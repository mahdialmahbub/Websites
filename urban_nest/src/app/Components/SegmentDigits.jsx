/**
 * Seven-segment style digits drawn with plain rectangles.
 * Sharp corners only, no rounding anywhere.
 */

// Which segments are lit for each digit (a = top, then clockwise, g = middle)
const SEGMENTS = {
  0: "abcdef",
  1: "bc",
  2: "abdeg",
  3: "abcdg",
  4: "bcfg",
  5: "acdfg",
  6: "acdefg",
  7: "abc",
  8: "abcdefg",
  9: "abcdfg",
};

// Each segment as [x, y, width, height]
function getSegmentRects(width, height, thickness) {
  const mid = (height - thickness) / 2;
  const half = mid + thickness;

  return {
    a: [0, 0, width, thickness],
    b: [width - thickness, 0, thickness, half],
    c: [width - thickness, mid, thickness, height - mid],
    d: [0, height - thickness, width, thickness],
    e: [0, mid, thickness, height - mid],
    f: [0, 0, thickness, half],
    g: [0, mid, width, thickness],
  };
}

/**
 * @typedef {Object} SegmentDigitsProps
 * @property {string} [text="404"] Digits to draw (0-9 only)
 * @property {number} [digitWidth=80] Width of one digit in px
 * @property {number} [digitHeight=130] Height of one digit in px
 * @property {number} [thickness=20] Thickness of every bar in px
 * @property {number} [gap=36] Space between digits in px
 * @property {string} [color="#333333"] Fill color of the bars
 */

/** @param {SegmentDigitsProps} props */
export default function SegmentDigits({
  text = "404",
  digitWidth = 80,
  digitHeight = 130,
  thickness = 20,
  gap = 36,
  color = "#073531",
}) {
  const chars = [...String(text)].filter((c) => SEGMENTS[c]);
  const rects = getSegmentRects(digitWidth, digitHeight, thickness);
  const totalWidth = chars.length * digitWidth + (chars.length - 1) * gap;

  return (
    <svg
      width={totalWidth}
      height={digitHeight}
      viewBox={`0 0 ${totalWidth} ${digitHeight}`}
      fill={color}
      shapeRendering="crispEdges"
      role="img"
      aria-label={text}
    >
      {chars.map((char, i) => (
        <g key={i} transform={`translate(${i * (digitWidth + gap)} 0)`}>
          {[...SEGMENTS[char]].map((seg) => {
            const [x, y, w, h] = rects[seg];
            return <rect key={seg} x={x} y={y} width={w} height={h} />;
          })}
        </g>
      ))}
    </svg>
  );
}
