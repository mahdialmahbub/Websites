"use client";

import React, { useEffect, useRef, useState } from "react";
import SectionHeader from "../SectionHeader";
import PropertyCard from "../PropertyCard";
import { properties } from "@/app/assets/assets";
import FadeUp from "../motions/FadeUp";

const SCROLL_AMOUNT = 400; // ekbar arrow click e koto px scroll hobe

const FeaturedProperty = () => {
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
    <section className="py-space-9 w-[1440px] mx-auto">
      <div>
        <SectionHeader mainText={"Property"} text={"Featured"} />

        <div className="relative mt-space-7">
          {/* Left arrow */}
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 size-11 flex items-center justify-center rounded-full bg-primary-1 text-primary-10 shadow hover:bg-primary-5 hover:text-primary-1 transition-colors disabled:opacity-0 disabled:cursor-not-allowed cursor-pointer"
          >
            <i className="fi fi-rs-arrow-small-left text-[26px]"></i>
          </button>

          {/* Scrollable card row */}
          <div
            ref={scrollRef}
            className="flex gap-space-5 overflow-x-scroll scrollbar-hide scroll-smooth"
          >
            {properties.map((item, i) => (
              <FadeUp key={i} delay={0.2}>
                <PropertyCard property={item} isProgress />
              </FadeUp>
            ))}
          </div>

          {/* Right arrow */}
          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 size-11 flex items-center justify-center rounded-full bg-primary-1 text-primary-10 shadow hover:bg-primary-5 hover:text-primary-1 transition-colors disabled:opacity-0 disabled:cursor-not-allowed cursor-pointer"
          >
            <i className="fi fi-rs-arrow-small-right text-[26px]"></i>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperty;
