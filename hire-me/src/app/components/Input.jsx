"use client";

import { forwardRef, useId, useState } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";

/**
 * Size variants — height, padding, icon size, and type scale move together.
 */
const SIZES = {
  sm: {
    box: "h-9 gap-1.5 px-3",
    text: "text-sm",
    label: "text-xs mb-1",
    helper: "text-xs",
    icon: "h-4 w-4",
  },
  md: {
    box: "h-11 gap-2 px-3.5",
    text: "text-[15px]",
    label: "text-sm mb-1.5",
    helper: "text-xs",
    icon: "h-[18px] w-[18px]",
  },
};

/**
 * Validation states — border/ring color, helper-text color, and the status
 * icon shown beside the helper text.
 */
const STATES = {
  default: {
    box: "border-gray-300 hover:border-gray-400 focus-within:border-gray-900 focus-within:ring-gray-900/5",
    helper: "text-gray-500",
    Icon: null,
  },
  success: {
    box: "border-emerald-500 hover:border-emerald-600 focus-within:border-emerald-500 focus-within:ring-emerald-500/10",
    helper: "text-emerald-600",
    Icon: CheckCircle2,
  },
  error: {
    box: "border-red-500 hover:border-red-600 focus-within:border-red-500 focus-within:ring-red-500/10",
    helper: "text-red-600",
    Icon: AlertCircle,
  },
  warning: {
    box: "border-amber-500 hover:border-amber-600 focus-within:border-amber-500 focus-within:ring-amber-500/10",
    helper: "text-amber-600",
    Icon: AlertTriangle,
  },
  info: {
    box: "border-blue-400 hover:border-blue-500 focus-within:border-blue-500 focus-within:ring-blue-500/10",
    helper: "text-blue-600",
    Icon: Info,
  },
};

/**
 * Professional, fully reusable text input covering every case from the spec
 * through a small set of composable props rather than one component per
 * "variant":
 *
 *   <Input label="Email" placeholder="you@company.com" />
 *   <Input label="Search" icon={<Search className="h-4 w-4" />} placeholder="Search Anything..." />
 *   <Input label="Amount" icon="$" placeholder="0.00" />
 *   <Input label="Date" icon={<Calendar className="h-4 w-4" />} placeholder="DD/MM/YYYY" />
 *   <Input label="Bio" showCounter maxLength={140} />
 *   <Input label="Email" state="error" helperText="Please check this field." />
 *
 * @param {string}   [label]       Field label. Omit to hide the label row.
 * @param {boolean}  [required]    Shows a red asterisk next to the label.
 * @param {'sm'|'md'} [size]       Defaults to 'md'.
 * @param {'default'|'success'|'error'|'warning'|'info'} [state]
 * @param {string}   [helperText]  Shown under the field, colored to match `state`.
 * @param {ReactNode}[icon]        Leading icon or short text (e.g. "$").
 * @param {boolean}  [showCounter] Shows a live "n / maxLength" counter, right-aligned.
 * @param {number}   [maxLength]
 * @param {boolean}  [disabled]
 * @param {string}   [className]   Extra classes on the outer wrapper.
 */
const Input = forwardRef(function Input(
  {
    label,
    required = false,
    size = "md",
    state = "default",
    helperText,
    icon,
    showCounter = false,
    maxLength,
    disabled = false,
    className = "",
    id,
    value,
    defaultValue,
    onChange,
    type = "text",
    ...props
  },
  ref
) {
  const autoId = useId();
  const inputId = id || autoId;
  const helperId = `${inputId}-helper`;

  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? "");
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : uncontrolledValue;

  const sizeStyle = SIZES[size] ?? SIZES.md;
  const stateStyle = STATES[state] ?? STATES.default;
  const StateIcon = stateStyle.Icon;

  function handleChange(e) {
    if (!isControlled) setUncontrolledValue(e.target.value);
    onChange?.(e);
  }

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className={`flex items-center font-medium text-gray-700 ${sizeStyle.label}`}>
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}

      <div
        className={`flex items-center rounded-lg border bg-white shadow-sm transition-colors duration-150 focus-within:ring-4 ${sizeStyle.box} ${
          disabled ? "border-gray-200 bg-gray-50 shadow-none" : stateStyle.box
        }`}
      >
        {icon && (
          <span
            className={`flex shrink-0 items-center justify-center font-medium ${sizeStyle.icon} ${
              disabled ? "text-gray-300" : "text-gray-400"
            }`}
          >
            {icon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          value={currentValue}
          onChange={handleChange}
          disabled={disabled}
          maxLength={maxLength}
          required={required}
          aria-invalid={state === "error"}
          aria-describedby={helperText ? helperId : undefined}
          className={`w-full min-w-0 bg-transparent text-gray-900 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:text-gray-400 ${sizeStyle.text}`}
          {...props}
        />
      </div>

      {(helperText || (showCounter && maxLength)) && (
        <div className="mt-1.5 flex items-center gap-2">
          {helperText && (
            <p id={helperId} className={`flex items-center gap-1 ${sizeStyle.helper} ${stateStyle.helper}`}>
              {StateIcon && <StateIcon className="h-3.5 w-3.5 shrink-0" />}
              {helperText}
            </p>
          )}
          {showCounter && maxLength && (
            <span className={`ml-auto shrink-0 tabular-nums text-gray-400 ${sizeStyle.helper}`}>
              {String(currentValue ?? "").length}/{maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

export default Input;
