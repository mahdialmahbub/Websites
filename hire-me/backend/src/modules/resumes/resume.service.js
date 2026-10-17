import { randomUUID } from 'node:crypto';
import { env } from '../../config/env.js';
import { ApiError } from '../../lib/ApiError.js';
import { deleteImage, isOwnedImageUrl, isOwnedPublicId } from '../../lib/images.js';
import { logger } from '../../lib/logger.js';
import { Resume } from './resume.model.js';

const ARRAY_SECTIONS = ['workExperience', 'education', 'projects', 'languages', 'references'];

const notFound = () => new ApiError(404, 'RESUME_NOT_FOUND', 'Resume not found');

/** Mongo document -> API shape ({ _id, __v, user } are internal). */
const serialize = ({ _id, __v, user, ...rest }) => ({ id: String(_id), ...rest });

/** 0-100, shown on the dashboard. Weights: personal 20, summary 15, experience 25, education 15, skills 15, projects 10. */
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

async function assertUnderLimit(userId) {
  const count = await Resume.countDocuments({ user: userId });
  if (count >= env.MAX_RESUMES_PER_USER) {
    throw new ApiError(403, 'RESUME_LIMIT_REACHED', `You can keep up to ${env.MAX_RESUMES_PER_USER} resumes. Delete one to create another.`);
  }
}

/** A Cloudinary photo may be shared by duplicated resumes, so it is only deleted when nothing references it. */
export async function releasePhotoIfUnused(publicId) {
  if (!publicId) return;
  try {
    const stillUsed = await Resume.exists({ 'personalInformation.photo.publicId': publicId });
    if (!stillUsed) await deleteImage(publicId);
  } catch (err) {
    logger.warn('[resume] photo cleanup failed:', err.message);
  }
}

/** The client may only attach photos it uploaded itself (folder is derived from the user id). */
function normalizePhoto(userId, photo) {
  if (!photo) return null;
  if (!isOwnedPublicId(userId, photo.publicId) || !isOwnedImageUrl(photo.url, photo.publicId)) {
    throw new ApiError(400, 'INVALID_PHOTO', 'This photo cannot be used. Please upload it again.');
  }
  return { url: photo.url, publicId: photo.publicId };
}

export async function listResumes(userId) {
  const docs = await Resume.find({ user: userId }).sort({ updatedAt: -1 }).lean();
  return docs.map((doc) => ({
    id: String(doc._id),
    title: doc.title,
    design: doc.design,
    fullName: doc.personalInformation?.fullName ?? '',
    professionalTitle: doc.personalInformation?.professionalTitle ?? '',
    photoUrl: doc.personalInformation?.photo?.url ?? null,
    completion: calcCompletion(doc),
    revision: doc.revision,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }));
}

export async function getResume(userId, id) {
  const doc = await Resume.findOne({ _id: id, user: userId }).lean();
  if (!doc) throw notFound();
  return { ...serialize(doc), completion: calcCompletion(doc) };
}

export async function createResume(user, { title, design }) {
  await assertUnderLimit(user._id);

  const doc = await Resume.create({
    user: user._id,
    title: title ?? 'Untitled Resume',
    design: design ?? {},
    // Saves the user two fields on their first resume.
    personalInformation: { fullName: user.name, email: user.email },
  });

  const resume = doc.toObject();
  return { ...serialize(resume), completion: calcCompletion(resume) };
}

/**
 * Autosave. Returns only { revision, updatedAt } - the client already has the data it just sent.
 * Pass `revision` to make the save conditional: if another tab saved first you get 409 REVISION_CONFLICT.
 */
export async function updateResume(userId, id, patch) {
  const { revision, ...fields } = patch;
  const $set = {};

  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined) continue;
    if (key === 'design') {
      for (const [designKey, designValue] of Object.entries(value)) {
        if (designValue !== undefined) $set[`design.${designKey}`] = designValue;
      }
    } else {
      $set[key] = value;
    }
  }
  if (Object.keys($set).length === 0) {
    throw new ApiError(400, 'NOTHING_TO_UPDATE', 'Send at least one field to update');
  }

  for (const section of ARRAY_SECTIONS) {
    if ($set[section]) $set[section] = $set[section].map((item) => ({ ...item, id: item.id || randomUUID() }));
  }
  if ($set.personalInformation) {
    $set.personalInformation = {
      ...$set.personalInformation,
      photo: normalizePhoto(String(userId), $set.personalInformation.photo),
    };
  }

  const filter = { _id: id, user: userId };
  if (revision !== undefined) filter.revision = revision;

  const before = await Resume.findOneAndUpdate(
    filter,
    { $set, $inc: { revision: 1 } },
    { new: false, runValidators: true, projection: { revision: 1, 'personalInformation.photo': 1 } },
  ).lean();

  if (!before) {
    const exists = await Resume.exists({ _id: id, user: userId });
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

export async function duplicateResume(user, id) {
  const original = await Resume.findOne({ _id: id, user: user._id }).lean();
  if (!original) throw notFound();
  await assertUnderLimit(user._id);

  const { _id, __v, createdAt, updatedAt, revision, ...data } = original;
  const doc = await Resume.create({ ...data, title: `${original.title} (copy)`.slice(0, 100), revision: 0 });

  const copy = doc.toObject();
  return { ...serialize(copy), completion: calcCompletion(copy) };
}

export async function deleteResume(userId, id) {
  const removed = await Resume.findOneAndDelete({ _id: id, user: userId }).lean();
  if (!removed) throw notFound();
  await releasePhotoIfUnused(removed.personalInformation?.photo?.publicId);
}
