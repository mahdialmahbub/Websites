// app/sitemap.js

import projectsData from "./assets/projects/projects";
import { canonical } from "./utils/buildMetadata";

// Page er content asholei change hole tokhon date update koro
const STATIC_ROUTES = [
  { path: "", lastModified: "2026-10-20" },
  { path: "/about", lastModified: "2026-06-01" },
  { path: "/workflow", lastModified: "2026-06-01" },
  { path: "/projects", lastModified: "2026-10-20" },
  { path: "/clients", lastModified: "2026-10-20" },
  { path: "/contact", lastModified: "2026-06-01" },
];

const FALLBACK_DATE = "2026-10-20";

/** @returns {import('next').MetadataRoute.Sitemap} */
export default function sitemap() {
  const staticPages = STATIC_ROUTES.map(({ path, lastModified }) => ({
    url: canonical(path || "/"),
    lastModified: new Date(lastModified),
  }));

  const projectPages = projectsData.map(({ slug, updatedAt }) => ({
    url: canonical(`/projects/${slug}`),
    lastModified: new Date(updatedAt ?? FALLBACK_DATE),
  }));

  return [...staticPages, ...projectPages];
}
