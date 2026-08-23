"use client";

import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { assets, socialAssets } from "../assets/assets";
import Link from "next/link";
import Image from "next/image";

const navItems = [
  { label: "Home", href: "/", icon: "fi fi-rr-house-blank", fillIcon: "fi fi-sr-house-blank" },
  { label: "About Me", href: "/about", icon: "fi fi-rr-info", fillIcon: "fi fi-sr-info" },
  { label: "Workflow", href: "/workflow", icon: "fi fi-rr-tools", fillIcon: "fi fi-sr-tools" },
  { label: "Projects", href: "/projects", icon: "fi fi-rr-layout-fluid", fillIcon: "fi fi-sr-layout-fluid" },
  { label: "Clients", href: "/clients", icon: "fi fi-rr-employee-man-alt", fillIcon: "fi fi-sr-employee-man-alt" },
  { label: "Contact Us", href: "/contact", icon: "fi fi-rr-customer-service", fillIcon: "fi fi-sr-customer-service" },
];

const social = [
  { icon: socialAssets.Linkedin, href: "https://linkedin.com", bg: "bg-[#0073B1]" },
  { icon: socialAssets.Whats_App, href: "https://whatsapp.com", bg: "bg-[#39AE41]" },
  { icon: socialAssets.Facebook, href: "https://facebook.com", bg: "bg-[#0165E1]" },
  { icon: socialAssets.Twitter, href: "https://twitter.com", bg: "bg-black" },
];

const EASE = "ease-[cubic-bezier(0.4,0,0.2,1)]";

const Sidebar = () => {
  const pathname = usePathname();
  const [isExpend, setIsExpend] = useState(false);

  return (
    <nav
      className={`flex flex-col items-center justify-between p-space-7 rounded-2xl transition-[width] duration-300 ${EASE} will-change-[width] bg-secondary-50 relative dark:bg-background dark:shadow-[2px_2px_5px_rgba(18,24,40,0.3),-2px_-2px_4px_rgba(18,24,40,0.90),2px_-2px_4px_rgba(4,6,10,0.2),-2px_2px_4px_rgba(4,6,10,0.2),inset_-1px_-1px_2px_rgba(4,6,10,0.5),inset_1px_1px_2px_rgba(18,24,40,0.30)] ${
        isExpend ? "w-64" : "w-24"
      }`}
    >
      {/* collapse and expand toggle */}
      <i
        className={`fi fi-rr-arrow-small-right rounded-full bg-background text-secondary-500 border-3 border-background text-[28px] absolute top-9.5 -right-3.5 cursor-pointer select-none transition-transform duration-300 ${EASE} hover:text-secondary-700 dark:hover:text-secondary-300 hover:scale-110 active:scale-95 ${
          isExpend ? "rotate-180" : "rotate-0"
        }`}
        onClick={() => setIsExpend(!isExpend)}
        role="button"
        aria-label={isExpend ? "Collapse sidebar" : "Expand sidebar"}
      ></i>

      <div className="flex flex-col items-center gap-space-7">
        <Image
          alt="logo"
          src={isExpend ? assets.logo : assets.logo_2}
          className="h-[40px] w-auto"
        />
        <div className="flex flex-col gap-space-2">
          {navItems.map((item, i) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            return (
              <Link
                href={item.href}
                key={i}
                className={`group relative h-12.5 flex items-center w-full rounded-xl gap-space-2 px-space-6 overflow-hidden transition-shadow duration-300 ${EASE} ${
                  isActive
                    ? "nav-active-shadow text-secondary-50"
                    : "hover:nav-hover-shadow text-foreground"
                }`}
              >
                <span className="relative z-10 flex items-center justify-center shrink-0">
                  <i className={`${isActive ? item.fillIcon : item.icon}`}></i>
                </span>

                <h4
                  className={`${
                    isActive && "font-semibold"
                  } relative z-10 text-size-md text-nowrap pl-0.5 transition-[opacity,transform] duration-300 ${EASE} ${
                    isExpend
                      ? " translate-x-0"
                      : "hidden -translate-x-2 pointer-events-none"
                  }`}
                  style={{
                    transitionDelay: isExpend ? `${i * 40 + 80}ms` : "0ms",
                  }}
                >
                  {item.label}
                </h4>
              </Link>
            );
          })}
        </div>
      </div>

      <div
        className={`grid w-full overflow-hidden transition-[grid-template-rows,opacity] duration-300 ${EASE} ${
          isExpend ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="grid grid-cols-2 gap-space-3 w-full pt-space-1">
            {social.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className={`h-9 min-w-full flex items-center justify-center *:w-[20px] *:h-[20px] ${item.bg} rounded-sm transition-all duration-200 ${EASE} hover:brightness-110 hover:shadow-md hover:scale-105 active:scale-95`}
              >
                <Image src={item.icon} alt={item.href} width={24} height={24} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;