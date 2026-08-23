/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";

/**
 * CounterField
 * -----------------------------------------------------------------------
 * InputField er structure/styling convention follow kore banano —
 * shudhu input box er jaygay ekta minus/plus counter boshano hoyeche.
 * Baki shob (title, required badge, status messages) InputField er
 * moto same rakha hoyeche, jate design consistent thake.
 *
 * USAGE EXAMPLE
 * -----------------------------------------------------------------------
 * <CounterField
 *   title="Quantity"
 *   required={true}
 *   min={0}
 *   max={99}
 *   step={1}
 *   value={value}
 *   onChange={(newValue) => setValue(newValue)}
 *   showInfo={true}
 *   infoMessage="Maximum 5 per order."
 *   showError={false}
 *   errorMessage="This field is required."
 *   showSuccess={false}
 *   successMessage="Looks good!"
 *   showLoading={false}
 *   loadingMessage="Updating cart..."
 * />
 * -----------------------------------------------------------------------
 */
export default function CounterField({
  // Label / basic config
  title = "",
  required = false,

  // Counter behavior
  min = 0,
  max = Infinity,
  step = 1,

  // Controlled counter (optional — component also works uncontrolled)
  value,
  defaultValue = 0,
  onChange,
  disabled = false,

  // Status messages — each has its own visibility toggle
  showInfo = false,
  infoMessage = "Information message",

  showError = false,
  errorMessage = "Error message",

  showSuccess = false,
  successMessage = "Success message",

  showLoading = false,
  loadingMessage = "Loading message",
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const updateValue = (nextValue) => {
    const clamped = Math.min(max, Math.max(min, nextValue));
    if (!isControlled) setInternalValue(clamped);
    onChange?.(clamped);
  };

  const handleDecrement = () => updateValue(currentValue - step);
  const handleIncrement = () => updateValue(currentValue + step);

  // Border color reacts to the highest-priority active status —
  // InputField er shathe exact same logic
  const borderClass = showError
    ? "border-red-500 focus-within:border-red-500"
    : showSuccess
      ? "border-emerald-500 focus-within:border-emerald-500"
      : "border-secondary focus-within:border-secondary/80";

  // "01", "12" er moto 2-digit leading-zero format — screenshot er moto
  const displayValue = String(currentValue).padStart(2, "0");

  // Local text buffer for the input so the user can freely type/backspace
  // without the leading-zero padding fighting the cursor on every keystroke.
  const [inputText, setInputText] = useState(displayValue);

  // Keep the local text in sync whenever the "real" value changes from
  // outside (parent passing a new `value`, or +/- buttons).
  useEffect(() => {
    setInputText(displayValue);
  }, [displayValue]);

  const handleInputChange = (e) => {
    const raw = e.target.value;
    // Allow only digits (and an optional leading "-" if negative min is allowed)
    if (raw === "" || /^-?\d*$/.test(raw)) {
      setInputText(raw);
    }
  };

  const commitInputValue = () => {
    const parsed = parseInt(inputText, 10);
    if (Number.isNaN(parsed)) {
      setInputText(displayValue); // revert to last valid value
      return;
    }
    updateValue(parsed);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.currentTarget.blur(); // triggers commitInputValue via onBlur
    }
  };

  return (
    <div className="h-full self-baseline">
      {/* Title row */}
      {(title || required) && (
        <div className="flex items-center justify-between mb-2 px-space-1">
          {title && (
            <label className="font-semibold font-primary text-size-h6 text-foreground">
              {title}
            </label>
          )}
          {required && (
            <span className="text-xs font-primary font-semibold text-green">
              Required
            </span>
          )}
        </div>
      )}

      {/* Counter row */}
      <div
        className={`flex items-center justify-between gap-6 rounded-xl bg-background border px-4 py-3 transition-colors ${borderClass} ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <button
          type="button"
          aria-label="Decrease"
          onClick={handleDecrement}
          disabled={disabled || currentValue <= min}
          className="flex items-center justify-center rounded-sm text-[#2BE7C4]/70 transition-colors hover:bg-[#2BE7C4]/10 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <i className="fi fi-rr-minus-small text-[38px]"></i>
        </button>

        <input
          type="text"
          inputMode="numeric"
          className="w-full text-center text-lg font-semibold text-foreground tabular-nums bg-transparent outline-none disabled:cursor-not-allowed"
          value={inputText}
          onChange={handleInputChange}
          onBlur={commitInputValue}
          onKeyDown={handleInputKeyDown}
          disabled={disabled}
        />

        <button
          type="button"
          aria-label="Increase"
          onClick={handleIncrement}
          disabled={disabled || currentValue >= max}
          className="flex items-center justify-center rounded-sm text-[#2BE7C4]/70 transition-colors hover:bg-[#2BE7C4]/10 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <i className="fi fi-rr-plus-small text-[38px]"></i>
        </button>
      </div>

      {/* Status messages — InputField er shathe exact same block */}
      <div className="mt-space-3 flex flex-col gap-space-3">
        {showInfo && (
          <StatusLine
            icon={
              <i className="fi fi-rr-info text-size-large text-secondary" />
            }
            colorClass="text-secondary"
            message={infoMessage}
          />
        )}
        {showError && (
          <StatusLine
            icon={
              <i className="fi fi-rr-cross-circle text-size-large text-red" />
            }
            colorClass="text-red"
            message={errorMessage}
          />
        )}
        {showSuccess && (
          <StatusLine
            icon={
              <i className="fi fi-rr-check-circle text-size-large text-green" />
            }
            colorClass="text-green"
            message={successMessage}
          />
        )}
        {showLoading && (
          <StatusLine
            icon={
              <i className="fi fi-rr-loading text-size-large text-placeholder_2" />
            }
            colorClass="text-placeholder_2"
            message={loadingMessage}
          />
        )}
      </div>
    </div>
  );
}

function StatusLine({ icon, colorClass, message }) {
  return (
    <div className={`flex items-center gap-1.5 text-sm ${colorClass}`}>
      {icon}
      <span>{message}</span>
    </div>
  );
}
