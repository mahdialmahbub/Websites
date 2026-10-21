// src/app/utils/buildMetadata.js

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");
const SITE_NAME = "MahdiVerse | MERN Developer, UI/UX Designer & SEO Specialist";
const DEFAULT_OG_IMAGE = "/og/default.png"; // public/og/default.png (1200x630)

const TITLE_MAX = 70;
const DESCRIPTION_MAX = 160;

/**
 * Page path theke canonical URL: nijer domain, query/hash chhara,
 * shesh e `/` chhara (home page bade).
 * @param {string} [path] - jemon '/projects/my-project'
 * @returns {string}
 */
export function canonical(path = "/") {
  const url = new URL(path, SITE_URL);
  url.search = "";
  url.hash = "";
  if (url.pathname.length > 1) url.pathname = url.pathname.replace(/\/+$/, "");
  return url.toString();
}

/**
 * @typedef {Object} MetadataInput
 * @property {string} title - Page title (max 70 character)
 * @property {string} description - Meta description (max 160 character)
 * @property {string} path - Page path, jemon '/projects/my-project'
 * @property {string | false} [image] - OG image path/URL. Na dile default image. `false` dile image set hoy na (opengraph-image file er jonno)
 * @property {'website' | 'article'} [type] - Default 'website'
 * @property {boolean} [noindex] - true dile Google page ta index korbe na
 * @property {Date} [publishedTime] - Shudhu type 'article' hole
 * @property {Date} [modifiedTime] - Shudhu type 'article' hole
 * @property {string[]} [authors] - Shudhu type 'article' hole
 */

const truncate = (text = "", max) =>
  text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;

/**
 * @param {MetadataInput} input
 * @returns {import('next').Metadata}
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  noindex = false,
  publishedTime,
  modifiedTime,
  authors,
}) {
  const url = canonical(path);
  const safeTitle = truncate(title, TITLE_MAX);
  const safeDescription = truncate(description, DESCRIPTION_MAX);

  const imageUrl =
    image === false
      ? null
      : new URL(image ?? DEFAULT_OG_IMAGE, SITE_URL).toString();

  return {
    title: safeTitle,
    description: safeDescription,
    alternates: { canonical: url },
    robots: { index: !noindex, follow: true },
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      title: safeTitle,
      description: safeDescription,
      ...(imageUrl && {
        images: [{ url: imageUrl, width: 1200, height: 630, alt: safeTitle }],
      }),
      ...(type === "article" && {
        publishedTime: publishedTime?.toISOString(),
        modifiedTime: modifiedTime?.toISOString(),
        authors,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: safeTitle,
      description: safeDescription,
      ...(imageUrl && { images: [imageUrl] }),
    },
  };
}
