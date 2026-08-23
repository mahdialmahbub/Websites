// app/components/ui/SearchBar.jsx
"use client";

import React, { useState, useEffect, useId } from "react";
import { useDebounce } from "@/app/hooks/useDebounce";

const SearchBar = ({
  placeholder = "Search for anything tech...",
  value: controlledValue, // parent theke control korte chaile pass koro
  defaultValue = "", // uncontrolled hole starting value
  onChange, // প্রতি keystroke-e fire hoy (instant, UI update-er জন্য)
  onSearch, // debounce howার পর fire hoy (API call-er জন্য)
  debounceMs = 400,
  isLoading = false,
  className = "",
}) => {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = isControlled ? controlledValue : internalValue;

  const debouncedValue = useDebounce(value, debounceMs);
  const inputId = useId();

  // user typing thamle e (debounced) shudhu tokhon backend call
  useEffect(() => {
    onSearch?.(debouncedValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (!isControlled) setInternalValue(newValue);
    onChange?.(newValue);
  };

  const handleClear = () => {
    if (!isControlled) setInternalValue("");
    onChange?.("");
    onSearch?.("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") handleClear();
    if (e.key === "Enter") onSearch?.(value); // debounce bypass kore immediate search
  };

  return (
    <div
      className={`p-space-3 bg-background border-[1.5px] border-secondary/20 rounded-lg flex items-center gap-space-3 w-100 focus-within:border-secondary/50 transition-colors ${className}`}
    >
      <label htmlFor={inputId} className="sr-only">
        {placeholder}
      </label>

      {isLoading ? (
        <i className="fi fi-rr-spinner animate-spin text-secondary text-[20px] flex items-center justify-center"></i>
      ) : (
        <i className="fi fi-br-search text-secondary text-[20px] flex items-center justify-center"></i>
      )}

      <input
        id={inputId}
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="w-full p-0 bg-transparent placeholder:text-placeholder_3 outline-none"
        placeholder={placeholder}
        autoComplete="off"
      />

      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="text-red-500 flex items-center justify-center"
        >
          <i className="fi fi-rr-cross-circle text-[20px]"></i>
        </button>
      )}
    </div>
  );
};

export default SearchBar;
