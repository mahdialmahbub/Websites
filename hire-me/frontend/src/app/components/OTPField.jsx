import React, { forwardRef, useRef, useState } from "react";

/* ---------- Style maps ---------- */
const SIZES = {
  sm: { cell: "h-12 w-12 text-xl rounded-lg", gap: "gap-2" },
  md: { cell: "h-14 w-14 text-2xl rounded-xl", gap: "gap-3" },
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
      "border-red-600 bg-red-50 focus:border-red-600 focus:ring-4 focus:ring-red-200",
    filled:
      "border-red-600 bg-red-50 focus:border-red-600 focus:ring-4 focus:ring-red-200",
  },
  success: {
    empty:
      "border-emerald-700 bg-emerald-50 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-200",
    filled:
      "border-emerald-700 bg-emerald-50 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-200",
  },
};

const PATTERNS = {
  numeric: /[^0-9]/g,
  alphanumeric: /[^a-zA-Z0-9]/g,
};

/**
 * OTPField
 *
 * Props
 * - length      number                              (default 6)
 * - size        "sm" | "md"                         (default "md")
 * - validation  "default" | "success" | "error"
 * - value       string   controlled value
 * - defaultValue string  uncontrolled initial value
 * - onChange    (value: string) => void
 * - onComplete  (value: string) => void   fires when all cells are filled
 * - type        "numeric" | "alphanumeric"          (default "numeric")
 * - mask        boolean  hide characters like a password
 * - placeholder string   shown in empty cells       (default "0")
 * - disabled    boolean
 * - autoFocus   boolean
 *
 * Hover / Focus / Filled / Disabled states are handled with CSS + native props.
 * Supports typing, Backspace/Delete, Arrow keys, Home/End and pasting a full code.
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
    className = "",
    "aria-label": ariaLabel = "One-time password",
  },
  ref
) {
  const isControlled = value !== undefined;
  const [inner, setInner] = useState(defaultValue.slice(0, length));
  const current = (isControlled ? value : inner) || "";
  const refs = useRef([]);

  const sizeCfg = SIZES[size] || SIZES.md;
  const tone = TONE[validation] || TONE.default;
  const strip = PATTERNS[type] || PATTERNS.numeric;

  const clean = (str) => str.replace(strip, "");
  const focusCell = (i) => {
    const el = refs.current[Math.max(0, Math.min(length - 1, i))];
    if (el) el.focus();
  };

  const commit = (next) => {
    if (!isControlled) setInner(next);
    onChange?.(next);
    if (next.length === length) onComplete?.(next);
  };

  const handleInput = (e, i) => {
    // Take the last typed character (handles overwriting a filled cell)
    const raw = e.target.value;
    const char = clean(raw).slice(-1);
    if (!char) return;
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
      const target =
        e.key === "Delete" ? i : i < current.length ? i : i - 1;
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
    // Keep typing order: jump to the first empty cell
    if (i > current.length) {
      focusCell(current.length);
      return;
    }
    e.target.select();
  };

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`inline-flex items-center ${sizeCfg.gap} ${className}`}
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
            maxLength={2}
            value={char}
            placeholder={placeholder}
            disabled={disabled}
            aria-label={`Digit ${i + 1} of ${length}`}
            aria-invalid={validation === "error" || undefined}
            onChange={(e) => handleInput(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onPaste={(e) => handlePaste(e, i)}
            onFocus={(e) => handleFocus(e, i)}
            className={[
              "border text-center font-semibold text-gray-900 placeholder-gray-400 outline-none transition",
              sizeCfg.cell,
              filled ? tone.filled : tone.empty,
              "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:placeholder-gray-300",
              filled
                ? "disabled:border-indigo-200 disabled:hover:border-indigo-200"
                : "disabled:border-gray-200 disabled:hover:border-gray-200",
            ].join(" ")}
          />
        );
      })}
    </div>
  );
});

/* ---------- Preview: all states, both sizes (default export, for viewing here).
   In your project use:  import { OTPField } from "./OTPField"; ---------- */
export default function OTPFieldPreview() {
  const [code, setCode] = useState("");
  const [done, setDone] = useState("");

  const rows = [
    { name: "Default", props: { defaultValue: "" } },
    { name: "Filled", props: { defaultValue: "123456" } },
    { name: "Disabled", props: { defaultValue: "123456", disabled: true } },
    { name: "Error", props: { defaultValue: "123456", validation: "error" } },
    { name: "Success", props: { defaultValue: "123456", validation: "success" } },
  ];

  return (
    <div className="bg-gray-50 p-6">
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-5">
        <p className="mb-3 text-sm font-medium text-gray-900">
          Try it: type, paste, or use Backspace and arrow keys
        </p>
        <OTPField value={code} onChange={setCode} onComplete={setDone} autoFocus />
        <p className="mt-3 text-xs text-gray-500">
          {done && done === code ? `Code entered: ${done}` : "Waiting for 6 digits"}
        </p>
      </div>

      {["sm", "md"].map((size) => (
        <div key={size} className="mb-8">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Size: {size}</h3>
          <div className="flex flex-col gap-4">
            {rows.map(({ name, props }) => (
              <div key={name} className="flex flex-wrap items-center gap-4">
                <span className="w-20 text-xs text-gray-500">{name}</span>
                <OTPField size={size} {...props} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
