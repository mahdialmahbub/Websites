"use client";

import React, { useEffect, useRef, useState } from "react";
import SectionHeader from "../SectionHeader";
import ReviewCard from "./ReviewCard";
import { clientReviews } from "@/app/assets/assets";
import FadeUp from "../motions/FadeUp";

const SCROLL_AMOUNT = 400;

const Review = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll position to enable/disable arrows
  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollButtons();

    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, []);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollBy({
      left: direction === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
      behavior: "smooth",
    });
  };

  return (
    <section className="p-space-9 gap-space-7 flex flex-col items-center min-w-300 max-w-360 container mx-auto">
      <SectionHeader mainText={"reviews"} text={"Real Client"} />

      <div className="relative w-full">
        {/* Left Arrow */}
        <button
          type="button"
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 size-11 flex items-center justify-center rounded-full bg-primary-1 text-primary-10 shadow hover:bg-primary-5 hover:text-primary-1 transition-colors disabled:opacity-0 disabled:cursor-not-allowed cursor-pointer"
        >
          <i className="fi fi-rs-arrow-small-left text-[26px]"></i>
        </button>

        {/* Scrollable Card Container */}
        <FadeUp delay={0.2}>
          <div
            ref={scrollRef}
            onScroll={updateScrollButtons}
            className="flex gap-space-4 overflow-x-scroll scrollbar-hide w-full"
          >
            {clientReviews.map((item) => (
              <ReviewCard key={item.id} clientInfo={item} />
            ))}
          </div>
        </FadeUp>

        {/* Left Gradient Overlay - Fixed */}
        {canScrollLeft && (
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-[64px] z-10 pointer-events-none bg-linear-to-r from-background to-background/0"
          />
        )}

        {/* Right Gradient Overlay - Fixed */}
        {canScrollRight && (
          <div
            aria-hidden="true"
            className="absolute inset-y-0 right-0 w-[64px] z-10 pointer-events-none bg-linear-to-l from-background to-background/0"
          />
        )}

        {/* Right Arrow */}
        <button
          type="button"
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          aria-label="Scroll right"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 size-11 flex items-center justify-center rounded-full bg-primary-1 text-primary-10 shadow hover:bg-primary-5 hover:text-primary-1 transition-colors disabled:opacity-0 disabled:cursor-not-allowed cursor-pointer"
        >
          <i className="fi fi-rs-arrow-small-right text-[26px]"></i>
        </button>
      </div>
    </section>
  );
};

export default Review;
