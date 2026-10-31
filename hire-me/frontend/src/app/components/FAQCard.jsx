"use client";

import { useId, useState } from "react";
import { icons } from "../../../assets/iconCollection";
import { cn } from "../lib/cn";

/* -------------------------------------------------------------------------- */
/*  Default values (prop na dile ei gulo dekhabe)                             */
/* -------------------------------------------------------------------------- */
const DEFAULT_FAQ = {
  question: "Question",
  answer: "Answer",
};

/**
 * Expandable FAQ item (accordion). Click ba keyboard (Enter/Space) diye open/close hoy.
 *
 * @param {Object}   props
 * @param {string}   [props.question]    Question text
 * @param {string}   [props.answer]      Answer text
 * @param {boolean}  [props.defaultOpen] Prothome open thakbe ki na
 * @param {string}   [props.className]   Card-er upor extra style
 * @param {(isOpen: boolean) => void} [props.onToggle] Open/close hole call hoy
 */
const FAQCard = ({
  question = DEFAULT_FAQ.question,
  answer = DEFAULT_FAQ.answer,
  defaultOpen = false,
  className,
  onToggle,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Button <-> panel connect korar jonno unique id (screen reader er jonno)
  const uid = useId();
  const buttonId = `${uid}-button`;
  const panelId = `${uid}-panel`;

  const handleToggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    onToggle?.(next);
  };

  return (
    <div className={cn("border-b border-neutral-500/20 px-[clamp(0px,calc(2.727vw-0.545rem),1.5rem)]", className)}>
      {/* Question (poro button, tai keyboard e kaj kore) */}
      <h4>
        <button
          id={buttonId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={handleToggle}
          className="group flex w-full items-center gap-space-4 rounded-md py-space-2 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-primary-200/50"
        >
          <span className="flex-1 text-h4 font-medium group-hover:underline">
            {question}
          </span>

          {/* Icon: open hole 45deg ghure "+" theke "x" hoy */}
          <span
            aria-hidden="true"
            className="flex size-11 shrink-0 items-center justify-center rounded-full text-[12px] transition-colors group-hover:bg-primary-300/5 group-active:bg-primary-300/10"
          >
            <i
              className={cn(
                icons.addBig,
                "transition-transform duration-300 ease-out motion-reduce:transition-none",
                isOpen && "rotate-45",
              )}
            />
          </span>
        </button>
      </h4>

      {/* Answer: grid-rows 0fr -> 1fr diye smooth height animation */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={cn(
          "grid transition-[grid-template-rows,visibility] duration-300 ease-out motion-reduce:transition-none",
          isOpen ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <p
            className={cn(
              "pb-space-4 pt-space-1 text-lead text-neutral-600 transition-opacity duration-300 motion-reduce:transition-none",
              isOpen ? "opacity-100" : "opacity-0",
            )}
          >
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQCard;