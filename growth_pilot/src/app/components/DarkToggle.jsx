"use client";

import { useEffect, useState } from "react";

const DarkToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsDark(true);
    } else {
      setIsDark(false);
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "";
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className={`rounded-full flex items-center gap-[4px] *:aspect-square *:rounded-full p-[4px] *:w-auto *:h-[clamp(1.125rem,0.9659rem+0.7955vw,1.5625rem)] h-[clamp(1.625rem,1.4659rem+0.7955vw,2.0625rem)] ${isDark ? "bg-black" : "bg-white"} ring ring-secondary2/10`}
    >
      <div
        className={`flex items-center justify-center ${!isDark ? "bg-linear-to-tr from-secondary/80 to-secondary2/80 text-white" : "text-secondary"}`}
      >
        <i className="fi fi-rr-brightness inline-flex items-center justify-center text-[clamp(0.5rem,0.3273rem+0.6818vw,0.875rem)]"></i>
      </div>
      <div
        className={`flex items-center justify-center ${isDark ? "bg-linear-to-tr from-secondary/80 to-secondary2/80 text-white" : "text-secondary"}`}
      >
        <i className="fi fi-sr-moon-stars inline-flex items-center justify-center text-[clamp(0.5rem,0.3273rem+0.6818vw,0.875rem)]"></i>
      </div>
    </button>
  );
};

export default DarkToggle;
