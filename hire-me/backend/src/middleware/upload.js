import multer from 'multer';
import { ApiError } from '../lib/ApiError.js';

export const MAX_PHOTO_BYTES = 3 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

/** Reads one image from the multipart field "photo" into memory (Cloudinary validates the real format). */
export const photoUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_PHOTO_BYTES, files: 1 },
  fileFilter: (_req, file, cb) =>
    ALLOWED_TYPES.has(file.mimetype)
      ? cb(null, true)
      : cb(new ApiError(415, 'UNSUPPORTED_FILE_TYPE', 'Only JPG, PNG or WebP images are allowed')),
}).single('photo');
