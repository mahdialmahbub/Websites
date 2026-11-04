import { templatePath } from "@/lib/catalog";

const text = (value) => (typeof value === "string" ? value.trim() : "");

/** noindex hobe jodi admin noindex kore, ba template active na thake. Sitemap o ei function use korbe. */
export const isNoindex = (template) =>
  template.noindex === true || template.isActive === false;

/**
 * Template theke SEO field gulo ber kore. Admin kichu na likhle khali field safe fallback diye bhore dey.
 * Title e brand nam dei na, karon layout er title template ("%s | HireMe") nijei suffix boshay.
 */
export function deriveSeo(template) {
  const name = text(template.name);
  const categoryName = text(template.category?.name);
  const keywords = [
    `${name} resume template`,
    categoryName && `${categoryName} resume template`,
    ...(Array.isArray(template.keywords) ? template.keywords : []), // admin theke dile
  ];
  const title =
    text(template.metaTitle) ||
    `${name} Resume Template${categoryName ? ` (${categoryName})` : ""}`;

  // Admin er description (na thakle ekta default line) + ekta extra line, jodi 160 character er moddhe ashe
  const base =
    text(template.metaDescription) ||
    text(template.description) ||
    `Use the ${name} resume template.`;
  const extra =
    "ATS-friendly design you can fill in and download as a PDF in minutes.";
  const description =
    `${base} ${extra}`.length <= 160 && !text(template.metaDescription)
      ? `${base} ${extra}`
      : base;

  // Image na thakle null: tokhon root er opengraph-image file use hoy
  const image = text(template.ogImage) || text(template.previewImage) || null;

  return {
    title,
    description,
    image,
    keywords,
    path: templatePath(template.slug),
    noindex: isNoindex(template),
  };
}
