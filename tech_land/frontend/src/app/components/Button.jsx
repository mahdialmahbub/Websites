"use client";

/**
 * Button
 * -----------------------------------------------------------------------
 * One component, three variants — fully controlled from outside:
 *
 *  variant="primary"   -> solid filled button (default red, override via `color`)
 *  variant="secondary" -> outlined button (default blue, override via `color`)
 *                          supports left/right icons (toggle via showLeftIcon/showRightIcon)
 *  variant="text"      -> plain text button (gray, turns bold + white on hover
 *                          automatically). Also supports left/right icons.
 *
 * The 4th button in the reference image is just the natural `:hover` state
 * of the text variant — real hover works out of the box. If you want to
 * force-render that hover look for a preview/demo (not an actual hover),
 * pass `forceHoverStyle`.
 *
 * USAGE EXAMPLES
 * -----------------------------------------------------------------------
 * <Button variant="primary">Button</Button>
 * <Button variant="primary" color="#2563EB">Button</Button>
 *
 * <Button
 *   variant="secondary"
 *   color="#2BC8E8"
 *   showLeftIcon
 *   showRightIcon
 *   leftIcon="fi fi-rr-shopping-cart"
 *   rightIcon="fi fi-rr-shopping-cart"
 * >
 *   Button
 * </Button>
 *
 * <Button
 *   variant="text"
 *   showLeftIcon
 *   showRightIcon
 *   leftIcon="fi fi-rr-arrow-left"
 *   rightIcon="fi fi-rr-arrow-right"
 * >
 *   Button
 * </Button>
 * -----------------------------------------------------------------------
 */
export default function Button({
  variant = "primary", // "primary" | "secondary" | "text"
  color, // any hex/rgb/css color — overrides the variant's default color
  children = "Button",
  onClick,
  disabled = false,
  type = "button",

  // Icons — only used by "secondary" and "text" variants
  showLeftIcon = false,
  showRightIcon = false,
  leftIcon = "fi fi-rr-arrow-left",
  rightIcon = "fi fi-rr-arrow-right",

  // Demo-only: force the text variant to render in its hover look
  forceHoverStyle = false,

  className = "",
}) {

  const baseClasses = `inline-flex items-center justify-center font-primary rounded-[8px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-[18px] text-nowrap`;

  if (variant === "primary") {
    const bg = color || "#E63A1E";
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} shadow-md hover:brightness-110 active:brightness-95 ${className} px-space-4 py-space-3 font-semibold`}
        style={{ backgroundColor: bg }}
      >
        {children}
      </button>
    );
  }

  if (variant === "secondary") {
    const accent = color || "#2BC8E8";
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} bg-background border-2 hover:brightness-125 active:brightness-95 font-medium px-space-4 py-space-3 flex gap-space-2 items-center ${className}`}
        style={{ borderColor: accent, color: accent }}
      >
        {showLeftIcon && <i className={leftIcon} style={{ color: accent }} />}
        {children}
        {showRightIcon && <i className={rightIcon} style={{ color: accent }} />}
      </button>
    );
  }

  // variant === "text"
  const hoverForced = forceHoverStyle
    ? "text-white font-bold"
    : "text-placeholder_2 font-medium hover:text-white hover:font-bold";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} bg-transparent rounded-none ${hoverForced} ${className} gap-1.5`}
    >
      {showLeftIcon && <i className={`${leftIcon} text-size-h4`} />}
      {children}
      {showRightIcon && <i className={`${rightIcon} text-size-h4`} />}
    </button>
  );
}
