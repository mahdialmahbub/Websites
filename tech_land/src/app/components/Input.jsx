"use client";

import React, { forwardRef, useId, useState, useCallback } from "react";

/**
 * ============================================================================
 * Input Component — fully controlled from parent, API-ready
 * ============================================================================
 *
 * Design goal: match the reference (dark navy field, soft rounded corners,
 * muted label above, subtle placeholder). Behavior goal: parent owns 100%
 * of the state (value, error, loading) so this component never has to know
 * where the data comes from — a local form, an API call, react-hook-form,
 * anything.
 *
 * Props:
 *  - label            : string  — label shown above the field (e.g. "Name")
 *  - value             : string  — current value, parent fully controls this
 *  - onChange          : (value, event) => void — fires on every keystroke
 *  - onValidate        : (value) => void — optional, fires on blur (handy
 *                        for triggering an async API check)
 *  - error             : string | null — error message from parent
 *  - success           : string | null — success/help message from parent
 *  - helperText        : string  — neutral helper text (shown when no
 *                        error/success)
 *  - isLoading         : boolean — shows a spinner (e.g. API call in flight)
 *  - leftIcon          : ReactNode — icon rendered on the left inside the field
 *  - rightIcon         : ReactNode — icon rendered on the right (hidden while
 *                        isLoading)
 *  - wrapperClassName  : string  — extra classes for the outer wrapper
 *  - className         : string  — extra classes for the <input> itself
 *  - ...rest           : any other standard <input> props (type, maxLength,
 *                        autoComplete, disabled, required, name, etc.) are
 *                        passed straight through to the <input>
 *
 * forwardRef -> works with react-hook-form's `register()` or any ref-based
 * library out of the box.
 */

const Input = forwardRef(function Input(
  {
    label,
    value,
    onChange,
    onValidate,
    error,
    success,
    helperText,
    isLoading = false,
    leftIcon,
    rightIcon,
    wrapperClassName = "",
    className = "",
    id,
    disabled,
    required,
    onBlur,
    onFocus,
    ...rest
  },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [focused, setFocused] = useState(false);

  const handleChange = useCallback(
    (e) => {
      onChange(e.target.value, e);
    },
    [onChange]
  );

  const handleBlur = useCallback(
    (e) => {
      setFocused(false);
      onBlur?.(e);
      onValidate?.(value);
    },
    [onBlur, onValidate, value]
  );

  const handleFocus = useCallback(
    (e) => {
      setFocused(true);
      onFocus?.(e);
    },
    [onFocus]
  );

  const describedBy = error
    ? `${inputId}-error`
    : success
    ? `${inputId}-success`
    : helperText
    ? `${inputId}-helper`
    : undefined;

  return (
    <div className={`w-full ${wrapperClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-slate-400"
        >
          {label}
          {required && <span className="ml-0.5 text-rose-400">*</span>}
        </label>
      )}

      <div
        className={[
          "relative flex items-center rounded-xl border bg-[#0B0F1A] transition-colors",
          error
            ? "border-rose-500/70"
            : success
            ? "border-emerald-500/60"
            : focused
            ? "border-slate-500"
            : "border-slate-800",
          disabled ? "opacity-50" : "",
        ].join(" ")}
      >
        {leftIcon && (
          <span className="pl-3.5 text-slate-500 flex items-center">{leftIcon}</span>
        )}

        <input
          ref={ref}
          id={inputId}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={[
            "peer w-full bg-transparent px-4 py-3 text-[15px] text-slate-100",
            "placeholder:text-slate-600 outline-none disabled:cursor-not-allowed",
            leftIcon ? "pl-2" : "",
            className,
          ].join(" ")}
          {...rest}
        />

        {isLoading && (
          <span className="pr-3.5 flex items-center">
            <svg
              className="h-4 w-4 animate-spin text-slate-500"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          </span>
        )}

        {!isLoading && rightIcon && (
          <span className="pr-3.5 text-slate-500 flex items-center">{rightIcon}</span>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-sm text-rose-400">
          {error}
        </p>
      )}
      {!error && success && (
        <p id={`${inputId}-success`} className="mt-1.5 text-sm text-emerald-400">
          {success}
        </p>
      )}
      {!error && !success && helperText && (
        <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-slate-500">
          {helperText}
        </p>
      )}
    </div>
  );
});

export default Input;
