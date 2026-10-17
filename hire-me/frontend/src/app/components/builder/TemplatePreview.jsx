'use client';

import ResumePreview from '@/resume/engine/ResumePreview';
import { getTemplate } from '@/resume/templates/registry';

/**
 * A thumbnail of a template filled with ITS demo data (first page only).
 * Use it as the preview inside your TempleteCard:   <TemplatePreview templateId={template.id} />
 */
export default function TemplatePreview({ templateId, color, className }) {
  const template = getTemplate(templateId);
  return <ResumePreview template={template} data={template.demoData} color={color} maxPages={1} className={className} />;
}
