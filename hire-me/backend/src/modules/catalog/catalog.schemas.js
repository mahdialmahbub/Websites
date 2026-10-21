import { z } from 'zod';

const OBJECT_ID = /^[a-f\d]{24}$/i;
const objectId = (label) => z.string().regex(OBJECT_ID, `Invalid ${label} id`);

// eslint-disable-next-line no-control-regex
const clean = (value) => value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
const text = (min, max, label) =>
  z.string().trim().min(min, `${label} is too short`).max(max, `${label} is too long`).transform(clean);
const optionalText = (max) => z.string().trim().max(max, `Maximum ${max} characters`).transform(clean);

// ───────── public ─────────
export const listTemplatesQuery = z.object({
  category: z.string().trim().toLowerCase().regex(/^[a-z0-9-]{1,60}$/, 'Invalid category').optional(),
  page: z.coerce.number().int().min(1).max(1000).default(1),
  limit: z.coerce.number().int().min(1).max(48).default(12),
});
export const slugParam = z.object({ slug: z.string().trim().toLowerCase().regex(/^[a-z0-9-]{1,60}$/, 'Invalid template') });

// ───────── admin: categories ─────────
export const idParams = z.object({ id: objectId('record') });

export const createCategoryBody = z.object({
  name: text(2, 50, 'Name'),
  description: optionalText(300).default(''),
  isActive: z.boolean().default(true),
});

export const updateCategoryBody = z
  .object({
    name: text(2, 50, 'Name').optional(),
    description: optionalText(300).optional(),
    isActive: z.boolean().optional(),
    // By default a rename keeps the slug, so existing links and search results do not break.
    regenerateSlug: z.boolean().optional(),
  })
  .refine((body) => Object.keys(body).length > 0, 'Send at least one field');

export const deleteCategoryQuery = z.object({ reassignTo: objectId('category').optional() });

// ───────── admin: templates ─────────
/** Pick an existing category (id) OR type a new one (name - created automatically). */
const categoryChoice = z.union([
  z.object({ id: objectId('category') }),
  z.object({ name: text(2, 50, 'Category name') }),
]);

export const createTemplateBody = z.object({
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9-]{2,60}$/, 'Use lower-case letters, numbers and dashes').optional(),
  name: text(2, 80, 'Name'),
  description: optionalText(400).default(''),
  category: categoryChoice,
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().min(-1000).max(100000).default(0),
  metaTitle: optionalText(70).default(''),
  metaDescription: optionalText(170).default(''),
});

export const updateTemplateBody = z
  .object({
    name: text(2, 80, 'Name').optional(),
    description: optionalText(400).optional(),
    category: categoryChoice.optional(),
    isActive: z.boolean().optional(),
    sortOrder: z.number().int().min(-1000).max(100000).optional(),
    metaTitle: optionalText(70).optional(),
    metaDescription: optionalText(170).optional(),
  })
  .refine((body) => Object.keys(body).length > 0, 'Send at least one field');
