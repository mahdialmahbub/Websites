import React, { useCallback, useEffect, useRef, useState } from "react";
import { icons } from "../../../../assets/iconCollection";

/* -------------------------------------------------------------------------- */
/*  Config (TemplateCarousel er filter nav er moto)                            */
/* -------------------------------------------------------------------------- */

const DRAG_DEADZONE = 6; // koto px er pore bujhbo horizontal drag naki page scroll
const NAV_STEP = 0.6; // ek arrow click e visible width er 60% scroll hobe
const NAV_EDGE = 44; // px, reveal howa tab jeno arrow er niche na thake

const MOTION =
  "transition-transform duration-500 will-change-transform motion-reduce:transition-none";

const clamp = (n, min, max) => Math.max(min, Math.min(n, max));

/* -------------------------------------------------------------------------- */
/*  useDrag                                                                    */
/*  Pointer-based drag (mouse + touch + pen), finger er sathe sathe chole.     */
/*  - dx: drag cholar somoy live horizontal offset (idle e 0)                  */
/*  - dragging: drag active thakle true (CSS transition bondho korar jonno)    */
/*  - onEnd(dx): chhere dile final offset diye call hoy                        */
/* -------------------------------------------------------------------------- */

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
        // vertical hole normal page scroll, amra sore thaki
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
    // drag er por click swallow kori, jeno niche er tab accidentally select na hoy
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

/* -------------------------------------------------------------------------- */
/*  NavArrow                                                                   */
/*  Tab row er upor boshe, scroll korar kichu na thakle fade out hoy.          */
/* -------------------------------------------------------------------------- */

function NavArrow({ side, label, disabled, onClick }) {
  const left = side === "left";
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`group absolute inset-y-0 z-10 flex w-12 items-center from-background from-40% to-transparent outline-none transition-opacity duration-200 disabled:pointer-events-none disabled:opacity-0 ${
        left
          ? "left-0 justify-start bg-linear-to-r"
          : "right-0 justify-end bg-linear-to-l"
      }`}
    >
      <span className="flex size-8 items-center justify-center rounded-full border border-violet-500/15 bg-white text-xl text-violet-500 shadow-sm transition-[transform,background-color,color] duration-200 group-hover:bg-violet-500/10 group-focus-visible:ring-[3px] group-focus-visible:ring-violet-300 group-active:scale-90">
        <i
          aria-hidden="true"
          className={`flex ${left ? icons.leftAngle : icons.rightAngle}`}
        />
      </span>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Single tab                                                                 */
/*  Active tab er niche underline center theke barhe (scale-x).                */
/* -------------------------------------------------------------------------- */

/**
 * @typedef {Object} ProfileNavProps
 * @property {string} id - Tab button er id (panel er aria-labelledby er jonno)
 * @property {string} panelId - Ei tab je panel control kore tar id
 * @property {string} text - Tab er label
 * @property {boolean} [isActive=false] - Ekhon select kora ache kina
 * @property {() => void} [onClick]
 * @property {(event: React.KeyboardEvent<HTMLButtonElement>) => void} [onKeyDown]
 */

/** @param {ProfileNavProps} props */
export const ProfileNav = ({
  id,
  panelId,
  text,
  isActive = false,
  onClick,
  onKeyDown,
}) => (
  <button
    type="button"
    role="tab"
    id={id}
    aria-selected={isActive}
    aria-controls={panelId}
    tabIndex={isActive ? 0 : -1}
    onClick={onClick}
    onKeyDown={onKeyDown}
    className={[
      // layout
      "relative flex min-h-11 min-w-25 shrink-0 items-center justify-center whitespace-nowrap rounded-t-md",
      "px-[clamp(0.75rem,calc(0.751vw+0.574rem),1.25rem)] py-space-2",
      // type
      "text-small sm:text-body transition-colors duration-200",
      // underline
      "after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-center",
      "after:bg-violet-500 after:transition-transform after:duration-200",
      "motion-reduce:transition-none motion-reduce:after:transition-none",
      // keyboard focus
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50",
      // state
      isActive
        ? "font-medium text-violet-500 after:scale-x-100"
        : "text-neutral-500 after:scale-x-0 hover:bg-violet-500/5 hover:text-violet-500 hover:after:scale-x-50",
    ].join(" ")}
  >
    {text}
  </button>
);

/* -------------------------------------------------------------------------- */
/*  Tab bar                                                                    */
/*  - role="tablist" + arrow keys / Home / End support                         */
/*  - arrow, drag, keyboard shobai ekii track (translate) ke move kore         */
/*  - dui pashe nav arrow; shuru/shesh e gele oi pash er arrow hide hoy        */
/*  - active tab change hole (click / keyboard) seta auto visible hobe         */
/* -------------------------------------------------------------------------- */

/**
 * @typedef {Object} ProfileNavItem
 * @property {string} key - Unique key (e.g. "personal")
 * @property {string} text - Tab e ja dekhabe
 *
 * @typedef {Object} ProfileNavbarProps
 * @property {ProfileNavItem[]} items - Tab list
 * @property {string} [activeKey] - Ekhon konta active
 * @property {(key: string) => void} [onChange] - Tab change hole call hobe
 * @property {string} [idPrefix="profile"] - Tab/panel id banano r jonno prefix
 * @property {string} [label="Profile sections"] - Screen reader er jonno naam
 */

/** @param {ProfileNavbarProps} props */
const ProfileNavbar = ({
  items = [],
  activeKey,
  onChange,
  idPrefix = "profile",
  label = "Profile sections",
}) => {
  const navViewport = useRef(null);
  const navTrack = useRef(null);
  const [navPos, setNavPos] = useState(0); // track ta koto px bame sorano
  const [navMax, setNavMax] = useState(0); // 0 = shob fit hoye gese, scroll lagbe na
  const [ready, setReady] = useState(false); // prothom render e animation off

  const readNavMax = () => {
    const v = navViewport.current;
    const t = navTrack.current;
    return v && t ? Math.max(0, t.scrollWidth - v.clientWidth) : 0;
  };

  // nav ba tab er size change hole (resize, font load, tab add/remove) abar measure
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
  }, [items.length]);

  const navX = Math.min(navPos, navMax); // nav choto/boro hole clamp
  const navAtStart = navX <= 0;
  const navAtEnd = navX >= navMax;

  const navGo = (dir) => {
    const view = navViewport.current?.clientWidth ?? 0;
    setNavPos(clamp(navX + dir * view * NAV_STEP, 0, navMax));
  };

  // track ta shudhu totuku sorabo jeno tab ta puropuri dekha jay (arrow er niche na thake)
  const reveal = useCallback((tab) => {
    const view = navViewport.current;
    if (!tab || !view) return;
    const max = readNavMax();
    const left = tab.offsetLeft - NAV_EDGE;
    const right =
      tab.offsetLeft + tab.offsetWidth + NAV_EDGE - view.clientWidth;
    setNavPos((cur) => {
      const x = Math.min(cur, max);
      if (left < x) return Math.max(0, left);
      if (right > x) return Math.min(max, right);
      return x;
    });
  }, []);

  // active tab change hole (click / keyboard / prothom render) seta visible kora
  useEffect(() => {
    const tab = navTrack.current?.querySelector(
      '[role="tab"][aria-selected="true"]',
    );
    reveal(tab);
  }, [activeKey, reveal]);

  // prothom position set howar por animation chalu
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // free drag: jekhane chhorbe sekhanei thakbe (dui prante clamp)
  const navDrag = useDrag((d) => setNavPos(clamp(navX - d, 0, navMax)));

  const navShift = navDrag.dragging
    ? clamp(navX - navDrag.dx, 0, navMax)
    : navX;

  const handleKeyDown = (event, index) => {
    const last = items.length - 1;
    let next;

    if (event.key === "ArrowRight") next = index === last ? 0 : index + 1;
    else if (event.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    else return;

    event.preventDefault();
    onChange?.(items[next].key);
    // preventScroll: browser er instant jump bondho, track er smooth move reveal() kore
    document
      .getElementById(`${idPrefix}-tab-${items[next].key}`)
      ?.focus({ preventScroll: true });
  };

  return (
    // w-full min-w-0 max-w-full: flex/grid parent er bhitore thakleo parent er width er beshi boro hobe na
    <div className="relative w-full min-w-0 max-w-full">
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

      {/* overflow-x-clip: native scrollbar nai, vertical focus ring kete jay na */}
      <div
        ref={navViewport}
        {...navDrag.bind}
        className="w-full min-w-0 touch-pan-y select-none overflow-x-clip shadow-[inset_0_-1px_0_rgba(115,115,115,0.15)]"
      >
        <div
          ref={navTrack}
          role="tablist"
          aria-label={label}
          onFocus={(e) => reveal(e.target.closest('[role="tab"]'))}
          className={`relative flex w-max min-w-full items-stretch gap-1 ${
            ready && !navDrag.dragging ? MOTION : "transition-none"
          }`}
          style={{ transform: `translate3d(${-navShift}px,0,0)` }}
        >
          {items.map((item, index) => (
            <ProfileNav
              key={item.key}
              id={`${idPrefix}-tab-${item.key}`}
              panelId={`${idPrefix}-panel-${item.key}`}
              text={item.text}
              isActive={item.key === activeKey}
              onClick={onChange ? () => onChange(item.key) : undefined}
              onKeyDown={(event) => handleKeyDown(event, index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileNavbar;
