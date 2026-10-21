"use client";

import React, { useEffect, useRef, useState } from "react";
import SectionHeader from "../SectionHeader";
import ReviewCard from "./ReviewCard";
import { clientReviews } from "@/app/assets/assets";
import FadeUp from "../motions/FadeUp";

const SCROLL_AMOUNT = 400; // ekbar arrow click e koto px scroll hobe

const Review = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Left/right arrow enable-disable korar jonno scroll position check kora
  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollButtons(); // initial check — koto card ache tar upor depend kore

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
    <section className="p-space-9 gap-space-7 flex flex-col items-center max-w-[1440px] container mx-auto">
      <SectionHeader mainText={"reviews"} text={"Real Client"} />

      <div className="relative w-full">
        {/* Left arrow */}
        <button
          type="button"
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 size-11 flex items-center justify-center rounded-full bg-primary-1 text-primary-10 shadow hover:bg-primary-5 hover:text-primary-1 transition-colors disabled:opacity-0 disabled:cursor-not-allowed cursor-pointer"
        >
          <i className="fi fi-rs-arrow-small-left text-[26px]"></i>
        </button>

        {/* Scrollable card row */}
        <FadeUp delay={0.2}>
          <div
            ref={scrollRef}
            className="flex gap-space-4 overflow-x-scroll scrollbar-hide w-full relative"
          >
            {canScrollLeft && (
              <div className="w-[64px] h-full bg-linear-to-r from-background to-background/0 absolute left-0 top-0 z-10 pointer-events-none"></div>
            )}
            {clientReviews.map((item, i) => (
              <ReviewCard key={item.id} clientInfo={item} />
            ))}
            {canScrollRight && (
              <div className="w-[64px] h-full bg-linear-to-l from-background to-background/0 absolute right-0 top-0 z-10 pointer-events-none"></div>
            )}
          </div>
        </FadeUp>

        {/* Right arrow */}
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
