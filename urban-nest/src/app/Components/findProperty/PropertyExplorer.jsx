"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import PropertyScoreChart from "./PropertyScoreChart";
import PropertyCard from "../PropertyCard";

export default function PropertyExplorer({
  properties,
  selectedId,
  onSelect,
}) {
  const list = properties ?? [];

  const scrollRef = useRef(null);
  const cardRefs = useRef([]);

  const total = list.length;

  const currentIndex = Math.max(
    0,
    list.findIndex((p) => p.id === selectedId),
  );

  const selectedProperty = list[currentIndex] ?? null;

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  /* -------------------------------------------------
     Check actual horizontal scroll position
  ------------------------------------------------- */
  const updateScrollState = useCallback(() => {
    const container = scrollRef.current;

    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;

    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(
      scrollLeft + clientWidth < scrollWidth - 4,
    );
  }, []);

  /* -------------------------------------------------
     Setup scroll listener + resize observer
  ------------------------------------------------- */
  useEffect(() => {
    const container = scrollRef.current;

    if (!container) return;

    updateScrollState();

    container.addEventListener("scroll", updateScrollState);

    const resizeObserver = new ResizeObserver(() => {
      updateScrollState();
    });

    resizeObserver.observe(container);

    return () => {
      container.removeEventListener(
        "scroll",
        updateScrollState,
      );

      resizeObserver.disconnect();
    };
  }, [list, updateScrollState]);

  /* -------------------------------------------------
     Reset refs when properties change
  ------------------------------------------------- */
  useEffect(() => {
    cardRefs.current = [];
  }, [properties]);

  /* -------------------------------------------------
     Go to property
  ------------------------------------------------- */
  const goTo = (index) => {
    if (!total) return;

    const clamped = Math.max(
      0,
      Math.min(total - 1, index),
    );

    const target = list[clamped];

    if (!target) return;

    onSelect?.(target.id);

    const card = cardRefs.current[clamped];

    if (card) {
      card.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  };

  const goPrev = () => {
    goTo(currentIndex - 1);
  };

  const goNext = () => {
    goTo(currentIndex + 1);
  };

  /* -------------------------------------------------
     Card click
  ------------------------------------------------- */
  const handleSelect = (id) => {
    const index = list.findIndex(
      (property) => property.id === id,
    );

    if (index !== -1) {
      goTo(index);
    }
  };

  /* -------------------------------------------------
     Empty state
  ------------------------------------------------- */
  if (total === 0) {
    return (
      <div className="mt-space-7">
        <div className="p-10 text-center font-medium text-placeholder">
          No property match in your search.{" "}
          <button
            type="button"
            className="text-background transition-colors duration-200 hover:text-primary-5"
          >
            Search Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-space-7">
      <div className="mx-auto flex flex-col gap-6 lg:flex-row">
        {/* -----------------------------------------
            LEFT — Selected Property Score
        ------------------------------------------ */}
        <div className="flex w-full justify-center lg:w-100 lg:justify-start">
          <PropertyScoreChart property={selectedProperty} />
        </div>

        {/* -----------------------------------------
            RIGHT — Property Explorer
        ------------------------------------------ */}
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {/* ---------------------------------------
              Scroll Viewport
          ---------------------------------------- */}
          <div className="relative min-w-0">
            {/* LEFT EDGE OVERLAY
                IMPORTANT:
                This is OUTSIDE the scroll container,
                so it won't move with the cards.
            */}
            <div
              className={`
                pointer-events-none
                absolute left-0 top-0 bottom-0 z-20
                w-12
                bg-gradient-to-r
                from-foreground
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

            {/* -------------------------------------
                Horizontal Scroll Container
            -------------------------------------- */}
            <div
              ref={scrollRef}
              onScroll={updateScrollState}
              className="
                flex
                min-w-0
                gap-4
                overflow-x-auto
                overflow-y-visible
                scroll-smooth
                scrollbar-hide
                px-1
                py-2
                overscroll-x-contain
              "
            >
              {list.map((property, index) => (
                <div
                  key={property.id}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  className="shrink-0"
                >
                  <PropertyCard
                    property={property}
                    isSelected={index === currentIndex}
                    onSelect={handleSelect}
                  />
                </div>
              ))}
            </div>

            {/* RIGHT EDGE OVERLAY */}
            <div
              className={`
                pointer-events-none
                absolute right-0 top-0 bottom-0 z-20
                w-12
                bg-gradient-to-l
                from-foreground
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
          </div>

          {/* ---------------------------------------
              Navigation
          ---------------------------------------- */}
          <div className="flex items-center justify-end gap-3 pr-1">
            {/* Previous */}
            <button
              type="button"
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                text-primary-1
                transition-all
                duration-200
                hover:bg-primary-1/10
                hover:text-primary-5
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-primary-5
                disabled:pointer-events-none
                disabled:opacity-30
              "
              aria-label="Previous property"
            >
              <i className="fi fi-rr-arrow-small-left flex items-center justify-center text-[28px]" />
            </button>

            {/* Counter */}
            <div className="flex items-baseline">
              <span className="font-semibold text-md text-[#2F8CFF]">
                {String(currentIndex + 1).padStart(2, "0")}
              </span>

              <span className="ml-1 text-[10px] font-semibold text-placeholder">
                / {String(total).padStart(2, "0")}
              </span>
            </div>

            {/* Next */}
            <button
              type="button"
              onClick={goNext}
              disabled={currentIndex === total - 1}
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                text-primary-1
                transition-all
                duration-200
                hover:bg-primary-1/10
                hover:text-primary-5
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-primary-5
                disabled:pointer-events-none
                disabled:opacity-30
              "
              aria-label="Next property"
            >
              <i className="fi fi-rr-arrow-small-right flex items-center justify-center text-[28px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}