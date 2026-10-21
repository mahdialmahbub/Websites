import { Router } from 'express';
import { ok } from '../../lib/respond.js';
import { validate } from '../../middleware/validate.js';
import { listTemplatesQuery, slugParam } from './catalog.schemas.js';
import { getPublicTemplate, listPublicCategories, listPublicTemplates } from './catalog.service.js';

/**
 * Public, read-only catalog. No login. The Next.js server components call these directly,
 * so the first HTML response already contains the templates (good for SEO).
 */
const router = Router();

// Safe to cache for a minute: it only changes when an admin edits the catalog.
// Applied per route (NOT router.use) so it can never leak onto /admin or /reviews.
const cache = (_req, res, next) => {
  res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300'); // overrides the API-wide "no-store"
  next();
};

router.get('/categories', cache, async (_req, res) => ok(res, { categories: await listPublicCategories() }));

router.get('/templates', cache, validate({ query: listTemplatesQuery }), async (req, res) =>
  ok(res, await listPublicTemplates(req.valid.query)),
);

router.get('/templates/:slug', cache, validate({ params: slugParam }), async (req, res) =>
  ok(res, { template: await getPublicTemplate(req.valid.params.slug) }),
);

export default router;
