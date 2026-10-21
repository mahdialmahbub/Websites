import { Router } from 'express';
import { resumeCreateLimiter } from '../../middleware/rateLimiters.js';
import { requireAuth } from '../../middleware/requireAuth.js';
import { accountOwner, resolveOwner } from '../../middleware/resolveOwner.js';
import { validate } from '../../middleware/validate.js';
import * as controller from './resume.controller.js';
import {
  claimBody,
  createResumeBody,
  generateBody,
  listResumesQuery,
  resumeIdParams,
  shareBody,
  updateResumeBody,
} from './resume.schemas.js';

const router = Router();
const owner = resolveOwner(); //                       logged in OR guest with a cookie
const ownerOrNewGuest = resolveOwner({ createGuest: true }); // only for routes that create data

// Logged-in only
router.get('/', requireAuth, accountOwner, validate({ query: listResumesQuery }), controller.list);
router.post('/claim', requireAuth, validate({ body: claimBody }), controller.claim);
router.post('/:id/sync-profile', requireAuth, accountOwner, validate({ params: resumeIdParams }), controller.syncProfile);

// Guests and users (the owner comes from the session / httpOnly cookie, never from the request)
router.post('/', resumeCreateLimiter, validate({ body: createResumeBody }), ownerOrNewGuest, controller.create);
router.get('/:id', validate({ params: resumeIdParams }), owner, controller.get);
router.patch('/:id', validate({ params: resumeIdParams, body: updateResumeBody }), owner, controller.update);
router.post('/:id/duplicate', validate({ params: resumeIdParams }), owner, controller.duplicate);
router.post('/:id/generate', validate({ params: resumeIdParams, body: generateBody }), owner, controller.generate);
router.post('/:id/share', validate({ params: resumeIdParams, body: shareBody }), owner, controller.share);
router.delete('/:id/share', validate({ params: resumeIdParams }), owner, controller.unshare);
router.delete('/:id', validate({ params: resumeIdParams }), owner, controller.remove);

export default router;
