"use client";

import { useEffect, useRef, useState } from "react";
import { icons } from "../../../../assets/iconCollection";
import { Button } from "../Button";

// Items come from the parent already rendered: { key, category, recommended?, node }.
// node = <TemplateCard />, so on the home page (server) the cards stay in the first HTML for crawlers.
//
// IMPORTANT: <TemplateCard /> should be `w-full` (no fixed width of its own).
// The slide <li> below owns the width via --card-w, and the centering math depends on it.

const PAD = "px-[clamp(1rem,calc(6.01vw-0.41rem),5rem)]";
const SWIPE_MIN = 50; // px a drag must travel before it counts as "next / previous"
const DRAG_DEADZONE = 6; // px before we decide if it's a horizontal drag or a page scroll
const EDGE_RESISTANCE = 0.3; // rubber-band feel when dragging past the first / last card
const NAV_STEP = 0.6; // one arrow click moves the filters by 60% of the visible width
const NAV_EDGE = 44; // px, keeps a revealed pill clear of the arrow

// Fast start, soft landing. 300ms feels responsive; the old 500ms ease-out felt sluggish.
const MOTION =
  "transition-transform duration-500 will-change-transform motion-reduce:transition-none";

const clamp = (n, min, max) => Math.max(min, Math.min(n, max));

// Pointer-based drag (mouse + touch + pen) that follows the finger while dragging.
// - dx: live horizontal offset in px (0 when idle)
// - dragging: true while a horizontal drag is active (use it to switch the CSS transition off)
// - onEnd(dx): called on release with the final offset
function useDrag(onEnd) {
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const state = useRef(null);
  const moved = useRef(false);

  const reset = () => {
    state.current = null;
    setDragging(false);
    setDx(0);
  };

  const bind = {
    onPointerDown: (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      state.current = {
        id: e.pointerId,
        x: e.clientX,
        y: e.clientY,
        locked: false,
      };
      moved.current = false;
    },
    onPointerMove: (e) => {
      const s = state.current;
      if (!s || s.id !== e.pointerId) return;
      const ddx = e.clientX - s.x;
      const ddy = e.clientY - s.y;

      if (!s.locked) {
        if (Math.max(Math.abs(ddx), Math.abs(ddy)) < DRAG_DEADZONE) return;
        // vertical intent = normal page scroll, we stay out of the way
        if (Math.abs(ddy) > Math.abs(ddx)) {
          state.current = null;
          return;
        }
        s.locked = true;
        e.currentTarget.setPointerCapture?.(e.pointerId);
        setDragging(true);
      }

      moved.current = true;
      setDx(ddx);
    },
    onPointerUp: (e) => {
      const s = state.current;
      if (!s || s.id !== e.pointerId) return;
      const finalDx = e.clientX - s.x;
      const wasLocked = s.locked;
      reset();
      if (wasLocked) onEnd(finalDx);
    },
    onPointerCancel: reset,
    // after a real drag, swallow the click so a card / pill underneath doesn't fire
    onClickCapture: (e) => {
      if (moved.current) {
        e.stopPropagation();
        e.preventDefault();
        moved.current = false;
      }
    },
    onDragStart: (e) => e.preventDefault(),
  };

  return { bind, dx, dragging };
}

// Small arrow that sits on top of the filter row, fades out when there is nothing more to scroll.
function NavArrow({ side, label, disabled, onClick }) {
  const left = side === "left";
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`absolute top-1/2 z-10 flex h-11 w-12 -translate-y-1/2 items-center md:h-12 ${
        left
          ? "left-[-1] justify-start bg-linear-to-r "
          : "right-[-1] justify-end bg-linear-to-l "
      } from-background from-40% to-transparent outline-none transition-opacity duration-200 disabled:pointer-events-none disabled:opacity-0 group`}
    >
      <span className="flex size-8 items-center justify-center rounded-full border border-indigo-500/15 bg-white text-xl text-indigo-600 shadow-sm transition-[transform,background-color,color] duration-200 group-hover:bg-indigo-100  group-focus-visible:ring-[3px] group-focus-visible:ring-indigo-300 group-active:scale-90">
        <i
          aria-hidden="true"
          className={`flex ${left ? icons.leftAngle : icons.rightAngle}`}
        />
      </span>
    </button>
  );
}

export default function TemplateCarousel({
  categories = [],
  items = [],
  startAt = 1,
}) {
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

  const go = (n) => setIndex(clamp(n, 0, total - 1));

  // ---- filter nav ----
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
    setNavPos(clamp(navX + dir * view * NAV_STEP, 0, navMax));
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
    setIndex(clamp(startAt, 0, Math.max(0, count - 1)));
  };

  // ---- drag: cards follow the finger, then snap to the next / previous card ----
  const cardDrag = useDrag((d) => {
    if (Math.abs(d) > SWIPE_MIN) go(current + (d < 0 ? 1 : -1));
  });

  // filters: free drag, they just stay where you let go (clamped to the ends)
  const navDrag = useDrag((d) => setNavPos(clamp(navX - d, 0, navMax)));

  // dragging past the first / last card feels "heavy" instead of hitting a wall
  const pastEdge =
    (current === 0 && cardDrag.dx > 0) ||
    (current === total - 1 && cardDrag.dx < 0);
  const cardShift = pastEdge ? cardDrag.dx * EDGE_RESISTANCE : cardDrag.dx;

  const navShift = navDrag.dragging
    ? clamp(navX - navDrag.dx, 0, navMax)
    : navX;

  const onCarouselKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(current - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(current + 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      go(0);
    } else if (e.key === "End") {
      e.preventDefault();
      go(total - 1);
    }
  };

  return (
    <div className="mx-auto flex w-screen min-w-[320px] max-w-300 flex-col items-center gap-[clamp(1.5rem,calc(1.690vw+1.104rem),2.625rem)]">
      {/* Filters: arrows, drag and keyboard all move the same track.
          When everything fits, the pills stay centered and the arrows hide themselves. */}
      <nav
        aria-label="Template categories"
        className={`w-full max-w-150 px-[clamp(1rem,calc(6.01vw-0.41rem),5rem)] `}
      >
        <div className="relative">
          <NavArrow
            side="left"
            label="Scroll categories left"
            disabled={navAtStart}
            onClick={() => navGo(-1)}
          />
          <NavArrow
            side="right"
            label="Scroll categories right"
            disabled={navAtEnd}
            onClick={() => navGo(1)}
          />

          {/* overflow-x-clip: no native scrollbar, vertical focus rings are not cut */}
          <div
            ref={navViewport}
            {...navDrag.bind}
            className="w-full touch-pan-y select-none overflow-x-clip py-1"
          >
            <ul
              ref={navTrack}
              onFocus={(e) => reveal(e.target)}
              className={`relative flex w-max min-w-full gap-2.5 sm:justify-center ${MOTION} ${
                navDrag.dragging ? "transition-none" : ""
              }`}
              style={{ transform: `translate3d(${-navShift}px,0,0)` }}
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
                      className={`inline-flex h-10 items-center whitespace-nowrap rounded-full border px-4 text-small outline-none transition-colors duration-200 focus-visible:ring-[3px] focus-visible:ring-indigo-300 md:h-11 md:px-6 md:text-body ${
                        on
                          ? "border-indigo-600 bg-indigo-600 font-semibold text-white"
                          : "border-indigo-500/15 bg-white font-medium text-indigo-500/80 hover:bg-indigo-500/5"
                      }`}
                    >
                      {c.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>

      {/* Carousel: active card is always centered, side cards peek in.
          overflow-x-clip hides the side overflow without cutting shadows/rings vertically. */}
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Resume templates"
        tabIndex={0}
        onKeyDown={onCarouselKeyDown}
        {...cardDrag.bind}
        className="relative w-full touch-pan-y select-none overflow-x-clip rounded-xl py-3 outline-none focus-visible:ring-[3px] focus-visible:ring-indigo-300 [--card-w:clamp(13.125rem,65vw,15.3125rem)] [--gap:2rem] md:[--card-w:15.3125rem] md:[--gap:2.5rem] lg:[--gap:4rem]"
      >
        <ul
          className={`relative left-1/2 flex items-center gap-(--gap) ${MOTION} ${
            cardDrag.dragging ? "transition-none" : ""
          }`}
          style={{
            transform: `translate3d(calc(var(--card-w) / -2 - ${current} * (var(--card-w) + var(--gap)) + ${cardShift}px),0,0)`,
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
                {/* side cards: a tap only slides to them, links inside don't fire (needs React 19 for `inert`) */}
                <div
                  inert={!active}
                  className={`h-full origin-center transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none ${
                    active
                      ? "scale-100 opacity-100"
                      : "pointer-events-none scale-[0.92] opacity-60"
                  }`}
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
          className={`flex w-full items-center justify-between md:w-auto md:justify-center md:gap-10 px-[clamp(1rem,calc(6.01vw-0.41rem),5rem)] md:px-0`}
        >
          <Button
            type="button"
            aria-label="Previous template"
            disabled={current <= 0}
            onClick={() => go(current - 1)}
            variant="secondary"
            icon={"fi fi-rr-arrow-small-left"}
            className="text-[24px] aspect-square"
          />
          <p
            aria-live="polite"
            className="min-w-16 text-center font-primary leading-none tabular-nums"
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
            className="text-[24px] aspect-square"
          />
        </div>
      )}
    </div>
  );
}
