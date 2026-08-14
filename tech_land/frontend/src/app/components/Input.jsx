"use client";

import { useState } from "react";

export default function InputField({
  // Label / basic config
  title = "",
  name,
  placeholder = "Placeholder",
  required = false,

  // Icon inside the input
  showIcon = false,
  icon = "fi fi-sr-user",

  // Controlled input (optional — component also works uncontrolled)
  value,
  defaultValue,
  onChange,
  type = "text",
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
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleChange = (e) => {
    if (!isControlled) setInternalValue(e.target.value);
    onChange?.(e);
  };

  // Border color reacts to the highest-priority active status
  const borderClass = showError
    ? "border-red-500 focus-within:border-red-500"
    : showSuccess
      ? "border-emerald-500 focus-within:border-emerald-500"
      : "border-secondary focus-within:border-secondary/80";

  return (
    <div className="w-full h-full">
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

      {/* Input row */}
      <div
        className={`flex items-center gap-2.5 rounded-xl bg-background border px-4 py-3 transition-colors ${borderClass} ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {showIcon && icon && (
          <i className={`${icon} text-size-h6 text-[#2BE7C4]/70`} />
        )}
        <input
          type={type}
          name={name}
          value={currentValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full bg-background text-foreground placeholder-placeholder_3 outline-none text-sm"
        />
      </div>

      {/* Status messages */}
      <div className="mt-space-3 flex flex-col gap-space-3">
        {showInfo && (
          <StatusLine
            icon={<i className="fi fi-rr-info text-[14px] text-secondary" />}
            colorClass="text-secondary"
            message={infoMessage}
          />
        )}
        {showError && (
          <StatusLine
            icon={<i className="fi fi-rr-cross-circle text-[14px] text-red" />}
            colorClass="text-red"
            message={errorMessage}
          />
        )}
        {showSuccess && (
          <StatusLine
            icon={
              <i className="fi fi-rr-check-circle text-[14px] text-green" />
            }
            colorClass="text-green"
            message={successMessage}
          />
        )}
        {showLoading && (
          <StatusLine
            icon={
              <i className="fi fi-rr-loading text-[14px] text-placeholder_2" />
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
