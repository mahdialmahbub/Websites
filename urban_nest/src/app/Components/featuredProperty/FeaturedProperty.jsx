"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import SectionHeader from "../SectionHeader";
import PropertyCard from "../PropertyCard";
import { properties } from "@/app/assets/assets";
import FadeUp from "../motions/FadeUp";

const SCROLL_AMOUNT = 400;

const FeaturedProperty = () => {
  const scrollRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  /* -----------------------------------------
     Check current scroll position
  ----------------------------------------- */
  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;

    if (!el) return;

    const maxScrollLeft = el.scrollWidth - el.clientWidth;

    setCanScrollLeft(el.scrollLeft > 4);

    setCanScrollRight(
      el.scrollLeft < maxScrollLeft - 4
    );
  }, []);

  /* -----------------------------------------
     Initial check + resize observer
  ----------------------------------------- */
  useEffect(() => {
    const el = scrollRef.current;

    if (!el) return;

    // Wait until cards/images/layout are rendered
    requestAnimationFrame(() => {
      updateScrollButtons();
    });

    el.addEventListener("scroll", updateScrollButtons);

    const resizeObserver = new ResizeObserver(() => {
      updateScrollButtons();
    });

    resizeObserver.observe(el);

    return () => {
      el.removeEventListener(
        "scroll",
        updateScrollButtons
      );

      resizeObserver.disconnect();
    };
  }, [updateScrollButtons]);

  /* -----------------------------------------
     Horizontal scroll
  ----------------------------------------- */
  const scroll = (direction) => {
    const el = scrollRef.current;

    if (!el) return;

    el.scrollBy({
      left:
        direction === "left"
          ? -SCROLL_AMOUNT
          : SCROLL_AMOUNT,
      behavior: "smooth",
    });
  };

  return (
    <section className="mx-auto max-w-360 px-space-10 py-space-9">
      <SectionHeader
        mainText="Property"
        text="Featured"
        isButton={true}
      />

      {/* ---------------------------------------
          Slider Wrapper
      ---------------------------------------- */}
      <div className="relative mt-space-7">
        {/* ---------------------------------------
            Left Gradient Overlay
            OUTSIDE scroll container
        ---------------------------------------- */}
        <div
          className={`
            pointer-events-none
            absolute inset-y-0 left-0
            z-20
            w-20
            bg-linear-to-r
            from-background
            to-transparent
            transition-opacity duration-200
            ${
              canScrollLeft
                ? "opacity-100"
                : "opacity-0"
            }
          `}
          aria-hidden="true"
        />

        {/* ---------------------------------------
            Right Gradient Overlay
            OUTSIDE scroll container
        ---------------------------------------- */}
        <div
          className={`
            pointer-events-none
            absolute inset-y-0 right-0
            z-20
            w-20
            bg-gradient-to-l
            from-background
            to-transparent
            transition-opacity duration-200
            ${
              canScrollRight
                ? "opacity-100"
                : "opacity-0"
            }
          `}
          aria-hidden="true"
        />

        {/* ---------------------------------------
            Left Arrow
        ---------------------------------------- */}
        <button
          type="button"
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
          className={`
            absolute
            left-2
            top-1/2
            z-30
            flex
            size-11
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-foreground/10
            bg-background
            text-foreground
            transition-all
            duration-200
            hover:border-primary-5
            hover:bg-primary-5
            hover:text-primary-1
            hover:scale-105
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-primary-5
            focus-visible:ring-offset-2
            focus-visible:ring-offset-background
            disabled:pointer-events-none
            disabled:opacity-0
          `}
        >
          <i className="fi fi-rs-arrow-small-left flex items-center justify-center text-[26px]" />
        </button>

        {/* ---------------------------------------
            Scroll Viewport
        ---------------------------------------- */}
        <div
          ref={scrollRef}
          className="
            flex
            gap-space-5
            overflow-x-auto
            overflow-y-hidden
            scroll-smooth
            scrollbar-hide
            overscroll-x-contain

            px-1
            py-2
          "
        >
          {properties.map((item, index) => (
            <div
              key={item.id ?? index}
              className="shrink-0"
            >
              <FadeUp delay={index * 0.08}>
                <PropertyCard
                  property={item}
                  isProgress
                />
              </FadeUp>
            </div>
          ))}
        </div>

        {/* ---------------------------------------
            Right Arrow
        ---------------------------------------- */}
        <button
          type="button"
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          aria-label="Scroll right"
          className={`
            absolute
            right-2
            top-1/2
            z-30
            flex
            size-11
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-foreground/10
            bg-background
            text-foreground
            transition-all
            duration-200
            hover:border-primary-5
            hover:bg-primary-5
            hover:text-primary-1
            hover:scale-105
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-primary-5
            focus-visible:ring-offset-2
            focus-visible:ring-offset-background
            disabled:pointer-events-none
            disabled:opacity-0
          `}
        >
          <i className="fi fi-rs-arrow-small-right flex items-center justify-center text-[26px]" />
        </button>
      </div>
    </section>
  );
};

export default FeaturedProperty;