"use client";

import { useDeferredValue, useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ResumePreview from "@/resume/engine/ResumePreview";
import { getTemplate } from "@/resume/templates/registry";

// A4 width at 96dpi (210mm). Change this if your resume engine renders pages at a different width.
const PAGE_WIDTH = 794;

/**
 * The LIVE preview: the draft in the chosen template and colour, split into real A4 pages.
 * It reads the same Redux draft the forms write to, so it updates as the user types.
 *
 * The frame always keeps the A4 ratio (210 : 297). The pages are scaled to the frame's width,
 * and if the resume has more than one page the frame scrolls vertically.
 * Border / shadow / rounded corners come from the parent card (PreviewandScore).
 */
export default function BuilderPreview({ className }) {
  const content = useSelector((state) => state.builder.content);
  const design = useSelector((state) => state.builder.design);

  // While the user types fast React keeps the previous preview until it has time to re-measure the pages.
  const deferredContent = useDeferredValue(content);

  const frameRef = useRef(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    // clientWidth excludes the scrollbar, so the scale does not jump when a scrollbar appears.
    const update = () => setScale(el.clientWidth / PAGE_WIDTH);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={frameRef}
      className=" overflow-y-auto overflow-x-hidden "
    >
      <div style={{ width: PAGE_WIDTH, zoom: scale }}>
        <ResumePreview
          template={getTemplate(design.templateId)}
          data={deferredContent}
          color={design.color}
          className={className}
        />
      </div>
    </div>
  );
}
