// Server-side data access for the template catalog. Import it only from server components,
// generateMetadata, sitemap.js and robots.js - never from a "use client" file.
import { BACKEND_URL } from "./site";

export const TEMPLATES_PER_PAGE = 12;

/** Cached for a minute (ISR): fast pages, and admin changes show up quickly. */
async function api(path) {
  const response = await fetch(`${BACKEND_URL}/api${path}`, { next: { revalidate: 60 } });
  if (response.status === 404) return null; //            "does not exist" -> the page shows notFound()
  if (!response.ok) throw new Error(`Catalog API answered ${response.status}`); // real problem -> error.jsx
  return (await response.json()).data;
}

/** [{ id, name, slug, description, templateCount }] - only categories that have templates. */
export async function getCategories() {
  return (await api("/categories"))?.categories ?? [];
}

/** { templates, category, pagination } or null when the category does not exist. */
export async function getTemplates({ category, page = 1, limit = TEMPLATES_PER_PAGE } = {}) {
  const query = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (category) query.set("category", category);
  return api(`/templates?${query}`);
}

/** One template or null. */
export async function getTemplate(slug) {
  return (await api(`/templates/${encodeURIComponent(slug)}`))?.template ?? null;
}

/** Every active template (for the sitemap). */
export async function getAllTemplates() {
  const all = [];
  for (let page = 1; page <= 50; page += 1) {
    const data = await getTemplates({ page, limit: 48 });
    if (!data) break;
    all.push(...data.templates);
    if (page >= data.pagination.totalPages) break;
  }
  return all;
}

// ───────── URLs ─────────
export const templatePath = (slug) => `/templates/${slug}`;
export const categoryPath = (slug) => `/templates/category/${slug}`;
/** /templates, /templates?page=2, /templates/category/modern, /templates/category/modern?page=2 */
export const listingPath = ({ category, page } = {}) =>
  `${category ? categoryPath(category) : "/templates"}${page > 1 ? `?page=${page}` : ""}`;

/** "?page=abc", "?page=0" -> 1 */
export const parsePage = (value) => {
  const page = Number.parseInt(Array.isArray(value) ? value[0] : value, 10);
  return Number.isFinite(page) && page >= 1 ? Math.min(page, 1000) : 1;
};
