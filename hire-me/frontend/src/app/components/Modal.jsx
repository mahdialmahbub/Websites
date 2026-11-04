"use client";

import { useEffect, useId, useRef, useState } from "react";

const EXIT_MS = 200;

// Shared by every Modal: the page stays locked until the last open modal is gone.
let lockCount = 0;
let savedStyles = null;

function lockScroll() {
  lockCount += 1;
  if (lockCount > 1) return;

  const root = document.documentElement;
  // Width of the scrollbar, so the page does not jump sideways when it disappears.
  const scrollbarWidth = window.innerWidth - root.clientWidth;

  savedStyles = {
    overflow: root.style.overflow,
    paddingRight: root.style.paddingRight,
  };

  root.style.overflow = "hidden";
  if (scrollbarWidth > 0) root.style.paddingRight = `${scrollbarWidth}px`;
}

function unlockScroll() {
  if (lockCount === 0) return;
  lockCount -= 1;
  if (lockCount > 0) return;

  const root = document.documentElement;
  root.style.overflow = savedStyles?.overflow ?? "";
  root.style.paddingRight = savedStyles?.paddingRight ?? "";
  savedStyles = null;
}

// Same fluid spacing as before, split per side so only the body scrolls
// while the header keeps its place.
const PAD_X = "px-[clamp(1rem,calc(1.5vw+0.65rem),2rem)]";
const PAD_TOP = "pt-[clamp(1rem,calc(1.5vw+0.65rem),2rem)]";
const PAD_BOTTOM = "pb-[clamp(1rem,calc(1.5vw+0.65rem),2rem)]";

/**
 * Accessible native dialog with smooth entrance and exit animations.
 * Only the children area scrolls; the header (title + close button) stays fixed.
 */
export default function Modal({
  open,
  onClose,
  title,
  titleHidden = false,
  wide = false,
  children,
  className = "",
}) {
  const dialogRef = useRef(null);
  const openRef = useRef(open);
  const titleId = useId();

  const [isVisible, setIsVisible] = useState(false);

  // Lock the page scroll while the modal is open.
  useEffect(() => {
    if (!open) return;

    lockScroll();

    return () => {
      // Release after the exit animation, so the page does not jump while the modal fades out.
      // This also runs if the modal unmounts while open.
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      window.setTimeout(unlockScroll, prefersReducedMotion ? 0 : EXIT_MS);
    };
  }, [open]);

  useEffect(() => {
    openRef.current = open;

    const dialog = dialogRef.current;

    if (!dialog) return;

    let closeTimer;
    let frameOne;
    let frameTwo;

    if (open) {
      // Open the native dialog.
      if (!dialog.open) {
        dialog.showModal();
      }

      // Start from the hidden animation state.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(false);

      // Allow the browser to paint the initial state first.
      frameOne = requestAnimationFrame(() => {
        frameTwo = requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else if (dialog.open) {
      // Keep the dialog mounted while its exit animation plays.
      setIsVisible(false);

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const closeDelay = prefersReducedMotion ? 0 : EXIT_MS;

      closeTimer = window.setTimeout(() => {
        if (dialog.open) {
          dialog.close();
        }
      }, closeDelay);
    } else {
      setIsVisible(false);
    }

    return () => {
      if (frameOne !== undefined) {
        cancelAnimationFrame(frameOne);
      }

      if (frameTwo !== undefined) {
        cancelAnimationFrame(frameTwo);
      }

      clearTimeout(closeTimer);
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={() => {
        // Do not call onClose again after closing programmatically.
        if (openRef.current) {
          onClose?.();
        }
      }}
      onCancel={(event) => {
        // Prevent the browser from closing the dialog immediately.
        // React will update `open`, allowing the exit animation to run.
        event.preventDefault();

        if (openRef.current) {
          onClose?.();
        }
      }}
      onClick={(event) => {
        // Close only when the actual backdrop is clicked.
        if (event.target === dialogRef.current && openRef.current) {
          onClose?.();
        }
      }}
      // `open:flex` (not plain `flex`) so a closed dialog stays hidden.
      // The dialog itself no longer scrolls: overflow-hidden + flex column,
      // and only the children wrapper below has overflow-y-auto.
      className={`modal-dialog-motion ${isVisible ? "is-visible" : ""} m-auto min-w-72.5 max-w-175 max-h-[88vh] overflow-hidden rounded-xl border border-neutral-500/10 bg-white p-0 shadow-[0_12px_32px_rgba(2,6,23,0.25)] open:flex open:flex-col ${className}`}
    >
      <div className="relative flex min-h-0 flex-1 flex-col">
        {/* Fixed header: never scrolls. */}
        <div
          className={`shrink-0 ${PAD_X} ${PAD_TOP} ${
            titleHidden ? "" : "mb-3 flex items-center justify-between gap-4"
          }`}
        >
          <h2
            id={titleId}
            className={
              titleHidden
                ? "sr-only"
                : "font-primary text-[clamp(1.125rem,calc(0.939vw+0.905rem),1.5rem)] font-semibold"
            }
          >
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={`flex size-10 items-center justify-center rounded-full transition-colors duration-200 hover:bg-neutral-500/10 ${
              titleHidden ? "absolute right-3 top-3 z-10" : ""
            }`}
          >
            <i
              className="fi fi-rr-cross-small text-[22px]"
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Only this area scrolls. */}
        <div
          className={`min-h-0 flex-1 overflow-y-auto overscroll-contain ${PAD_X} ${PAD_BOTTOM}`}
        >
          {children}
        </div>
      </div>
    </dialog>
  );
}
