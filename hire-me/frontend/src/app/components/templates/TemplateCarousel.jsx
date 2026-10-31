"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "../Button";
import { icons } from "../../../../assets/iconCollection";

// Items come from the parent already rendered: { key, category, recommended?, node }.
// node = <TemplateCard />, so on the home page (server) the cards stay in the first HTML for crawlers.
//
// IMPORTANT: <TemplateCard /> should be `w-full` (no fixed width of its own).
// The slide <li> below owns the width via --card-w, and the centering math depends on it.

const PAD = "px-[clamp(1rem,calc(5.258vw+0.268rem),5rem)]";
const SWIPE_MIN = 40; // px
const NAV_STEP = 0.6; // one arrow click / swipe moves the filters by 60% of the visible width
const NAV_EDGE = 44; // px, same as the arrow width (w-11), keeps a revealed pill clear of the arrow

// One swipe rule for both the cards and the filters, so they always feel identical.
// onSwipe receives +1 (swiped left = next) or -1 (swiped right = previous).
function useSwipe(onSwipe) {
  const start = useRef(null);

  return {
    onTouchStart: (e) => {
      const t = e.touches[0];
      start.current = { x: t.clientX, y: t.clientY };
    },
    onTouchEnd: (e) => {
      if (!start.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - start.current.x;
      const dy = t.clientY - start.current.y;
      start.current = null;
      // only a mostly-horizontal swipe moves things; diagonal/vertical = page scroll
      if (Math.abs(dx) > SWIPE_MIN && Math.abs(dx) > Math.abs(dy)) {
        onSwipe(dx < 0 ? 1 : -1);
      }
    },
    onTouchCancel: () => {
      start.current = null;
    },
  };
}

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

  // filter nav scroll state
  const navViewport = useRef(null);
  const navTrack = useRef(null);
  const [navPos, setNavPos] = useState(0); // px the filter track is shifted to the left
  const [navMax, setNavMax] = useState(0); // 0 = everything fits, nothing to scroll

  const matches = (item, slug) =>
    slug === "all" ||
    (slug === "recommended"
      ? Boolean(item.recommended)
      : item.category === slug);

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

  // ---- filter nav: same transform-based scrolling as the cards ----
  const readNavMax = () => {
    const v = navViewport.current;
    const t = navTrack.current;
    return v && t ? Math.max(0, t.scrollWidth - v.clientWidth) : 0;
  };

  // re-measure whenever the nav or the pills change size (resize, rotate, fonts, categories)
  useEffect(() => {
    const v = navViewport.current;
    const t = navTrack.current;
    if (!v || !t) return;
    const measure = () => setNavMax(readNavMax());
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(v);
    ro.observe(t);
    return () => ro.disconnect();
  }, []);

  const navX = Math.min(navPos, navMax); // clamp if the nav got wider
  const navAtStart = navX <= 0;
  const navAtEnd = navX >= navMax;

  const navGo = (dir) => {
    const view = navViewport.current?.clientWidth ?? 0;
    setNavPos(Math.max(0, Math.min(navX + dir * view * NAV_STEP, navMax)));
  };

  // slide the nav just enough so a pill is fully visible (keyboard focus, click on a half-hidden pill)
  const reveal = (el) => {
    const li = el?.closest("li");
    const view = navViewport.current;
    if (!li || !view) return;
    const max = readNavMax();
    const left = li.offsetLeft - NAV_EDGE;
    const right = li.offsetLeft + li.offsetWidth + NAV_EDGE - view.clientWidth;
    setNavPos((cur) => {
      const x = Math.min(cur, max);
      if (left < x) return Math.max(0, left);
      if (right > x) return Math.min(max, right);
      return x;
    });
  };

  const pick = (slug) => {
    const count = items.filter((i) => matches(i, slug)).length;
    setFilter(slug);
    setIndex(Math.max(0, Math.min(startAt, count - 1)));
  };

  const cardSwipe = useSwipe((dir) => go(current + dir));
  const navSwipe = useSwipe((dir) => navGo(dir));

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-300 flex-col items-center gap-[clamp(1.5rem,calc(1.690vw+1.104rem),2.625rem)]">
      {/* Filters: scroll exactly like the cards (arrows, swipe, same 500ms ease-out).
          When everything fits, the pills stay centered and the arrows hide themselves. */}
      <nav
        aria-label="Template categories"
        className={`relative w-full max-w-[600px] px-[clamp(2.5rem,calc(5.258vw+0.268rem),7rem)]`}
      >
        <button
          type="button"
          aria-label="Scroll categories left"
          disabled={navAtStart}
          onClick={() => navGo(-1)}
          className="absolute left-0 top-0 z-10 flex h-10 w-11 items-center justify-center bg-linear-to-r from-background to-transparent transition-all duration-200 group disabled:pointer-events-none disabled:opacity-0 md:h-11 text-[26px] hover:text-primary-200 hover:*:-translate-x-1 *:transition-transform *:duration-200"
        >
          <i className={icons.leftAngle}></i>
        </button>
        <button
          type="button"
          aria-label="Scroll categories right"
          disabled={navAtEnd}
          onClick={() => navGo(1)}
          className="absolute right-0 top-0 z-10 flex h-10 w-11 items-center justify-center bg-linear-to-l from-background to-transparent transition-all duration-200 group disabled:pointer-events-none disabled:opacity-0 md:h-11 text-[26px] hover:text-primary-200 hover:*:translate-x-1 *:transition-transform *:duration-200"
        >
          <i className={icons.rightAngle}></i>
        </button>

        {/* overflow-x-clip: no native scrollbar, vertical focus rings are not cut */}
        <div
          ref={navViewport}
          {...navSwipe}
          className="w-full touch-pan-y overflow-x-clip"
        >
          <ul
            ref={navTrack}
            onFocus={(e) => reveal(e.target)}
            className="relative flex w-max gap-2.5 transition-transform duration-500 ease-out motion-reduce:transition-none sm:mx-auto"
            style={{ transform: `translateX(${-navX}px)` }}
          >
            {filters.map((c) => {
              const on = filter === c.slug;
              return (
                <li key={c.slug}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={(e) => {
                      pick(c.slug);
                      reveal(e.currentTarget);
                    }}
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
        </div>
      </nav>

      {/* Carousel: active card is always centered, side cards peek in.
          overflow-x-clip hides the side overflow without cutting shadows/rings vertically. */}
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Resume templates"
        {...cardSwipe}
        className="relative w-full touch-pan-y overflow-x-clip py-3 [--card-w:clamp(13.125rem,65vw,15.3125rem)] [--gap:2rem] md:[--card-w:15.3125rem] md:[--gap:2.5rem] lg:[--gap:4rem]"
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
                // width comes from --card-w so it always matches the translate math
                className={`group/slide w-(--card-w) shrink-0 ${active ? "" : "cursor-pointer"}`}
              >
                {/* side cards: tap only slides to them, links inside don't fire (needs React 19 for `inert`) */}
                <div
                  inert={!active}
                  className={`h-full ${active ? "" : "pointer-events-none"}`}
                >
                  {item.node}
                </div>
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
