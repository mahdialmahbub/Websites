"use client";

import * as React from "react";
import { CalendarDays, Clock, Search } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Types (JSDoc) — parent e <Input /> likhle ei prop gula suggest korbe      */
/* -------------------------------------------------------------------------- */

/** @typedef {"default" | "icon" | "counter" | "amount" | "calendar" | "time"} InputVariant */
/** @typedef {"sm" | "md"} InputSize */
/** @typedef {"default" | "success" | "error" | "info" | "warning"} InputValidation */

/**
 * @typedef {Object} InputOwnProps
 *
 * @property {string} [label]
 *   Field er label. Na dile `aria-label` dao.
 * @property {string} [labelIcon]
 *   Label er pasher icon, shudu icon class string, jemon `"fi fi-rr-envelope"`.
 *   Value dile icon dekhay, na dile hide.
 * @property {boolean} [required=false]
 *   true dile `<input>` ta native required hoy. Label e "Required" text dekhay na.
 * @property {boolean} [requiredLabel=false]
 *   true dile label e "Required" text dekhay (shudu text, input required kore na).
 * @property {InputVariant} [variant="default"]
 *   `icon` | `counter` | `amount` | `calendar` | `time`: variant onujayi icon,
 *   placeholder ar inputMode ashe.
 * @property {InputSize} [size="md"]
 *   Input er size.
 * @property {InputValidation} [validation="default"]
 *   Border, focus ring, helper text ar helper icon er rong ei state onujayi hoy.
 * @property {string} [helperText]
 *   Input er niche message (rong `validation` onujayi).
 * @property {string | null | false} [helperIcon]
 *   Helper text er pasher Flaticon icon class, jemon `"fi fi-rr-info"`.
 *   Na dile `validation` onujayi default icon ashe. `null` / `false` dile hide.
 * @property {React.ReactNode} [inputCta]
 *   Helper text er pashe ekta text button (jemon "Resend"). `helperText` thakle
 *   tobei dekhay.
 * @property {React.MouseEventHandler<HTMLButtonElement>} [onCtaClick]
 *   `inputCta` button e click korle ei function chole. (`onClick` ekhon normal
 *   `<input>` er onClick.)
 * @property {React.ReactNode} [icon]
 *   Prefix icon. `icon` variant e Search, `calendar` e CalendarDays, `time` e
 *   Clock default. `icon={null}` dile hide.
 * @property {string} [currency="$"]
 *   `amount` variant er prefix.
 * @property {number} [maxLength=140]
 *   `counter` variant er character limit.
 * @property {boolean} [darkBg=false]
 *   true dile small screen e label/text light (neutral-50) hoy.
 * @property {string} [className]
 *   Wrapper er extra class.
 * @property {string} [inputClassName]
 *   `<input>` er extra class.
 */

/**
 * Baki sob (type, value, defaultValue, onChange, disabled, placeholder, name...)
 * normal `<input>` props.
 *
 * @typedef {InputOwnProps & Omit<React.ComponentPropsWithoutRef<"input">, keyof InputOwnProps>} InputProps
 */

/* -------------------------------------------------------------------------- */
/*  Styles — Figma er sathe milate ekhane change koro                         */
/* -------------------------------------------------------------------------- */

// Project e already `cn` (clsx + tailwind-merge) thakle oita diye replace koro.
const cn = (...parts) => parts.filter(Boolean).join(" ");

// `min-h` shudu small screen e (44px touch target). Na hole `size` prop er
// h-9 / h-10 kaj korto na, shob size e 44px hoye jeto.
const INPUT_BASE = [
  "block w-full max-sm:min-h-[44px] outline-none",
  "transition-[border-color,box-shadow] duration-150 motion-reduce:transition-none",
  "placeholder:text-neutral-400 focus:ring-[3px]",
  "disabled:cursor-not-allowed disabled:border-transparent disabled:bg-slate-100",
  "disabled:text-slate-400 disabled:placeholder:text-slate-400",
].join(" ");

const TEXT_COLOR = {
  light: "text-neutral-950",
  dark: "max-sm:text-neutral-50",
};

// Font size fixed text token (body / small / caption) theke ashe, fallback shoho.
const SIZE = {
  sm: {
    input: "h-9 rounded-md pr-3",
    text: "text-[length:var(--text-small,0.875rem)]",
    pl: "pl-3",
    plIcon: "pl-9",
    prefix: "pl-3 [&_svg]:size-4",
  },
  md: {
    input: "h-10 rounded-md pr-3.5",
    text: "text-[length:var(--text-body,1rem)]",
    pl: "pl-3.5",
    plIcon: "pl-10",
    prefix: "pl-3.5 [&_svg]:size-[18px]",
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

// Tailwind v3 ar v4 duitaite kaj kore, ar upore baki size gular sathe consistent.
const SMALL_TEXT = "text-[length:var(--text-caption,0.75rem)]";

// Helper text er pasher Flaticon (UIcons, regular rounded) icon — validation onujayi.
// Icon bodlate chaile shudu ekhane class name bodlao.
const HELPER_ICON = {
  default: "fi fi-rr-info",
  success: "fi fi-rr-check",
  error: "fi fi-rr-cross-circle",
  info: "fi fi-rr-info",
  warning: "fi fi-rr-exclamation",
};

// Variant er default icon, placeholder ar inputMode.
const VARIANT = {
  default: {},
  icon: { icon: <Search aria-hidden="true" /> },
  counter: {},
  amount: { placeholder: "0.00", inputMode: "decimal" },
  calendar: {
    icon: <CalendarDays aria-hidden="true" />,
    placeholder: "DD / MM / YYYY",
    inputMode: "numeric",
  },
  time: { icon: <Clock aria-hidden="true" />, placeholder: "HH : MM AM/PM" },
};

const DEFAULT_MAX_LENGTH = 140;

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export const Input = React.forwardRef(
  /** @type {React.ForwardRefRenderFunction<HTMLInputElement, InputProps>} */
  (
    function Input(
      {
        // look
        variant = "default",
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
        helperIcon,
        inputCta,
        onCtaClick,
        icon,
        currency = "$",
        maxLength,

        // <input> props
        id,
        type = "text",
        placeholder,
        inputMode,
        value,
        defaultValue,
        onChange,
        disabled = false,
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

      // Char counter: controlled (value) ar uncontrolled (defaultValue) duitai kaj kore.
      const showCounter = variant === "counter";
      const counterMax = maxLength ?? DEFAULT_MAX_LENGTH;
      const [count, setCount] = React.useState(
        () => String(value ?? defaultValue ?? "").length,
      );
      const length = value !== undefined ? String(value).length : count;

      // TypeScript nai, tai label/aria-label miss hole dev e warning dey.
      // useEffect e rakha hoyeche jate protiti render e console spam na hoy.
      const ariaLabel = rest["aria-label"];
      const ariaLabelledBy = rest["aria-labelledby"];
      React.useEffect(() => {
        if (
          process.env.NODE_ENV !== "production" &&
          !label &&
          !ariaLabel &&
          !ariaLabelledBy
        ) {
          console.warn(
            "Input: `label` ba `aria-label` dite hobe (accessibility er jonno).",
          );
        }
      }, [label, ariaLabel, ariaLabelledBy]);

      const sz = SIZE[size] ?? SIZE.md;
      const tone = VALIDATION[validation] ?? VALIDATION.default;
      const config = VARIANT[variant] ?? VARIANT.default;
      const textColor = darkBg ? TEXT_COLOR.dark : TEXT_COLOR.light;

      // amount e currency; onno variant e `icon` prop (null dile hide), na hole variant er default.
      const prefix =
        variant === "amount"
          ? currency
          : icon === undefined
            ? config.icon
            : icon;
      const hasPrefix = prefix != null && prefix !== false;

      // helperIcon na dile validation er default; null/false dile hide.
      const helperIconClass =
        helperIcon === undefined
          ? (HELPER_ICON[validation] ?? HELPER_ICON.default)
          : helperIcon;

      const describedByIds = [describedBy, helperText ? helpId : null]
        .filter(Boolean)
        .join(" ");

      const handleChange = (e) => {
        setCount(e.target.value.length);
        onChange?.(e);
      };

      return (
        <div className={cn("flex w-full flex-col gap-1.5", className)}>
          {label && (
            <label
              htmlFor={inputId}
              className={cn(
                "flex items-center gap-space-1 text-small font-semibold px-0.5",
                textColor,
              )}
            >
              {labelIcon && (
                <i aria-hidden="true" className={cn("size-3.5", labelIcon)} />
              )}
              <span className="flex items-end justify-between w-full">
                {label}
                {requiredLabel && (
                  <span
                    className="text-green-500/90 text-[8px]"
                    aria-hidden="true"
                  >
                    Required
                  </span>
                )}
              </span>
            </label>
          )}

          <div className="relative">
            {hasPrefix && (
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute inset-y-0 left-0 flex items-center",
                  disabled ? "text-neutral-400" : "text-neutral-500",
                  sz.text,
                  sz.prefix,
                )}
              >
                {prefix}
              </span>
            )}

            <input
              ref={ref}
              id={inputId}
              type={type}
              value={value}
              defaultValue={defaultValue}
              onChange={handleChange}
              disabled={disabled}
              required={required}
              placeholder={placeholder ?? config.placeholder}
              inputMode={inputMode ?? config.inputMode}
              maxLength={showCounter ? counterMax : maxLength}
              aria-invalid={validation === "error" || undefined}
              aria-describedby={describedByIds || undefined}
              className={cn(
                INPUT_BASE,
                textColor,
                sz.input,
                sz.text,
                hasPrefix ? sz.plIcon : sz.pl,
                tone.field,
                inputClassName,
              )}
              {...rest}
            />
          </div>

          {(helperText || showCounter) && (
            <div className="flex items-start gap-2 px-0.5">
              {helperText && (
                <div className="flex items-start gap-space-1">
                  {helperIconClass && (
                    <i
                      aria-hidden="true"
                      className={cn(
                        helperIconClass,
                        SMALL_TEXT,
                        tone.help,
                        // h-[1lh]: icon ta helper text er prothom line er majhkhane thake,
                        // text multi-line hole-o.
                        "flex h-[1lh] shrink-0 items-center",
                      )}
                    />
                  )}
                  <p id={helpId} className={cn(SMALL_TEXT, tone.help)}>
                    {helperText}
                  </p>
                  {inputCta && (
                    <button
                      type="button"
                      onClick={onCtaClick}
                      className={cn(
                        SMALL_TEXT,
                        tone.help,
                        "shrink-0 cursor-pointer hover:underline",
                      )}
                    >
                      {inputCta}
                    </button>
                  )}
                </div>
              )}
              {showCounter && (
                <span
                  className={cn(
                    SMALL_TEXT,
                    "ml-auto shrink-0 text-neutral-500",
                  )}
                >
                  {length} / {counterMax}
                </span>
              )}
            </div>
          )}
        </div>
      );
    }
  ),
);
