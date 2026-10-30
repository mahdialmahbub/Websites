import React from "react";

/**
 * @typedef {Object} ColorSelectProps
 * @property {string} [color="#64748B"] - Swatch-er color (hex ba valid CSS color). Badge-eo ei value dekhabe.
 * @property {string} [title="Color"] - Color-er naam.
 * @property {string} [subtitle=""] - Title-er niche choto description.
 * @property {boolean} [isActive=false] - Selected hole true dao; highlight ar check icon dekhabe.
 * @property {string} [className=""] - Root element-e extra class dite chaile.
 */

const DEFAULT_COLOR = "#64748B";

const styles = {
  root: "flex items-center gap-space-3 rounded-sm border px-space-3 py-space-2 transition-colors min-w-[270px]",
  swatch:
    "size-[clamp(3.0625rem,calc(2.182vw+2.551rem),4.1875rem)] shrink-0 rounded-full ring-1 ring-inset ring-neutral-500/10",
  title:
    "truncate font-primary text-[clamp(1.25rem,calc(0.97vw+1.023rem),1.75rem)] font-medium",
  badge:
    "shrink-0 rounded-full bg-blue-500/5 font-primary text-[8px] font-medium text-blue-500/70 md:text-[10px] px-[clamp(0.375rem,calc(0.485vw+0.261rem),0.625rem)] py-[clamp(0.25rem,calc(0.242vw+0.193rem),0.375rem)] font-medium",
  subtitle:
    "text-[clamp(0.75rem,calc(0.242vw+0.693rem),0.875rem)] text-neutral-500/50 truncate",
  check:
    "flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-500/60 text-2.5 text-neutral-50",
};

/** @param {ColorSelectProps} props */
const ColorSelect = ({
  color = DEFAULT_COLOR,
  title = "Color",
  subtitle = "Subtitle",
  isActive = false,
  className = "",
}) => {
  const stateStyles = isActive
    ? "border-blue-500/10 bg-blue-500/5"
    : "border-neutral-500/5 hover:border-blue-500/10 hover:bg-blue-500/5";

  return (
    <div
      className={`${styles.root} ${stateStyles} ${className}`.trim()}
      aria-current={isActive ? "true" : undefined}
    >
      {/* Color swatch */}
      <span
        className={styles.swatch}
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="flex-1 w-4">
        <div className="mb-space-1 flex items-center gap-space-2 md:mb-1.5 ">
          <h3 className={styles.title}>{title}</h3>
          <span className={styles.badge}>{color}</span>
        </div>

        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>

      {/* Active indicator */}
      {isActive && (
        <span className={styles.check}>
          <i className="fi fi-rr-check" aria-hidden="true" />
        </span>
      )}
    </div>
  );
};

export default ColorSelect;