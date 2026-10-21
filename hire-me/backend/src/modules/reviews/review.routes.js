import { Router } from 'express';
import { ok } from '../../lib/respond.js';
import { reviewLimiter } from '../../middleware/rateLimiters.js';
import { resolveOwner } from '../../middleware/resolveOwner.js';
import { validate } from '../../middleware/validate.js';
import { createReviewBody } from './review.schemas.js';
import { createReview } from './review.service.js';

const router = Router();

// Guests and users. The review must be for a resume the sender owns (that alone stops most spam).
router.post('/', reviewLimiter, validate({ body: createReviewBody }), async (req, res, next) => {
  // Honeypot: a filled hidden field = a bot. Answer "success" so it learns nothing, and save nothing.
  if (req.valid.body.website) return ok(res, { review: null }, 'Thanks for your feedback!', 201);
  next();
}, resolveOwner(), async (req, res) => {
  const { review, existing } = await createReview(req.owner, req.valid.body);
  ok(res, { review }, 'Thanks for your feedback!', existing ? 200 : 201);
});

export default router;
