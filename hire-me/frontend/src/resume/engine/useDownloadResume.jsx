'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ResumeDocument from './ResumeDocument';

/**
 * "Download PDF" = the SAME A4 pages the preview shows are drawn into a PDF and the file downloads directly.
 * No print window, no "Save as PDF" step.
 *
 *   const { downloadResume, downloadPortal, isDownloading, error } = useDownloadResume();
 *   <button disabled={isDownloading} onClick={() => downloadResume({ template, data, color })}>Download PDF</button>
 *   {downloadPortal}                   // render once, anywhere in the component
 *
 * How it works: ResumeDocument (mode="print") renders the real pages off-screen -> each page is captured as an
 * image (html2canvas-pro) -> the images are put on A4 pages (jsPDF) -> the browser saves the file.
 * The libraries are loaded only when the button is clicked, so they don't make the first page load heavier.
 *
 * Needs:  npm i html2canvas-pro jspdf
 * Tip:    add `data-resume-page` to each A4 page element in ResumeDocument (print mode) so pages are found
 *         for sure. Without it, the hook looks for the outermost A4-shaped boxes.
 */

/**
 * @typedef {Object} DownloadResumeJob
 * @property {string} template Template id / key, same value you pass to ResumeDocument
 * @property {Object} data Resume data (uses data.personalInformation.fullName for the file name)
 * @property {string} color Chosen colour, same value you pass to ResumeDocument
 */

/**
 * @typedef {Object} UseDownloadResumeResult
 * @property {(job: DownloadResumeJob) => void} downloadResume Start the PDF download
 * @property {import('react').ReactPortal | null} downloadPortal Render this once (off-screen print copy)
 * @property {boolean} isDownloading true while the PDF is being made, use it to disable the button
 * @property {Error | null} error Set if the PDF could not be made, null otherwise
 */

const PAGE_SELECTOR = '[data-resume-page]';
const A4_W = 210; // mm
const A4_H = 297; // mm
const A4_RATIO = A4_W / A4_H;
const SCALE = 3; // 794px page x 3 ~ 288 dpi: sharp text. Lower to 2 for smaller files
const JPEG_QUALITY = 0.92;

// File names can't contain \ / : * ? " < > |
const safeName = (text) => text.replace(/[\\/:*?"<>|]+/g, '').trim() || 'My';

// Fonts (Bengali etc.) and images must be loaded and painted before a page is captured
async function waitForAssets(root) {
  await document.fonts?.ready;
  await Promise.all(
    [...root.querySelectorAll('img')].map((img) => img.decode().catch(() => {})),
  );
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

function findPages(root) {
  const marked = root.querySelectorAll(PAGE_SELECTOR);
  if (marked.length) return [...marked];

  // Fallback: the outermost elements that are shaped like an A4 sheet
  const pages = [];
  const walk = (el) => {
    for (const child of el.children) {
      const { width, height } = child.getBoundingClientRect();
      if (width > 300 && height > 0 && Math.abs(width / height - A4_RATIO) < 0.02) pages.push(child);
      else walk(child);
    }
  };
  walk(root);
  return pages;
}

async function buildPdf(root, fileName) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas-pro'), // (not "html2canvas": it can't read Tailwind v4's oklch colours)
    import('jspdf'),
  ]);

  await waitForAssets(root);

  const pages = findPages(root);
  if (!pages.length) {
    throw new Error('No resume pages found. Add data-resume-page to each A4 page in ResumeDocument.');
  }

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });

  // One page at a time, so only one big canvas is in memory at once
  for (let i = 0; i < pages.length; i++) {
    const canvas = await html2canvas(pages[i], {
      scale: SCALE,
      backgroundColor: '#ffffff',
      useCORS: true, // profile photo from another domain (e.g. Cloudinary) needs CORS headers
      logging: false,
    });

    if (i > 0) pdf.addPage();
    pdf.addImage(canvas.toDataURL('image/jpeg', JPEG_QUALITY), 'JPEG', 0, 0, A4_W, A4_H, undefined, 'FAST');

    canvas.width = canvas.height = 0; // free the memory
  }

  pdf.save(fileName);
}

/** @returns {UseDownloadResumeResult} */
export function useDownloadResume() {
  const [job, setJob] = useState(null); // { template, data, color } while a PDF is being made
  const [error, setError] = useState(null);
  const rootRef = useRef(null);
  const phase = useRef('idle'); // 'idle' -> 'queued' (waiting for ResumeDocument) -> 'rendering' -> 'idle'

  /** @param {DownloadResumeJob} nextJob */
  const downloadResume = useCallback((nextJob) => {
    if (phase.current !== 'idle') return; // ignore double clicks
    phase.current = 'queued';
    setError(null);
    setJob(nextJob);
  }, []);

  // called by ResumeDocument when the print copy has been measured and rendered
  const handleReady = useCallback(async () => {
    if (phase.current !== 'queued' || !job) return;
    phase.current = 'rendering';

    try {
      // Wait one frame first: if ResumeDocument reports "ready" from a layout effect,
      // the wrapper's ref is not attached yet.
      await new Promise((resolve) => requestAnimationFrame(resolve));
      if (!rootRef.current) throw new Error('The print copy of the resume was not found.');

      const name = safeName(job.data?.personalInformation?.fullName || 'My');
      await buildPdf(rootRef.current, `${name} - Resume.pdf`);
    } catch (err) {
      console.error('Resume PDF failed:', err);
      setError(err);
    } finally {
      phase.current = 'idle';
      setJob(null);
    }
  }, [job]);

  // Safety net: if ResumeDocument never says "ready", don't stay stuck on "Preparing PDF..." forever
  useEffect(() => {
    if (!job) return undefined;
    const timer = setTimeout(() => {
      if (phase.current !== 'queued') return; // already rendering, let it finish
      phase.current = 'idle';
      setError(new Error('The resume was not ready in time.'));
      setJob(null);
    }, 15000);
    return () => clearTimeout(timer);
  }, [job]);

  const downloadPortal = job
    ? createPortal(
        // Off-screen but really laid out (display:none / visibility:hidden would give blank pages).
        // The inline style also wins over any CSS that hides .rb-print-root outside of printing.
        <div
          ref={rootRef}
          className="rb-print-root"
          aria-hidden="true"
          style={{
            display: 'block',
            visibility: 'visible',
            position: 'fixed',
            top: 0,
            left: '-10000px',
            width: `${A4_W}mm`,
            pointerEvents: 'none',
          }}
        >
          <ResumeDocument template={job.template} data={job.data} color={job.color} mode="print" onReady={handleReady} />
        </div>,
        document.body,
      )
    : null;

  return { downloadResume, downloadPortal, isDownloading: Boolean(job), error };
}
