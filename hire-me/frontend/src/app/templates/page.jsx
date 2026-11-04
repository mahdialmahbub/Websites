import { notFound } from "next/navigation";
import TemplatesView from "../components/templates/TemplatesView";
import {
  getCategories,
  getTemplates,
  listingPath,
  parsePage,
} from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo/build-metadata";

// /templates            all templates
// /templates?page=2     next page (plain links, crawlable)
// The data is fetched on the server, so the first HTML already contains the templates.

export async function generateMetadata({ searchParams }) {
  const page = parsePage((await searchParams).page);
  const data = await getTemplates({ page });
  const pagination = data?.pagination;
  const total = pagination?.total ?? 0;

  // Shesh page er por-er page: notFound() hobe, tai index korano jabe na
  const outOfRange = !data || (page > 1 && page > pagination.totalPages);

  const title =
    page > 1
      ? `Free Resume Templates - Page ${page}`
      : "Free ATS-Friendly Resume Templates";
  const base = `Browse ${total || "our"} professional resume templates. Pick a clean, ATS-friendly design, fill in your details and download your resume in minutes.`;

  return buildMetadata({
    title,
    // Page 2+ e alada description, jate duplicate description na hoy
    description: page > 1 ? `Page ${page}: ${base}` : base,
    path: listingPath({ page }),
    noindex: outOfRange,
    pagination: pagination && {
      previous: page > 1 ? listingPath({ page: page - 1 }) : undefined,
      next:
        page < pagination.totalPages
          ? listingPath({ page: page + 1 })
          : undefined,
    },
  });
}

export default async function TemplatesPage({ searchParams }) {
  const page = parsePage((await searchParams).page);
  const [categories, data] = await Promise.all([
    getCategories(),
    getTemplates({ page }),
  ]);

  // A page number past the end is not a real page (and would be thin duplicate content).
  if (!data || (page > 1 && page > data.pagination.totalPages)) notFound();

  return <TemplatesView categories={categories} data={data} page={page} />;
}
