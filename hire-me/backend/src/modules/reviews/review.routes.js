import { Router } from 'express';
import { ok } from '../../lib/respond.js';
import { reviewLimiter } from '../../middleware/rateLimiters.js';
import { resolveOwner } from '../../middleware/resolveOwner.js';
import { validate } from '../../middleware/validate.js';
import { createReviewBody } from './review.schemas.js';
import { createReview } from './review.service.js';
import { Review } from './review.model.js';

const router = Router();

// Guests and users. The review must be for a resume the sender owns (that alone stops most spam).
router.post('/', reviewLimiter, validate({ body: createReviewBody }), async (req, res, next) => {
  // Honeypot: a filled hidden field = a bot. Answer "success" so it learns nothing, and save nothing.
  if (req.valid.body.hpField) return ok(res, { review: null }, 'Thanks for your feedback!', 201);
  next();
}, resolveOwner(), async (req, res) => {
  const { review, existing } = await createReview(req.owner, req.valid.body);
  ok(res, { review }, 'Thanks for your feedback!', existing ? 200 : 201);
});

router.get('/', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 12, 50);
    const filter = { status: 'approved' }; // shudhu approved

    const [docs, total] = await Promise.all([
      Review.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select('rating comment guestName templateSlug createdAt user')
        .populate('user', 'name') // User model e name field er nam onujayi change koro
        .lean(),
      Review.countDocuments(filter),
    ]);

    const reviews = docs.map((r) => ({
      id: r._id.toString(),
      rating: r.rating,
      comment: r.comment,
      name: r.user?.name || r.guestName || 'Anonymous',
      templateSlug: r.templateSlug,
      createdAt: r.createdAt,
    }));

    res.json({ reviews, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: 'Review load kora jachhe na' });
  }
});

export default router;
