"use client";

import React from "react";

/**
 * Header of one entry card: its number, move up / move down, and delete.
 * Without handlers it renders as before (so it can still be used for static previews).
 */
const FieldCardHeader = ({
  index = 0,
  isFirst = true,
  isLast = true,
  onMoveUp,
  onMoveDown,
  onRemove,
  label = "entry",
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-space-4">
        <div className="p-space-2 items-center justify-center rounded-full">#{index + 1}</div>
        <div className="flex items-center gap-space-2">
          <button
            type="button"
            onClick={onMoveDown}
            disabled={isLast || !onMoveDown}
            aria-label={`Move ${label} ${index + 1} down`}
            className="size-9.5 rounded-full bg-primary-500/5 hover:bg-primary-500/10 text-primary-500 transition-all duration-150 group disabled:cursor-not-allowed disabled:bg-neutral-500/10 disabled:text-neutral-500/40"
          >
            <i className="fi fi-rr-arrow-small-down group-hover:tranneutral-y-2 transition-all duration-150 text-[26px]"></i>
          </button>
          <button
            type="button"
            onClick={onMoveUp}
            disabled={isFirst || !onMoveUp}
            aria-label={`Move ${label} ${index + 1} up`}
            className="size-9.5 rounded-full bg-primary-500/5 hover:bg-primary-500/10 text-primary-500 transition-all duration-150 group disabled:cursor-not-allowed disabled:bg-neutral-500/10 disabled:text-neutral-500/40 rotate-180"
          >
            <i className="fi fi-rr-arrow-small-down group-hover:tranneutral-y-2 transition-all duration-150 text-[26px]"></i>
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={onRemove}
        disabled={!onRemove}
        aria-label={`Delete ${label} ${index + 1}`}
        className="flex items-center justify-center size-11 hover:bg-red-500/5 rounded-full transition-all duration-150 cursor-pointer group"
      >
        <i className="fi fi-rr-trash text-red-500/70 group-hover:text-red-500 text-[24px]"></i>
      </button>
    </div>
  );
};

export default FieldCardHeader;
