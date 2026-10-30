"use client";

import ResumePreview from "@/resume/engine/ResumePreview";
import { getTemplate } from "@/resume/templates/registry";
import { useGetResumeQuery } from "@/store/api/resumeApi";
import Modal from "../Modal";

/** The whole resume, every page, as a larger preview. `id` is the resume to show, or null (closed). */
export default function ResumePreviewModal({ id, title, onClose }) {
  const { data: resume, isError } = useGetResumeQuery(id, { skip: !id });

  return (
    <Modal open={Boolean(id)} onClose={onClose} title={title ?? "Resume preview"} wide>
      {isError ? (
        <p role="alert" className="py-8 text-center text-red-600">
          We could not load this resume.
        </p>
      ) : !resume ? (
        <p role="status" className="py-8 text-center text-neutral-500/70">
          Loading…
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-neutral-500/10 bg-white">
          <ResumePreview template={getTemplate(resume.design?.templateId)} data={resume} color={resume.design?.color} />
        </div>
      )}
    </Modal>
  );
}
