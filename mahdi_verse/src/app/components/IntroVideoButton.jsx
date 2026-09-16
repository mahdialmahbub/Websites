"use client";

import React from "react";

const IntroVideoButton = ({
  label = "Intro Video",
  onClick,
  className = "",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`
        group relative inline-flex
        items-center h-13
        gap-1.5
        rounded-lg

        border border-white/10
        bg-[#141A26]

        px-[24px] py-4.5

        text-white

        shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]
        transition-all
        duration-400
        ease-[cubic-bezier(0.22,1,0.36,1)]

        hover:border-cyan-400/25
        hover:bg-[#171E2B]
        hover:shadow-[0_14px_35px_rgba(0,0,0,0.30),0_0_25px_rgba(34,211,238,0.06)]

        active:scale-[0.98]

        ${className}
      `}
    >
      {/* Ambient glow */}
      <span
        className="
          pointer-events-none
          absolute
          left-8
          top-1/2
          size-12
          -translate-y-1/2
          rounded-full
          bg-cyan-400/6
          blur-xl
          opacity-0
          transition-opacity
          duration-400
          group-hover:opacity-100
        "
      />

      {/* Play button */}
      <span
        className="
          relative
          z-10
          flex
          size-7
          shrink-0
          items-center
          justify-center
          rounded-full

          bg-white
          text-[#111827]

          shadow-[0_5px_18px_rgba(255,255,255,0.10)]

          transition-all
          duration-400
          ease-[cubic-bezier(0.22,1,0.36,1)]

          group-hover:scale-105
          group-hover:shadow-[0_8px_24px_rgba(255,255,255,0.16)]
        "
      >
        <i className="fi fi-sr-play text-size-xs translate-x-px" />
      </span>

      {/* Label */}
      <span
        className="
          relative
          z-10
          font-primary
          text-size-sm
          font-semibold
          tracking-[-0.01em]
          text-white/95
        "
      >
        {label}
      </span>

    </button>
  );
};

export default IntroVideoButton;