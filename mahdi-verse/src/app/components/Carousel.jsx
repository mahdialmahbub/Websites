"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Universal horizontal carousel (clients, projects ba je kono card list e use kora jay).
 *
 * Kemon kaj kore:
 * - Right button: porer card gulo dekhay, kintu ager 1-2 ta card screen e theke jay.
 * - Left button: ager card gulo dekhay, kintu ekhon je card gulo chilo tar 1-2 ta theke jay.
 * - Scroll shuru te → left button hide. Scroll sesh e → right button hide.
 * - Shob card ekshathe fit hoye gele → dui button-i hide.
 *
 * Note: shob card er width same dhora hoy (prothom card er width theke step hisab hoy).
 * Card gulo ke direct child hishebe pass koro, ar card e `shrink-0` / fixed width thaka dorkar.
 *
 * Props:
 * - children  : card gulo
 * - resetKey  : ei value bodlale scroll abar shuru te cole jay (jemon activeCategory)
 * - label     : accessibility label, jemon "clients" / "projects"
 * - peek      : "auto" (default → 4+ card dekhale 2 ta, nahole 1 ta) ba ekta number
 * - className : scroller er extra class (default: flex gap-space-6 overflow-x-auto p-1)
 */

// "auto" mode e koyta card ekshathe dekhale 2 ta peek card rakhbe (er kom hole 1 ta)
const WIDE_VIEW_MIN_ITEMS = 4;

const SCROLLER_BASE = "flex gap-space-4 overflow-x-auto p-1 rounded-[24px]";

const buttonBase =
  "absolute top-1/2 z-10 flex h-full w-10 -translate-y-1/2 justify-center items-center rounded-full " +
  "border border-black/5 bg-white text-primary-500 " +
  "transition-all duration-200 ease-out " +
  "hover:scale-105 hover:bg-primary-500 hover:text-white active:scale-95 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60 " +
  "dark:border-white/10 dark:bg-background dark:hover:bg-primary-500";

const buttonHidden = "pointer-events-none scale-90 opacity-0";
const buttonVisible = "opacity-100";

// Koyta card peek (age er card) hishebe screen e thakbe
function getPeekCount(visibleItems, peek) {
  if (typeof peek === "number") {
    return Math.min(
      Math.max(Math.floor(peek), 0),
      Math.max(visibleItems - 1, 0),
    );
  }
  return visibleItems >= WIDE_VIEW_MIN_ITEMS ? 2 : 1;
}

export default function Carousel({
  children,
  resetKey,
  label = "items",
  peek = "auto",
  className = "",
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

  // resetKey (jemon category) bodlale abar shuru theke dekhabe
  useEffect(() => {
    scrollerRef.current?.scrollTo({ left: 0 });
  }, [resetKey]);

  const scrollByPage = (direction) => {
    const el = scrollerRef.current;
    const firstItem = el?.firstElementChild;
    if (!el || !firstItem) return;

    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const itemStep = firstItem.getBoundingClientRect().width + gap;

    const visibleItems = Math.max(
      1,
      Math.floor((el.clientWidth + gap) / itemStep),
    );
    const peekCount = getPeekCount(visibleItems, peek);
    const itemsToMove = Math.max(1, visibleItems - peekCount);

    el.scrollBy({
      left: direction * itemsToMove * itemStep,
      behavior: "smooth",
    });
  };

  return (
    <div
      className="relative max-w-max "
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => scrollByPage(-1)}
        aria-label={`Scroll ${label} left`}
        aria-hidden={!canScrollLeft}
        tabIndex={canScrollLeft ? 0 : -1}
        className={`${buttonBase} left-0 ${canScrollLeft ? buttonVisible : buttonHidden}`}
      >
        <i className="fi fi-rr-angle-small-left text-[22px]"></i>
      </button>

      <div
        ref={scrollerRef}
        className={className ? `${SCROLLER_BASE} ${className}` : SCROLLER_BASE}
      >
        {children}
      </div>

      <button
        type="button"
        onClick={() => scrollByPage(1)}
        aria-label={`Scroll ${label} right`}
        aria-hidden={!canScrollRight}
        tabIndex={canScrollRight ? 0 : -1}
        className={`${buttonBase} right-0 ${canScrollRight ? buttonVisible : buttonHidden}`}
      >
        <i className="fi fi-rr-angle-small-right text-[22px]"></i>
      </button>
    </div>
  );
}
