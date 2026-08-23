"use client";

import React, { useEffect, useId, useRef, useState } from "react";

/**
 * PhoneInput
 * -----------------------------------------------------------------------
 * Country-code dropdown + phone number field, InputField/Select er design
 * convention follow kore banano (bg-background, border-secondary/20,
 * status messages) — jate app-er baki form field er shathe consistent thake.
 *
 * Backend-e connect kora shohoj kora hoyeche: onChange protibar full
 * payload dey —
 *   { countryCode, dialCode, number, fullNumber, isValid }
 * fullNumber already E.164 format-e thake (e.g. "+8801735999190"),
 * shrudhu setao form.phone-e boshiye dile backend-e pathano jay.
 *
 * USAGE (uncontrolled — shohojh case)
 * -----------------------------------------------------------------------
 * <PhoneInput
 *   title="Phone Number"
 *   required
 *   onChange={(val) =>
 *     setForm((prev) => ({ ...prev, phone: val.fullNumber }))
 *   }
 * />
 *
 * USAGE (controlled — form.countryCode / form.phoneNumber alada rakhte chaile)
 * -----------------------------------------------------------------------
 * <PhoneInput
 *   countryCode={form.countryCode}
 *   number={form.phoneNumber}
 *   onChange={(val) =>
 *     setForm((prev) => ({
 *       ...prev,
 *       countryCode: val.countryCode,
 *       phoneNumber: val.number,
 *       phone: val.fullNumber,
 *     }))
 *   }
 *   showError={submitted && !isValidPhone}
 *   errorMessage="Enter a valid phone number"
 * />
 * -----------------------------------------------------------------------
 */

// Common country dial codes — list ta apnar dorkar moto extend korte paren.
// `format` = digit grouping pattern, e.g. [3, 3, 4] means "123 456 7890".
const DEFAULT_COUNTRIES = [
  { code: "BD", name: "Bangladesh", dialCode: "+880", maxLength: 10, format: [4, 6] },
  { code: "IN", name: "India", dialCode: "+91", maxLength: 10, format: [5, 5] },
  { code: "PK", name: "Pakistan", dialCode: "+92", maxLength: 10, format: [3, 7] },
  { code: "US", name: "United States", dialCode: "+1", maxLength: 10, format: [3, 3, 4] },
  { code: "GB", name: "United Kingdom", dialCode: "+44", maxLength: 10, format: [4, 6] },
  { code: "AE", name: "United Arab Emirates", dialCode: "+971", maxLength: 9, format: [2, 3, 4] },
  { code: "SA", name: "Saudi Arabia", dialCode: "+966",  maxLength: 9, format: [2, 3, 4] },
  { code: "MY", name: "Malaysia", dialCode: "+60", maxLength: 10, format: [3, 3, 4] },
  { code: "SG", name: "Singapore", dialCode: "+65", maxLength: 8, format: [4, 4] },
  { code: "AU", name: "Australia", dialCode: "+61", maxLength: 9, format: [3, 3, 3] },
];

// Groups raw digits according to a country's `format` pattern —
// e.g. formatNumber("1234567890", [3, 3, 4]) -> "123 456 7890"
const formatNumber = (digits, groups) => {
  if (!groups || groups.length === 0 || !digits) return digits;

  let result = "";
  let cursor = 0;

  for (const size of groups) {
    if (cursor >= digits.length) break;
    result += (result ? " " : "") + digits.slice(cursor, cursor + size);
    cursor += size;
  }

  // Any leftover digits beyond the defined groups (shouldn't normally
  // happen since maxLength already clamps input) still get shown.
  if (cursor < digits.length) {
    result += (result ? " " : "") + digits.slice(cursor);
  }

  return result;
};

export default function PhoneInput({
  // Label / basic config
  title = "",
  required = false,

  // Country list — replace/extend if you need more countries
  countries = DEFAULT_COUNTRIES,
  defaultCountryCode = "BD",

  // Controlled usage — pass both together if the parent wants to own state
  countryCode: controlledCountryCode,
  number: controlledNumber,

  // Fires on every change (country switch or typing) with a rich payload
  onChange,

  placeholder = "Enter your Phone Number",
  disabled = false,

  // Status messages — same pattern as InputField/CounterField
  showInfo = false,
  infoMessage = "Information message",

  showError = false,
  errorMessage = "Enter a valid phone number",

  showSuccess = false,
  successMessage = "Looks good!",

  showLoading = false,
  loadingMessage = "Checking...",
}) {
  const isControlled =
    controlledCountryCode !== undefined && controlledNumber !== undefined;

  const [internalCountryCode, setInternalCountryCode] = useState(defaultCountryCode);
  const [internalNumber, setInternalNumber] = useState("");

  const countryCode = isControlled ? controlledCountryCode : internalCountryCode;
  const number = isControlled ? controlledNumber : internalNumber;

  const selectedCountry =
    countries.find((c) => c.code === countryCode) || countries[0];

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const inputId = useId();

  // Close dropdown on outside click — same pattern as Select.jsx
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const emitChange = (nextCountry, nextNumber) => {
    const digitsOnly = nextNumber.replace(/\D/g, "");
    const fullNumber = digitsOnly ? `${nextCountry.dialCode}${digitsOnly}` : "";
    const isValid = nextCountry.maxLength
      ? digitsOnly.length === nextCountry.maxLength
      : digitsOnly.length > 0;

    onChange?.({
      countryCode: nextCountry.code,
      dialCode: nextCountry.dialCode,
      number: digitsOnly,
      fullNumber,
      isValid,
    });
  };

  const handleCountrySelect = (country) => {
    if (!isControlled) setInternalCountryCode(country.code);
    setIsOpen(false);
    emitChange(country, number);
  };

  const handleNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, ""); // digits chara baki shob bad
    const trimmed = selectedCountry.maxLength
      ? raw.slice(0, selectedCountry.maxLength)
      : raw;

    if (!isControlled) setInternalNumber(trimmed);
    emitChange(selectedCountry, trimmed);
  };

  const borderClass = showError
    ? "border-red-500 focus-within:border-red-500"
    : showSuccess
      ? "border-emerald-500 focus-within:border-emerald-500"
      : "border-secondary/20 focus-within:border-secondary/50";

  return (
    <div className="h-full self-baseline">
      {(title || required) && (
        <div className="flex items-center justify-between mb-2 px-space-1">
          {title && (
            <label
              htmlFor={inputId}
              className="font-semibold font-primary text-size-h6 text-foreground"
            >
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

      <div
        className={`flex items-center bg-background border-[1.5px] rounded-lg transition-colors ${borderClass} ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {/* Country code dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            disabled={disabled}
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex items-center gap-2 px-space-3 py-space-3 text-placeholder_3 text-size-h6 disabled:cursor-not-allowed"
          >
            <span>{selectedCountry.dialCode}</span>
            <i
              className={`fi fi-rr-angle-small-down text-secondary transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            ></i>
          </button>

          {isOpen && (
            <ul className="absolute z-20 mt-space-2 min-w-[220px] max-h-64 overflow-y-auto bg-[#0B1120] border border-secondary/20 rounded-lg shadow-lg">
              {countries.map((c) => (
                <li
                  key={c.code}
                  onClick={() => handleCountrySelect(c)}
                  className={`flex items-center gap-2.5 px-space-3 py-space-2 text-size-large cursor-pointer hover:bg-secondary/10 ${
                    c.code === selectedCountry.code
                      ? "text-secondary"
                      : "text-placeholder_3"
                  }`}
                >
                  <span className="flex-1">{c.name}</span>
                  <span className="">{c.dialCode}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-secondary/20" />

        {/* Phone number field */}
        <div className="flex items-center gap-2.5 flex-1 px-space-3 py-space-3">
          <i className="fi fi-sr-phone-call text-secondary text-size-h6"></i>
          <label htmlFor={inputId} className="sr-only">
            {placeholder}
          </label>
          <input
            id={inputId}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            value={formatNumber(number, selectedCountry.format)}
            onChange={handleNumberChange}
            disabled={disabled}
            placeholder={placeholder}
            className="w-full bg-transparent outline-none placeholder:text-placeholder_3 text-foreground disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {/* Status messages — InputField/CounterField er shathe exact same block */}
      <div className="mt-space-3 flex flex-col gap-space-3">
        {showInfo && (
          <StatusLine
            icon={<i className="fi fi-rr-info text-size-large text-secondary" />}
            colorClass="text-secondary"
            message={infoMessage}
          />
        )}
        {showError && (
          <StatusLine
            icon={<i className="fi fi-rr-cross-circle text-size-large text-red" />}
            colorClass="text-red"
            message={errorMessage}
          />
        )}
        {showSuccess && (
          <StatusLine
            icon={<i className="fi fi-rr-check-circle text-size-large text-green" />}
            colorClass="text-green"
            message={successMessage}
          />
        )}
        {showLoading && (
          <StatusLine
            icon={<i className="fi fi-rr-loading text-size-large text-placeholder_2" />}
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
