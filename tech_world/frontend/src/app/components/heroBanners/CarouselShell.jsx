"use client";

import { Children, useEffect, useState } from "react";

export default function CarouselShell({ children, interval = 4000 }) {
  const slides = Children.toArray(children);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(
      () => setActiveIndex((prev) => (prev + 1) % slides.length),
      interval,
    );
    return () => clearInterval(id);
  }, [paused, slides.length, interval]);

  return (
    <section
      className="w-full"
      aria-roledescription="carousel"
      aria-label="Featured offers"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative w-full overflow-hidden rounded-3xl">
        <div className="relative aspect-2/1 w-full sm:aspect-3/1 lg:aspect-[3.8/1]">
          {slides.map((slide, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={index}
                data-active={isActive}
                aria-hidden={!isActive}
                inert={!isActive}
                className={`group absolute inset-0 transition-opacity duration-700 ${
                  isActive ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                {slide}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-2">
        {slides.map((_, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={isActive}
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                isActive
                  ? "w-8 bg-cyan-400"
                  : "w-2 bg-slate-600 hover:bg-slate-400"
              }`}
            />
          );
        })}
      </div>
    </section>
  );
}
