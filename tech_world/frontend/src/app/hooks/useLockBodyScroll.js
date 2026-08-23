// app/hooks/useLockBodyScroll.js
"use client";

import { useEffect } from "react";

export default function useLockBodyScroll() {
  useEffect(() => {
  const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
  const originalOverflow = document.body.style.overflow;
  const originalPaddingRight = document.body.style.paddingRight;

  document.body.style.overflow = "hidden";
  document.body.style.paddingRight = `${scrollBarWidth}px`; // shift avoid korar jonno

  return () => {
    document.body.style.overflow = originalOverflow;
    document.body.style.paddingRight = originalPaddingRight;
  };
}, []);
}