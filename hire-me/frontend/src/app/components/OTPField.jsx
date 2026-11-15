import React, { forwardRef, useEffect, useId, useRef, useState } from "react";

/* ---------- Helpers ---------- */
// Project e already `cn` (clsx + tailwind-merge) thakle oita diye replace koro.
const cn = (...parts) => parts.filter(Boolean).join(" ");

const SMALL_TEXT = "text-[length:var(--text-caption,0.75rem)]";

/* ---------- Style maps ---------- */
const SIZES = {
  sm: {
    cell: "size-11 text-lg rounded-lg",
    gap: "gap-2",
  },
  md: {
    cell: "size-[clamp(3rem,calc(0.909vw+2.818rem),3.5rem)] rounded-[clamp(0.5rem,calc(0.909vw+0.318rem),1rem)] text-[clamp(1.25rem,calc(0.455vw+1.159rem),1.5rem)]",
    gap: "gap-[clamp(0.375rem,calc(0.455vw+0.284rem),0.625rem)]",
  },
  // Cells wrapper er puro width nei (className e w-full / max-w-* dao)
  fluid: {
    cell: "h-12 min-w-0 flex-1 text-xl rounded-lg",
    gap: "gap-1.5 sm:gap-2",
    group: "w-full",
  },
};

// Colors for each validation, split by whether the cell has a value
const TONE = {
  default: {
    empty:
      "border-gray-200 bg-white hover:border-gray-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-200",
    filled:
      "border-indigo-200 bg-white hover:border-indigo-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-200",
  },
  error: {
    empty:
      "border-red-500 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-200",
    filled:
      "border-red-500 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-200",
  },
  success: {
    empty:
      "border-green-500 bg-green-50 focus:border-green-500 focus:ring-4 focus:ring-green-200",
    filled:
      "border-green-500 bg-green-50 focus:border-green-500 focus:ring-4 focus:ring-green-200",
  },
  info: {
    empty:
      "border-sky-500 bg-sky-50 focus:border-sky-500 focus:ring-4 focus:ring-sky-200",
    filled:
      "border-sky-500 bg-sky-50 focus:border-sky-500 focus:ring-4 focus:ring-sky-200",
  },
  warning: {
    empty:
      "border-amber-500 bg-amber-50 focus:border-amber-500 focus:ring-4 focus:ring-amber-200",
    filled:
      "border-amber-500 bg-amber-50 focus:border-amber-500 focus:ring-4 focus:ring-amber-200",
  },
};

// Helper text er color, validation onujayi
const HELP_TONE = {
  default: "text-neutral-600",
  success: "text-green-600",
  error: "text-red-600",
  info: "text-sky-600",
  warning: "text-amber-600",
};

// Helper icon (Flaticon UIcons), validation onujayi
const HELPER_ICON = {
  default: "fi fi-rr-info",
  success: "fi fi-rr-check",
  error: "fi fi-rr-cross-circle",
  info: "fi fi-rr-info",
  warning: "fi fi-rr-exclamation",
};

const PATTERNS = {
  numeric: /[^0-9]/g,
  alphanumeric: /[^a-zA-Z0-9]/g,
};

/**
 * OTPField
 *
 * Props
 * - length        number                              (default 6)
 * - size          "sm" | "md" | "fluid"               (default "md")
 * - validation    "default" | "success" | "error" | "info" | "warning"
 * - value         string   controlled value
 * - defaultValue  string   uncontrolled initial value
 * - onChange      (value: string) => void
 * - onComplete    (value: string) => void   fires when all cells are filled
 * - type          "numeric" | "alphanumeric"          (default "numeric")
 * - mask          boolean  hide characters like a password
 * - placeholder   string   shown in empty cells       (default "0")
 * - disabled      boolean
 * - autoFocus     boolean
 * - className     string   outer wrapper er extra class
 *
 * Helper text
 * - helperText    string   cells er niche message (rong `validation` onujayi)
 * - helperIcon    string | null | false   Flaticon class. Na dile validation er
 *                 default icon ashe, null/false dile hide.
 * - inputCta      ReactNode  helper er pashe text button (jemon "Resend")
 * - onCtaClick    (e) => void
 * - ctaDisabled   boolean  CTA disable kore (jemon countdown cholar shomoy)
 *
 * Behavior
 * - Ekta digit type korle automatic porer cell e jay.
 * - Backspace: filled cell hole oita clear kore (cell e-i thake); khali cell hole
 *   ager cell e giye oita clear kore. Delete: current cell clear kore.
 * - Filled cell er upor type korle oi cell overwrite hoy ar porer cell e jay.
 * - Arrow keys / Home / End diye cell bodlano jay.
 * - Paste ba SMS/keyboard autofill (full code) shob cell e boshe jay.
 * - Khali cell er pore (gap rekhe) click korle prothom khali cell e focus jay.
 * - Letter (numeric type e) ba onno invalid character ignore hoy.
 */
export const OTPField = forwardRef(function OTPField(
  {
    length = 6,
    size = "md",
    validation = "default",
    value,
    defaultValue = "",
    onChange,
    onComplete,
    type = "numeric",
    mask = false,
    placeholder = "0",
    disabled = false,
    autoFocus = false,
    name,
    id,
    className = "",
    "aria-label": ariaLabel = "One-time password",

    // helper text
    helperText,
    helperIcon,
    inputCta,
    onCtaClick,
    ctaDisabled = false,
  },
  ref,
) {
  const autoId = useId();
  const baseId = id ?? autoId;
  const helpId = `${baseId}-help`;

  const isControlled = value !== undefined;
  const [inner, setInner] = useState(defaultValue.slice(0, length));
  const current = (isControlled ? value : inner) || "";
  const refs = useRef([]);

  // Always-fresh copy of the value. State updates are async, but focus events
  // fire synchronously while we move between cells, so handlers must read this
  // (not the render-time `current`) or focus bounces back to an old position.
  const valueRef = useRef(current);
  useEffect(() => {
    valueRef.current = current;
  });

  const sizeCfg = SIZES[size] || SIZES.md;
  const tone = TONE[validation] || TONE.default;
  const helpTone = HELP_TONE[validation] || HELP_TONE.default;
  const strip = PATTERNS[type] || PATTERNS.numeric;

  // helperIcon na dile validation er default; null/false dile hide
  const helperIconClass =
    helperIcon === undefined
      ? (HELPER_ICON[validation] ?? HELPER_ICON.default)
      : helperIcon;

  const clean = (str) => str.replace(strip, "");
  const focusCell = (i) => {
    const el = refs.current[Math.max(0, Math.min(length - 1, i))];
    if (el) el.focus();
  };

  const commit = (next) => {
    valueRef.current = next;
    if (!isControlled) setInner(next);
    onChange?.(next);
    if (next.length === length) onComplete?.(next);
  };

  // Write `str` into the cells starting at `start`, then move focus right after it.
  // A full-length code always replaces everything (paste / autofill into any cell).
  const insert = (start, str) => {
    const cur = valueRef.current;
    const from = str.length >= length ? 0 : Math.min(start, cur.length);
    const next = (
      cur.slice(0, from) +
      str +
      cur.slice(from + str.length)
    ).slice(0, length);
    commit(next);
    focusCell(Math.min(from + str.length, length - 1));
  };

  const handleChange = (e, i) => {
    const raw = e.target.value;
    const cur = valueRef.current;
    const old = cur[i] || "";

    // Cell was emptied without a Backspace keydown (some mobile keyboards).
    if (raw === "") {
      if (old) commit(cur.slice(0, i) + cur.slice(i + 1));
      return;
    }

    let chars = clean(raw);
    if (!chars) return; // invalid character: the controlled value restores the cell

    // Typed into a filled cell: it now holds the old char + the new one.
    // Keep only the new one.
    if (old && chars.length === 2) {
      const at = chars.indexOf(old);
      chars =
        at === -1 ? chars.slice(-1) : chars.slice(0, at) + chars.slice(at + 1);
    }

    // More than one char at once = autofill / keyboard suggestion: spread it.
    insert(i, chars);
  };

  const handleKeyDown = (e, i) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return; // keep Ctrl/Cmd+V, +A, etc.
    const cur = valueRef.current;

    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      const target = e.key === "Delete" ? i : i < cur.length ? i : i - 1;
      if (target < 0 || target >= cur.length) return;
      commit(cur.slice(0, target) + cur.slice(target + 1));
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
    insert(i, pasted);
  };

  const handleFocus = (e, i) => {
    // Keep typing order: jump to the first empty cell
    const len = valueRef.current.length;
    if (i > len) {
      focusCell(len);
      return;
    }
    e.target.select();
  };

  return (
    <div className={cn("inline-flex flex-col gap-1.5", className)}>
      <div
        role="group"
        aria-label={ariaLabel}
        aria-describedby={helperText ? helpId : undefined}
        className={cn("inline-flex items-center", sizeCfg.gap, sizeCfg.group)}
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
              pattern={type === "numeric" ? "[0-9]*" : undefined}
              autoComplete={i === 0 ? "one-time-code" : "off"}
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              autoFocus={autoFocus && i === 0}
              name={name ? `${name}-${i}` : undefined}
              value={char}
              placeholder={placeholder}
              disabled={disabled}
              aria-label={`Digit ${i + 1} of ${length}`}
              aria-invalid={validation === "error" || undefined}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={(e) => handlePaste(e, i)}
              onFocus={(e) => handleFocus(e, i)}
              onClick={(e) => e.currentTarget.select()}
              className={cn(
                "border text-center font-semibold text-gray-900 placeholder-gray-400 outline-none transition",
                sizeCfg.cell,
                filled ? tone.filled : tone.empty,
                "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:placeholder-gray-300",
                filled
                  ? "disabled:border-indigo-200 disabled:hover:border-indigo-200"
                  : "disabled:border-gray-200 disabled:hover:border-gray-200",
              )}
            />
          );
        })}
      </div>

      {helperText && (
        // w-0 min-w-full: lomba helper text hole OTP cell er width bariye dey na
        <div className="flex w-0 min-w-full items-start gap-1 px-0.5">
          {helperIconClass && (
            <i
              aria-hidden="true"
              className={cn(
                helperIconClass,
                SMALL_TEXT,
                helpTone,
                "flex h-lh shrink-0 items-center",
              )}
            />
          )}
          <p
            id={helpId}
            aria-live={validation !== "default" ? "polite" : undefined}
            className={cn(SMALL_TEXT, helpTone)}
          >
            {helperText}
          </p>
          {inputCta && (
            <button
              type="button"
              onClick={onCtaClick}
              disabled={ctaDisabled}
              className={cn(
                SMALL_TEXT,
                helpTone,
                "shrink-0 cursor-pointer hover:underline",
                "disabled:cursor-not-allowed disabled:no-underline disabled:opacity-50",
              )}
            >
              {inputCta}
            </button>
          )}
        </div>
      )}
    </div>
  );
});

/* ---------- Preview: all states, all sizes (default export, for viewing here).
   In your project use:  import { OTPField } from "./OTPField"; ---------- */
export default function OTPFieldPreview() {
  const [code, setCode] = useState("");
  const [done, setDone] = useState("");

  const rows = [
    { name: "Default", props: { defaultValue: "" } },
    { name: "Filled", props: { defaultValue: "123456" } },
    { name: "Disabled", props: { defaultValue: "123456", disabled: true } },
    {
      name: "Helper",
      props: {
        defaultValue: "12",
        helperText: "We sent a code to your email",
        inputCta: "Resend",
      },
    },
    {
      name: "Error",
      props: {
        defaultValue: "123456",
        validation: "error",
        helperText: "Invalid code",
        inputCta: "Resend",
      },
    },
    {
      name: "Success",
      props: {
        defaultValue: "123456",
        validation: "success",
        helperText: "Verified",
      },
    },
    {
      name: "Info",
      props: {
        defaultValue: "123456",
        validation: "info",
        helperText: "Code expires in 10 minutes",
      },
    },
    {
      name: "Warning",
      props: {
        defaultValue: "123456",
        validation: "warning",
        helperText: "Please wait before requesting another code",
        inputCta: "Resend in 30s",
        ctaDisabled: true,
      },
    },
  ];

  return (
    <div className="bg-gray-50 p-6">
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-5">
        <p className="mb-3 text-sm font-medium text-gray-900">
          Try it: type, paste, or use Backspace and arrow keys
        </p>
        <OTPField
          value={code}
          onChange={setCode}
          onComplete={setDone}
          autoFocus
        />
        <p className="mt-3 text-xs text-gray-500">
          {done && done === code
            ? `Code entered: ${done}`
            : "Waiting for 6 digits"}
        </p>
      </div>

      {["sm", "md", "fluid"].map((size) => (
        <div key={size} className="mb-8">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">
            Size: {size}
          </h3>
          <div className="flex flex-col gap-4">
            {rows.map(({ name, props }) => (
              <div key={name} className="flex flex-wrap items-start gap-4">
                <span className="w-20 pt-3 text-xs text-gray-500">{name}</span>
                <OTPField
                  size={size}
                  className={size === "fluid" ? "w-full max-w-88" : ""}
                  {...props}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
