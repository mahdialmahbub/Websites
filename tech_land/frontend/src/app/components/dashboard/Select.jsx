// components/ui/Select.jsx
"use client";

import React, { useState, useRef, useEffect } from "react";

const Select = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const selectedLabel =
    options?.find((opt) => opt.value === value)?.label || label;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2.5 p-space-3 rounded-lg bg-[#0C1221] border-[1.5px] border-secondary/20 text-placeholder_3 text-size-h6 focus-within:border-secondary/50"
      >
        <span>{selectedLabel}</span>
        <i
          className={`fi fi-rr-angle-small-down transition-transform text-secondary ${isOpen ? "rotate-180" : ""} text-size-h6`}
        ></i>
      </button>

      {isOpen && (
        <ul className="absolute z-20 mt-space-2 min-w-space-12 bg-[#0B1120] border border-secondary/20 rounded-lg overflow-hidden shadow-lg">
          {options?.map((opt) => (
            <li
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`px-space-3 py-space-2 text-size-large cursor-pointer hover:bg-secondary/10 ${
                opt.value === value ? "text-secondary" : "text-placeholder_2"
              }`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Select;
