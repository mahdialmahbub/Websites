import { notFound } from "next/navigation";
import TemplatesView from "../../../components/templates/TemplatesView";
import { getCategories, getTemplates, listingPath, parsePage } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo/build-metadata";

// /templates/category/modern          templates of one category (the slug is the filter)
// /templates/category/modern?page=2   pagination

const SLUG = /^[a-z0-9-]{1,60}$/;

export async function generateMetadata({ params, searchParams }) {
  const { category: slug } = await params;
  const page = parsePage((await searchParams).page);
  const data = SLUG.test(slug) ? await getTemplates({ category: slug, page }) : null;
  if (!data) return { title: "Category not found", robots: { index: false, follow: false } };

  const { category, pagination } = data;
  const outOfRange = page > 1 && page > pagination.totalPages;

  const title = page > 1 ? `${category.name} Resume Templates - Page ${page}` : `${category.name} Resume Templates`;
  const base =
    category.description ||
    `Browse ${pagination.total} ${category.name.toLowerCase()} resume template${pagination.total === 1 ? "" : "s"}. Pick one, fill it in and download your ATS-friendly resume.`;

  return buildMetadata({
    title,
    description: page > 1 ? `Page ${page}: ${base}` : base,
    path: listingPath({ category: slug, page }),
    noindex: outOfRange,
    pagination: {
      previous: page > 1 ? listingPath({ category: slug, page: page - 1 }) : undefined,
      next: page < pagination.totalPages ? listingPath({ category: slug, page: page + 1 }) : undefined,
    },
  });
}

export default async function CategoryPage({ params, searchParams }) {
  const { category: slug } = await params;
  const page = parsePage((await searchParams).page);
  if (!SLUG.test(slug)) notFound();

  const [categories, data] = await Promise.all([getCategories(), getTemplates({ category: slug, page })]);
  if (!data || (page > 1 && page > data.pagination.totalPages)) notFound();

  return (
      <TemplatesView categories={categories} data={data} page={page} />
  );
}