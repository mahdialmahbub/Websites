"use client";

import { useRef } from "react";

/**
 * @typedef {Object} GridSpotlightProps
 * @property {React.ReactNode} children - Content rendered above the grid layers
 * @property {string} [className] - Extra classes for the card (border, bg, padding, radius)
 * @property {number} [radius] - Size of the glowing circle around the cursor, in px
 */

/** @param {GridSpotlightProps} props */
const GridSpotlight = ({ children, className = "", radius = 200 }) => {
  const ref = useRef(null);

  // CSS variables update korchi, state na, tai mouse move e re-render hoy na
  const handlePointerMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      style={{ "--spot": `${radius}px` }}
      className={`group/cta relative overflow-hidden [--mx:50%] [--my:50%] ${className}`}
    >
      {/* base grid: same grid + glow language as the hero, so the page opens and closes on one idea */}
      <div
        aria-hidden="true"
        className="absolute inset-0
                   bg-[linear-gradient(to_right,rgba(236,72,153,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(236,72,153,0.10)_1px,transparent_1px)]
                   bg-size-[64px_64px]
                   mask-[radial-gradient(ellipse_60%_60%_at_50%_30%,black,transparent)]"
      />

      {/* bright grid lines, shudhu cursor er charpashe circle e dekha jay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300
                   group-hover/cta:opacity-100
                   bg-[linear-gradient(to_right,rgba(236,72,153,0.55)_1px,transparent_1px),linear-gradient(to_bottom,rgba(236,72,153,0.55)_1px,transparent_1px)]
                   bg-size-[64px_64px]
                   mask-[radial-gradient(circle_var(--spot)_at_var(--mx)_var(--my),black,transparent)]"
      />

      {/* halka soft glow, line gulo ke aro glow er moto dekhay (chaile eta delete kore dite paro) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300
                   group-hover/cta:opacity-100
                   bg-[radial-gradient(circle_var(--spot)_at_var(--mx)_var(--my),rgba(236,72,153,0.12),transparent)]"
      />

      {children}
    </div>
  );
};

export default GridSpotlight;
