"use client";

import * as React from "react";

/* -------------------------------------------------------------------------- */
/*  Types (JSDoc) — parent e <Textarea /> likhle ei prop gula suggest korbe   */
/* -------------------------------------------------------------------------- */

/** @typedef {"sm" | "md"} TextareaSize */
/** @typedef {"default" | "success" | "error" | "info" | "warning"} TextareaValidation */

/**
 * @typedef {Object} TextareaOwnProps
 *
 * @property {string} [label]
 *   Field er label. Na dile `aria-label` dao.
 * @property {string} [labelIcon]
 *   Label er pasher icon, shudu icon class string, jemon `"fi fi-rr-envelope"`.
 *   Value dile icon dekhay, na dile hide.
 * @property {boolean} [required=false]
 *   true dile `<textarea>` ta native required hoy. Label e `*` dekhay na.
 * @property {boolean} [requiredLabel=false]
 *   true dile label e required `*` dekhay (shudu text, field required kore na).
 * @property {TextareaSize} [size="md"]
 *   Textarea er size.
 * @property {TextareaValidation} [validation="default"]
 *   Border, focus ring, helper text er rong ar status icon ei state onujayi hoy.
 * @property {string} [helperText]
 *   Niche message. Na dile `validation` er default message dekhay
 *   (`default` e kichu dekhay na).
 * @property {boolean} [isIcon=true]
 *   Helper text er age status icon dekhabe kina.
 * @property {number} [rows]
 *   Minimum height (line er hishebe). Text barle height nijei barbe, komle
 *   abar kombe. Default: `sm` = 3, `md` = 4.
 * @property {boolean} [darkBg=false]
 *   true dile small screen e label/text light (neutral-50) hoy.
 * @property {string} [className]
 *   Wrapper er extra class.
 * @property {string} [textareaClassName]
 *   `<textarea>` er extra class.
 */

/**
 * Baki sob (value, defaultValue, onChange, disabled, placeholder, name...)
 * normal `<textarea>` props.
 *
 * @typedef {TextareaOwnProps & Omit<React.ComponentPropsWithoutRef<"textarea">, keyof TextareaOwnProps>} TextareaProps
 */

/* -------------------------------------------------------------------------- */
/*  Styles — Figma er sathe milate ekhane change koro                         */
/* -------------------------------------------------------------------------- */

// Project e already `cn` (clsx + tailwind-merge) thakle oita diye replace koro.
const cn = (...parts) => parts.filter(Boolean).join(" ");

const TEXTAREA_BASE = [
  "block w-full resize-none field-sizing-content outline-none",
  "transition-[border-color,box-shadow] duration-150 motion-reduce:transition-none",
  "placeholder:text-neutral-400 focus:ring-[3px]",
  "disabled:cursor-not-allowed disabled:border-transparent disabled:bg-slate-100",
  "disabled:text-slate-400 disabled:placeholder:text-slate-400",
  "disabled:hover:border-transparent",
].join(" ");

const TEXT_COLOR = {
  light: "text-neutral-950",
  dark: "max-sm:text-neutral-50",
};

// Font size fixed text token (body / small / caption) theke ashe, fallback shoho.
const SIZE = {
  sm: {
    field: "rounded-md px-3 py-2",
    text: "text-[length:var(--text-small,0.875rem)]",
    rows: 3,
    padY: "1rem", // py-2 er top + bottom
  },
  md: {
    field: "rounded-md px-3.5 py-2.5",
    text: "text-[length:var(--text-body,1rem)]",
    rows: 4,
    padY: "1.25rem", // py-2.5 er top + bottom
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
const STATUS_ICON_TEXT = "text-[length:var(--text-small,0.875rem)]";

// Validation er status icon (Flaticon CDN class). Pack er icon name onujayi ekhane change koro.
const STATUS_ICON = {
  success: "fi fi-rr-check-circle",
  error: "fi fi-rr-cross-circle",
  warning: "fi fi-rr-triangle-warning",
  info: "fi fi-rr-info",
};

// `helperText` na dile validation onujayi ei message dekhay.
const DEFAULT_HELP = {
  success: "Looks good",
  error: "Please check this field.",
  warning: "Please review this information.",
  info: "This is an information message.",
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export const Textarea = React.forwardRef(
  /** @type {React.ForwardRefRenderFunction<HTMLTextAreaElement, TextareaProps>} */
  (function Textarea(
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
      isIcon = true,
      rows,

      // <textarea> props
      id,
      style,
      "aria-describedby": describedBy,

      // classes
      className,
      textareaClassName,

      ...rest
    },
    ref,
  ) {
    const autoId = React.useId();
    const fieldId = id ?? autoId;
    const helpId = `${fieldId}-help`;

    // TypeScript nai, tai label/aria-label miss hole dev e warning dey.
    if (
      process.env.NODE_ENV !== "production" &&
      !label &&
      !rest["aria-label"] &&
      !rest["aria-labelledby"]
    ) {
      console.warn(
        "Textarea: `label` ba `aria-label` dite hobe (accessibility er jonno).",
      );
    }

    const sz = SIZE[size] ?? SIZE.md;
    const tone = VALIDATION[validation] ?? VALIDATION.default;
    const textColor = darkBg ? TEXT_COLOR.dark : TEXT_COLOR.light;
    const statusIcon = isIcon ? STATUS_ICON[validation] : undefined;

    // `field-sizing-content` e `rows` ignore hoy, tai minimum height nijei set kori:
    // rows lines + vertical padding + border.
    const minHeight = `calc(${rows ?? sz.rows}lh + ${sz.padY} + 3px)`;

    const help = helperText ?? DEFAULT_HELP[validation];

    const describedByIds = [describedBy, help ? helpId : null]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={cn("flex w-full flex-col gap-1.5", className)}>
        {label && (
          <label
            htmlFor={fieldId}
            className={cn(
              "flex items-center gap-space-1 text-small font-semibold",
              textColor,
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

        <textarea
          ref={ref}
          id={fieldId}
          rows={rows ?? sz.rows}
          style={{ minHeight, ...style }}
          required={required}
          aria-invalid={validation === "error" || undefined}
          aria-describedby={describedByIds || undefined}
          className={cn(
            TEXTAREA_BASE,
            textColor,
            sz.field,
            sz.text,
            tone.field,
            textareaClassName,
          )}
          {...rest}
        />

        {help && (
          <p
            id={helpId}
            className={cn("flex items-center gap-1.5", SMALL_TEXT, tone.help)}
          >
            {statusIcon && (
              <i
                aria-hidden="true"
                className={cn(
                  "flex shrink-0 leading-none",
                  STATUS_ICON_TEXT,
                  statusIcon,
                )}
              />
            )}
            <span>{help}</span>
          </p>
        )}
      </div>
    );
  }),
);
