import { Router } from 'express';
import { ok } from '../../lib/respond.js';
import { requireAdmin } from '../../middleware/requireAdmin.js';
import { requireAuth } from '../../middleware/requireAuth.js';
import { validate } from '../../middleware/validate.js';
import {
  createCategoryBody,
  createTemplateBody,
  deleteCategoryQuery,
  idParams,
  updateCategoryBody,
  updateTemplateBody,
} from '../catalog/catalog.schemas.js';
import * as catalog from '../catalog/catalog.service.js';
import { adminReviewsQuery, reviewIdParams, reviewStatusBody } from '../reviews/review.schemas.js';
import * as reviews from '../reviews/review.service.js';

/**
 * Admin API. The website has no admin dashboard, so these routes are used with Postman / Thunder Client
 * (log in first so the session cookie is sent). Only accounts listed in ADMIN_EMAILS get through.
 */
const router = Router();
router.use(requireAuth, requireAdmin);

// ───────── categories ─────────
router.get('/categories', async (_req, res) => ok(res, { categories: await catalog.listAdminCategories() }));
router.post('/categories', validate({ body: createCategoryBody }), async (req, res) =>
  ok(res, { category: await catalog.createCategory(req.valid.body) }, 'Category created', 201),
);
router.patch('/categories/:id', validate({ params: idParams, body: updateCategoryBody }), async (req, res) =>
  ok(res, { category: await catalog.updateCategory(req.valid.params.id, req.valid.body) }, 'Category updated'),
);
router.delete('/categories/:id', validate({ params: idParams, query: deleteCategoryQuery }), async (req, res) => {
  await catalog.deleteCategory(req.valid.params.id, req.valid.query);
  ok(res, null, 'Category deleted');
});

// ───────── templates ─────────
router.get('/templates', async (_req, res) => ok(res, { templates: await catalog.listAdminTemplates() }));
router.post('/templates', validate({ body: createTemplateBody }), async (req, res) =>
  ok(res, { template: await catalog.createTemplate(req.valid.body) }, 'Template created', 201),
);
router.patch('/templates/:id', validate({ params: idParams, body: updateTemplateBody }), async (req, res) =>
  ok(res, { template: await catalog.updateTemplate(req.valid.params.id, req.valid.body) }, 'Template updated'),
);
router.delete('/templates/:id', validate({ params: idParams }), async (req, res) => {
  await catalog.deleteTemplate(req.valid.params.id);
  ok(res, null, 'Template deleted');
});

// ───────── reviews ─────────
router.get('/reviews', validate({ query: adminReviewsQuery }), async (req, res) =>
  ok(res, await reviews.listReviews(req.valid.query)),
);
router.patch('/reviews/:id', validate({ params: reviewIdParams, body: reviewStatusBody }), async (req, res) =>
  ok(res, { review: await reviews.setReviewStatus(req.valid.params.id, req.valid.body.status) }, 'Review updated'),
);

export default router;
