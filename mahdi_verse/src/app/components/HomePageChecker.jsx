"use client";

import { usePathname } from "next/navigation";
import SmoothScrolling from "./SmoothScrolling";

export default function HomePageChecker({ children }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div
      className={`mx-auto flex justify-center min-w-full max-w-[2000px] flex-1 ${
        isHomePage ? "" : "overflow-y-auto"
      }`}
    >
      {!isHomePage ? (
        <SmoothScrolling>{children}</SmoothScrolling>
      ) : (
        children
      )}
    </div>
  );
}
