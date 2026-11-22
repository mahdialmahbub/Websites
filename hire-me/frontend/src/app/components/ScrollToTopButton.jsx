"use client";

import { useCallback, useEffect, useState } from "react";

export default function ScrollToTopButton({
  threshold = 40, // page er bottom theke koto px er moddhe thakle button dekhabe
  label = "Go to top",
  className = "",
}) {
  const [visible, setVisible] = useState(false);

  // Check korbe user page er ekdom last e pouchhechhe kina.
  const updateVisibility = useCallback(() => {
    const doc = document.documentElement;
    const scrollTop = window.scrollY || doc.scrollTop;
    const maxScroll = doc.scrollHeight - window.innerHeight;

    // Page scroll hoy na hole button dekhabe na.
    setVisible(maxScroll > 1 && scrollTop >= maxScroll - threshold);
  }, [threshold]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    updateVisibility();

    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    // Content load hoye page height change hole abar check korbe.
    let resizeObserver;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(updateVisibility);
      resizeObserver.observe(document.body);
    }

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
      resizeObserver?.disconnect();
    };
  }, [updateVisibility]);

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <button
      type="button"
      aria-label={label}
      // `inert` hidden obosthay button ke focus, click ar screen reader theke shoriye dey.
      // (aria-hidden + focusable = browser er error, tai eta use kora hoyeche.)
      inert={!visible}
      onClick={scrollToTop}
      className={`
        group fixed bottom-6 right-4 z-50
        flex flex-col items-center gap-1
        transition-all duration-300
        focus-visible:outline-none
        md:right-6
        ${
          visible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }
        ${className}
      `}
    >
      <span
        className="
          inline-flex size-11 items-center justify-center
          rounded-full border border-slate-200
          bg-white text-xl text-slate-700 shadow-md
          transition-all duration-200
          group-hover:bg-slate-100 group-hover:shadow-lg
          group-focus-visible:ring-2 group-focus-visible:ring-indigo-400
          group-active:scale-95
          md:size-12
        "
      >
        <i
          aria-hidden="true"
          className="fi fi-rr-arrow-small-up transition-transform duration-200 group-hover:-translate-y-0.5"
        />
      </span>

      <span
        className="
          rounded-full bg-white/90 px-2 py-0.5
          text-[10px] font-medium leading-none text-slate-600
          shadow-sm backdrop-blur
        "
      >
        {label}
      </span>
    </button>
  );
}
