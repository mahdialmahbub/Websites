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
 * Tip:    add `data-resume-page` to each REAL A4 page element in ResumeDocument (print mode) and to nothing else
 *         (not to hidden measuring/probe pages). Without it, the hook looks for the outermost A4-shaped boxes.
 *
 * Blank-page protection (this file): hidden elements, empty elements, nested duplicates and pages that come out
 * completely white are skipped. If that happens a console warning shows it, so the cause can be fixed at the source.
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

/**
 * true if the browser really shows the element. Hidden "measuring" copies of a page (visibility:hidden,
 * opacity:0, display:none) are drawn as blank white sheets by html2canvas, so they must never become PDF pages.
 */
function isShown(el, root) {
  // visibility is inherited, so this also catches a hidden parent
  if (getComputedStyle(el).visibility === 'hidden') return false;
  for (let node = el; node && node !== root; node = node.parentElement) {
    const style = getComputedStyle(node);
    if (style.display === 'none' || Number(style.opacity) === 0) return false;
  }
  return true;
}

const hasContent = (el) => el.textContent.trim() !== '' || el.querySelector('img, svg, canvas') !== null;

// Fallback when no element has data-resume-page: the outermost elements that are shaped like an A4 sheet
function a4ShapedBoxes(root) {
  const boxes = [];
  const walk = (el) => {
    for (const child of el.children) {
      const { width, height } = child.getBoundingClientRect();
      if (width > 300 && height > 0 && Math.abs(width / height - A4_RATIO) < 0.02) boxes.push(child);
      else walk(child);
    }
  };
  walk(root);
  return boxes;
}

function findPages(root) {
  const marked = [...root.querySelectorAll(PAGE_SELECTOR)];
  const candidates = marked.length ? marked : a4ShapedBoxes(root);

  const pages = candidates.filter(
    (el) =>
      isShown(el, root) &&
      hasContent(el) &&
      // a marked element inside another marked element would be captured twice
      !candidates.some((other) => other !== el && other.contains(el)),
  );

  if (pages.length !== candidates.length) {
    console.warn(
      `[resume-pdf] ${candidates.length - pages.length} of ${candidates.length} page candidates were skipped (hidden, empty or nested). ` +
        'Check that data-resume-page is only on the real A4 pages in ResumeDocument.',
    );
  }
  return pages;
}

// true if every pixel is (almost) white. Stops at the first dark pixel, so real pages are checked in no time.
function isBlankCanvas(canvas) {
  try {
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    const STRIP = 256; // rows per read, keeps memory small
    for (let y = 0; y < height; y += STRIP) {
      const { data } = ctx.getImageData(0, y, width, Math.min(STRIP, height - y));
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] < 250 || data[i + 1] < 250 || data[i + 2] < 250) return false;
      }
    }
    return true;
  } catch {
    return false; // can't read the pixels (tainted canvas): keep the page
  }
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
  let added = 0;

  // One page at a time, so only one big canvas is in memory at once
  for (let i = 0; i < pages.length; i++) {
    const canvas = await html2canvas(pages[i], {
      scale: SCALE,
      backgroundColor: '#ffffff',
      useCORS: true, // profile photo from another domain (e.g. Cloudinary) needs CORS headers
      logging: false,
      scrollX: 0, // don't depend on how far the user has scrolled the editor
      scrollY: 0,
    });

    if (isBlankCanvas(canvas)) {
      console.warn(`[resume-pdf] page ${i + 1} came out completely white and was left out of the PDF.`);
    } else {
      if (added > 0) pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/jpeg', JPEG_QUALITY), 'JPEG', 0, 0, A4_W, A4_H, undefined, 'FAST');
      added += 1;
    }

    canvas.width = canvas.height = 0; // free the memory
  }

  if (!added) throw new Error('Every resume page came out blank.');

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