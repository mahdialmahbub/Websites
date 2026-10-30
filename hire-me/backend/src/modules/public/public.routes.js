import { Router } from 'express';
import { ok } from '../../lib/respond.js';
import { validate } from '../../middleware/validate.js';
import { slugParams } from '../resumes/resume.schemas.js';
import { getPublicResume } from '../resumes/share.service.js';

/** No login needed: these are the pages behind a share link. */
const router = Router();

router.get('/resumes/:slug', validate({ params: slugParams }), async (req, res) => {
  const data = await getPublicResume(req.valid.params.slug);
  // No cache override on purpose: the API-wide "no-store" stays, so turning sharing off works at once.
  ok(res, data);
});

export default router;
