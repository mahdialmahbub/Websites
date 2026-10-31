// Site-wide constants.
export const SITE_NAME = "HireMe";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");

// Server-side only: Express API.
export const BACKEND_URL =
  process.env.BACKEND_URL ?? "http://localhost:5000";

export const absoluteUrl = (path = "/") =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;