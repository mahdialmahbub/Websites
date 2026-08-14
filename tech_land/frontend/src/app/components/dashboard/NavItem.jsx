"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavItem = ({ href, text, stockIcon, fillIcon }) => {
  const pathname = usePathname();

  // "/dashboard" root path exact match chai, baki route gula nested o cover korবে
  const isActive =
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`font-primary flex items-center gap-space-2 px-space-5 py-space-3 rounded-lg font-semibold text-size-h6 transition-colors duration-200 ${
        isActive
          ? "bg-secondary text-background"
          : "text-foreground hover:text-secondary"
      }`}
    >
      <i className={`${isActive ? fillIcon : stockIcon} text-[20px]`}></i>
      <span>{text}</span>
    </Link>
  );
};

export default NavItem;