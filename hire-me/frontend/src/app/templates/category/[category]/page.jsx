import { notFound } from "next/navigation";
import TemplatesView from "../../../components/templates/TemplatesView";
import { categoryPath, getCategories, getTemplates, listingPath, parsePage } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site";

// /templates/category/modern          templates of one category (the slug is the filter)
// /templates/category/modern?page=2   pagination

const SLUG = /^[a-z0-9-]{1,60}$/;

export async function generateMetadata({ params, searchParams }) {
  const { category: slug } = await params;
  const page = parsePage((await searchParams).page);
  const data = SLUG.test(slug) ? await getTemplates({ category: slug, page }) : null;
  if (!data) return { title: "Category not found", robots: { index: false, follow: false } };

  const { category, pagination } = data;
  const title = page > 1 ? `${category.name} Resume Templates - Page ${page}` : `${category.name} Resume Templates`;
  const description =
    category.description ||
    `Browse ${pagination.total} ${category.name.toLowerCase()} resume template${pagination.total === 1 ? "" : "s"}. Pick one, fill it in and download your ATS-friendly resume.`;
  const url = absoluteUrl(listingPath({ category: slug, page }));

  return {
    title,
    description,
    alternates: { canonical: url },
    pagination: {
      ...(page > 1 && { previous: absoluteUrl(listingPath({ category: slug, page: page - 1 })) }),
      ...(page < pagination.totalPages && { next: absoluteUrl(listingPath({ category: slug, page: page + 1 })) }),
    },
    openGraph: { type: "website", url, title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const { category: slug } = await params;
  const page = parsePage((await searchParams).page);
  if (!SLUG.test(slug)) notFound();

  const [categories, data] = await Promise.all([getCategories(), getTemplates({ category: slug, page })]);
  if (!data || (page > 1 && page > data.pagination.totalPages)) notFound();
  return <TemplatesView categories={categories} data={data} page={page} />;
}
