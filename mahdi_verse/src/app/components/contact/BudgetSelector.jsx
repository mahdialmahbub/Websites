"use client";

import { useState } from "react";

const DEFAULT_OPTIONS = [
  "Less than $5K",
  "$5K - $10K",
  "$10K - $20K",
  "$20K - $50K",
  "More than $50K",
];

export default function BudgetSelector({
  label = "Budget",
  options = DEFAULT_OPTIONS,
  defaultValue = DEFAULT_OPTIONS[0],
  onChange,
}) {
  const [selected, setSelected] = useState(defaultValue);

  const handleSelect = (option) => {
    setSelected(option);
    onChange?.(option);
  };

  return (
    <div className="w-full max-w-xl mt-space-2">
      <style>{`
        .budget-pill {
          transition: box-shadow 0.2s ease, background 0.2s ease, color 0.2s ease;
        }
        .budget-pill--selected {
          background: #6f5bed;
          color: #f5f4ff;
          box-shadow:
            1px 1px 2px rgba(125, 115, 255, 0.3),
            -1px -1px 2px rgba(91, 83, 209, 0.5),
            inset 1px -1px 2px rgba(91, 83, 209, 0.2),
            inset -1px 1px 2px rgba(91, 83, 209, 0.2),
            inset -1px -1px 2px rgba(125, 115, 255, 0.5),
            inset 1px 1px 3px rgba(91, 83, 209, 0.9);
        }
        .budget-pill--unselected {
          background: linear-gradient(to bottom right, #fcfbff, #e4e3f2);
          cursor: pointer;
          box-shadow:
            1px 1px 2px rgba(202, 201, 209, 0.9),
            -1px -1px 2px rgba(225, 225, 255, 0.9),
            1px -1px 2px rgba(202, 201, 209, 0.2),
            -1px 1px 2px rgba(202, 201, 209, 0.2),
            inset -1px -1px 2px rgba(202, 201, 209, 0.5),
            inset 1px 1px 2px rgba(255, 255, 255, 0.3);
        }
        .budget-pill--unselected:hover {
          background: #f5f4ff;
          box-shadow:
            1px 1px 2px rgba(255, 255, 255, 0.3),
            -1px -1px 2px rgba(202, 201, 209, 1),
            inset 1px -1px 2px rgba(202, 201, 209, 0.2),
            inset -1px 1px 2px rgba(202, 201, 209, 0.2),
            inset -1px -1px 2px rgba(255, 255, 255, 0.9),
            inset 1px 1px 3px rgba(202, 201, 209, 0.9);
        }
        .dark .budget-pill--unselected {
          background: rgba(111, 91, 237, 0.05);
          box-shadow: none;
        }
        .dark .budget-pill--unselected:hover {
          background: rgba(111, 91, 237, 0.2);
          box-shadow: none;
        }
      `}</style>

      <div
        role="radiogroup"
        aria-label={label}
        className="flex flex-wrap gap-4"
      >
        {options.map((option) => {
          const isSelected = option === selected;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => handleSelect(option)}
              className={`budget-pill rounded-sm px-3 py-2 text-sm font-semibold text-primary-900 dark:text-primary-100 ${
                isSelected ? "budget-pill--selected" : "budget-pill--unselected"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}