// Site-wide constants. Set NEXT_PUBLIC_SITE_URL in production (e.g. https://hireme.com) - it is used for
// canonical links, Open Graph URLs and the sitemap.
export const SITE_NAME = "HireMe";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");

// Server-side only: the Express API. Server components call it directly (no browser, no CORS).
export const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:5000";

export const absoluteUrl = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
