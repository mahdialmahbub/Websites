import Link from "next/link";
import JsonLd from "../JsonLd";
import { absoluteUrl } from "@/lib/site";
import { categoryPath, listingPath, templatePath } from "@/lib/catalog";
import CategoryNav from "./CategoryNav";
import Pagination from "./Pagination";
import TemplateCard from "./TemplateCard";

/**
 * The templates page body, shared by /templates and /templates/category/[category].
 * A server component: the first HTML response already contains the categories and the cards.
 */
export default function TemplatesView({ categories, data, page }) {
  const { templates, category, pagination } = data;
  const heading = category ? `${category.name} Resume Templates` : "Free ATS-Friendly Resume Templates";
  const intro =
    category?.description ||
    (category
      ? `Browse ${pagination.total} ${category.name.toLowerCase()} resume template${pagination.total === 1 ? "" : "s"}. Pick one, fill it in and download your resume.`
      : "Choose a clean, recruiter-approved template, fill in your details and download a polished resume in minutes. You can change the template any time.");
  const pagePath = listingPath({ category: category?.slug, page });

  const crumbs = [
    { name: "Home", url: absoluteUrl("/") },
    { name: "Templates", url: absoluteUrl("/templates") },
    ...(category ? [{ name: category.name, url: absoluteUrl(categoryPath(category.slug)) }] : []),
  ];

  return (
    <main className="mx-auto flex min-h-screen w-full min-w-[320px] max-w-300 flex-col items-center gap-[clamp(1.5rem,calc(1.690vw+1.104rem),2.625rem)] px-[clamp(1rem,calc(5.258vw+0.268rem),5rem)] py-[clamp(2rem,calc(6.009vw+0.592rem),4rem)]">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": absoluteUrl(pagePath),
              url: absoluteUrl(pagePath),
              name: heading,
              description: intro,
              isPartOf: { "@type": "WebSite", name: "HireMe", url: absoluteUrl("/") },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: crumbs.map((crumb, index) => ({ "@type": "ListItem", position: index + 1, name: crumb.name, item: crumb.url })),
            },
            {
              "@type": "ItemList",
              numberOfItems: pagination.total,
              itemListElement: templates.map((template, index) => ({
                "@type": "ListItem",
                position: (pagination.page - 1) * pagination.limit + index + 1,
                name: template.name,
                url: absoluteUrl(templatePath(template.slug)),
              })),
            },
          ],
        }}
      />

      <header className="max-w-2xl space-y-3 text-center">
        <h1 className="font-primary text-[clamp(1.5rem,calc(1.878vw+1.06rem),2.75rem)] font-semibold">{heading}</h1>
        <p className="text-[clamp(0.875rem,calc(0.188vw+0.831rem),1rem)] text-[#5C5C61]/80">{intro}</p>
      </header>

      <CategoryNav categories={categories} activeSlug={category?.slug} />

      {templates.length === 0 ? (
        <p className="py-10 text-center text-neutral-500/70">No templates here yet. Check back soon.</p>
      ) : (
        <ul className="flex flex-wrap items-start justify-center gap-[clamp(1.5rem,calc(3.005vw+0.796rem),3.5rem)]">
          {templates.map((template) => (
            <li key={template.slug}>
              <TemplateCard template={template} alwaysActive />
            </li>
          ))}
        </ul>
      )}

      <Pagination page={pagination.page} totalPages={pagination.totalPages} category={category?.slug} />
    </main>
  );
}
