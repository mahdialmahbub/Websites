"use client";

import { useEffect } from "react";

// Shared across all hook instances so stacked modals don't unlock the page
// while another modal is still open.
let lockCount = 0;
let prevOverflow = "";
let prevPaddingRight = "";

/**
 * Locks <body> scroll while the calling component is mounted.
 * - SSR-safe: touches `document` / `window` only inside useEffect.
 * - Compensates for the scrollbar width so the page doesn't jump.
 * - Ref-counted: safe with multiple modals open at once.
 */
export default function useLockBodyScroll() {
  useEffect(() => {
    const body = document.body;

    if (lockCount === 0) {
      prevOverflow = body.style.overflow;
      prevPaddingRight = body.style.paddingRight;

      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      body.style.overflow = "hidden";
      if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
    }
    lockCount += 1;

    return () => {
      lockCount -= 1;
      if (lockCount === 0) {
        body.style.overflow = prevOverflow;
        body.style.paddingRight = prevPaddingRight;
      }
    };
  }, []);
}
