'use client';

import { useDeferredValue } from 'react';
import { useSelector } from 'react-redux';
import ResumePreview from '@/resume/engine/ResumePreview';
import { getTemplate } from '@/resume/templates/registry';

/**
 * The LIVE preview: shows the draft with the chosen template and colour, split into real A4 pages.
 * Put it where the static <Image src="/resumePreview.jpg" /> is in PreviewandScore.
 */
export default function BuilderPreview({ className }) {
  const content = useSelector((state) => state.builder.content);
  const design = useSelector((state) => state.builder.design);

  // while the user types fast, React keeps the previous preview until it has time to re-measure the pages
  const deferredContent = useDeferredValue(content);

  return <ResumePreview template={getTemplate(design.templateId)} data={deferredContent} color={design.color} className={className} />;
}
