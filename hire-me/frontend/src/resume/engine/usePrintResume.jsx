'use client';

import { useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ResumeDocument from './ResumeDocument';

/**
 * "Download PDF" = the browser prints the SAME pages the preview shows, as A4, and the user saves them as PDF.
 *
 *   const { printResume, printPortal } = usePrintResume();
 *   <button onClick={() => printResume({ template, data, color })}>Download PDF</button>
 *   {printPortal}                      // render once, anywhere in the component
 *
 * Why not a PDF library? One layout engine = preview, PDF and shared page can never disagree, text stays
 * selectable (ATS friendly) and every script (Bengali ...) works. The price: the browser's print window opens and
 * the user picks "Save as PDF" (see docs for the one-click server option).
 */
export function usePrintResume() {
  const [job, setJob] = useState(null); // { template, data, color } while a print is in progress
  const originalTitle = useRef('');

  const finish = useCallback(() => {
    if (originalTitle.current) document.title = originalTitle.current;
    originalTitle.current = '';
    setJob(null);
  }, []);

  const printResume = useCallback((nextJob) => setJob(nextJob), []);

  // called by ResumeDocument when the print copy has been measured and rendered
  const handleReady = useCallback(() => {
    originalTitle.current = document.title;
    // Chrome / Edge use the page title as the default file name
    document.title = `${job?.data?.personalInformation?.fullName || 'My'} - Resume`;
    window.addEventListener('afterprint', finish, { once: true });
    window.print();
  }, [finish, job]);

  const printPortal = job
    ? createPortal(
        <div className="rb-print-root" aria-hidden="true">
          <ResumeDocument template={job.template} data={job.data} color={job.color} mode="print" onReady={handleReady} />
        </div>,
        document.body,
      )
    : null;

  return { printResume, printPortal, isDownloading: Boolean(job) };
}
