"use client";

import Link from "next/link";
import ResumePreview from "@/resume/engine/ResumePreview";
import { useDownloadResume } from "@/resume/engine/useDownloadResume";
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
  const { downloadResume, downloadPortal, isDownloading, error } =
    useDownloadResume();
  const name = data.content.personalInformation?.fullName;

  return (
    <main className="mx-auto w-full max-w-215 px-4 py-8">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-small font-medium text-neutral-500/80">
          {name ? `${name}'s resume` : "Resume"}
        </p>
        <button
          type="button"
          disabled={isDownloading}
          onClick={() =>
            downloadResume({
              template,
              data: data.content,
              color: data.design?.color,
            })
          }
          className="rounded-lg bg-primary-300 px-4 py-2 text-small font-medium text-white outline-none hover:bg-[#4338CA] focus-visible:ring-[3px] focus-visible:ring-indigo-300 disabled:opacity-60"
        >
          {isDownloading ? "Preparing PDF…" : "Download PDF"}
        </button>
      </div>

      {error ? (
        <p role="alert" className="mb-4 text-small text-red-600">
          The PDF could not be created. Please try again.
        </p>
      ) : null}

      <div className="overflow-hidden rounded-[13px] border border-neutral-500/10 bg-white shadow-[0_6px_8px_rgba(2,6,23,0.10)]">
        <ResumePreview
          template={template}
          data={data.content}
          color={data.design?.color}
        />
      </div>
      {downloadPortal}

      <p className="mt-6 text-center text-small text-neutral-500/70">
        Want one like this?{" "}
        <Link href="/templates" className="underline">
          Build your own resume
        </Link>
      </p>
    </main>
  );
}
