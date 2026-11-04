import { cache } from "react";
import { notFound } from "next/navigation";
import PublicResume from "./PublicResume";
import { BACKEND_URL, SITE_NAME } from "@/lib/site";

// The page behind a share link. A server component: crawlers (Facebook, LinkedIn, X, WhatsApp ...) never run
// JavaScript, so the Open Graph tags must already be in the first HTML response.

// Share page search e jabe na, kintu link thaka manush dhukte parbe. Tai noindex-er shathe:
// noarchive (Google er cached copy nei) ar noimageindex (profile photo image search e jabe na).
const PRIVATE_ROBOTS = { index: false, follow: false, nocache: true, noarchive: true, noimageindex: true };

// cache(): generateMetadata ar page duita-i ek-i slug chay, tai API ekbar-i call hoy.
const loadResume = cache(async (slug) => {
  // Never cached: when the owner turns sharing off, the very next visit must get "not found".
  const response = await fetch(`${BACKEND_URL}/api/public/resumes/${encodeURIComponent(slug)}`, { cache: "no-store" });

  // Backend down ba rate limit: "not found" na, error page dekhai. Na hole valid link e 404 dekhe
  // user bhabe tar resume muche geche.
  if (response.status === 429 || response.status >= 500) {
    throw new Error(`Public resume API answered ${response.status}`);
  }
  // 404 / 403 / 410: link nei ba sharing bondho
  if (!response.ok) return null;
  return (await response.json()).data;
});

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await loadResume(slug);
  if (!data) return { title: "Resume not found", robots: { index: false, follow: false } };

  const { og } = data;
  const images = og.image ? [{ url: og.image, alt: og.title }] : undefined;

  return {
    title: og.title,
    description: og.description,
    // A share link is "unlisted": people with the link can open it, search engines must not index personal data.
    robots: PRIVATE_ROBOTS,
    alternates: { canonical: og.url },
    // siteName/locale dite hobe: page er openGraph layout er openGraph ke puro replace kore
    openGraph: { type: "profile", siteName: SITE_NAME, locale: "en_US", url: og.url, title: og.title, description: og.description, images },
    twitter: { card: "summary", title: og.title, description: og.description, images: og.image ? [og.image] : undefined },
  };
}

export default async function SharedResumePage({ params }) {
  const { slug } = await params;
  const data = await loadResume(slug);
  if (!data) notFound();
  return <PublicResume data={data} />;
}
