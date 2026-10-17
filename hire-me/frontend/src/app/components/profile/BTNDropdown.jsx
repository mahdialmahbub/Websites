"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "../Button";
import { icons } from "../../../../assets/iconCollection";
import { ProfileIcon } from "./ProfileIcon";

/**
 * @typedef {Object} BTNDropdownProps
 * @property {() => void} [onLogout] - "Log out" click hole call hobe
 * @property {() => void} [onDeleteAccount] - "Delete account" click hole call hobe
 */

/** @param {BTNDropdownProps} props */
const BTNDropdown = ({ onLogout, onDeleteAccount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);

  // Bahire click korle ba Escape chaple menu bondho hobe
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const run = (callback) => () => {
    setIsOpen(false);
    callback?.();
  };

  return (
    <div ref={rootRef} className="relative">
      <Button
        variant="secondary"
        icon={icons.down}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="More actions"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      />

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-md border border-neutral-500/10 bg-white p-2.5 shadow-[0_12px_32px_rgba(16,24,40,0.12)] space-y-1.5"
        >
          <button
            type="button"
            role="menuitem"
            onClick={run(onLogout)}
            className="flex min-h-11 w-full items-center gap-2.5 rounded-lg px-3 text-left text-small sm:text-body font-medium text-neutral-700 transition-colors hover:bg-neutral-500/5 focus-visible:bg-neutral-500/5 focus-visible:outline-none"
          >
            <i className="fi fi-rr-user-logout text-[22px]"></i>
            Log out
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={run(onDeleteAccount)}
            className="flex min-h-11 w-full items-center gap-2.5 rounded-lg px-3 text-left text-small sm:text-body font-medium text-red-500 transition-colors hover:bg-red-500/5 focus-visible:bg-red-500/5 focus-visible:outline-none"
          >
            <i className="fi fi-rr-trash text-[22px]"></i>
            Delete account
          </button>
        </div>
      )}
    </div>
  );
};

export default BTNDropdown;
