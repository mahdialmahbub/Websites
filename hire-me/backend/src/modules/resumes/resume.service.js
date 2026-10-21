import { ApiError } from '../../lib/ApiError.js';
import { clearGuestCookie } from '../../lib/guest.js';
import { logger } from '../../lib/logger.js';
import { assertTemplateAvailable } from '../catalog/catalog.service.js';
import { Template } from '../catalog/template.model.js';
import { pickSections } from '../content/content.js';
import { prepareSections, releasePhotoIfUnused } from '../content/content.photos.js';
import { getProfileContent, mergeIntoProfile } from '../profile/profile.service.js';
import { Resume } from './resume.model.js';
import { checkReadyToGenerate } from './resume.rules.js';
import { enableShare, shareUrl } from './share.service.js';

/*
 * Every function here receives `owner` (see middleware/resolveOwner.js): a logged-in user or a guest.
 * The owner always comes from the session / cookie, so one person can never touch another one's resume.
 */

const notFound = () => new ApiError(404, 'RESUME_NOT_FOUND', 'Resume not found');

/** Mongo document -> API shape ({ _id, __v, user, guestId, sourceDraftId } are internal). */
const serialize = ({ _id, __v, user, guestId, sourceDraftId, share, ...rest }) => ({
  id: String(_id),
  ...rest,
  share: {
    enabled: Boolean(share?.enabled),
    url: share?.enabled && share.slug ? shareUrl(share.slug) : null,
    hideContact: share?.hideContact !== false,
  },
});

/** 0-100 "how filled in is it". Weights: personal 20, summary 15, experience 25, education 15, skills 15, projects 10. */
export function calcCompletion(resume) {
  const personal = resume.personalInformation ?? {};
  const personalFields = [personal.fullName, personal.email, personal.phone, personal.location, personal.professionalTitle];

  const parts = [
    [20, personalFields.filter(Boolean).length / personalFields.length],
    [15, resume.professionalSummary ? 1 : 0],
    [25, resume.workExperience?.length ? 1 : 0],
    [15, resume.education?.length ? 1 : 0],
    [15, Math.min((resume.skills?.length ?? 0) / 3, 1)],
    [10, resume.projects?.length ? 1 : 0],
  ];
  return Math.round(parts.reduce((sum, [weight, filled]) => sum + weight * filled, 0));
}

const present = (doc) => ({ ...serialize(doc), completion: calcCompletion(doc) });

/** A new resume of a logged-in user starts from the profile; name and e-mail fall back to the account. */
async function prefillFromProfile(user) {
  const profile = await getProfileContent(user._id);
  const personalInformation = { ...(profile.personalInformation ?? {}) };
  personalInformation.fullName ||= user.name;
  personalInformation.email ||= user.email;
  return prepareSections(String(user._id), { ...profile, personalInformation });
}

/** My resumes page: newest first, paginated, with the template's name. */
export async function listResumes(owner, { page, limit }) {
  const [total, docs] = await Promise.all([
    Resume.countDocuments(owner.filter),
    Resume.find(owner.filter)
      .sort({ updatedAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
  ]);

  const slugs = [...new Set(docs.map((doc) => doc.design?.templateId).filter(Boolean))];
  const templates = slugs.length ? await Template.find({ slug: { $in: slugs } }).select('slug name').lean() : [];
  const nameBySlug = new Map(templates.map((template) => [template.slug, template.name]));

  return {
    resumes: docs.map((doc) => ({
      id: String(doc._id),
      title: doc.title,
      design: doc.design,
      templateName: nameBySlug.get(doc.design?.templateId) ?? null,
      fullName: doc.personalInformation?.fullName ?? '',
      professionalTitle: doc.personalInformation?.professionalTitle ?? '',
      photoUrl: doc.personalInformation?.photo?.url ?? null,
      completion: calcCompletion(doc),
      atsScore: doc.atsScore ?? null,
      status: doc.status,
      shared: Boolean(doc.share?.enabled),
      shareUrl: doc.share?.enabled && doc.share.slug ? shareUrl(doc.share.slug) : null,
      revision: doc.revision,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    })),
    pagination: { page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) },
  };
}

export async function getResume(owner, id) {
  const doc = await Resume.findOne({ _id: id, ...owner.filter }).lean();
  if (!doc) throw notFound();
  return present(doc);
}

/**
 * Creates a resume. There is NO limit and NO "one per template" rule: every call makes a new resume.
 * (The builder calls this on the first save, never just because the page was opened.)
 *
 *  - logged-in user, no content  -> pre-filled from the profile
 *  - content sent                -> created from it (a browser draft); the profile is topped up where it is empty
 *  - guest                       -> blank unless content is sent (the browser fills it from its saved data)
 *
 * `clientDraftId` (users only) makes the call safe to repeat.
 */
export async function createResume(owner, input) {
  const { title, design, clientDraftId, targetJob, ...rest } = input;
  const provided = pickSections(rest);
  const hasContent = Object.keys(provided).length > 0;
  const draftId = owner.kind === 'user' ? clientDraftId : undefined;

  await assertTemplateAvailable(design?.templateId);

  const findExisting = async () => {
    if (!draftId) return null;
    const doc = await Resume.findOne({ ...owner.filter, sourceDraftId: draftId }).lean();
    return doc ? { resume: present(doc), profile: { updatedSections: [] }, existing: true } : null;
  };

  const already = await findExisting();
  if (already) return already;

  let sections;
  if (hasContent) sections = prepareSections(owner.key, provided);
  else if (owner.kind === 'user') sections = await prefillFromProfile(owner.user);
  else sections = {};

  let doc;
  try {
    doc = await Resume.create({
      ...owner.create,
      title: title ?? 'Untitled Resume',
      design: design ?? {},
      ...sections,
      ...(targetJob && { targetJob }),
      ...(draftId && { sourceDraftId: draftId }),
    });
  } catch (err) {
    if (err?.code === 11000) {
      const raced = await findExisting(); // two identical requests raced - hand back the winner
      if (raced) return raced;
    }
    throw err;
  }

  const updatedSections =
    hasContent && owner.kind === 'user' ? await mergeIntoProfile(owner.userId, sections, 'fill') : [];
  return { resume: present(doc.toObject()), profile: { updatedSections }, existing: false };
}

/**
 * Autosave. Returns only { revision, updatedAt } - the client already has the data it just sent.
 * Pass `revision` to make the save conditional: if another tab saved first you get 409 REVISION_CONFLICT.
 * It always UPDATES the same resume, so the share link never changes.
 */
export async function updateResume(owner, id, patch) {
  const { revision, design, title, targetJob, ...rest } = patch;

  const $set = prepareSections(owner.key, pickSections(rest));
  if (title !== undefined) $set.title = title;
  if (targetJob !== undefined) $set.targetJob = targetJob;
  if (design) {
    if (design.templateId) await assertTemplateAvailable(design.templateId);
    for (const [key, value] of Object.entries(design)) if (value !== undefined) $set[`design.${key}`] = value;
  }
  if (Object.keys($set).length === 0) {
    throw new ApiError(400, 'NOTHING_TO_UPDATE', 'Send at least one field to update');
  }

  const filter = { _id: id, ...owner.filter };
  if (revision !== undefined) filter.revision = revision;

  const before = await Resume.findOneAndUpdate(
    filter,
    { $set, $inc: { revision: 1 } },
    { new: false, runValidators: true, projection: { revision: 1, 'personalInformation.photo': 1 } },
  ).lean();

  if (!before) {
    const exists = await Resume.exists({ _id: id, ...owner.filter });
    throw exists
      ? new ApiError(409, 'REVISION_CONFLICT', 'This resume was changed in another tab or device. Reload to get the latest version.')
      : notFound();
  }

  if ($set.personalInformation) {
    const oldPublicId = before.personalInformation?.photo?.publicId;
    const newPublicId = $set.personalInformation.photo?.publicId;
    if (oldPublicId && oldPublicId !== newPublicId) await releasePhotoIfUnused(oldPublicId);
  }

  return { revision: (before.revision ?? 0) + 1, updatedAt: new Date().toISOString() };
}

/** "Update my profile from this resume": the resume's non-empty sections win, empty ones never wipe the profile. */
export async function syncProfileFromResume(owner, id) {
  const doc = await Resume.findOne({ _id: id, ...owner.filter }).lean();
  if (!doc) throw notFound();
  return { updatedSections: await mergeIntoProfile(owner.userId, pickSections(doc), 'overwrite') };
}

export async function duplicateResume(owner, id) {
  const original = await Resume.findOne({ _id: id, ...owner.filter }).lean();
  if (!original) throw notFound();

  // The copy is private (no share link), starts as a draft and is not tied to a browser draft.
  const { _id, __v, createdAt, updatedAt, revision, share, sourceDraftId, status, generatedAt, ...data } = original;
  const doc = await Resume.create({ ...data, title: `${original.title} (copy)`.slice(0, 100), revision: 0 });
  return present(doc.toObject());
}

export async function deleteResume(owner, id) {
  const removed = await Resume.findOneAndDelete({ _id: id, ...owner.filter }).lean();
  if (!removed) throw notFound();
  await releasePhotoIfUnused(removed.personalInformation?.photo?.publicId);
}

/**
 * "Generate": validates the content, creates the unguessable share link (the same link every time),
 * marks the resume as generated and - for logged-in users - merges its data into the profile.
 * Safe against double clicks: every step is idempotent.
 */
export async function generateResume(owner, id, { hideContact } = {}) {
  const doc = await Resume.findOne({ _id: id, ...owner.filter }).lean();
  if (!doc) throw notFound();

  const fieldErrors = checkReadyToGenerate(doc);
  if (Object.keys(fieldErrors).length > 0) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Please fix the highlighted fields before generating', { fieldErrors });
  }

  const share = await enableShare(owner, id, { hideContact });

  await Resume.updateOne(
    { _id: id, ...owner.filter, status: { $ne: 'generated' } },
    { $set: { status: 'generated', generatedAt: new Date() } },
  );

  // Profile merge: latest values win, but an empty value never wipes existing profile data.
  const updatedSections = owner.kind === 'user' ? await mergeIntoProfile(owner.userId, pickSections(doc), 'overwrite') : [];

  return { resume: await getResume(owner, id), share, profile: { updatedSections } };
}

/**
 * Guest -> user. Moves the guest's resumes to the account and tops up the profile from them.
 *  - idempotent: after the first run there is nothing left under that guest id, so a repeat does nothing
 *  - never overwrites non-empty profile data (mode "fill"); the newest data fills the gaps first
 *  - `draft` = the guest's latest data from the browser (localStorage), treated as the newest
 *
 * @returns {{ claimed: number, updatedSections: string[] }}
 */
export async function claimGuestResumes(user, guestId, draft = {}) {
  const updated = new Set();
  const fill = async (content) => {
    for (const section of await mergeIntoProfile(user._id, content, 'fill')) updated.add(section);
  };

  const guestResumes = guestId ? await Resume.find({ guestId }).sort({ updatedAt: -1 }).lean() : [];

  if (guestResumes.length > 0) {
    await Resume.updateMany({ guestId }, { $set: { user: user._id }, $unset: { guestId: '' } });
  }

  const draftSections = pickSections(draft);
  if (Object.keys(draftSections).length > 0) await fill(prepareSections(String(user._id), draftSections));
  for (const resume of guestResumes) await fill(pickSections(resume));

  return { claimed: guestResumes.length, updatedSections: [...updated] };
}

/** Called right after a login: claims silently and never lets a problem here break the login. */
export async function claimOnLogin(req, user, guestId) {
  if (!guestId) return;
  try {
    await claimGuestResumes(user, guestId);
  } catch (err) {
    logger.warn('[claim] could not claim guest resumes on login:', err.message);
    return; // keep the cookie so the explicit POST /resumes/claim can retry
  }
  if (req.res) clearGuestCookie(req.res);
}
