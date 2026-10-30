import { notFound } from "next/navigation";
import TemplatesView from "../components/templates/TemplatesView";
import { getCategories, getTemplates, listingPath, parsePage } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site";

// /templates            all templates
// /templates?page=2     next page (plain links, crawlable)
// The data is fetched on the server, so the first HTML already contains the templates.

export async function generateMetadata({ searchParams }) {
  const page = parsePage((await searchParams).page);
  const data = await getTemplates({ page });
  const total = data?.pagination.total ?? 0;
  const title = page > 1 ? `Free Resume Templates - Page ${page}` : "Free ATS-Friendly Resume Templates";
  const description = `Browse ${total || "our"} professional resume templates. Pick a clean, ATS-friendly design, fill in your details and download your resume in minutes.`;
  const url = absoluteUrl(listingPath({ page }));
  const { pagination } = data ?? {};

  return {
    title,
    description,
    alternates: { canonical: url },
    pagination: {
      ...(page > 1 && { previous: absoluteUrl(listingPath({ page: page - 1 })) }),
      ...(pagination && page < pagination.totalPages && { next: absoluteUrl(listingPath({ page: page + 1 })) }),
    },
    openGraph: { type: "website", url, title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function TemplatesPage({ searchParams }) {
  const page = parsePage((await searchParams).page);
  const [categories, data] = await Promise.all([getCategories(), getTemplates({ page })]);

  // A page number past the end is not a real page (and would be thin duplicate content).
  if (!data || (page > 1 && page > data.pagination.totalPages)) notFound();
  return <TemplatesView categories={categories} data={data} page={page} />;
}
