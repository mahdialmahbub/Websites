import { randomUUID } from 'node:crypto';
import { cloudinary } from '../config/cloudinary.js';
import { env } from '../config/env.js';
import { ApiError } from './ApiError.js';
import { logger } from './logger.js';

/** Every user only ever touches images under their own folder. */
export const userPhotoPrefix = (userId) => `${env.CLOUDINARY_FOLDER}/users/${userId}/photos/`;

export const isOwnedPublicId = (userId, publicId) =>
  typeof publicId === 'string' && publicId.startsWith(userPhotoPrefix(userId)) && !publicId.includes('..');

export const isOwnedImageUrl = (url, publicId) =>
  typeof url === 'string' &&
  url.startsWith(`https://res.cloudinary.com/${env.CLOUDINARY_CLOUD_NAME}/`) &&
  url.includes(publicId);

/**
 * Uploads a profile photo: cropped to 600x600 around the face and stored as JPEG
 * (JPEG keeps client-side PDF generation simple - no WebP/AVIF surprises).
 */
export function uploadUserPhoto(userId, buffer) {
  if (!env.cloudinaryEnabled) {
    throw new ApiError(501, 'UPLOADS_NOT_CONFIGURED', 'Image uploads are not configured on this server');
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: `${userPhotoPrefix(userId)}${randomUUID()}`,
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        format: 'jpg',
        transformation: [{ width: 600, height: 600, crop: 'fill', gravity: 'auto' }],
      },
      (error, result) => {
        if (error || !result) {
          logger.error('[cloudinary] upload failed:', error?.message ?? 'no result');
          return reject(new ApiError(502, 'UPLOAD_FAILED', 'We could not upload the image. Please try again.'));
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      },
    );
    stream.end(buffer);
  });
}

export async function deleteImage(publicId) {
  if (!env.cloudinaryEnabled || !publicId) return;
  await cloudinary.uploader.destroy(publicId, { resource_type: 'image', invalidate: true });
}
