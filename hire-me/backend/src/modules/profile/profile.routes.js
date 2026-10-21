import { Router } from 'express';
import { ok } from '../../lib/respond.js';
import { requireAuth } from '../../middleware/requireAuth.js';
import { validate } from '../../middleware/validate.js';
import { profileUpdateBody } from '../resumes/resume.schemas.js';
import { getProfile, updateProfile } from './profile.service.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res) => ok(res, { profile: await getProfile(req.user) }));

router.patch('/', validate({ body: profileUpdateBody }), async (req, res) =>
  ok(res, await updateProfile(req.user._id, req.valid.body), 'Profile saved'),
);

export default router;
