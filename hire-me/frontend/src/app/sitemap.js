import {
  getAllTemplates,
  getCategories,
  categoryPath,
  templatePath,
} from "@/lib/catalog";
import { isNoindex } from "@/lib/seo/derive";
import { absoluteUrl } from "@/lib/site";

// Fetches in catalog.js revalidate every 60s, so this may rebuild more often than hourly.
export const revalidate = 3600;

const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

// Returns a valid Date or undefined (never "Invalid Date").
const toDate = (value) => {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

export default async function sitemap() {
  const entries = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    {
      url: absoluteUrl("/templates"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    // Add other public static pages here, e.g. /pricing, /about, /contact, /blog
  ];

  try {
    const [categories, templates] = await Promise.all([
      getCategories(),
      getAllTemplates(),
    ]);

    for (const category of categories) {
      entries.push({
        url: absoluteUrl(categoryPath(category.slug)),
        lastModified: toDate(category.updatedAt),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }

    for (const template of templates) {
      if (isNoindex(template)) continue; // noindex ba inactive template sitemap e dibo na

      entries.push({
        url: absoluteUrl(templatePath(template.slug)),
        lastModified: toDate(template.updatedAt),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  } catch (error) {
    // During build the API may not be reachable: keep the static entries so the build passes.
    // At runtime, rethrow so Next.js keeps serving the last good sitemap instead of a cut-down one.
    if (!isBuildPhase) throw error;
    console.error(
      "Sitemap: catalog API unavailable at build time, using static entries only.",
      error,
    );
  }

  return entries;
}
