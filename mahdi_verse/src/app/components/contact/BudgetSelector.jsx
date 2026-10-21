"use client";

import { BUDGET_OPTIONS } from "@/src/lib/budgetOptions";
import { useRef, useState } from "react";
import FadeUp from "../motions/FadeUp";

// Only the shadows live here. Everything else is inline Tailwind.
const SHADOW_STYLES = `
  .budget-pill--selected {
    box-shadow:
      1px 1px 2px rgba(125, 115, 255, 0.3),
      -1px -1px 2px rgba(91, 83, 209, 0.5),
      inset 1px -1px 2px rgba(91, 83, 209, 0.2),
      inset -1px 1px 2px rgba(91, 83, 209, 0.2),
      inset -1px -1px 2px rgba(125, 115, 255, 0.5),
      inset 1px 1px 3px rgba(91, 83, 209, 0.9);
  }
  .budget-pill--unselected {
    box-shadow:
      1px 1px 2px rgba(202, 201, 209, 0.9),
      -1px -1px 2px rgba(225, 225, 255, 0.9),
      1px -1px 2px rgba(202, 201, 209, 0.2),
      -1px 1px 2px rgba(202, 201, 209, 0.2),
      inset -1px -1px 2px rgba(202, 201, 209, 0.5),
      inset 1px 1px 2px rgba(255, 255, 255, 0.3);
  }
  .budget-pill--unselected:hover {
    box-shadow:
      1px 1px 2px rgba(255, 255, 255, 0.3),
      -1px -1px 2px rgba(202, 201, 209, 1),
      inset 1px -1px 2px rgba(202, 201, 209, 0.2),
      inset -1px 1px 2px rgba(202, 201, 209, 0.2),
      inset -1px -1px 2px rgba(255, 255, 255, 0.9),
      inset 1px 1px 3px rgba(202, 201, 209, 0.9);
  }
`;

const BASE_CLASSES =
  "rounded-sm px-3 py-2 text-sm font-semibold transition-[box-shadow,background-color,color] duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f5bed] dark:focus-visible:outline-none dark:!shadow-none";

const SELECTED_CLASSES = "budget-pill--selected bg-[#6f5bed] text-[#f5f4ff]";

const UNSELECTED_CLASSES =
  "budget-pill--unselected cursor-pointer bg-gradient-to-br from-[#fcfbff] to-[#e4e3f2] text-primary-900/70 hover:bg-none hover:bg-[#f5f4ff] dark:bg-none dark:bg-[rgba(108,99,255,0.05)] dark:text-primary-100/70 dark:hover:bg-[rgba(108,99,255,0.2)]";

/**
 * Props:
 * - name:       hidden input er name (form submit e ei key diye value jabe). Default "budget"
 * - value:      dile controlled mode (parent state control kore, form reset e kaje lage)
 * - defaultValue: uncontrolled mode e initial value
 * - onChange:   option select hole call hobe
 * - labelledBy: visible label er id (aria-labelledby). Na dile `label` prop use hobe
 */
export default function BudgetSelector({
  label = "Budget",
  labelledBy,
  name = "budget",
  options = BUDGET_OPTIONS,
  value,
  defaultValue = options[0],
  onChange,
}) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const selected = isControlled ? value : internalValue;
  const buttonRefs = useRef([]);

  const handleSelect = (option) => {
    if (!isControlled) setInternalValue(option);
    onChange?.(option);
  };

  // Radio group keyboard support: arrows move + select, Home/End jump.
  const handleKeyDown = (e, index) => {
    const last = options.length - 1;
    let next = null;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      next = index === last ? 0 : index + 1;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      next = index === 0 ? last : index - 1;
    } else if (e.key === "Home") {
      next = 0;
    } else if (e.key === "End") {
      next = last;
    }

    if (next === null) return;
    e.preventDefault();
    handleSelect(options[next]);
    buttonRefs.current[next]?.focus();
  };

  return (
    <div className="w-full max-w-xl mt-space-2">
      <style>{SHADOW_STYLES}</style>

      {/* Buttons form data te jay na, tai selected value ekhane hidden input e thake */}
      <input type="hidden" name={name} value={selected} />

      <div
        role="radiogroup"
        aria-label={labelledBy ? undefined : label}
        aria-labelledby={labelledBy}
        className="flex flex-wrap gap-4"
      >
        {options.map((option, index) => {
          const isSelected = option === selected;
          return (
            <FadeUp key={index} delay={index * 0.1}>
              <button
                key={option}
                ref={(el) => {
                  buttonRefs.current[index] = el;
                }}
                type="button"
                role="radio"
                aria-checked={isSelected}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => handleSelect(option)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`${BASE_CLASSES} ${
                  isSelected ? SELECTED_CLASSES : UNSELECTED_CLASSES
                }`}
              >
                {option}
              </button>
            </FadeUp>
          );
        })}
      </div>
    </div>
  );
}
