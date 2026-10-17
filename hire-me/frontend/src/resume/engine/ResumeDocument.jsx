'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { themeVars } from '../theme/palette';
import './engine.css';
import { paginateColumn } from './paginate';

export const PAGE_WIDTH = 794; //  A4 at 96 dpi
export const PAGE_HEIGHT = 1123;
export const PAGE_GAP = 24; //     space between pages on screen
const BOTTOM_SAFETY = 6; //        px kept free at the bottom of a column: text never touches the cut line

const wrapBlocks = (list) =>
  list.map((block) => (
    <div className="rb-block" data-block={block.id} key={block.id}>
      {block.element}
    </div>
  ));

/**
 * Layout sizes in CSS px as FRACTIONS. offsetHeight / clientHeight round to whole pixels, and after 30 blocks
 * that rounding error adds up to more than the safety margin. getBoundingClientRect is fractional, but it is
 * affected by CSS transform: scale (the live preview is scaled), so we divide the scale out again.
 */
const layoutScale = (element) => element.getBoundingClientRect().width / (element.offsetWidth || 1) || 1;
const layoutHeight = (element, scale) => element.getBoundingClientRect().height / scale;

/** Content height of a column (without its padding / border): how much room the blocks really have. */
function contentHeight(element, scale) {
  if (!element) return PAGE_HEIGHT - 150;
  const style = getComputedStyle(element);
  const frame = ['paddingTop', 'paddingBottom', 'borderTopWidth', 'borderBottomWidth'].reduce((sum, key) => sum + parseFloat(style[key]), 0);
  return layoutHeight(element, scale) - frame;
}

/** Wait for web fonts and images, otherwise we would measure the wrong heights. */
async function waitForAssets(root) {
  if (document.fonts?.ready) await document.fonts.ready;
  const images = [...root.querySelectorAll('img')];
  await Promise.all(
    images.map((img) => (img.complete ? null : new Promise((resolve) => { img.onload = resolve; img.onerror = resolve; }))),
  );
}

/** Measure the hidden copy, then let paginateColumn decide the pages. */
function layoutPages(root, blocks) {
  const scale = layoutScale(root);
  const heights = {};
  root.querySelectorAll('[data-measure-content] [data-block]').forEach((element) => {
    heights[element.dataset.block] = layoutHeight(element, scale);
  });

  // page 1 and page 2+ can have different room (page 2+ has a running header instead of the big header)
  const capacities = (column) =>
    [0, 1].map((index) => contentHeight(root.querySelector(`[data-probe="${index}"] [data-column="${column}"]`), scale) - BOTTOM_SAFETY);

  const pack = (list, column) => {
    const room = capacities(column);
    return paginateColumn(
      list.map((block) => ({ id: block.id, height: heights[block.id] ?? 0, keepWithNext: block.keepWithNext })),
      (pageIndex) => room[Math.min(pageIndex, 1)],
    );
  };

  const sidebar = pack(blocks.sidebar, 'sidebar');
  const main = pack(blocks.main, 'main');
  const byId = new Map([...blocks.sidebar, ...blocks.main].map((block) => [block.id, block]));
  const pageCount = Math.max(sidebar.pages.length, main.pages.length, 1);

  return {
    overflow: sidebar.overflow || main.overflow,
    pages: Array.from({ length: pageCount }, (_, index) => ({
      sidebar: (sidebar.pages[index] ?? []).map((id) => byId.get(id)),
      main: (main.pages[index] ?? []).map((id) => byId.get(id)),
    })),
  };
}

/**
 * Renders a resume as real A4 pages.
 *
 * @param {object}   props
 * @param {object}   props.template   a template from templates/registry.js
 * @param {object}   props.data       the resume content (same shape as the builder draft's `content`)
 * @param {string}   [props.color]    a palette colour (hex); unknown values fall back to the default
 * @param {'screen'|'print'} [props.mode]
 * @param {number}   [props.maxPages] show only the first N pages (thumbnails use 1)
 * @param {(info: { pageCount: number, overflow: boolean }) => void} [props.onLayout]
 * @param {() => void} [props.onReady]  called once the pages are on screen (the print flow waits for it)
 */
export default function ResumeDocument({ template, data, color, mode = 'screen', maxPages, onLayout, onReady }) {
  const themeStyle = useMemo(() => themeVars(color), [color]);
  const blocks = useMemo(() => template.buildBlocks(data), [template, data]);
  const measureRef = useRef(null);
  const readyCalled = useRef(false);
  const [layout, setLayout] = useState(null);
  const TemplatePage = template.Page;

  // measure + paginate whenever the content, the template or the colour changes
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const root = measureRef.current;
      if (!root) return;
      await waitForAssets(root);
      if (!cancelled) setLayout(layoutPages(root, blocks));
    })();
    return () => {
      cancelled = true;
    };
  }, [blocks, themeStyle, template]);

  useEffect(() => {
    if (!layout) return;
    onLayout?.({ pageCount: layout.pages.length, overflow: layout.overflow });
    if (layout.overflow && process.env.NODE_ENV !== 'production') {
      console.warn(`[resume] a single block in "${template.id}" is taller than a page. Split it into smaller blocks.`);
    }
    if (onReady && !readyCalled.current) {
      readyCalled.current = true;
      requestAnimationFrame(() => requestAnimationFrame(() => onReady()));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout]);

  const visiblePages = layout ? layout.pages.slice(0, maxPages ?? layout.pages.length) : [];

  return (
    <div style={themeStyle}>
      {/* hidden measuring copy: two empty pages (capacity) + one page holding ALL blocks (heights) */}
      <div className="rb-measure" ref={measureRef} aria-hidden="true">
        {[0, 1].map((index) => (
          <div className="rb-page-frame" data-probe={index} key={index}>
            <TemplatePage pageIndex={index} pageCount={2} data={data} sidebar={[]} main={[]} />
          </div>
        ))}
        <div className="rb-page-frame rb-measure-content" data-measure-content>
          <TemplatePage pageIndex={0} pageCount={1} data={data} sidebar={wrapBlocks(blocks.sidebar)} main={wrapBlocks(blocks.main)} />
        </div>
      </div>

      <div className="rb-document" data-mode={mode} style={{ gap: mode === 'print' ? 0 : PAGE_GAP }}>
        {visiblePages.map((page, index) => (
          <div className="rb-page-frame" data-page={index} key={index}>
            <TemplatePage
              pageIndex={index}
              pageCount={layout.pages.length}
              data={data}
              sidebar={wrapBlocks(page.sidebar)}
              main={wrapBlocks(page.main)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
