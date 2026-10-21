import { ApiError } from '../../lib/ApiError.js';
import { slugify } from '../../lib/slug.js';
import { Category } from './category.model.js';
import { Template } from './template.model.js';

const DUPLICATE = 11000;

// ───────── shapes sent to the browser ─────────
const categoryDto = (doc, templateCount) => ({
  id: String(doc._id),
  name: doc.name,
  slug: doc.slug,
  description: doc.description ?? '',
  isActive: doc.isActive,
  ...(templateCount !== undefined && { templateCount }),
});

const templateDto = (doc) => ({
  id: String(doc._id),
  slug: doc.slug,
  name: doc.name,
  description: doc.description ?? '',
  isActive: doc.isActive,
  sortOrder: doc.sortOrder ?? 0,
  metaTitle: doc.metaTitle ?? '',
  metaDescription: doc.metaDescription ?? '',
  category: doc.category && doc.category.slug ? categoryDto(doc.category) : null,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

// ───────── categories ─────────

/**
 * Finds the category with this name or creates it. One atomic upsert on the unique slug, so two admins
 * (or two requests) saving "Modern" at the same moment end up with ONE category; the loser just reads it.
 */
export async function upsertCategoryByName(name) {
  const slug = slugify(name);
  if (!slug) throw new ApiError(400, 'VALIDATION_ERROR', 'Use letters or numbers in the category name', { fieldErrors: { name: ['Use letters or numbers in the category name'] } });

  const run = () =>
    Category.findOneAndUpdate(
      { slug },
      { $setOnInsert: { name: name.trim(), slug, description: '', isActive: true } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  try {
    return await run();
  } catch (err) {
    if (err?.code === DUPLICATE) return Category.findOne({ slug }); // lost the race: the winner's document is there
    throw err;
  }
}

async function resolveCategory(choice) {
  if (choice.id) {
    const category = await Category.findById(choice.id);
    if (!category) throw new ApiError(404, 'CATEGORY_NOT_FOUND', 'Category not found');
    return category;
  }
  return upsertCategoryByName(choice.name);
}

/** Public: only categories that really have an active template (so no empty filter tabs). */
export async function listPublicCategories() {
  const counts = await Template.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);
  const countById = new Map(counts.map((row) => [String(row._id), row.count]));
  const categories = await Category.find({ isActive: true }).sort({ name: 1 }).lean();
  return categories
    .filter((category) => countById.has(String(category._id)))
    .map((category) => categoryDto(category, countById.get(String(category._id))));
}

export async function listAdminCategories() {
  const counts = await Template.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
  const countById = new Map(counts.map((row) => [String(row._id), row.count]));
  const categories = await Category.find().sort({ name: 1 }).lean();
  return categories.map((category) => categoryDto(category, countById.get(String(category._id)) ?? 0));
}

export async function createCategory({ name, description, isActive }) {
  const slug = slugify(name);
  if (!slug) throw new ApiError(400, 'VALIDATION_ERROR', 'Use letters or numbers in the category name', { fieldErrors: { name: ['Use letters or numbers in the category name'] } });
  try {
    const doc = await Category.create({ name, slug, description, isActive });
    return categoryDto(doc, 0);
  } catch (err) {
    if (err?.code === DUPLICATE) throw new ApiError(409, 'CATEGORY_EXISTS', 'A category with this name already exists');
    throw err;
  }
}

export async function updateCategory(id, { name, description, isActive, regenerateSlug }) {
  const category = await Category.findById(id);
  if (!category) throw new ApiError(404, 'CATEGORY_NOT_FOUND', 'Category not found');

  if (name !== undefined) {
    category.name = name;
    if (regenerateSlug) {
      const slug = slugify(name);
      if (!slug) throw new ApiError(400, 'VALIDATION_ERROR', 'Use letters or numbers in the category name');
      category.slug = slug;
    }
  }
  if (description !== undefined) category.description = description;
  if (isActive !== undefined) category.isActive = isActive;

  try {
    await category.save();
  } catch (err) {
    if (err?.code === DUPLICATE) throw new ApiError(409, 'CATEGORY_EXISTS', 'A category with this name already exists');
    throw err;
  }
  return categoryDto(category, await Template.countDocuments({ category: category._id }));
}

/**
 * A category that still has templates is never deleted silently:
 *   - no `reassignTo`  -> 409 CATEGORY_IN_USE (the response says how many templates use it)
 *   - with `reassignTo` -> the templates move to that category first
 */
export async function deleteCategory(id, { reassignTo } = {}) {
  const category = await Category.findById(id);
  if (!category) throw new ApiError(404, 'CATEGORY_NOT_FOUND', 'Category not found');

  const inUse = await Template.countDocuments({ category: category._id });
  if (inUse > 0) {
    if (!reassignTo) {
      throw new ApiError(409, 'CATEGORY_IN_USE', `${inUse} template(s) use this category. Choose another category to move them to.`, { templateCount: inUse });
    }
    if (String(reassignTo) === String(category._id)) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Choose a different category to move the templates to');
    }
    const target = await Category.findById(reassignTo);
    if (!target) throw new ApiError(404, 'CATEGORY_NOT_FOUND', 'The category to move templates to was not found');
    await Template.updateMany({ category: category._id }, { $set: { category: target._id } });
  }

  await category.deleteOne();
}

// ───────── templates ─────────

/** Public listing: active templates, optional category filter (by slug), paginated. */
export async function listPublicTemplates({ category, page, limit }) {
  const filter = { isActive: true };
  let activeCategory = null;

  if (category) {
    activeCategory = await Category.findOne({ slug: category, isActive: true }).lean();
    if (!activeCategory) throw new ApiError(404, 'CATEGORY_NOT_FOUND', 'Category not found');
    filter.category = activeCategory._id;
  }

  const [total, docs] = await Promise.all([
    Template.countDocuments(filter),
    Template.find(filter)
      .sort({ sortOrder: 1, createdAt: 1, _id: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('category')
      .lean(),
  ]);

  return {
    templates: docs.map(templateDto),
    category: activeCategory ? categoryDto(activeCategory) : null,
    pagination: { page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) },
  };
}

export async function getPublicTemplate(slug) {
  const doc = await Template.findOne({ slug, isActive: true }).populate('category').lean();
  if (!doc) throw new ApiError(404, 'TEMPLATE_NOT_FOUND', 'Template not found');
  return templateDto(doc);
}

export async function listAdminTemplates() {
  const docs = await Template.find().sort({ sortOrder: 1, createdAt: 1, _id: 1 }).populate('category').lean();
  return docs.map(templateDto);
}

export async function createTemplate(input) {
  const slug = slugify(input.slug || input.name);
  if (!slug) throw new ApiError(400, 'VALIDATION_ERROR', 'Use letters or numbers in the template name');

  const category = await resolveCategory(input.category);
  try {
    const doc = await Template.create({
      slug,
      name: input.name,
      description: input.description,
      category: category._id,
      isActive: input.isActive,
      sortOrder: input.sortOrder,
      metaTitle: input.metaTitle,
      metaDescription: input.metaDescription,
    });
    return templateDto({ ...doc.toObject(), category });
  } catch (err) {
    if (err?.code === DUPLICATE) throw new ApiError(409, 'TEMPLATE_EXISTS', 'A template with this slug already exists');
    throw err;
  }
}

export async function updateTemplate(id, input) {
  const template = await Template.findById(id);
  if (!template) throw new ApiError(404, 'TEMPLATE_NOT_FOUND', 'Template not found');

  const { category: categoryChoice, ...rest } = input;
  for (const [key, value] of Object.entries(rest)) if (value !== undefined) template[key] = value;
  if (categoryChoice) template.category = (await resolveCategory(categoryChoice))._id;

  await template.save();
  await template.populate('category');
  return templateDto(template.toObject());
}

/** Resumes keep their design.templateId text; the frontend falls back to its default template when it no longer exists. */
export async function deleteTemplate(id) {
  const removed = await Template.findByIdAndDelete(id);
  if (!removed) throw new ApiError(404, 'TEMPLATE_NOT_FOUND', 'Template not found');
}

/** Used by the resume service: a resume can only be started from / switched to an active template. */
export async function assertTemplateAvailable(slug) {
  if (!slug) return;
  const exists = await Template.exists({ slug, isActive: true });
  if (!exists) throw new ApiError(400, 'TEMPLATE_NOT_FOUND', 'This template is no longer available. Please choose another one.');
}
