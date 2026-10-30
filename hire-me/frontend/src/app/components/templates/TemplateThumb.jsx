"use client";

import { useSyncExternalStore } from "react";
import ResumePreview from "@/resume/engine/ResumePreview";
import { getTemplate } from "@/resume/templates/registry";

// false while the server renders and during hydration, true afterwards.
const subscribe = () => () => {};
const useIsBrowser = () => useSyncExternalStore(subscribe, () => true, () => false);

/**
 * A live thumbnail of a template filled with its demo data (first page only).
 *
 * It is drawn in the browser ONLY. The server sends an empty, correctly sized box, so the page's HTML
 * does not fill up with the demo resume's headings and text (extra <h1>s, duplicate content for search engines).
 * The design has no <img>; role="img" + aria-label is its alt text.
 * A slug that has no design in the frontend registry shows the default template.
 */
export default function TemplateThumb({ slug, name, color, className }) {
  const inBrowser = useIsBrowser();
  const template = inBrowser ? getTemplate(slug) : null;

  return (
    <div
      role="img"
      aria-label={`Preview of the ${name} resume template`}
      className={`pointer-events-none select-none bg-white ${className ?? ""}`}
      style={{ aspectRatio: "210 / 297" }}
    >
      {template && <ResumePreview template={template} data={template.demoData} color={color} maxPages={1} />}
    </div>
  );
}
