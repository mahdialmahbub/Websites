import React, { useCallback, useEffect, useRef, useState } from "react";
import { icons } from "../../../../assets/iconCollection";

/* -------------------------------------------------------------------------- */
/*  Scroll config                                                              */
/* -------------------------------------------------------------------------- */

// Ek click e visible width er koto ongsho scroll hobe (0.75 = 75%)
const SCROLL_RATIO = 0.75;
// Sub-pixel rounding er jonno ektu tolerance, noile end e button disable hoy na
const EDGE_TOLERANCE = 1;

// Reduced motion on thakle animation chara scroll korbe
const getScrollBehavior = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";

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
/*  - choto screen e wrap na hoye horizontal scroll hobe                       */
/*  - left/right button diye smooth scroll, shesh e gele button disable hobe   */
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
  const scrollRef = useRef(null);
  const hasMounted = useRef(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Scroll position dekhe left/right button enable-disable kora
  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > EDGE_TOLERANCE);
    setCanScrollRight(el.scrollLeft < maxScroll - EDGE_TOLERANCE);
  }, []);

  // Container ba tab er size change hole (resize, font load, tab add/remove) abar check
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollState();

    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);
    Array.from(el.children).forEach((child) => observer.observe(child));

    return () => observer.disconnect();
  }, [items.length, updateScrollState]);

  const scrollByPage = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction * el.clientWidth * SCROLL_RATIO,
      behavior: getScrollBehavior(),
    });
  };

  // Active tab arrow button er niche chole gele seta visible area te niye ashbe.
  // scrollIntoView use kori nai, karon seta page-o scroll kore dite pare.
  useEffect(() => {
    const el = scrollRef.current;
    const tab = el?.querySelector('[role="tab"][aria-selected="true"]');
    if (!el || !tab) return;

    // Arrow button er jaygar width = container er padding
    const edge = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    const tabLeft = tab.offsetLeft;
    const tabRight = tabLeft + tab.offsetWidth;
    const viewLeft = el.scrollLeft + edge;
    const viewRight = el.scrollLeft + el.clientWidth - edge;

    // Prothom render e animation chara position set hobe
    const behavior = hasMounted.current ? getScrollBehavior() : "auto";
    hasMounted.current = true;

    if (tabLeft < viewLeft) {
      el.scrollTo({ left: tabLeft - edge, behavior });
    } else if (tabRight > viewRight) {
      el.scrollTo({ left: tabRight - el.clientWidth + edge, behavior });
    }
  }, [activeKey]);

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
    // preventScroll: browser er instant jump bondho, upor er effect smooth scroll korbe
    document
      .getElementById(`${idPrefix}-tab-${items[next].key}`)
      ?.focus({ preventScroll: true });
  };

  return (
    // Button gulo scroll container er bahire, noile content er shathe scroll hoye cholei jabe
    <div className="relative">
      <button
        type="button"
        aria-label="Scroll categories left"
        onClick={() => scrollByPage(-1)}
        disabled={!canScrollLeft}
        className="absolute left-0 top-0 z-10 flex h-10 w-11 items-center justify-center bg-linear-to-r from-background to-transparent transition-all duration-200 group disabled:pointer-events-none disabled:opacity-0 md:h-11 text-[26px] hover:text-primary-200 hover:*:-translate-x-1 *:transition-transform *:duration-200"
      >
        <i className={icons.leftAngle}></i>
      </button>
      <button
        type="button"
        aria-label="Scroll categories right"
        onClick={() => scrollByPage(1)}
        disabled={!canScrollRight}
        className="absolute right-0 top-0 z-10 flex h-10 w-11 items-center justify-center bg-linear-to-l from-background to-transparent transition-all duration-200 group disabled:pointer-events-none disabled:opacity-0 md:h-11 text-[26px] hover:text-primary-200 hover:*:translate-x-1 *:transition-transform *:duration-200"
      >
        <i className={icons.rightAngle}></i>
      </button>

      <div
        ref={scrollRef}
        role="tablist"
        aria-label={label}
        onScroll={updateScrollState}
        className="flex items-stretch gap-1 overflow-x-auto shadow-[inset_0_-1px_0_rgba(115,115,115,0.15)] scrollbar-none [&::-webkit-scrollbar]:hidden relative px-11"
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
  );
};

export default ProfileNavbar;
