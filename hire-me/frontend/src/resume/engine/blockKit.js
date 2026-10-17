/**
 * Tiny helpers for writing a template's buildBlocks(). A BLOCK is the smallest piece that may never be cut:
 *   { id: 'exp-1-head', element: <div>...</div>, keepWithNext?: true }
 * Rules for block elements:  (1) ids are unique inside the whole resume  (2) use PADDING for spacing, not margin
 * (the engine measures each block's height).
 */

/** Glue blocks together so they always stay on one page: [a, b, c] -> a, b stay with the next; c is the end. */
export const glue = (blocks) => blocks.map((block, index) => ({ ...block, keepWithNext: index < blocks.length - 1 }));

/**
 * A section = a heading + entries. The heading is glued to the first entry, so a heading is never left alone
 * at the bottom of a page. Every entry is itself glued (it moves to the next page as a whole).
 * @param {object} headingBlock  one block
 * @param {object[][]} entries   each entry is an array of blocks
 */
export function section(headingBlock, entries) {
  if (entries.length === 0) return []; // empty section -> nothing is shown
  const [first, ...rest] = entries;
  return [{ ...headingBlock, keepWithNext: true }, ...glue(first), ...rest.flatMap(glue)];
}
