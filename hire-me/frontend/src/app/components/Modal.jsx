"use client";

import { useEffect, useId, useRef, useState } from "react";

/**
 * Accessible native dialog with smooth entrance and exit animations.
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

      const closeDelay = prefersReducedMotion ? 0 : 200;

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
      className={`modal-dialog-motion ${isVisible ? "is-visible" : ""} m-auto min-w-72.5 max-w-[700px]"
      } max-h-[88vh] overflow-y-auto rounded-xl border border-neutral-500/10 bg-white p-0 shadow-[0_12px_32px_rgba(2,6,23,0.25)] ${className}`}
    >
      <div className="relative p-[clamp(1rem,calc(1.5vw+0.65rem),2rem)]">
        <div
          className={
            titleHidden ? "" : "mb-5 flex items-center justify-between gap-4"
          }
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

        {children}
      </div>
    </dialog>
  );
}
