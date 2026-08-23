"use client";

import { useTheme } from "next-themes";
import { useMounted } from "../hooks/use-mounted";

const DarkToggleBTN = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <div className="flex items-center justify-center p-space-1 rounded-md bg-secondary-50 border border-secondary-900/10 max-w-max">
        <div className="w-[24px] h-[24px] rounded-sm" />
        <div className="w-[24px] h-[24px] rounded-sm" />
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className="flex items-center gap-space-1 justify-center p-space-1 rounded-md bg-secondary-50 border border-secondary-900/10 max-w-max dark:bg-secondary-900/20 dark:border-primary-900/30">
      <button
        type="button"
        aria-label="Light mode"
        aria-pressed={!isDark}
        onClick={() => setTheme("light")}
        className={`w-[32px] h-[32px] rounded-sm ${!isDark ? "bg-secondary-500" : "hover:bg-secondary-500/10"} flex items-center justify-center`}
      >
        <i
          className={`${!isDark ? "fi fi-sr-brightness text-secondary-50" : "fi fi-rr-brightness text-secondary-100"}`}
        ></i>
      </button>
      <button
        type="button"
        aria-label="Dark mode"
        aria-pressed={isDark}
        onClick={() => setTheme("dark")}
        className={`w-[32px] h-[32px] rounded-sm ${isDark ? "bg-secondary-500" : "hover:bg-secondary-500/10"} flex items-center justify-center`}
      >
        <i
          className={`${isDark ? "fi fi-sr-moon-stars text-secondary-50" : "fi fi-rr-moon-stars text-secondary-500"}`}
        ></i>
      </button>
    </div>
  );
};

export default DarkToggleBTN;