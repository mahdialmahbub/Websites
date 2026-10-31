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

  // ---- Ripple (press korle round circle) ----
  // Circle er color ashe text color (currentColor) theke,
  // tai text color change korle ripple-o auto match kore.
  "after:pointer-events-none after:absolute after:-z-10 after:rounded-full after:bg-current after:opacity-0",
  // Circle er size fixed 44px. Center = click point: `--rx`, `--ry` JS (placeRipple) set kore.
  // Fallback = button er center (JS chalar age ba SSR e).
  "after:left-[var(--rx,50%)] after:top-[var(--ry,50%)] after:h-[44px] after:w-[44px]",
  // Shuru te 0 size, tarpor press e 1 (expand hoy).
  "after:[transform:translate(-50%,-50%)_scale(0)]",
  // Charle (release): opacity fade out hoy, ar scale 0 te reset hoy fade shesh howar PORE
  // (delay 300ms) — tai fade er somoy circle chhoto hoye jay na.
  "after:[transition:opacity_300ms_ease-out,transform_0s_linear_300ms]",
  // Press korle: smooth ease-out e boro hoy.
  "active:after:[transform:translate(-50%,-50%)_scale(1)]",
  "active:after:[transition:opacity_100ms_ease-out,transform_400ms_cubic-bezier(0.22,1,0.36,1)]",
  "motion-reduce:after:[transition:none] motion-reduce:active:after:[transition:none]",
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
    "border-indigo-500/5 bg-indigo-500/5 text-indigo-500 hover:bg-indigo-500/10 active:after:opacity-20",
    "disabled:border-transparent disabled:bg-neutral-50 disabled:text-neutral-300",
  ].join(" "),
  text: [
    "bg-transparent text-neutral-900 hover:text-indigo-900 active:after:opacity-5",
    "disabled:bg-transparent disabled:text-neutral-500 px-0",
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
/*  Ripple origin                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Button er upor `--rx`, `--ry` (circle er center) set kore.
 * CSS e `after:` circle ei variable gula porhe. State/re-render lage na, tai fast.
 * (x, y) = button er padding box er bhitore point, px e.
 *
 * @param {HTMLElement} el
 * @param {number} x
 * @param {number} y
 */
function placeRipple(el, x, y) {
  el.style.setProperty("--rx", `${x}px`);
  el.style.setProperty("--ry", `${y}px`);
}

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
      onPointerDown,
      onKeyDown,
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

    // Mouse / touch / pen: jekhane press korbe shekhan theke ripple shuru.
    // Parent er `onPointerDown` o call hoy (alada destructure kora, nahole `...rest` e overwrite hoto).
    function handlePointerDown(event) {
      onPointerDown?.(event);
      const el = event.currentTarget;
      const rect = el.getBoundingClientRect();
      // clientLeft/clientTop = border er width. Circle padding box er sapekkhe boshe, tai minus.
      placeRipple(
        el,
        event.clientX - rect.left - el.clientLeft,
        event.clientY - rect.top - el.clientTop,
      );
    }

    // Keyboard (Space/Enter) e cursor nai, tai center theke.
    // Na dile ager click er jaygay theke ripple ashto.
    function handleKeyDown(event) {
      onKeyDown?.(event);
      if ((event.key === " " || event.key === "Enter") && !event.repeat) {
        const el = event.currentTarget;
        placeRipple(el, el.clientWidth / 2, el.clientHeight / 2);
      }
    }

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
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {iconPosition === "left" && glyph}
        {children}
        {iconPosition === "right" && glyph}
      </button>
    );
  }),
);
