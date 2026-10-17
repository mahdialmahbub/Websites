import { Router } from 'express';
import { z } from 'zod';
import { ApiError } from '../../lib/ApiError.js';
import { isOwnedPublicId, uploadUserPhoto } from '../../lib/images.js';
import { ok } from '../../lib/respond.js';
import { requireAuth } from '../../middleware/requireAuth.js';
import { uploadLimiter } from '../../middleware/rateLimiters.js';
import { photoUpload } from '../../middleware/upload.js';
import { validate } from '../../middleware/validate.js';
import { releasePhotoIfUnused } from '../resumes/resume.service.js';

const router = Router();
router.use(requireAuth);

// multipart/form-data, field name: "photo"  ->  { photo: { url, publicId } }
router.post('/photo', uploadLimiter, photoUpload, async (req, res) => {
  if (!req.file) throw new ApiError(400, 'NO_FILE', 'Attach an image in the "photo" field');
  const photo = await uploadUserPhoto(String(req.user._id), req.file.buffer);
  ok(res, { photo }, 'Photo uploaded', 201);
});

// Removes a photo the user uploaded but no resume uses (e.g. they picked another one before saving).
router.delete(
  '/photo',
  validate({ query: z.object({ publicId: z.string().min(1).max(300) }) }),
  async (req, res) => {
    const { publicId } = req.valid.query;
    if (!isOwnedPublicId(String(req.user._id), publicId)) {
      throw new ApiError(403, 'FORBIDDEN', 'You can only remove your own photos');
    }
    await releasePhotoIfUnused(publicId);
    ok(res, null, 'Photo removed');
  },
);

export default router;
