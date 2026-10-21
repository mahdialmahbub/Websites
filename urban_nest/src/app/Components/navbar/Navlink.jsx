"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navlink = ({ item, index, isWhite = false }) => {
  const pathname = usePathname();

  return (
    <div
      className={`px-space-3 py-space-2 relative ${pathname !== item.link && "card"}`}
    >
      <div
        className={`absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 bg-primary-5 transition-all duration-300 ${
          pathname === item.link ? "w-full" : "w-0"
        }`}
      ></div>
      <Link
        key={index}
        href={item.link}
        className={`font-medium font-primary ${
          pathname === item.link ? "text-primary-7 " : isWhite ? "text-background" : "text-foreground"
        }`}
      >
        {item.name}
      </Link>
    </div>
  );
};

export default Navlink;
