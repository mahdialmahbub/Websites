import { DEFAULT_KEYWORDS, SITE_NAME, SITE_URL } from "@/lib/site";
import { canonical } from "@/lib/seo/canonical";

const DEFAULT_OG_IMAGE = "/opengraph-image"; // app/opengraph-image.jsx er route
const TWITTER_HANDLE = process.env.NEXT_PUBLIC_TWITTER_HANDLE;

// Lomba text ke shobdo er shimay kete "…" dey (title 70, description 160)
const truncate = (text = "", max) => {
  const clean = String(text).replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
};

const mergeKeywords = (...lists) => {
  const seen = new Set();
  const result = [];
  for (const list of lists) {
    for (const item of list ?? []) {
      const word = String(item ?? "")
        .replace(/\s+/g, " ")
        .trim();
      const key = word.toLowerCase();
      if (!word || seen.has(key)) continue;
      seen.add(key);
      result.push(word);
    }
  }
  return result.slice(0, 15);
};

// Invalid date hole undefined dey, jate toISOString() crash na kore
const toISO = (value) => {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

const toAbsolute = (path) =>
  path ? new URL(path, SITE_URL).toString() : undefined;

/**
 * Ekta reusable metadata builder.
 * path: "/templates/modern"  |  image: optional (relative ba absolute)
 * pagination: { previous: "/templates", next: "/templates?page=3" } (path hishebe dao)
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  keywords = [],
  useDefaultKeywords = true,
  type = "website",
  noindex = false,
  publishedTime,
  modifiedTime,
  authors,
  pagination,
}) {
  const url = canonical(path, { keep: ["page"] });
  const cleanTitle = truncate(title, 70);
  const cleanDescription = truncate(description, 160);

  // Image na dile images set kora hoy na, tokhon root er opengraph-image file e fallback hoy
  const images = image
    ? [{ url: toAbsolute(image), width: 1200, height: 630, alt: cleanTitle }]
    : undefined;

  const ogImages = images ?? [
    {
      url: toAbsolute(DEFAULT_OG_IMAGE),
      width: 1200,
      height: 630,
      alt: cleanTitle,
    },
  ];

  const hasPagination = pagination && (pagination.previous || pagination.next);

  return {
    title: cleanTitle,
    description: cleanDescription,
    keywords: mergeKeywords(
      useDefaultKeywords ? DEFAULT_KEYWORDS : [],
      keywords,
    ),
    alternates: { canonical: url },

    // Indexable page e robots set kori na, jate layout er googleBot setting (max-image-preview) hariye na jay
    ...(noindex && { robots: { index: false, follow: true } }),

    ...(hasPagination && {
      pagination: {
        previous: toAbsolute(pagination.previous),
        next: toAbsolute(pagination.next),
      },
    }),

    openGraph: {
      type,
      url,
      title: cleanTitle,
      description: cleanDescription,
      siteName: SITE_NAME, // page er openGraph layout er openGraph ke replace kore, tai ekhane dite hoy
      locale: "en_US",
      images: ogImages,
      ...(type === "article" && {
        publishedTime: toISO(publishedTime),
        modifiedTime: toISO(modifiedTime),
        authors,
      }),
    },

    twitter: {
      card: "summary_large_image",
      title: cleanTitle,
      description: cleanDescription,
      ...(images && { images: images.map((item) => item.url) }),
      ...(TWITTER_HANDLE && { site: TWITTER_HANDLE, creator: TWITTER_HANDLE }),
    },
  };
}
