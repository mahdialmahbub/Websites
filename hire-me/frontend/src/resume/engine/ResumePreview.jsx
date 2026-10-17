'use client';

import { useEffect, useRef, useState } from 'react';
import ResumeDocument, { PAGE_GAP, PAGE_HEIGHT, PAGE_WIDTH } from './ResumeDocument';

/**
 * ResumeDocument shrunk to fit its container (live preview, template thumbnails, shared page).
 * The pages are laid out at full A4 size and only SCALED visually, so the page breaks are exactly the ones
 * the PDF will have.
 *
 * <ResumePreview template={t} data={content} color="#1d4ed8" />      all pages
 * <ResumePreview template={t} data={t.demoData} maxPages={1} />     thumbnail
 */
export default function ResumePreview({ template, data, color, maxPages, className, onLayout }) {
  const hostRef = useRef(null);
  const [scale, setScale] = useState(0.5);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;
    const update = () => setScale(Math.max(0.1, host.clientWidth / PAGE_WIDTH));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  const shownPages = Math.min(pageCount, maxPages ?? pageCount);
  const height = (shownPages * PAGE_HEIGHT + (shownPages - 1) * PAGE_GAP) * scale;

  return (
    <div ref={hostRef} className={className} style={{ width: '100%', height, position: 'relative', overflow: 'hidden' }}>
      <div style={{ width: PAGE_WIDTH, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <ResumeDocument
          template={template}
          data={data}
          color={color}
          maxPages={maxPages}
          onLayout={(info) => {
            setPageCount(info.pageCount);
            onLayout?.(info);
          }}
        />
      </div>
    </div>
  );
}
