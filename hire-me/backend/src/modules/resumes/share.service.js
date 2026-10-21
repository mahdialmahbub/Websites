import { randomBytes } from 'node:crypto';
import { env } from '../../config/env.js';
import { ApiError } from '../../lib/ApiError.js';
import { pickSections } from '../content/content.js';
import { Resume } from './resume.model.js';

const newSlug = () => randomBytes(9).toString('base64url'); // 12 url-safe characters, unguessable
export const shareUrl = (slug) => `${env.clientOrigin}/r/${slug}`;

const notFound = () => new ApiError(404, 'RESUME_NOT_FOUND', 'Resume not found');

const describe = (share) => ({
  enabled: share.enabled,
  slug: share.slug,
  url: shareUrl(share.slug),
  hideContact: share.hideContact !== false,
});

/**
 * Turns the public link on (idempotent: the same link is returned unless `rotate` is true).
 * Every step is ONE atomic update, so a double click (two requests at once) can never end with two
 * different links - the slug is only written while it is still missing.
 */
export async function enableShare(owner, id, { hideContact, rotate } = {}) {
  const base = { _id: id, ...owner.filter };
  const found = await Resume.exists(base);
  if (!found) throw notFound();

  const writeSlug = async (filter) => {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        await Resume.updateOne(filter, { $set: { 'share.slug': newSlug(), 'share.sharedAt': new Date() } });
        return;
      } catch (err) {
        if (err?.code !== 11000) throw err; // astronomically unlikely slug collision: try another one
      }
    }
    throw new ApiError(500, 'SHARE_FAILED', 'Could not create the share link. Please try again.');
  };

  if (rotate) await writeSlug(base);
  else await writeSlug({ ...base, 'share.slug': { $exists: false } }); // no-op when a slug already exists

  const $set = { 'share.enabled': true };
  if (hideContact !== undefined) $set['share.hideContact'] = hideContact;
  await Resume.updateOne(base, { $set });

  const resume = await Resume.findOne(base).select('share').lean();
  if (!resume) throw notFound();
  return describe(resume.share);
}

/** Turns the link off. The slug is kept, so switching it on again restores the same link. */
export async function disableShare(owner, id) {
  const result = await Resume.updateOne({ _id: id, ...owner.filter }, { $set: { 'share.enabled': false } });
  if (result.matchedCount === 0) throw notFound();
}

const truncate = (value, max) => (value.length <= max ? value : `${value.slice(0, max - 1).trimEnd()}…`);

/** What anyone with the link may see. Contact details are removed unless the owner chose to show them. */
export async function getPublicResume(slug) {
  const doc = await Resume.findOne({ 'share.slug': slug, 'share.enabled': true }).lean();
  if (!doc) throw new ApiError(404, 'SHARE_NOT_FOUND', 'This resume is not available');

  const hideContact = doc.share.hideContact !== false;
  const content = pickSections(doc);

  if (hideContact) {
    content.personalInformation = { ...content.personalInformation, email: '', phone: '' };
    content.references = (content.references ?? []).map((reference) => ({ ...reference, email: '', phone: '' }));
  }

  const personal = content.personalInformation ?? {};
  const name = personal.fullName || 'Resume';
  const summary = (content.professionalSummary ?? '').replace(/\s+/g, ' ').trim();

  return {
    slug,
    title: doc.title,
    design: doc.design,
    hideContact,
    content,
    // Ready-made Open Graph data for the share page (<meta og:*>).
    og: {
      title: personal.professionalTitle ? `${name} - ${personal.professionalTitle}` : `${name}'s resume`,
      description: truncate(summary || `Resume of ${name}`, 160),
      image: personal.photo?.url ?? null,
      url: shareUrl(slug),
    },
    updatedAt: doc.updatedAt,
  };
}
