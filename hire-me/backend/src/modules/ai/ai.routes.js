import { Router } from 'express';
import { getAiProvider } from '../../lib/ai/index.js';
import { ok } from '../../lib/respond.js';
import { aiIpLimiter, aiSubjectLimiter } from '../../middleware/rateLimiters.js';
import { validate } from '../../middleware/validate.js';
import { suggestKeywords } from './ai.keywords.js';
import { enhanceBody, keywordsBody } from './ai.schemas.js';
import { enhanceText } from './ai.service.js';

const router = Router();

// POST /api/ai/enhance  { field, text, context } -> { text, mode, field }
// Guests can use it (the builder works without an account); per-visitor and per-IP limits keep it fair.
router.post('/enhance', aiIpLimiter, aiSubjectLimiter, validate({ body: enhanceBody }), async (req, res) => {
  const result = await enhanceText(req.valid.body, { provider: getAiProvider() });
  ok(res, result);
});

// POST /api/ai/keywords  { professionalTitle, targetJobTitle?, skills } -> { keywords: [...], role }
router.post('/keywords', aiIpLimiter, aiSubjectLimiter, validate({ body: keywordsBody }), async (req, res) => {
  ok(res, await suggestKeywords(req.valid.body, { provider: getAiProvider() }));
});

export default router;
