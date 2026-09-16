"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavLink = ({
  text = "Text",
  link = "/",
}) => {
  const pathname = usePathname();

  const isActive =
    link === "/"
      ? pathname === "/"
      : pathname === link || pathname.startsWith(`${link}/`);

  return (
    <Link
      href={link}
      aria-current={isActive ? "page" : undefined}
      className={`
        group
        relative
        inline-flex
        items-center
        justify-center
        overflow-hidden
        whitespace-nowrap
        rounded-full
        px-3.5
        py-2

        font-primary
        text-sm
        font-semibold
        tracking-[-0.01em]

        transition-all
        duration-300
        ease-[cubic-bezier(0.22,1,0.36,1)]

        md:px-4
        md:py-2.5
        md:text-base

        ${
          isActive
            ? `
              text-secondary2

              bg-linear-to-r
              from-secondary2/10
              via-secondary2/6
              to-secondary/6

              ring-1
              ring-inset
              ring-secondary2/15

              shadow-[0_4px_18px_rgba(0,0,0,0.04)]

              dark:from-secondary2/14
              dark:via-secondary2/8
              dark:to-secondary/8

              dark:ring-secondary2/20
              dark:shadow-[0_4px_18px_rgba(0,0,0,0.20)]
            `
            : `
              text-black/50
              dark:text-white/50

              hover:bg-black/[0.035]
              hover:text-black/80

              dark:hover:bg-white/[0.05]
              dark:hover:text-white/90
            `
        }
      `}
    >
      {/* Active indicator */}
      <span
        className={`
          absolute
          bottom-1
          left-1/2
          h-[2px]
          -translate-x-1/2
          rounded-full
          bg-secondary2

          transition-all
          duration-300
          ease-[cubic-bezier(0.22,1,0.36,1)]

          ${
            isActive
              ? "w-3 opacity-100"
              : "w-0 opacity-0 group-hover:w-2 group-hover:opacity-60"
          }
        `}
      />

      {/* Text */}
      <span
        className={`
          relative
          z-10
          transition-transform
          duration-300
          ease-[cubic-bezier(0.22,1,0.36,1)]

          group-hover:-translate-y-[0.5px]
        `}
      >
        {text}
      </span>
    </Link>
  );
};

export default NavLink;