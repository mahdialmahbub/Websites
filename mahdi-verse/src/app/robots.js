// app/robots.js

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");
const IS_PRODUCTION = process.env.NEXT_PUBLIC_ENV === "production";

// Search engine jeno crawl na kore
const PRIVATE_PATHS = ["/api/", "/clients"];

/** @returns {import('next').MetadataRoute.Robots} */
export default function robots() {
  // Staging / preview / local: pura site block
  if (!IS_PRODUCTION) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
