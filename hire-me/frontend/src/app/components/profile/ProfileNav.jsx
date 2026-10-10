import React from "react";

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
      "relative flex min-h-11 items-center justify-center whitespace-nowrap rounded-t-md",
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
/* -------------------------------------------------------------------------- */

/**
 * @typedef {Object} ProfileNavItem
 * @property {string} key - Unique key (e.g. "personal")
 * @property {string} label - Tab e ja dekhabe
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
    document.getElementById(`${idPrefix}-tab-${items[next].key}`)?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label={label}
      className="flex items-stretch gap-1 overflow-x-auto shadow-[inset_0_-1px_0_rgba(115,115,115,0.15)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {items.map((item, index) => (
        <ProfileNav
          key={item.key}
          id={`${idPrefix}-tab-${item.key}`}
          panelId={`${idPrefix}-panel-${item.key}`}
          text={item.label}
          isActive={item.key === activeKey}
          onClick={onChange ? () => onChange(item.key) : undefined}
          onKeyDown={(event) => handleKeyDown(event, index)}
        />
      ))}
    </div>
  );
};

export default ProfileNavbar;
