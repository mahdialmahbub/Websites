import React from "react";

/**
 * @typedef {Object} ThemeCardProps
 * @property {string} [title="Title"] - Card-er main heading.
 * @property {string} [subtitle="Subtitle"] - Highlighted box-er vitore dekhano text.
 * @property {boolean} [isActive=false] - Card selected hole true dao; check icon ar active background dekhabe.
 * @property {string} [className=""] - Root element-e extra class dite chaile.
 */

/** @param {ThemeCardProps} props */
const ThemeCard = ({
  title = "Title",
  subtitle = "Subtitle",
  isActive = false,
  className = "",
}) => {
  const baseStyles =
    "flex flex-col gap-5 rounded-lg border border-blue-500/15 p-5 transition-colors";
  const stateStyles = isActive ? "bg-blue-500/5" : "hover:bg-neutral-500/20";

  return (
    <div
      className={`${baseStyles} ${stateStyles} ${className}`.trim()}
      aria-current={isActive ? "true" : undefined}
    >
      <div className="flex items-center gap-space-3">
        <h2 className="flex-1 font-primary text-[26px] font-medium">
          {title}
        </h2>

        {isActive && (
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-500/60 text-2.5 text-neutral-50">
            <i className="fi fi-rr-check" aria-hidden="true" />
          </span>
        )}
      </div>

    </div>
  );
};

export default ThemeCard;