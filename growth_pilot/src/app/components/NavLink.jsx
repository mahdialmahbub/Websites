"use client";

import Link from "next/link";

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

const NavLink = ({
  text = "Text",
  link = "/",
  isActive = false,
  block = false,
  onClick,
}) => {
  return (
    <Link
      href={link}
      onClick={onClick}
      aria-current={isActive ? "location" : undefined}
      className={`
        group relative items-center justify-center
        ${block ? "flex w-full" : "inline-flex"}
        overflow-hidden whitespace-nowrap rounded-full
        px-space-lg h-10
        text-h6 font-semi
        transition-all duration-300 ${EASE}
        ${
          isActive
            ? `
              text-secondary2
              bg-linear-to-r from-secondary2/10 via-secondary2/6 to-secondary/6
              ring-1 ring-inset ring-secondary2/15
              dark:from-secondary2/14 dark:via-secondary2/8 dark:to-secondary/8
              dark:ring-secondary2/20
            `
            : `
              text-black/50 dark:text-white/50
              hover:bg-black/5 hover:text-black
              dark:hover:bg-white/5 dark:hover:text-white
            `
        }
      `}
    >
      <span
        aria-hidden="true"
        className={`
          absolute bottom-1 left-1/2 h-[2px] -translate-x-1/2
          rounded-full bg-secondary2
          transition-all duration-300 ${EASE}
          ${
            isActive
              ? "w-3 opacity-100"
              : "w-0 opacity-0 group-hover:w-2 group-hover:opacity-60"
          }
        `}
      />

      <span
        className={`
          relative z-10
          transition-transform duration-300 ${EASE}
          group-hover:-translate-y-[0.5px]
        `}
      >
        {text}
      </span>
    </Link>
  );
};

export default NavLink;
