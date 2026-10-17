import { Router } from 'express';
import { z } from 'zod';
import { ok } from '../../lib/respond.js';
import { requireAuth } from '../../middleware/requireAuth.js';
import { validate } from '../../middleware/validate.js';
import { toPublicUser } from './user.model.js';

const router = Router();
router.use(requireAuth);

router.get('/me', (req, res) => ok(res, { user: toPublicUser(req.user) }));

router.patch(
  '/me',
  validate({ body: z.object({ name: z.string().trim().min(2, 'Name is too short').max(80, 'Name is too long') }) }),
  async (req, res) => {
    req.user.name = req.valid.body.name;
    await req.user.save();
    ok(res, { user: toPublicUser(req.user) }, 'Profile updated');
  },
);

export default router;
