"use client";

import { useCallback, useEffect, useRef, useState } from "react";

function ScrollButton({ direction, label, disabled, onClick, className = "" }) {
  const isPrev = direction === "prev";

  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`
        group absolute top-1/2 z-20
        inline-flex size-11 -translate-y-1/2
        items-center justify-center
        rounded-full border border-slate-200
        bg-white text-xl text-slate-700 shadow-md
        transition-all duration-200
        hover:bg-slate-100 hover:shadow-lg
        focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-indigo-400
        active:scale-95
        disabled:pointer-events-none disabled:opacity-0
        md:size-12
        ${isPrev ? "-left-5" : "right-1 xl:-right-5"}
        ${className}
      `}
    >
      <i
        aria-hidden="true"
        className={`transition-transform duration-200 ${
          isPrev
            ? "fi fi-rr-arrow-small-left group-hover:-translate-x-0.5"
            : "fi fi-rr-arrow-small-right group-hover:translate-x-0.5"
        }`}
      />
    </button>
  );
}

export default function HorizontalScroller({
  children,
  label = "Scrollable content",
  className = "",
  wrapperClassName = "",
  buttonClassName = "",
  prevButtonClassName = "",
  nextButtonClassName = "",
  showButtons = true,
}) {
  const scrollRef = useRef(null);

  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  // Check the current scroll position.
  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;

    setAtStart(maxScroll <= 1 || el.scrollLeft <= 1);
    setAtEnd(maxScroll <= 1 || el.scrollLeft >= maxScroll - 1);
  }, []);

  // Observe container/card size and dynamically added cards.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let resizeObserver;

    const observeElements = () => {
      resizeObserver?.disconnect();
      resizeObserver?.observe(el);

      Array.from(el.children).forEach((child) => {
        resizeObserver?.observe(child);
      });

      updateScrollState();
    };

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(updateScrollState);
    }

    const mutationObserver =
      typeof MutationObserver !== "undefined"
        ? new MutationObserver(observeElements)
        : null;

    observeElements();

    mutationObserver?.observe(el, { childList: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      window.removeEventListener("resize", updateScrollState);
    };
  }, [children, updateScrollState]);

  // Scroll by a full group of visible cards.
  const scrollByCards = (direction) => {
    const el = scrollRef.current;
    if (!el) return;

    const cards = Array.from(el.children);
    if (!cards.length) return;

    // Measure real card width + gap (independent of offsetParent / scroll position).
    const firstRect = cards[0].getBoundingClientRect();
    const secondRect = cards[1]?.getBoundingClientRect();

    const step = secondRect
      ? secondRect.left - firstRect.left
      : firstRect.width;
    const gap = Math.max(0, step - firstRect.width);

    // How many complete cards fit in the viewport.
    const visibleCards = Math.max(
      1,
      Math.floor((el.clientWidth + gap) / Math.max(step, 1)),
    );

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    el.scrollBy({
      left: direction * visibleCards * step,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <div className={`relative w-full min-w-0 max-w-full ${wrapperClassName}`}>
      {showButtons && (
        <>
          <ScrollButton
            direction="prev"
            label={`Previous ${label}`}
            disabled={atStart}
            onClick={() => scrollByCards(-1)}
            className={`
              ${buttonClassName}
              ${prevButtonClassName}
            `}
          />

          <ScrollButton
            direction="next"
            label={`Next ${label}`}
            disabled={atEnd}
            onClick={() => scrollByCards(1)}
            className={`
              ${buttonClassName}
              ${nextButtonClassName}
            `}
          />
        </>
      )}

      <div
        ref={scrollRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        onScroll={updateScrollState}
        className={`
          relative flex w-full min-w-0 max-w-full
          snap-x snap-mandatory
          overflow-x-auto scroll-smooth
          outline-none
          focus-visible:ring-2 focus-visible:ring-indigo-400
          motion-reduce:scroll-auto
          *:shrink-0 *:snap-start
          [-ms-overflow-style:none]
          scrollbar-none
          [&::-webkit-scrollbar]:hidden
          ${className}
        `}
      >
        {children}
      </div>
    </div>
  );
}
