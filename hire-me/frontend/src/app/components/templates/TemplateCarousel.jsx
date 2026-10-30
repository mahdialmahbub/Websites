"use client";

import { useRef, useState } from "react";
import { Button } from "../Button";

// Items come from the parent already rendered: { key, category, recommended?, node }.
// node = <TemplateCard />, so on the home page (server) the cards stay in the first HTML for crawlers.

const PAD = "px-[clamp(1rem,calc(5.258vw+0.268rem),5rem)]";

export default function TemplateCarousel({
  categories = [],
  items = [],
  startAt = 1,
  padded = true, // false when the page already has its own side padding
}) {
  const pad = padded ? PAD : "";
  const [filter, setFilter] = useState("all");
  const [index, setIndex] = useState(() =>
    Math.max(0, Math.min(startAt, items.length - 1)),
  );
  const touchStartX = useRef(null);

  const matches = (item, slug) =>
    slug === "all" ||
    (slug === "recommended" ? Boolean(item.recommended) : item.category === slug);

  // only show filters that actually have a template
  const hasRecommended = items.some((i) => i.recommended);
  const pills = categories.filter((c) =>
    items.some((i) => i.category === c.slug),
  );
  const filters = [
    { slug: "all", name: "All" },
    ...(hasRecommended ? [{ slug: "recommended", name: "Recommended" }] : []),
    ...pills,
  ];

  const visible = items.filter((i) => matches(i, filter));
  const total = visible.length;
  const current = Math.max(0, Math.min(index, total - 1));

  const go = (n) => setIndex(Math.max(0, Math.min(n, total - 1)));

  const pick = (slug) => {
    const count = items.filter((i) => matches(i, slug)).length;
    setFilter(slug);
    setIndex(Math.max(0, Math.min(startAt, count - 1)));
  };

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) > 40) go(current + (dx < 0 ? 1 : -1));
  };

  return (
    <div className="flex w-full flex-col items-center gap-[clamp(1.5rem,calc(1.690vw+1.104rem),2.625rem)]">
      {/* Filters: wrap and center */}
      <nav aria-label="Template categories" className={`w-full ${pad}`}>
        <ul className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none flex-wrap md:justify-center md:overflow-visible [&::-webkit-scrollbar]:hidden">
          {filters.map((c) => {
            const on = filter === c.slug;
            return (
              <li key={c.slug} className="shrink-0">
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => pick(c.slug)}
                  className={`inline-flex h-10 items-center rounded-full border px-4 text-small outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-indigo-300 md:h-11 md:px-6 md:text-body ${
                    on
                      ? "border-indigo-600 bg-indigo-600 text-white font-semibold"
                      : "border-indigo-500/15 font-medium bg-white text-indigo-500/80 hover:bg-indigo-500/5"
                  }`}
                >
                  {c.name}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Carousel: full-bleed, active card is always centered, side cards peek in */}
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Resume templates"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="relative w-full touch-pan-y overflow-hidden py-3 [--card-w:clamp(13.125rem,65vw,15.3125rem)] [--gap:2rem] md:[--card-w:15.3125rem] md:[--gap:2.5rem] lg:[--gap:4rem]"
      >
        <ul
          className="relative left-1/2 flex items-center gap-(--gap) transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{
            transform: `translateX(calc(var(--card-w) / -2 - ${current} * (var(--card-w) + var(--gap))))`,
          }}
        >
          {visible.map((item, i) => {
            const active = i === current;
            return (
              <li
                key={item.key}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${total}`}
                data-active={active}
                onClick={() => !active && go(i)}
                className={`group/slide shrink-0 ${active ? "" : "cursor-pointer"}`}
              >
                {item.node}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Controls: arrows pushed to the edges on mobile, grouped in the middle from md */}
      {total > 1 && (
        <div
          className={`flex w-full items-center justify-between md:w-auto md:justify-center md:gap-10 ${pad} md:px-0`}
        >
          <Button
            type="button"
            aria-label="Previous template"
            disabled={current <= 0}
            onClick={() => go(current - 1)}
            variant="secondary"
            icon={"fi fi-rr-arrow-small-left"}
          />

          <p
            aria-live="polite"
            className="min-w-16 text-center font-primary leading-none"
          >
            <span className="text-2xl font-medium text-neutral-900">
              {current + 1}
            </span>
            <span className="text-base text-neutral-500">/{total}</span>
          </p>

          <Button
            type="button"
            aria-label="Next template"
            disabled={current >= total - 1}
            onClick={() => go(current + 1)}
            variant="secondary"
            icon={"fi fi-rr-arrow-small-right"}
          />
        </div>
      )}
    </div>
  );
}
