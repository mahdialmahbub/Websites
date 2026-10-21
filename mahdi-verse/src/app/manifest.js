// app/manifest.js

const SITE_NAME =
  "MahdiVerse | MERN Developer, UI/UX Designer & SEO Specialist";
const SHORT_NAME = "MahdiVerse"; // keep under 12 characters so it is not truncated under the app icon
const DESCRIPTION =
  "Portfolio of a MERN stack developer and UI/UX designer building fast, SEO-friendly websites with Next.js. Web design, development, and technical SEO services.";

// Replace with your site's real brand colors.
// theme_color tints the browser/OS toolbar; background_color is the splash screen.
const THEME_COLOR = "#6C63FF";
const BACKGROUND_COLOR = "#F8FAFC";

/** @returns {import('next').MetadataRoute.Manifest} */
export default function manifest() {
  return {
    id: "/",
    name: SITE_NAME,
    short_name: SHORT_NAME,
    description: DESCRIPTION,
    lang: "en",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: BACKGROUND_COLOR,
    theme_color: THEME_COLOR,
    categories: ["business", "design", "productivity", "development", "seo"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      { name: "About Me", short_name: "about", url: "/about" },
      { name: "Workflow", short_name: "Workflow", url: "/workflow" },
      { name: "Projects", short_name: "Projects", url: "/projects" },
      { name: "Clients", short_name: "Clients", url: "/clients" },
      { name: "Contact Me", short_name: "Contact", url: "/contact" },
    ],
  };
}
