"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { assets, socialAssets } from "../assets/assets";

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: "fi fi-rr-house-blank",
    fillIcon: "fi fi-sr-house-blank",
  },
  {
    label: "About Me",
    href: "/about",
    icon: "fi fi-rr-info",
    fillIcon: "fi fi-sr-info",
  },
  {
    label: "Workflow",
    href: "/workflow",
    icon: "fi fi-rr-tools",
    fillIcon: "fi fi-sr-tools",
  },
  {
    label: "Projects",
    href: "/projects",
    icon: "fi fi-rr-layout-fluid",
    fillIcon: "fi fi-sr-layout-fluid",
  },
  {
    label: "Clients",
    href: "/clients",
    icon: "fi fi-rr-employee-man-alt",
    fillIcon: "fi fi-sr-employee-man-alt",
  },
  {
    label: "Contact Us",
    href: "/contact",
    icon: "fi fi-rr-customer-service",
    fillIcon: "fi fi-sr-customer-service",
  },
];

const social = [
  {
    name: "LinkedIn",
    icon: socialAssets.Linkedin,
    href: "https://linkedin.com",
    bg: "bg-[#0077B5]",
  },
  {
    name: "WhatsApp",
    icon: socialAssets.Whats_App,
    href: "https://whatsapp.com",
    bg: "bg-[#25D366]",
  },
  {
    name: "Facebook",
    icon: socialAssets.Facebook,
    href: "https://facebook.com",
    bg: "bg-[#1877F2]",
  },
  {
    name: "Twitter",
    icon: socialAssets.Twitter,
    href: "https://twitter.com",
    bg: "bg-[#111111]",
  },
];

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

// Mouse sidebar er upor theke soranor koto ms por collapse hobe
const COLLAPSE_DELAY = 200;

const Sidebar = () => {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const collapseTimer = useRef(null);

  const clearCollapseTimer = useCallback(() => {
    if (collapseTimer.current) {
      clearTimeout(collapseTimer.current);
      collapseTimer.current = null;
    }
  }, []);

  const expand = useCallback(() => {
    clearCollapseTimer();
    setIsExpanded(true);
  }, [clearCollapseTimer]);

  const scheduleCollapse = useCallback(() => {
    clearCollapseTimer();
    collapseTimer.current = setTimeout(() => {
      setIsExpanded(false);
      collapseTimer.current = null;
    }, COLLAPSE_DELAY);
  }, [clearCollapseTimer]);

  // Component unmount hole pending timer cleanup
  useEffect(() => clearCollapseTimer, [clearCollapseTimer]);

  return (
    <nav
      onMouseEnter={expand}
      onMouseLeave={scheduleCollapse}
      onFocus={expand}
      onBlur={(e) => {
        // Focus sidebar er bhitore thakle collapse korbe na
        if (!e.currentTarget.contains(e.relatedTarget)) scheduleCollapse();
      }}
      className={`
        relative flex max-h-full overflow-hidden flex-col items-center justify-between
        rounded-2xl
        bg-secondary-50
        p-space-5
        dark:bg-background
        transition-[width] duration-500 ${EASE}
        will-change-[width]
        ${isExpanded ? "w-58" : "w-22"}
      `}
    >
      {/* ========================================
          TOP SECTION
      ======================================== */}
      <div className="flex w-full flex-col items-center gap-space-6">
        {/* Logo */}
        <div
          className={`
            flex
            h-11
            w-full
            items-center
            ${isExpanded ? "justify-start px-space-2" : "justify-center"}
            transition-all duration-500 ${EASE}
          `}
        >
          <Image
            src={isExpanded ? assets.logo : assets.logo_2}
            alt="Logo"
            priority
            className={`
              h-10
              w-auto
              object-contain
              transition-transform
              duration-500
              ${EASE}
              ${isExpanded ? "scale-100" : "scale-95"}
            `}
          />
        </div>

        {/* Navigation */}
        <div className="flex w-full flex-col gap-2">
          {navItems.map((item, index) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            return (
              <Link
                href={item.href}
                key={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`
                  group relative flex h-12 w-full
                  items-center
                  overflow-hidden
                  rounded-xl
                  transition-all
                  duration-300
                  ${EASE}
                  ${
                    isActive
                      ? "bg-secondary-500 text-white shadow-[0_8px_22px_rgba(0,0,0,0.10)] dark:bg-secondary-700"
                      : "text-foreground/50 hover:text-foreground/80 hover:bg-secondary-100 dark:hover:bg-secondary-900/70"
                  }
                `}
              >
                {/* Active indicator */}
                <span
                  className={`
                    absolute
                    left-0
                    top-1/2
                    h-6
                    w-1
                    -translate-y-1/2
                    rounded-r-full
                    bg-white
                    transition-all
                    duration-300
                    ${EASE}
                    ${isActive ? "opacity-100" : "opacity-0"}
                  `}
                />

                {/* Icon */}
                <span
                  className={`
                    relative
                    z-10
                    flex
                    size-12
                    shrink-0
                    items-center
                    justify-center
                    transition-transform
                    duration-300
                  `}
                >
                  <i
                    className={`
                      text-[19px]
                      transition-all
                      duration-300
                      ${isActive ? item.fillIcon : item.icon}
                    `}
                  />
                </span>

                {/* Label */}
                <span
                  className={`
                    relative
                    z-10
                    whitespace-nowrap
                    text-size-md
                    font-medium
                    transition-all
                    duration-400 font-primary -ml-1
                    ${EASE}
                    ${
                      isExpanded
                        ? "max-w-40 translate-x-0 opacity-100"
                        : "pointer-events-none max-w-0 -translate-x-3 opacity-0"
                    }
                    ${isActive ? "font-semibold" : ""}
                  `}
                  style={{
                    transitionDelay: isExpanded
                      ? `${index * 35 + 50}ms`
                      : "0ms",
                  }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ========================================
          BOTTOM / SOCIAL
      ======================================== */}
      <div
        className={`
          w-full
          transition-all
          duration-500
          ${EASE}
          ${
            isExpanded
              ? "max-h-40 opacity-100 translate-y-0"
              : "max-h-0 translate-y-3 opacity-0 pointer-events-none"
          }
        `}
      >
        <div className="">
          <div className="grid grid-cols-4 gap-2">
            {social.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.name}
                className={`
                  group
                  flex
                  h-10
                  items-center
                  justify-center
                  rounded-lg
                  ${item.bg}
                  shadow-sm
                  transition-all
                  duration-300
                  ${EASE}
                  hover:-translate-y-0.5
                  hover:brightness-110
                  hover:shadow-lg
                  active:scale-95
                `}
              >
                <Image
                  src={item.icon}
                  alt={item.name}
                  width={18}
                  height={18}
                  className="
                    h-4.5
                    w-4.5
                    object-contain
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  "
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
