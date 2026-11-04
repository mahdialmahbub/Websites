// Site-wide constants.
export const SITE_NAME = "HireMe";

// Server-side only: Express API.
export const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:5000";

export const absoluteUrl = (path = "/") =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

if (!rawSiteUrl && process.env.NODE_ENV === "production") {
  throw new Error("NEXT_PUBLIC_SITE_URL must be set in production.");
}

export const SITE_URL = (rawSiteUrl ?? "http://localhost:3000").replace(
  /\/+$/,
  "",
);

export const SITE_DESCRIPTION =
  "Build a professional, ATS-friendly resume with smart templates and AI-powered guidance. Free to start.";

// Optional: social profile, jodi thake (Organization schema te sameAs hishebe jabe)
export const SOCIAL_LINKS = [
  // "https://www.linkedin.com/company/hireme",
  // "https://twitter.com/hireme",
];