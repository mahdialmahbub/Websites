// components/dashboard/products/ProductStatusDropdown.jsx
"use client";

import { useState, useRef, useEffect } from "react";

const statusStyles = {
  Active: "bg-green-500/10 text-green-500",
  Paused: "bg-red-500/10 text-red-500",
  Draft: "bg-placeholder_2/10 text-placeholder_2",
};

const STATUS_OPTIONS = ["Active", "Paused", "Draft"];

const ProductStatusDropdown = ({ status = "Active", onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-space-1 px-space-4 py-space-1 rounded-full text-size-large font-semibold capitalize ${statusStyles[status]}`}
      >
        {status}
        <i
          className={`fi fi-rr-angle-small-down transition-transform text-size-h6 ${isOpen ? "rotate-180" : ""}`}
        ></i>
      </button>

      {isOpen && (
        <ul className="absolute z-20 mt-space-2 min-w-space-12 bg-[#0B1120] border border-secondary/20 rounded-lg overflow-hidden shadow-lg">
          {STATUS_OPTIONS.map((opt) => (
            <li
              key={opt}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className="px-space-3 py-space-2 text-size-large capitalize cursor-pointer hover:bg-secondary/10 text-placeholder_2"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductStatusDropdown;
