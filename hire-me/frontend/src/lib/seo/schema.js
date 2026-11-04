import {
  SITE_NAME,
  SITE_DESCRIPTION,
  SOCIAL_LINKS,
  SITE_URL,
  absoluteUrl,
} from "@/lib/site";
import { templatePath } from "@/lib/catalog";

// Relative URL ke absolute banay (already absolute hole same thake)
const toAbsolute = (url) => new URL(url, SITE_URL).toString();
const toISODate = (value) => {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
};

// Organization + WebSite
export function siteSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": absoluteUrl("/#organization"),
        name: SITE_NAME,
        url: absoluteUrl("/"),
        logo: absoluteUrl("/logo.png"), // public/logo.png rakho (min 112x112)
        ...(SOCIAL_LINKS.length > 0 && { sameAs: SOCIAL_LINKS }),
      },
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        url: absoluteUrl("/"),
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "en",
        publisher: { "@id": absoluteUrl("/#organization") },
      },
    ],
  };
}

// Template page er Product schema (doc er productSchema er equivalent)
export function templateSchema(template) {
  const rating = Number(template.ratingAvg);
  const validUntil = toISODate(template.priceValidUntil);
  const images = (template.images ?? [template.previewImage])
    .filter(Boolean)
    .map((image) => toAbsolute(typeof image === "string" ? image : image.url));

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: template.name,
    description: template.description,
    ...(images.length > 0 && { image: images }),
    ...(template.sku && { sku: template.sku }),
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      url: toAbsolute(templatePath(template.slug)),
      price: Number(template.price ?? 0).toFixed(2), // shonkha, mudrar chinho chhara
      priceCurrency: "USD", // tomar currency onujayi change koro
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      ...(template.priceValidUntil && {
        priceValidUntil: new Date(template.priceValidUntil)
          .toISOString()
          .slice(0, 10),
      }),
      ...(validUntil && { priceValidUntil: validUntil }),
    },
    // Shudhu prokrito review thakle, ar page e dekha gele
    ...(template.reviewCount > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: Number(template.ratingAvg).toFixed(1),
        reviewCount: template.reviewCount,
      },
    }),
  };
}
