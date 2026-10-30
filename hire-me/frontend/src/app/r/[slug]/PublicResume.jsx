"use client";

import Link from "next/link";
import ResumePreview from "@/resume/engine/ResumePreview";
import { usePrintResume } from "@/resume/engine/usePrintResume";
import { getTemplate } from "@/resume/templates/registry";

/**
 * The read-only page of a shared resume. It uses the SAME engine as the builder preview and the PDF,
 * so visitors see the same template, colour and page breaks.
 *
 * `data` is the answer of GET /api/public/resumes/:slug (email / phone are already removed on the server
 * unless the owner chose to show them). All text is rendered by React, which escapes it, and the templates
 * only link to http(s) addresses.
 */
export default function PublicResume({ data }) {
  const template = getTemplate(data.design?.templateId);
  const { printResume, printPortal, isDownloading } = usePrintResume();
  const name = data.content.personalInformation?.fullName;

  return (
    <main className="mx-auto w-full max-w-[860px] px-4 py-8">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-small font-medium text-neutral-500/80">{name ? `${name}'s resume` : "Resume"}</p>
        <button
          type="button"
          disabled={isDownloading}
          onClick={() => printResume({ template, data: data.content, color: data.design?.color })}
          className="rounded-lg bg-[#4F46E5] px-4 py-2 text-small font-medium text-white outline-none hover:bg-[#4338CA] focus-visible:ring-[3px] focus-visible:ring-indigo-300 disabled:opacity-60"
        >
          Download PDF
        </button>
      </div>

      <div className="overflow-hidden rounded-[13px] border border-neutral-500/10 bg-white shadow-[0_6px_8px_rgba(2,6,23,0.10)]">
        <ResumePreview template={template} data={data.content} color={data.design?.color} />
      </div>
      {printPortal}

      <p className="mt-6 text-center text-small text-neutral-500/70">
        Want one like this?{" "}
        <Link href="/templates" className="underline">
          Build your own resume
        </Link>
      </p>
    </main>
  );
}
