"use client";

import React from "react";
import { useSelector } from "react-redux";
import ResumePreview from "@/resume/engine/ResumePreview";
import { getTemplate } from "@/resume/templates/registry";

/**
 * The first page of the resume as it will be shared: the same template, colour and data as the live preview.
 * (It used to be a fixed picture; it now shows the real draft.)
 */
const FinalPreview = () => {
  const content = useSelector((state) => state.builder.content);
  const design = useSelector((state) => state.builder.design);

  return (
    <div
      role="img"
      aria-label="First page of your resume"
      className="md:max-w-135.5 sm:max-w-95 w-full aspect-210/297 overflow-hidden bg-white shadow-[0_12px_16px_rgba(0,0,0,0.12)] rounded-[13px] relative pointer-events-none select-none"
    >
      <ResumePreview template={getTemplate(design.templateId)} data={content} color={design.color} maxPages={1} />
    </div>
  );
};

export default FinalPreview;
