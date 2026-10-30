import { getAllTemplates, getCategories, categoryPath, templatePath } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site";

// Rebuilt at most once an hour. If the API is down while it builds, the static pages are still listed.
export const revalidate = 3600;

export default async function sitemap() {
  const entries = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/templates"), changeFrequency: "weekly", priority: 0.9 },
  ];

  try {
    const [categories, templates] = await Promise.all([getCategories(), getAllTemplates()]);
    for (const category of categories) {
      entries.push({ url: absoluteUrl(categoryPath(category.slug)), changeFrequency: "weekly", priority: 0.8 });
    }
    for (const template of templates) {
      entries.push({
        url: absoluteUrl(templatePath(template.slug)),
        lastModified: template.updatedAt ? new Date(template.updatedAt) : undefined,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  } catch {
    // keep the static entries
  }
  return entries;
}
