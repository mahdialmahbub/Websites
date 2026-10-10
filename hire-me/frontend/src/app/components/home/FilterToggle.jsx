"use client";

/**
 * Filter toggle (rounded pill). Fully controlled: the parent owns the state.
 *
 * Figma → props
 *   State  Default / Active → active={false} / active={true}
 *          Hover            → CSS :hover, no prop needed
 *   Size   Desktop / Mobile → size="desktop" | "mobile"
 *          (default "responsive": mobile below `sm`, desktop from `sm` up)
 *
 * @param {object} props
 * @param {React.ReactNode} [props.children="Filter"] - Label
 * @param {string} [props.value] - Filter value (e.g. "design"), handed back to onChange
 * @param {boolean} [props.active=false] - Selected state, controlled by the parent
 * @param {(value: string | undefined, nextActive: boolean, event: React.MouseEvent<HTMLButtonElement>) => void} [props.onChange]
 *   Called on click with the next state. The parent decides what happens
 *   (update state, change the URL, call the backend...).
 * @param {"responsive" | "mobile" | "desktop"} [props.size="responsive"]
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.className] - Extra classes
 */

// Values measured from the exported PNG (assumed 1x). Swap the hex colors
// for your own tokens if you have them:
//   violet #816FFF  → default border 20%, hover border 30%, hover fill 10%
//   text   #6D65E8  → 80%
//   active #4F46E5 (Tailwind indigo-600), active text white 90%
const styles = {
  base: [
    "inline-flex shrink-0 items-center justify-center rounded-full border font-primary whitespace-nowrap select-none",
    "transition-colors duration-150 motion-reduce:transition-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4F46E5]",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ].join(" "),
  inactive: [
    "border-[#816FFF]/20 bg-transparent text-[#6D65E8]/80 font-medium",
    "enabled:hover:border-[#4F46E5]/20 enabled:hover:bg-[#4F46E5]/10",
  ].join(" "),
  // Figma: active label is a weight bolder
  active: "bg-[#4F46E5] text-primary-50 font-semibold",
  sizes: {
    mobile: "h-9.5 px-4 text-[12px]", // 56px tall, 24px side padding, 20px text
    desktop: "h-9.5 px-4 text-[14px]", // 56px tall, 24px side padding, 24px text
    responsive: "h-9.5 px-4 text-[12px] sm:text-[14px]",
  },
};

const FilterToggle = ({
  children = "Filter",
  value,
  active = false,
  onChange,
  onClick,
  size = "responsive",
  disabled = false,
  className = "",
  ...rest
}) => {
  const handleClick = (event) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    onChange?.(value, !active, event);
  };

  return (
    <button
      {...rest}
      type="button"
      value={value}
      aria-pressed={active}
      disabled={disabled}
      onClick={handleClick}
      className={[
        styles.base,
        styles.sizes[size] ?? styles.sizes.responsive,
        active ? styles.active : styles.inactive,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
};

export default FilterToggle;
