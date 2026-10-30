/**
 * THE colour palette shared by every template. Add / change colours ONLY here.
 * The chosen colour is saved with the resume (design.color) and applied through CSS variables, so the live
 * preview, the PDF and the shared link always agree.
 */
export const PALETTE = Object.freeze([
  {
    id: "ocean",
    name: "Ocean Blue",
    hex: "#1d4ed8",
    subtitle: "Builds trust and clarity with a polished, professional look.",
  },
  {
    id: "teal",
    name: "Teal",
    hex: "#0f766e",
    subtitle: "Creates a calm, modern feel that balances confidence and approachability.",
  },
  {
    id: "emerald",
    name: "Emerald",
    hex: "#047857",
    subtitle: "Adds a fresh, balanced look that reflects growth and professionalism.",
  },
  {
    id: "violet",
    name: "Violet",
    hex: "#6d28d9",
    subtitle: "Brings a creative, distinctive touch while keeping the design refined.",
  },
  {
    id: "rose",
    name: "Rose",
    hex: "#be123c",
    subtitle: "Adds warmth and personality for a confident, expressive resume style.",
  },
  {
    id: "amber",
    name: "Amber",
    hex: "#b45309",
    subtitle: "Introduces warmth and energy, making key details stand out.",
  },
  {
    id: "slate",
    name: "Slate",
    hex: "#334155",
    subtitle: "Keeps the resume understated, structured, and easy to scan.",
  },
  {
    id: "charcoal",
    name: "Charcoal",
    hex: "#111827",
    subtitle: "Creates a bold, sophisticated look with strong visual contrast.",
  },
]);

export const DEFAULT_COLOR = PALETTE[0].hex;

/** Any saved value -> a palette colour (unknown / missing values fall back to the default). */
export const resolveColor = (hex) =>
  PALETTE.find((color) => color.hex.toLowerCase() === String(hex ?? '').toLowerCase())?.hex ?? DEFAULT_COLOR;

/** White or near-black text, whichever is readable on top of `hex`. */
function readableOn(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const luminance = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return luminance > 0.5 ? '#111827' : '#ffffff';
}

/**
 * The CSS variables every template reads. Templates NEVER write a colour themselves - they use var(--resume-...).
 *   --resume-accent           the chosen palette colour
 *   --resume-accent-contrast  readable text on top of the accent
 *   --resume-accent-soft      a very light tint of the accent
 *   --resume-paper / --resume-text / --resume-muted / --resume-border   neutral colours
 *   --resume-font             the font stack
 */
export function themeVars(hex) {
  const accent = resolveColor(hex);
  return {
    '--resume-accent': accent,
    '--resume-accent-contrast': readableOn(accent),
    '--resume-accent-soft': `color-mix(in srgb, ${accent} 12%, #ffffff)`,
    '--resume-paper': '#ffffff',
    '--resume-text': '#0f172a',
    '--resume-muted': '#475569',
    '--resume-border': '#e2e8f0',
    '--resume-font': '"Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    '--resume-shadow': '0 6px 24px rgba(15, 23, 42, 0.14)',
  };
}
