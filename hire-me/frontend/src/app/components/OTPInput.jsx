import React, { forwardRef, useId, useRef, useState } from "react";

/* ---------- Icons (inline, no dependency) ---------- */
const Svg = ({ children }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="shrink-0"
  >
    {children}
  </svg>
);

const ICONS = {
  info: (
    <Svg>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </Svg>
  ),
  success: (
    <Svg>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </Svg>
  ),
  warning: (
    <Svg>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </Svg>
  ),
  error: (
    <Svg>
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6M9 9l6 6" />
    </Svg>
  ),
};

/* ---------- Style maps ---------- */
const SIZES = {
  sm: { cell: "h-12 w-12 text-xl rounded-lg", gap: "gap-2", help: "text-xs" },
  md: { cell: "h-14 w-14 text-2xl rounded-xl", gap: "gap-3", help: "text-sm" },
};

const NEUTRAL = {
  empty:
    "border-gray-300 bg-white hover:border-gray-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-200",
  filled:
    "border-indigo-200 bg-white hover:border-indigo-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-200",
};
const AUTOFILL =
  "border-blue-600 bg-white ring-4 ring-blue-200 focus:border-blue-600";
const ERROR =
  "border-red-600 bg-red-50 focus:border-red-600 focus:ring-4 focus:ring-red-200";
const SUCCESS =
  "border-emerald-700 bg-emerald-50 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-200";

const CELL_TONE = {
  default: NEUTRAL,
  information: NEUTRAL,
  warning: NEUTRAL,
  autofill: { empty: AUTOFILL, filled: AUTOFILL },
  error: { empty: ERROR, filled: ERROR },
  success: { empty: SUCCESS, filled: SUCCESS },
};

const HELP_TONE = {
  autofill: "text-blue-600",
  information: "text-blue-600",
  success: "text-emerald-600",
  warning: "text-amber-600",
  error: "text-red-600",
};

const HELP_ICON = {
  autofill: "info",
  information: "info",
  success: "success",
  warning: "warning",
  error: "error",
};

const DEFAULT_HELP = {
  autofill: "OTP was auto filled",
  information: "This is an information message.",
  success: "Looks good",
  warning: "Please review this information.",
  error: "Please check this field.",
};

const PATTERNS = {
  numeric: /[^0-9]/g,
  alphanumeric: /[^a-zA-Z0-9]/g,
};

/**
 * OTPInput  (label + cells + helptext)
 *
 * Props
 * - variant     "default" | "autofill" | "information" | "warning" | "error" | "success"
 * - size        "sm" | "md"                    (default "md")
 * - label       string                         (default "OTP")
 * - isLabel     boolean                        (default true)
 * - isIcon      boolean  icon before helptext  (default true)
 * - helperText  string   overrides default helptext of the variant
 * - placeholder string                         (default "0")
 * - length      number                         (default 4)
 * - value / defaultValue / onChange / onComplete
 * - type        "numeric" | "alphanumeric"     (default "numeric")
 * - mask, disabled, autoFocus, required, name
 *
 * When the browser / OS autofills the whole code (SMS one-time-code) and
 * variant is "default", the component switches itself to the "autofill" look
 * until the user edits a digit.
 */
export const OTPInput = forwardRef(function OTPInput(
  {
    variant = "default",
    size = "md",
    label = "OTP",
    isLabel = true,
    isIcon = true,
    helperText,
    placeholder = "0",
    length = 4,
    value,
    defaultValue = "",
    onChange,
    onComplete,
    type = "numeric",
    mask = false,
    disabled = false,
    autoFocus = false,
    required = false,
    name,
    className = "",
  },
  ref
) {
  const uid = useId();
  const labelId = `${uid}-label`;
  const helpId = `${uid}-help`;

  const isControlled = value !== undefined;
  const [inner, setInner] = useState(defaultValue.slice(0, length));
  const [autoFilled, setAutoFilled] = useState(false);
  const current = (isControlled ? value : inner) || "";
  const refs = useRef([]);

  const effective = variant === "default" && autoFilled ? "autofill" : variant;
  const sizeCfg = SIZES[size] || SIZES.md;
  const tone = CELL_TONE[effective] || NEUTRAL;
  const strip = PATTERNS[type] || PATTERNS.numeric;

  const help = helperText ?? DEFAULT_HELP[effective];
  const showHelp = Boolean(help) && effective !== "default";

  const clean = (s) => s.replace(strip, "");
  const focusCell = (i) => {
    const el = refs.current[Math.max(0, Math.min(length - 1, i))];
    if (el) el.focus();
  };

  const commit = (next, fromAutofill = false) => {
    setAutoFilled(fromAutofill);
    if (!isControlled) setInner(next);
    onChange?.(next);
    if (next.length === length) onComplete?.(next);
  };

  const handleInput = (e, i) => {
    const cleaned = clean(e.target.value);
    if (!cleaned) return;

    // Whole code arrived in one go → OS / browser autofill
    if (cleaned.length > 2) {
      const next = cleaned.slice(0, length);
      commit(next, true);
      focusCell(next.length >= length ? length - 1 : next.length);
      return;
    }

    const char = cleaned.slice(-1);
    const at = Math.min(i, current.length);
    const next = (current.slice(0, at) + char + current.slice(at + 1)).slice(
      0,
      length
    );
    commit(next);
    focusCell(at + 1);
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      const target = e.key === "Delete" ? i : i < current.length ? i : i - 1;
      if (target < 0 || target >= current.length) return;
      commit(current.slice(0, target) + current.slice(target + 1));
      focusCell(target);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusCell(i - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusCell(i + 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusCell(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusCell(length - 1);
    }
  };

  const handlePaste = (e, i) => {
    e.preventDefault();
    const pasted = clean(e.clipboardData.getData("text")).slice(0, length);
    if (!pasted) return;
    const at = Math.min(i, current.length);
    const next = (current.slice(0, at) + pasted).slice(0, length);
    commit(next);
    focusCell(next.length >= length ? length - 1 : next.length);
  };

  const handleFocus = (e, i) => {
    if (i > current.length) {
      focusCell(current.length);
      return;
    }
    e.target.select();
  };

  return (
    <div className={`inline-flex flex-col gap-2 ${className}`}>
      {isLabel && (
        <span id={labelId} className="text-sm font-medium text-gray-900">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </span>
      )}

      <div
        role="group"
        aria-labelledby={isLabel ? labelId : undefined}
        aria-label={isLabel ? undefined : "One-time password"}
        aria-describedby={showHelp ? helpId : undefined}
        className={`flex items-center ${sizeCfg.gap}`}
      >
        {Array.from({ length }, (_, i) => {
          const char = current[i] || "";
          const filled = Boolean(char);
          return (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
                if (i === 0) {
                  if (typeof ref === "function") ref(el);
                  else if (ref) ref.current = el;
                }
              }}
              type={mask ? "password" : "text"}
              inputMode={type === "numeric" ? "numeric" : "text"}
              autoComplete={i === 0 ? "one-time-code" : "off"}
              autoFocus={autoFocus && i === 0}
              name={name ? `${name}-${i}` : undefined}
              value={char}
              placeholder={placeholder}
              disabled={disabled}
              aria-label={`Digit ${i + 1} of ${length}`}
              aria-invalid={effective === "error" || undefined}
              onChange={(e) => handleInput(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={(e) => handlePaste(e, i)}
              onFocus={(e) => handleFocus(e, i)}
              className={[
                "min-w-0 border text-center font-semibold text-gray-900 placeholder-gray-400 outline-none transition",
                sizeCfg.cell,
                filled ? tone.filled : tone.empty,
                "disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:placeholder-gray-300 disabled:ring-0",
              ].join(" ")}
            />
          );
        })}
      </div>

      {showHelp && (
        <p
          id={helpId}
          className={`flex items-center gap-1.5 ${sizeCfg.help} ${HELP_TONE[effective]}`}
        >
          {isIcon && ICONS[HELP_ICON[effective]]}
          <span>{help}</span>
        </p>
      )}
    </div>
  );
});

/* ---------- Preview: all variants, both sizes (default export, for viewing here).
   In your project use:  import { OTPInput } from "./OTPInput"; ---------- */
export default function OTPInputPreview() {
  const variants = [
    { name: "Default", props: {} },
    { name: "AutoFill", props: { variant: "autofill" } },
    { name: "Success", props: { variant: "success", defaultValue: "1111" } },
    { name: "Warning", props: { variant: "warning" } },
    { name: "Error", props: { variant: "error", defaultValue: "1111" } },
    { name: "Information", props: { variant: "information" } },
  ];

  return (
    <div className="bg-gray-50 p-6">
      {["sm", "md"].map((size) => (
        <div key={size} className="mb-8">
          <h3 className="mb-4 text-sm font-semibold text-gray-700">Size: {size}</h3>
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 md:grid-cols-3">
            {variants.map(({ name, props }) => (
              <OTPInput key={name} size={size} {...props} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
