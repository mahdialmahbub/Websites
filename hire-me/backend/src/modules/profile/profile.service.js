import { ApiError } from '../../lib/ApiError.js';
import { pickSections, planMerge } from '../content/content.js';
import { prepareSections, releasePhotoIfUnused } from '../content/content.photos.js';
import { Profile } from './profile.model.js';

/** Upsert that survives two requests creating the very first profile at the same moment. */
async function upsertProfile(userId, $set) {
  const run = () =>
    Profile.findOneAndUpdate(
      { user: userId },
      { $set },
      { upsert: true, new: false, setDefaultsOnInsert: true, runValidators: true, projection: { 'personalInformation.photo': 1 } },
    ).lean();
  try {
    return await run();
  } catch (err) {
    if (err?.code === 11000) return run();
    throw err;
  }
}

/** Stored sections only (what other services merge from / prefill with). */
export async function getProfileContent(userId) {
  const doc = await Profile.findOne({ user: userId }).lean();
  return doc ? pickSections(doc) : {};
}

/** Full profile for the profile page and for pre-filling the builder. Name + e-mail fall back to the account. */
export async function getProfile(user) {
  const doc = await Profile.findOne({ user: user._id }).lean();
  const stored = doc ? pickSections(doc) : {};

  const personalInformation = {
    photo: null, fullName: '', email: '', phone: '', location: '', professionalTitle: '', linkedin: '', website: '',
    ...(stored.personalInformation ?? {}),
  };
  personalInformation.fullName ||= user.name;
  personalInformation.email ||= user.email;

  return {
    personalInformation,
    professionalSummary: stored.professionalSummary ?? '',
    workExperience: stored.workExperience ?? [],
    education: stored.education ?? [],
    projects: stored.projects ?? [],
    skills: stored.skills ?? [],
    languages: stored.languages ?? [],
    references: stored.references ?? [],
    updatedAt: doc?.updatedAt ?? null,
  };
}

/** The profile page's own save: every section you send replaces the stored one. */
export async function updateProfile(userId, patch) {
  const sections = prepareSections(userId, pickSections(patch));
  if (Object.keys(sections).length === 0) {
    throw new ApiError(400, 'NOTHING_TO_UPDATE', 'Send at least one section to update');
  }

  const before = await upsertProfile(userId, sections);

  if (sections.personalInformation) {
    const oldPublicId = before?.personalInformation?.photo?.publicId;
    const newPublicId = sections.personalInformation.photo?.publicId;
    if (oldPublicId && oldPublicId !== newPublicId) await releasePhotoIfUnused(oldPublicId);
  }
  return { updatedAt: new Date().toISOString() };
}

/**
 * Copies resume content into the profile. See planMerge for the two modes.
 * @returns {Promise<string[]>} names of the sections that changed
 */
export async function mergeIntoProfile(userId, sections, mode) {
  const current = await Profile.findOne({ user: userId }).lean();
  const { set, sections: changed } = planMerge(current ? pickSections(current) : {}, sections, mode);
  if (changed.length === 0) return [];

  await upsertProfile(userId, set);

  if (set.personalInformation) {
    const oldPublicId = current?.personalInformation?.photo?.publicId;
    const newPublicId = set.personalInformation.photo?.publicId;
    if (oldPublicId && oldPublicId !== newPublicId) await releasePhotoIfUnused(oldPublicId);
  }
  return changed;
}
