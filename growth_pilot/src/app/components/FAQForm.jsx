"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { assets } from "../assets/assets";

/**
 * A single FAQ accordion item.
 *
 * @param {{
 *   ques: string,           // The question shown in the header
 *   ans: string,            // The answer revealed when the item is open
 *   defaultOpen?: boolean,  // Start expanded (default: false)
 * }} props
 */
const FAQForm = ({ ques, ans, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  const id = useId();
  const buttonId = `${id}-button`;
  const panelId = `${id}-panel`;

  return (
    <div
      className={`w-full rounded-xl border bg-white transition-colors duration-300 hover:bg-secondary2/8 dark:bg-black dark:hover:bg-secondary2/8 ${
        open
          ? "border-secondary2/60 dark:border-secondary2/40"
          : "border-secondary2/30 dark:border-secondary2/20"
      }`}
    >
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((prev) => !prev)}
          className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-xl p-3 text-left md:p-4.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary2/60 dark:focus-visible:ring-secondary2/60"
        >
          <span className="text-[clamp(1rem,0.9545rem+0.2273vw,1.125rem)] font-medium">{ques}</span>
          <i className={`fi fi-rr-angle-small-down text-[clamp(1.375rem,1.2386rem+0.6818vw,1.75rem)] transition-transform duration-300 motion-reduce:transition-none text-secondary2 ${
               open && "rotate-180"
            }`}></i>
        </button>
      </h3>

      {/* grid-rows 0fr -> 1fr animates the height without measuring it in JS */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-[grid-template-rows,visibility] duration-300 ease-in-out motion-reduce:transition-none ${
          open ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p
            className={`px-3 pb-3 text-[clamp(0.875rem,0.8295rem+0.2273vw,1rem)] leading-relaxed text-black/70 transition-opacity duration-300 motion-reduce:transition-none md:px-4.5 md:pb-4.5 dark:text-white/70 ${
              open  ? "opacity-100" : "opacity-0"
            }`}
          >
            {ans}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQForm;
