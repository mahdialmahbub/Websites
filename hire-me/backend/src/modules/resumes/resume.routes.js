import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth.js';
import { validate } from '../../middleware/validate.js';
import * as controller from './resume.controller.js';
import { createResumeBody, resumeIdParams, updateResumeBody } from './resume.schemas.js';

const router = Router();
router.use(requireAuth);

router.get('/', controller.list);
router.post('/', validate({ body: createResumeBody }), controller.create);
router.get('/:id', validate({ params: resumeIdParams }), controller.get);
router.patch('/:id', validate({ params: resumeIdParams, body: updateResumeBody }), controller.update);
router.post('/:id/duplicate', validate({ params: resumeIdParams }), controller.duplicate);
router.delete('/:id', validate({ params: resumeIdParams }), controller.remove);

export default router;
