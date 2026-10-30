"use client";

import { useEffect, useRef, useState } from "react";
import ResumePreview from "@/resume/engine/ResumePreview";
import { getTemplate } from "@/resume/templates/registry";
import { useGetResumeQuery } from "@/store/api/resumeApi";

/**
 * The first page of a saved resume, drawn live in its template and colour.
 * It loads (and draws) only when the card scrolls into view, so a long list stays light.
 * The resume is fetched fresh each time the list opens, so an edit you just made shows at once.
 */
export default function ResumeThumb({ id, title }) {
  const ref = useRef(null);
  // Browsers without IntersectionObserver just load everything.
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === "undefined");

  useEffect(() => {
    const node = ref.current;
    if (visible || !node) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [visible]);

  const { data: resume, isError } = useGetResumeQuery(id, { skip: !visible, refetchOnMountOrArgChange: true });

  return (
    <div ref={ref} role="img" aria-label={`${title} resume preview`} className="pointer-events-none absolute inset-x-0 top-0 aspect-210/297 select-none overflow-hidden bg-white">
      {resume ? (
        <ResumePreview template={getTemplate(resume.design?.templateId)} data={resume} color={resume.design?.color} maxPages={1} />
      ) : (
        <div className={`size-full bg-neutral-100 ${isError ? "" : "animate-pulse"}`} />
      )}
    </div>
  );
}
