/**
 * Decides which blocks go on which page for ONE column. Pure function: heights in, page lists out.
 *
 * A block is the smallest piece that may never be cut: a heading, one job entry, one skill list ...
 * `keepWithNext: true` glues a block to the block after it (a heading to its first item, the lines of one entry).
 * Glued blocks form a "unit"; a unit is moved to the next page as a whole when it does not fit.
 * Only a unit taller than a whole page is split (between its blocks, never inside one).
 *
 * @param {{ id: string, height: number, keepWithNext?: boolean }[]} blocks  measured heights, in order
 * @param {(pageIndex: number) => number} capacity  usable height of this column on that page
 * @returns {{ pages: string[][], overflow: boolean }}  block ids per page; overflow = a single block is taller than a page
 */
export function paginateColumn(blocks, capacity) {
  const room = (pageIndex) => Math.max(capacity(pageIndex), 50); // never 0 -> no endless loops
  const units = toUnits(blocks);

  const pages = [[]];
  let used = 0;
  let overflow = false;

  const startNewPage = () => {
    pages.push([]);
    used = 0;
  };
  const current = () => pages[pages.length - 1];
  const put = (block) => {
    current().push(block.id);
    used += block.height;
  };

  for (const unit of units) {
    const height = unit.reduce((sum, block) => sum + block.height, 0);

    if (used + height <= room(pages.length - 1)) {
      unit.forEach(put); // fits on this page
      continue;
    }

    if (height <= room(pages.length)) {
      // does not fit here, but fits on a fresh page -> move the whole unit
      if (current().length > 0) startNewPage();
      unit.forEach(put);
      continue;
    }

    // taller than a whole page: split between blocks (keep the first block together with the second)
    unit.forEach((block, index) => {
      if (used + block.height > room(pages.length - 1) && current().length > 0) {
        const orphanHeader = index === 1 && current().length > 0 && current()[current().length - 1] === unit[0].id;
        if (orphanHeader) {
          current().pop(); // never leave the first block (usually a heading) alone at the bottom
          used -= unit[0].height;
          startNewPage();
          put(unit[0]);
        } else {
          startNewPage();
        }
      }
      if (block.height > room(pages.length - 1)) overflow = true;
      put(block);
    });
  }

  return { pages: pages.filter((page, index) => page.length > 0 || index === 0), overflow };
}

/** Groups blocks into units: [h(keepWithNext), a(keepWithNext), b] -> one unit; [c] -> another unit. */
function toUnits(blocks) {
  const units = [];
  let unit = [];
  blocks.forEach((block) => {
    unit.push(block);
    if (!block.keepWithNext) {
      units.push(unit);
      unit = [];
    }
  });
  if (unit.length > 0) units.push(unit); // a trailing keepWithNext block with nothing after it
  return units;
}
