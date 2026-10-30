import { notFound } from "next/navigation";
import PublicResume from "./PublicResume";
import { BACKEND_URL } from "@/lib/site";

// The page behind a share link. A server component: crawlers (Facebook, LinkedIn, X, WhatsApp ...) never run
// JavaScript, so the Open Graph tags must already be in the first HTML response.

async function loadResume(slug) {
  try {
    // Never cached: when the owner turns sharing off, the very next visit must get "not found".
    const response = await fetch(`${BACKEND_URL}/api/public/resumes/${encodeURIComponent(slug)}`, { cache: "no-store" });
    if (!response.ok) return null;
    return (await response.json()).data;
  } catch {
    return null;
  }
}

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
    robots: { index: false, follow: false, nocache: true },
    alternates: { canonical: og.url },
    openGraph: { type: "profile", url: og.url, title: og.title, description: og.description, images },
    twitter: { card: "summary", title: og.title, description: og.description, images: og.image ? [og.image] : undefined },
  };
}

export default async function SharedResumePage({ params }) {
  const { slug } = await params;
  const data = await loadResume(slug);
  if (!data) notFound();
  return <PublicResume data={data} />;
}
