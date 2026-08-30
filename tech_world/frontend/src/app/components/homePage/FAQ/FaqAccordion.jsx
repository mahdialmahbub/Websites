"use client";

import React, { useState } from "react";

const FaqAccordion = ({
  ques = "How do I book a car?",
  ans = "You can book a car directly from our website. Just choose your location, dates, and select a car that fits your needs — then follow the checkout steps to confirm your booking.",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`group relative w-full max-w-[800px] overflow-hidden rounded-2xl border transition-all duration-300 ${
        isOpen
          ? "border-secondary/40 bg-secondary/[0.07] shadow-lg shadow-secondary/5"
          : "border-secondary/20 bg-secondary/[0.03] hover:border-secondary/30 hover:bg-secondary/[0.05]"
      }`}
    >
      {/* Active Left Indicator */}
      <span
        className={`absolute left-0 top-0 h-full w-1.5 bg-secondary transition-all duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Question Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left sm:px-6 sm:py-6"
      >
        {/* Question */}
        <h6
          className={`font-medium text-size-h5 leading-7 transition-colors duration-300 ${
            isOpen ? "text-secondary" : "text-foreground"
          }`}
        >
          {ques}
        </h6>

        {/* Toggle Icon */}
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
            isOpen
              ? "rotate-180 border-secondary bg-secondary text-white"
              : "border-secondary/20 bg-secondary/5 text-foreground group-hover:border-secondary/40 group-hover:text-secondary"
          }`}
        >
          <i className="fi fi-rr-angle-small-down text-size-h5" />
        </span>
      </button>

      {/* Answer */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 sm:px-6 sm:pb-6">
            <div className="h-px w-full bg-secondary/10" />

            <p className="pt-5 text-size-h6 leading-7 text-placeholder sm:max-w-[90%]">
              {ans}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqAccordion;
