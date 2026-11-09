import "./hero-motion.css";

/**
 * Pure CSS version — framer-motion lagbe na, "use client"-o lagbe na.
 * Shob timing / easing ./hero-motion.css er :root variable e ache.
 */

/**
 * @typedef {Object} HeroAvatarProps
 * @property {import("react").ReactNode} children - Profile image
 * @property {string} [className] - Extra Tailwind class
 */

/**
 * Circle image: opacity 0 + choto theke full size e ashe.
 * z-10 dewa ache jate icon gulo image-er pichon theke berote pare.
 * @param {HeroAvatarProps} props
 */
export const HeroAvatar = ({ children, className = "" }) => {
  return (
    <div className={`hero-avatar relative z-10 ${className}`}>{children}</div>
  );
};

/**
 * @typedef {Object} HeroOrbitIconProps
 * @property {import("react").ReactNode} children - Icon image
 * @property {number} x - Image-er center theke final X offset (px). Negative = bam dike
 * @property {number} y - Image-er center theke final Y offset (px). Negative = upore
 * @property {number} [index=0] - Stagger order (0 = prothom icon)
 * @property {string} [className] - Extra Tailwind class
 */

/**
 * Tech icon circle: image-er center theke shuru hoye (x, y) te giye bose.
 * Position `left-1/2 top-1/2` diye center e anchor kora, shudhu transform
 * animate hoy (GPU-friendly, layout shift nai).
 * @param {HeroOrbitIconProps} props
 */
export const HeroOrbitIcon = ({ children, x, y, index = 0, className = "" }) => {
  return (
    <div
      style={{ "--x": `${x}px`, "--y": `${y}px`, "--i": index }}
      className={`hero-orbit-icon absolute left-1/2 top-1/2 z-0 -ml-6.5 -mt-6.5 flex size-13 items-center justify-center rounded-full heroIcon bg-linear-to-br from-[#FFFFFF] to-[#EAEAEA] ${className}`}
    >
      {children}
    </div>
  );
};

/**
 * @typedef {Object} HeroItemProps
 * @property {import("react").ReactNode} children
 * @property {"badge" | "title" | "subtitle" | "cta" | "stats"} [stage="title"] - Timeline-er kon dhape ashbe
 * @property {"div" | "h1" | "h2" | "p" | "span"} [as="div"] - Kon HTML tag e render hobe
 * @property {number} [distance=20] - Koto px niche theke uthbe
 * @property {string} [className] - Extra Tailwind class
 */

/**
 * Title / subtitle / CTA / badge: ektu niche theke fade kore uthe ashe.
 * @param {HeroItemProps} props
 */
export const HeroItem = ({
  children,
  stage = "title",
  as: Tag = "div",
  distance = 20,
  className = "",
  style,
  ...rest
}) => {
  return (
    <Tag
      className={`hero-item hero-item--${stage} ${className}`}
      style={{ "--hero-distance": `${distance}px`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
};
