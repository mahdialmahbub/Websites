"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Horizontal scroll container with left/right toggle buttons.
 *
 * - Right button: porer card gulo dekhay, kintu age er 1-2 ta card
 *   screen e theke jay (context thake).
 * - Left button: ager card gulo dekhay, kintu ekhon je card gulo chilo
 *   tar 1-2 ta screen e theke jay.
 * - Scroll shuru te (left e card nai) → left button hide.
 * - Scroll sesh e (right e card nai) → right button hide.
 * - Shob card ekshathe fit hoye gele (scroll er dorkar nai) → dui button-i hide.
 */

// Koyta card thakle 2 ta "peek" card rakhbe (er kom hole 1 ta)
const WIDE_VIEW_MIN_CARDS = 4;

function ArrowIcon({ direction }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {direction === "left" ? (
        <polyline points="15 18 9 12 15 6" />
      ) : (
        <polyline points="9 18 15 12 9 6" />
      )}
    </svg>
  );
}

const buttonBase =
  "absolute top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full " +
  "border border-black/5 bg-white/90 text-primary-500 backdrop-blur-sm " +
  "shadow-[0_8px_24px_-8px_rgba(0,0,0,0.35)] cursor-pointer " +
  "transition-all duration-200 ease-out " +
  "hover:scale-105 hover:bg-primary-500 hover:text-white active:scale-95 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60 " +
  "dark:border-white/10 dark:bg-background/90 dark:hover:bg-primary-500";

const buttonHidden = "pointer-events-none scale-90 opacity-0";
const buttonVisible = "opacity-100";

export default function ClientsCarousel({
  children,
  resetKey,
  label = "Clients",
}) {
  const scrollerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateButtons = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    // maxScroll <= 2 mane shob card already fit hoye ache → button lagbe na
    const hasOverflow = maxScroll > 2;

    setCanScrollLeft(hasOverflow && el.scrollLeft > 2);
    setCanScrollRight(hasOverflow && maxScroll - el.scrollLeft > 2);
  }, []);

  // Scroll, resize ar card size change hole button state update
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    updateButtons();
    el.addEventListener("scroll", updateButtons, { passive: true });

    const observer = new ResizeObserver(updateButtons);
    observer.observe(el);
    Array.from(el.children).forEach((child) => observer.observe(child));

    return () => {
      el.removeEventListener("scroll", updateButtons);
      observer.disconnect();
    };
  }, [updateButtons, children]);

  // Category change hole abar shuru theke dekhabe
  useEffect(() => {
    scrollerRef.current?.scrollTo({ left: 0 });
  }, [resetKey]);

  const scrollByPage = (direction) => {
    const el = scrollerRef.current;
    const firstCard = el?.firstElementChild;
    if (!el || !firstCard) return;

    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const cardStep = firstCard.getBoundingClientRect().width + gap;

    const visibleCards = Math.max(1, Math.floor((el.clientWidth + gap) / cardStep));
    const peekCards = visibleCards >= WIDE_VIEW_MIN_CARDS ? 2 : 1;
    const cardsToMove = Math.max(1, visibleCards - peekCards);

    el.scrollBy({
      left: direction * cardsToMove * cardStep,
      behavior: "smooth",
    });
  };

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => scrollByPage(-1)}
        aria-label="Previous clients"
        aria-hidden={!canScrollLeft}
        tabIndex={canScrollLeft ? 0 : -1}
        className={`${buttonBase} left-2 ${canScrollLeft ? buttonVisible : buttonHidden}`}
      >
        <ArrowIcon direction="left" />
      </button>

      <div ref={scrollerRef} className="flex gap-space-6 overflow-x-auto p-1">
        {children}
      </div>

      <button
        type="button"
        onClick={() => scrollByPage(1)}
        aria-label="Next clients"
        aria-hidden={!canScrollRight}
        tabIndex={canScrollRight ? 0 : -1}
        className={`${buttonBase} right-2 ${canScrollRight ? buttonVisible : buttonHidden}`}
      >
        <ArrowIcon direction="right" />
      </button>
    </div>
  );
}
