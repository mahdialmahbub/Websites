// Icon.jsx
// "use client" lagbe na, tai Server Component e use korle client e extra JS jabe na
import Image from "next/image";
import { icons } from "./iconCollection";

const DEFAULT_SIZE = 24;

// Next.js e `import x from "./a.svg"` korle { src, width, height } object ashe.
// Vite/CRA e string path ashe ("/", "http(s)://" ba "data:" diye shuru).
// Baki sob (jemon "fi fi-rr-user") font icon class.
const isImage = (value) =>
  (typeof value === "object" && value !== null && "src" in value) ||
  (typeof value === "string" && /^(\/|https?:\/\/|data:)/.test(value));

/**
 * @param {Object} props
 * @param {keyof typeof icons} props.name  icons.js er key
 * @param {number} [props.size]  width + height ek sathe (px). Image er default 24
 * @param {number} [props.width]
 * @param {number} [props.height]
 * @param {string} [props.label]  dile accessible hoy (alt / aria-label), na dile decorative
 * @param {string} [props.className]
 * @param {import("react").CSSProperties} [props.style]
 *
 * Baki prop (priority, id, title, data-* ...) Image / <i> e pass hoy.
 */
const Icon = ({
  name,
  size,
  width,
  height,
  label,
  className = "",
  style,
  ...rest
}) => {
  const value = icons[name];

  if (!value) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[Icon] "${name}" naame icons.js e kono icon nai`);
    }
    return null;
  }

  // ---------- Image icon (svg / png ...) ----------
  if (isImage(value)) {
    const src = typeof value === "string" ? value : value.src;

    // ekta dimension dile oita diye square hoy, kichu na dile 24x24
    const w = width ?? size ?? height ?? DEFAULT_SIZE;
    const h = height ?? size ?? width ?? DEFAULT_SIZE;

    return (
      <Image
        src={value}
        alt={label ?? ""} // label na dile decorative: screen reader / crawler skip kore
        width={w}
        height={h}
        className={className || undefined}
        style={style}
        unoptimized={/\.svg(\?|$)/i.test(src)} // svg optimizer e jay na, as-is serve hoy
        {...rest}
      />
    );
  }

  // ---------- Font icon ("fi fi-rr-user") ----------
  return (
    <i
      className={`${value} ${className}`.trim()}
      style={size ? { fontSize: size, ...style } : style}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      {...rest}
    />
  );
};

export default Icon;
