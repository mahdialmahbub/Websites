"use client";

import { useTheme } from "next-themes";
import { useMounted } from "../hooks/use-mounted";

const DarkToggleBTN = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <div className="flex items-center justify-center p-space-1 rounded-md bg-primary-50 border border-primary-900/10 max-w-max">
        <div className="w-[24px] h-[24px] rounded-sm" />
        <div className="w-[24px] h-[24px] rounded-sm" />
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className="flex items-center justify-center p-space-1 rounded-md bg-primary-50 border border-primary-900/10 max-w-max">
      <button
        type="button"
        aria-label="Light mode"
        aria-pressed={!isDark}
        onClick={() => setTheme("light")}
        className={`w-[24px] h-[24px] rounded-sm ${!isDark && "bg-primary-500"} *:text-size-xs_2 flex items-center justify-center`}
      >
        <i
          className={`${!isDark ? "fi fi-sr-brightness text-primary-50" : "fi fi-rr-brightness text-primary-500"}`}
        ></i>
      </button>
      <button
        type="button"
        aria-label="Dark mode"
        aria-pressed={isDark}
        onClick={() => setTheme("dark")}
        className={`w-[24px] h-[24px] rounded-sm ${isDark && "bg-primary-500"} *:text-size-xs_2 flex items-center justify-center`}
      >
        <i
          className={`${isDark ? "fi fi-sr-moon-stars text-primary-50" : "fi fi-rr-moon-stars text-primary-500"}`}
        ></i>
      </button>
    </div>
  );
};

export default DarkToggleBTN;