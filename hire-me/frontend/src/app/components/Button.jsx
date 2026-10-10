"use client";

import * as React from "react";
import { cn } from "../lib/cn";

/* -------------------------------------------------------------------------- */
/*  Props — parent e <Button /> likhle ei prop gula suggest korbe             */
/* -------------------------------------------------------------------------- */

/** @typedef {"primary" | "secondary" | "text"} ButtonVariant */
/** @typedef {"sm" | "md"} ButtonSize */
/** @typedef {"left" | "right"} ButtonIconPosition */

/**
 * @typedef {Object} ButtonOwnProps
 *
 * @property {ButtonVariant} [variant="primary"]
 *   Button er style.
 * @property {ButtonSize} [size="md"]
 *   Button er size.
 * @property {string | React.ReactElement} [icon]
 *   CDN class string (jemon `"fi fi-rr-plus"`) ba React element.
 * @property {ButtonIconPosition} [iconPosition="left"]
 *   Label er kon pashe icon boshbe.
 * @property {boolean} [loading=false]
 *   Spinner dekhabe + click bondho.
 * @property {string} [className]
 *   Shob style override ekhane. Background, border, text, ring, size, radius,
 *   hover/focus/active state, even ripple color. Tomar class ta shobar upore jite.
 */

/**
 * Baki sob (onClick, type, disabled, children ...) normal `<button>` props.
 *
 * @typedef {ButtonOwnProps & Omit<React.ComponentPropsWithoutRef<"button">, keyof ButtonOwnProps>} ButtonProps
 */

/* -------------------------------------------------------------------------- */
/*  Styles — Figma er sathe milate ekhane change koro                         */
/* -------------------------------------------------------------------------- */

// Shob button e same thake.
const BASE = [
  "relative isolate inline-flex shrink-0 cursor-pointer select-none items-center justify-center overflow-hidden",
  // border sob variant-e ache (transparent), tai className e shudu `border-red-500` dilei color change hoy
  "whitespace-nowrap border border-transparent font-medium outline-none",
  "transition-[color,background-color,border-color,box-shadow] duration-150 motion-reduce:transition-none",
  "focus-visible:ring-[3px] focus-visible:ring-indigo-300",
  // Press korle round ripple. Color ashe text color (currentColor) theke,
  // tai text color change korle ripple-o auto match kore.
  "after:pointer-events-none after:absolute after:left-1/2 after:top-1/2 after:-z-10 after:aspect-square after:h-full",
  "after:-translate-x-1/2 after:-translate-y-1/2 after:scale-50 after:rounded-full after:bg-current after:opacity-0",
  "after:transition after:duration-150 motion-reduce:after:transition-none",
  "active:after:scale-100",
  // Disabled / loading e ripple dekhabe na
  "disabled:after:hidden",
].join(" ");

const SIZE = {
  sm: "h-11 gap-1.5 rounded-md px-4 text-[15px]",
  md: "h-11 gap-2 rounded-lg px-4 text-[16px]",
};

/**
 * Disabled/loading style `disabled:` prefix diye deya.
 * Karon: parent theke `bg-red-500` dilew disabled obosthay seta jeno
 * grey-ei thake, red na hoye jay. Chaile parent `disabled:bg-...` diye alada kore dite pare.
 */
const VARIANT = {
  primary: [
    "bg-indigo-500 text-white hover:bg-indigo-600 active:after:opacity-20",
    "disabled:bg-neutral-200 disabled:text-neutral-500",
  ].join(" "),
  secondary: [
    "border-indigo-100 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 active:after:opacity-10",
    "disabled:border-transparent disabled:bg-neutral-50 disabled:text-neutral-500",
  ].join(" "),
  text: [
    "bg-transparent text-neutral-900 hover:text-indigo-900 active:after:opacity-5",
    "disabled:bg-transparent disabled:text-neutral-500",
  ].join(" "),
};

// Loading spinner (Flaticon CDN icon). currentColor use kore, tai text color follow kore.
const SPINNER = (
  <i
    className="fi fi-rr-spinner animate-spin motion-reduce:[animation-duration:3s]"
    aria-hidden="true"
  />
);

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

// Niche `@type` ta shudu parent e prop suggestion er jonno, logic er kono kaj nai.
export const Button = React.forwardRef(
  /** @type {React.ForwardRefRenderFunction<HTMLButtonElement, ButtonProps>} */
  (function Button(
    {
      variant = "primary",
      size = "md",
      icon,
      iconPosition = "left",
      loading = false,
      disabled = false,
      type = "button",
      className,
      children,
      ...rest
    },
    ref,
  ) {
    // Shudu icon er button (children nai) e aria-label na thakle dev e warning dey.
    if (
      process.env.NODE_ENV !== "production" &&
      !children &&
      !rest["aria-label"] &&
      !rest["aria-labelledby"]
    ) {
      console.warn(
        "Button: children na thakle `aria-label` dite hobe (screen reader er jonno).",
      );
    }

    const isDisabled = disabled || loading;

    // icon string hole <i> banai, element hole seta-i dekhai. Loading hole spinner.
    const iconNode =
      typeof icon === "string" ? <i className={icon} aria-hidden="true" /> : icon;
    const glyph = loading ? SPINNER : iconNode;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        className={cn(
          BASE,
          SIZE[size] ?? SIZE.md,
          VARIANT[variant] ?? VARIANT.primary,
          loading ? "cursor-progress" : disabled && "cursor-not-allowed",
          className, // sobar shesh e, tai sobar upore jite
        )}
        {...rest}
      >
        {iconPosition === "left" && glyph}
        {children}
        {iconPosition === "right" && glyph}
      </button>
    );
  }),
);