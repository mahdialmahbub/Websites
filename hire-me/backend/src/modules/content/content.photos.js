import { randomUUID } from 'node:crypto';
import { ApiError } from '../../lib/ApiError.js';
import { deleteImage, isOwnedImageUrl, isOwnedPublicId } from '../../lib/images.js';
import { logger } from '../../lib/logger.js';
import { Profile } from '../profile/profile.model.js';
import { Resume } from '../resumes/resume.model.js';
import { ARRAY_SECTIONS, withIds } from './content.js';

/** The client may only attach photos it uploaded itself (the Cloudinary folder contains the user id). */
export function normalizePhoto(userId, photo) {
  if (!photo) return null;
  if (!isOwnedPublicId(userId, photo.publicId) || !isOwnedImageUrl(photo.url, photo.publicId)) {
    throw new ApiError(400, 'INVALID_PHOTO', 'This photo cannot be used. Please upload it again.');
  }
  return { url: photo.url, publicId: photo.publicId };
}

/** Gives every array item an id and validates the photo. Used by every write path (resume + profile). */
export function prepareSections(userId, sections) {
  const prepared = { ...sections };
  for (const section of ARRAY_SECTIONS) {
    if (prepared[section]) prepared[section] = withIds(prepared[section], randomUUID);
  }
  if (prepared.personalInformation) {
    prepared.personalInformation = {
      ...prepared.personalInformation,
      photo: normalizePhoto(String(userId), prepared.personalInformation.photo),
    };
  }
  return prepared;
}

/** A Cloudinary photo can be shared by several resumes and the profile - delete it only when nothing uses it. */
export async function releasePhotoIfUnused(publicId) {
  if (!publicId) return;
  try {
    const [inResume, inProfile] = await Promise.all([
      Resume.exists({ 'personalInformation.photo.publicId': publicId }),
      Profile.exists({ 'personalInformation.photo.publicId': publicId }),
    ]);
    if (!inResume && !inProfile) await deleteImage(publicId);
  } catch (err) {
    logger.warn('[photos] cleanup failed:', err.message);
  }
}
