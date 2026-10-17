"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Types (JSDoc) — <PasswordInput /> likhle ei prop gula suggest korbe       */
/* -------------------------------------------------------------------------- */

/** @typedef {"sm" | "md"} PasswordInputSize */
/** @typedef {"default" | "success" | "error" | "info" | "warning"} PasswordInputValidation */

/**
 * @typedef {Object} PasswordInputOwnProps
 *
 * @property {string} [label]
 *   Field er label. Na dile `aria-label` dao.
 * @property {string} [labelIcon]
 *   Label er pasher icon, shudu icon class string, jemon `"fi fi-rr-lock"`.
 *   Value dile icon dekhay, na dile hide.
 * @property {boolean} [required=false]
 *   true dile `<input>` ta native required hoy. Label e `*` dekhay na.
 * @property {boolean} [requiredLabel=false]
 *   true dile label e required `*` dekhay (shudu text, input required kore na).
 * @property {PasswordInputSize} [size="md"]
 *   Input er size.
 * @property {PasswordInputValidation} [validation="default"]
 *   Border, focus ring ar helper text er rong ei state onujayi hoy.
 * @property {string} [helperText]
 *   Input er niche message (rong `validation` onujayi).
 * @property {boolean} [defaultVisible=false]
 *   true dile password prothom theke visible thake (pore eye icon diye toggle kora jay).
 * @property {string} [autoComplete="current-password"]
 *   Login e `"current-password"`, sign up / reset password e `"new-password"` dao.
 * @property {boolean} [darkBg=false]
 *   true dile small screen e label/text/eye icon light hoy.
 * @property {string} [className]
 *   Wrapper er extra class.
 * @property {string} [inputClassName]
 *   `<input>` er extra class.
 */

/**
 * Baki sob (value, defaultValue, onChange, disabled, placeholder, name...)
 * normal `<input>` props. `type` dite hobe na, component nijei password/text
 * toggle kore.
 *
 * @typedef {PasswordInputOwnProps & Omit<React.ComponentPropsWithoutRef<"input">, keyof PasswordInputOwnProps | "type">} PasswordInputProps
 */

/* -------------------------------------------------------------------------- */
/*  Styles — Input er style er sathe mila (change hole duita-i update koro)   */
/* -------------------------------------------------------------------------- */

// Project e already `cn` (clsx + tailwind-merge) thakle oita diye replace koro.
const cn = (...parts) => parts.filter(Boolean).join(" ");

const INPUT_BASE = [
  "block w-full min-h-[44px] outline-none",
  "transition-[border-color,box-shadow] duration-150 motion-reduce:transition-none",
  "placeholder:text-neutral-400 focus:ring-[3px]",
  "disabled:cursor-not-allowed disabled:border-transparent disabled:bg-slate-100",
  "disabled:text-slate-400 disabled:placeholder:text-slate-400",
  // Edge nijer reveal/clear button dey, hide na korle duita eye icon dekhabe
  "[&::-ms-reveal]:hidden [&::-ms-clear]:hidden",
].join(" ");

const TEXT_COLOR = {
  light: "text-neutral-950",
  dark: "max-sm:text-neutral-50",
};

// pr-11 (44px) = right e eye button er jayga, button er width er soman.
const SIZE = {
  sm: {
    input: "h-9 rounded-md pl-3 pr-11",
    text: "text-[length:var(--text-small,0.875rem)]",
    icon: "[&_svg]:size-4",
  },
  md: {
    input: "h-10 rounded-md pl-3.5 pr-11",
    text: "text-[length:var(--text-body,1rem)]",
    icon: "[&_svg]:size-[18px]",
  },
};

// Border + focus ring (field) ar helper text er color (help), validation onujayi.
const VALIDATION = {
  default: {
    field:
      "border border-neutral-300 hover:border-neutral-400 focus:border-indigo-400 focus:ring-indigo-200",
    help: "text-neutral-500",
  },
  success: {
    field: "border-[1.5px] border-emerald-600 focus:ring-emerald-100",
    help: "text-emerald-700",
  },
  error: {
    field: "border-[1.5px] border-red-500 focus:ring-red-100",
    help: "text-red-600",
  },
  info: {
    field:
      "border-[1.5px] border-sky-300 focus:border-sky-400 focus:ring-sky-100",
    help: "text-sky-700",
  },
  warning: {
    field: "border-[1.5px] border-amber-500 focus:ring-amber-100",
    help: "text-amber-700",
  },
};

const SMALL_TEXT = "text-[length:var(--text-caption,0.75rem)]";

/* Eye (show / hide) button */

// w-11 = 44px touch target. inset-y-0 diye input er full height ney.
const TOGGLE_BASE = [
  "absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-md",
  "cursor-pointer leading-none outline-hidden",
  "transition-colors duration-150 motion-reduce:transition-none",
  "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-400",
  "disabled:cursor-not-allowed disabled:text-slate-400",
].join(" ");

const TOGGLE_COLOR = {
  light: "text-neutral-500 hover:text-neutral-700",
  dark: "text-neutral-500 hover:text-neutral-700 max-sm:text-neutral-300 max-sm:hover:text-neutral-50",
};

// Icon click er action dekhay: hidden thakle "dekhao" (Eye), visible thakle "lukao" (EyeOff).
// uicons use korte chaile: <i className="fi fi-rr-eye" aria-hidden="true" />
// ar <i className="fi fi-rr-eye-crossed" aria-hidden="true" />
const ICON_SHOW = <Eye aria-hidden="true" />;
const ICON_HIDE = <EyeOff aria-hidden="true" />;

// Button er accessible name (screen reader). Onno bhasha lagle ekhane change koro.
const SHOW_LABEL = "Show password";
const HIDE_LABEL = "Hide password";

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export const PasswordInput = React.forwardRef(
  /** @type {React.ForwardRefRenderFunction<HTMLInputElement, PasswordInputProps>} */
  (function PasswordInput(
    {
      // look
      size = "md",
      validation = "default",
      darkBg = false,

      // label
      label,
      labelIcon,
      required = false,
      requiredLabel = false,

      // content
      helperText,
      defaultVisible = false,

      // <input> props
      id,
      disabled = false,
      autoComplete = "current-password",
      "aria-describedby": describedBy,

      // classes
      className,
      inputClassName,

      ...rest
    },
    ref,
  ) {
    const autoId = React.useId();
    const inputId = id ?? autoId;
    const helpId = `${inputId}-help`;

    // Password ekhon dekha jacche kina. Eye button click e toggle hoy.
    const [visible, setVisible] = React.useState(defaultVisible);

    // TypeScript nai, tai label/aria-label miss hole dev e warning dey.
    if (
      process.env.NODE_ENV !== "production" &&
      !label &&
      !rest["aria-label"] &&
      !rest["aria-labelledby"]
    ) {
      console.warn(
        "PasswordInput: `label` ba `aria-label` dite hobe (accessibility er jonno).",
      );
    }

    const sz = SIZE[size] ?? SIZE.md;
    const tone = VALIDATION[validation] ?? VALIDATION.default;
    const mode = darkBg ? "dark" : "light";

    const describedByIds = [describedBy, helperText ? helpId : null]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={cn("flex w-full flex-col gap-1.5", className)}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "flex items-center gap-space-1 text-small font-semibold",
              TEXT_COLOR[mode],
            )}
          >
            {labelIcon && (
              <i aria-hidden="true" className={cn("size-3.5", labelIcon)} />
            )}
            <span>
              {label}
              {requiredLabel && (
                <span className="ml-0.5 text-red-500" aria-hidden="true">
                  *
                </span>
              )}
            </span>
          </label>
        )}

        <div className="relative">
          <input
            {...rest}
            ref={ref}
            id={inputId}
            // type nijei toggle hoy, bahir theke override kora jabe na
            type={visible ? "text" : "password"}
            required={required}
            disabled={disabled}
            autoComplete={autoComplete}
            // visible obosthay (type="text") jate keyboard/browser password bodlay ba spellcheck na kore
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            aria-invalid={validation === "error" || undefined}
            aria-describedby={describedByIds || undefined}
            className={cn(
              INPUT_BASE,
              TEXT_COLOR[mode],
              sz.input,
              sz.text,
              tone.field,
              inputClassName,
            )}
          />

          <button
            type="button"
            onClick={() => setVisible((prev) => !prev)}
            // mouse click e input er focus/caret jate na harae
            onMouseDown={(e) => e.preventDefault()}
            disabled={disabled}
            aria-label={visible ? HIDE_LABEL : SHOW_LABEL}
            aria-controls={inputId}
            className={cn(TOGGLE_BASE, TOGGLE_COLOR[mode], sz.text, sz.icon)}
          >
            {visible ? ICON_HIDE : ICON_SHOW}
          </button>
        </div>

        {helperText && (
          <p id={helpId} className={cn(SMALL_TEXT, tone.help)}>
            {helperText}
          </p>
        )}
      </div>
    );
  }),
);
