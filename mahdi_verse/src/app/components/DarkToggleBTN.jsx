"use client";

import { applyTheme } from "@/src/lib/applyTheme";

const DarkToggleBTN = () => {
  return (
    <div className="flex items-center gap-space-1 justify-center p-space-1 rounded-md bg-secondary-50 border border-secondary-900/10 max-w-max dark:bg-secondary-900/20 dark:border-primary-900/30">
      {/* Light button: active in light mode, inactive in dark mode */}
      <button
        type="button"
        onClick={() => applyTheme("light")}
        aria-label="Light mode"
        className="w-[32px] h-[32px] rounded-sm flex items-center justify-center bg-secondary-500 dark:bg-transparent dark:hover:bg-secondary-500/10"
      >
        <span aria-hidden="true" className="dark:hidden">
          <i className="fi fi-sr-brightness text-secondary-50"></i>
        </span>
        <span aria-hidden="true" className="hidden dark:block">
          <i className="fi fi-rr-brightness text-secondary-500"></i>
        </span>
      </button>

      {/* Dark button: active in dark mode, inactive in light mode */}
      <button
        type="button"
        onClick={() => applyTheme("dark")}
        aria-label="Dark mode"
        className="w-[32px] h-[32px] rounded-sm flex items-center justify-center hover:bg-secondary-500/10 dark:bg-secondary-500 dark:hover:bg-secondary-500"
      >
        <span aria-hidden="true" className="dark:hidden">
          <i className="fi fi-rr-moon-stars text-secondary-500"></i>
        </span>
        <span aria-hidden="true" className="hidden dark:block">
          <i className="fi fi-sr-moon-stars text-secondary-50"></i>
        </span>
      </button>
    </div>
  );
};

export default DarkToggleBTN;