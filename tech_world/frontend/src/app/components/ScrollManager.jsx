"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollManager() {
  const pathname = usePathname();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const savePosition = () => {
      sessionStorage.setItem(
        `scroll:${pathname}`,
        String(window.scrollY)
      );
    };

    window.addEventListener("scroll", savePosition);

    return () => {
      savePosition();
      window.removeEventListener("scroll", savePosition);
    };
  }, [pathname]);

  useEffect(() => {
    const handlePopState = () => {
      const position = sessionStorage.getItem(
        `scroll:${window.location.pathname}`
      );

      if (position) {
        requestAnimationFrame(() => {
          window.scrollTo(0, Number(position));
        });
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return null;
}