"use client";

import React, { useState } from "react";
import { Button } from "../Button";

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------

/**
 * @typedef {Object} SuggestionProps
 * @property {string} [title] - Heading of the suggestion card.
 * @property {string} [subtitle] - Short line shown under the title.
 * @property {string} [improvedVersion] - Suggested text shown in the "Improved version" box.
 * @property {string} [whyThisImprovement] - Explains why the change is an improvement.
 * @property {string[]} [whatImproved] - List of things this suggestion improves.
 */

// --------------------------------------------------------------------------
// Defaults
// --------------------------------------------------------------------------

const DEFAULT_TITLE = "Make your opening sentence stronger";

const DEFAULT_SUBTITLE =
  "A clear, confident opening keeps readers engaged from the first line.";

const DEFAULT_IMPROVED_VERSION =
  "Results-driven professional with 5+ years of experience delivering high-quality projects on time and within budget.";

const DEFAULT_WHY_THIS_IMPROVEMENT =
  "The improved version is clearer and more specific. It highlights measurable value, which makes it more convincing and easier to scan.";

const DEFAULT_WHAT_IMPROVED = [
  "Clearer and more concise wording",
  "Stronger, action-oriented language",
  "Highlights experience and measurable value",
  "Better readability and flow",
];

// --------------------------------------------------------------------------
// Sub components
// --------------------------------------------------------------------------

/**
 * Single row inside the "what improved" list.
 *
 * @param {{ title: string }} props
 */
const WhatImproved = ({ title }) => {
  return (
    <div className="p-space-3 bg-green-500/5 rounded-[clamp(0.5rem,calc(0.376vw+0.412rem),0.75rem)] hover:before:absolute hover:before:left-0 hover:before:top-0 hover:before:h-full hover:before:w-0.5 hover:before:-translate-x-full hover:before:bg-green-500 text-[clamp(0.75rem,calc(0.188vw+0.706rem),0.875rem)] font-semibold font-primary flex items-center gap-space-2 mt-[clamp(0.75rem,calc(0.188vw+0.706rem),0.875rem)]">
      <div className="flex items-center justify-center max-sm:hidden size-9.5 text-body bg-green-500/5 border border-green-500/5 rounded-lg text-green-500/60">
        <i className="fi fi-rr-memo-circle-check"></i>
      </div>
      {title}
    </div>
  );
};

// --------------------------------------------------------------------------
// Component
// --------------------------------------------------------------------------

/**
 * Card that shows an improved version of some text, the reason behind it,
 * and a list of what got better.
 *
 * @param {SuggestionProps} props
 */
const Suggestion = ({
  title = DEFAULT_TITLE,
  subtitle = DEFAULT_SUBTITLE,
  improvedVersion = DEFAULT_IMPROVED_VERSION,
  whyThisImprovement = DEFAULT_WHY_THIS_IMPROVEMENT,
  whatImproved = DEFAULT_WHAT_IMPROVED,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`flex flex-col gap-[clamp(1rem,calc(1.502vw+0.648rem),2rem)] rounded-[clamp(0.5rem,calc(0.376vw+0.412rem),0.75rem)] bg-orange-500/5 relative overflow-hidden py-space-3 px-[clamp(0.75rem,calc(0.376vw+0.662rem),1rem)] ${
        isOpen
          ? "before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:-translate-x-full before:bg-orange-500"
          : "hover:before:absolute hover:before:left-0 hover:before:top-0 hover:before:h-full hover:before:w-0.5 hover:before:-translate-x-full hover:before:bg-orange-500"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-2 w-full">
          <div className="flex items-center justify-center max-sm:hidden size-9.5 text-body bg-orange-500/5 border border-orange-500/5 rounded-lg text-orange-500/60">
            <i className="fi fi-rr-lightbulb-exclamation"></i>
          </div>

          <div className="w-full">
            <h3 className="text-[clamp(0.875rem,calc(0.188vw+0.831rem),1rem)] font-semibold font-primary mb-space-1">
              {title}
            </h3>
            <p className="text-[clamp(0.75rem,calc(0.188vw+0.706rem),0.875rem)] text-neutral-400">
              {subtitle}
            </p>
          </div>
        </div>

        <div
          className={`size-11 hover:bg-orange-500/5 rounded-lg flex items-center justify-center text-orange-500/60 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <i className="fi fi-rr-angle-small-down"></i>
        </div>
      </div>

      {/* Improved version */}
      <div>
        <h4 className="text-[clamp(0.75rem,calc(0.188vw+0.706rem),0.875rem)] font-medium mb-[clamp(0.5rem,calc(0.376vw+0.412rem),0.75rem)] text-neutral-500/80">
          Improved version
        </h4>

        <div className="min-h-[clamp(7.5rem,calc(1.878vw+7.06rem),8.75rem)] text-[clamp(0.875rem,calc(0.188vw+0.831rem),1rem)] font-medium font-primary leading-[24px] bg-white border border-neutral-500/10 rounded-lg w-full p-[clamp(0.75rem,calc(0.376vw+0.662rem),1rem)] flex flex-col justify-between">
          {improvedVersion}

          <div className="flex justify-end mt-[clamp(1.25rem,calc(1.127vw+0.986rem),2rem)] gap-space-5">
            <Button variant="text" className="text-red-500 hover:text-red-700">
              Ignore
            </Button>
            <Button>Apply Changes</Button>
          </div>
        </div>
      </div>

      {/* Why this improvement + what improved */}
      <div>
        <div>
          <h4 className="text-[clamp(0.75rem,calc(0.188vw+0.706rem),0.875rem)] font-medium mb-space-2 text-neutral-500/80">
            Why this Improvements??
          </h4>
          <p className="text-[clamp(0.75rem,calc(0.188vw+0.706rem),0.875rem)] text-neutral-900">
            {whyThisImprovement}
          </p>
        </div>

        <div className="flex flex-col gap-[clamp(0.5rem,calc(0.376vw+0.412rem),0.75rem)]">
          {whatImproved.map((item) => (
            <WhatImproved key={item} title={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Suggestion;
