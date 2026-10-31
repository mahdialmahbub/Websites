import React from "react";
import { icons } from "../../../../assets/iconCollection";
import Image from "next/image";

/* -------------------------------------------------------------------------- */
/*  EntryCardHeader — form card er header (FieldDropdown er header er moto)    */
/*                                                                             */
/*  Puro row ta click korle card open/close hobe. Move up / down / delete      */
/*  button gulo alada, tai <button> er bhitore <button> hoy na.                */
/*  (toggle button er ::after puro row dhake, action gulo tar upore thake)     */
/* -------------------------------------------------------------------------- */

// Icon class gulo ekhane. Onno icon lagle shudhu ekhane bodlalei hobe.
const ICON = {
  up: "fi fi-rr-arrow-small-up",
  down: "fi fi-rr-arrow-small-down",
  remove: "fi fi-rr-trash",
  chevron: "fi fi-rr-angle-small-down",
};

const ACTION_BTN =
  "grid size-8 place-items-center rounded-lg text-[18px] text-neutral-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40 disabled:pointer-events-none disabled:opacity-30";

/**
 * @typedef {Object} EntryCardHeaderProps
 * @property {number} index - Card er position (0 theke shuru)
 * @property {string} label - Singular naam, e.g. "job" (title na thakle "Job 1" dekhabe)
 * @property {string} [title] - Header er boro text (e.g. company name)
 * @property {string} [subtitle] - Title er niche (e.g. job title)
 * @property {string} [meta] - Subtitle er niche choto line (e.g. "Sep 2023 – Present")
 * @property {string} [badge] - Title er pashe choto green badge (e.g. "Current")
 * @property {string} [icon] - Left er icon class
 * @property {boolean} [isOpen=false] - Card ekhon expanded kina
 * @property {boolean} [hasError=false] - Card er bhitore error thakle true (header lal hoy)
 * @property {boolean} [isFirst=false] - true hole "Move up" disabled
 * @property {boolean} [isLast=false] - true hole "Move down" disabled
 * @property {string} contentId - Content div er id (aria-controls er jonno)
 * @property {() => void} onToggle - Header e click korle
 * @property {() => void} onMoveUp
 * @property {() => void} onMoveDown
 * @property {() => void} onRemove
 */

/** @param {EntryCardHeaderProps} props */
const EntryCardHeader = ({
  index,
  label,
  title = "",
  subtitle = "",
  meta = "",
  badge = "",
  icon = "fi fi-rr-document",
  isOpen = false,
  hasError = false,
  isFirst = false,
  isLast = false,
  contentId,
  onToggle,
  onMoveUp,
  onMoveDown,
  onRemove,
}) => {
  const name = `${label} ${index + 1}`;
  const fallbackTitle = name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <div className="relative flex items-center gap-2 p-3 sm:gap-3 sm:p-4">
      {/* toggle — ::after diye puro row clickable */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="flex min-w-0 flex-1 items-center gap-3 text-left after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-violet-500/40 max-sm:after:rounded-md"
      >
        <span
          className={`flex size-12 shrink-0 items-center justify-center rounded-lg text-[22px] max-sm:hidden ${
            hasError
              ? "bg-red-500/10 text-red-500"
              : "bg-violet-500/5 text-violet-500/80"
          }`}
        >
          <i className={icon} aria-hidden="true" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span
              className={`font-primary text-body font-medium wrap-break-word sm:text-[18px] ${
                title ? "" : "text-neutral-400"
              }`}
            >
              {title || fallbackTitle}
            </span>
            {badge && (
              <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-caption font-medium leading-none text-green-600">
                {badge}
              </span>
            )}
            {hasError && (
              <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-caption font-medium leading-none text-red-600">
                Fix errors
              </span>
            )}
          </span>
          {subtitle && (
            <span className="mt-0.5 block text-small sm:text-body text-neutral-600 wrap-break-word">
              {subtitle}
            </span>
          )}
          {meta && (
            <span className="mt-0.5 block text-caption sm:text-small text-neutral-400">
              {meta}
            </span>
          )}
        </span>
      </button>

      {/* actions — toggle er upore thake, tai click korle card toggle hoy na */}
      <div className="relative z-10 flex shrink-0 items-center gap-0.5">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={isFirst}
          aria-label={`Move ${name} up`}
          className={`${ACTION_BTN} hover:bg-neutral-500/10`}
        >
          <i className={ICON.up} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={isLast}
          aria-label={`Move ${name} down`}
          className={`${ACTION_BTN} hover:bg-neutral-500/10`}
        >
          <i className={ICON.down} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Delete ${name}`}
          className={`${ACTION_BTN} hover:bg-red-500/10 hover:text-red-600`}
        >
          <i className={ICON.remove} aria-hidden="true" />
        </button>
      </div>

      <span
        aria-hidden="true"
        className={`pointer-events-none size-8 shrink-0 place-items-center rounded-lg bg-primary-200/5 text-[18px] text-primary-200 transition-transform duration-300 motion-reduce:transition-none flex items-center justify-center rotate-90`}
      >
        {
          isOpen ? <Image src={icons.collups} width={24} height={24} alt="collups" className="transition-all duration-300 motion-reduce:transition-none" /> : <Image src={icons.expand} width={24} height={24} alt="collups" className="transition-all duration-300 motion-reduce:transition-none" />
        }
      </span>
    </div>
  );
};

export default EntryCardHeader;
