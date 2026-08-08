"use client";

import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { assets, socialAssets } from "../assets/assets";
import Link from "next/link";
import Image from "next/image";

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
    icon: socialAssets.Linkedin,
    href: "https://linkedin.com",
    bg: "bg-[#0073B1]",
  },
  {
    icon: socialAssets.Whats_App,
    href: "https://whatsapp.com",
    bg: "bg-[#39AE41]",
  },
  {
    icon: socialAssets.Facebook,
    href: "https://facebook.com",
    bg: "bg-[#0165E1]",
  },
  {
    icon: socialAssets.Twitter,
    href: "https://twitter.com",
    bg: "bg-black",
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [isExpend, setIsExpend] = useState(true);

  return (
    <nav className="flex flex-col items-center justify-between p-space-7 rounded-2xl transition-all duration-200 bg-secondary-50">
      <div className="flex flex-col items-center gap-space-7">
        <Image alt="logo" src={isExpend ? assets.logo : assets.logo_2} className="h-[40px] w-auto" />
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
                className={`h-12.5 flex items-center w-full rounded-xl gap-space-2 transition-all duration-100 px-space-6 ${
                  isActive
                    ? "bg-linear-to-br from-[#52E7FD] to-[#4AD1E5] shadow-[1_1px_3px_rgba(210, 222, 223,0.9),-1_-1px_2px_rgba((255,255,255,0.90)),1_-1px_2px_rgba(210, 222, 223,0.2),-1_1px_2px_rgba(210, 222, 223,0.2),inset_-1_-1px_2px_rgba(74,209,239,0.5),inset_1_1px_2px_rgba(82,231,253,0.30)]"
                    : "hover:bg-linear-to-br from-[#DDEEF0] to-[#F5FFFF] hover:shadow-[1_1px_3px_rgba(74,209,239,0.9),-1_-1px_2px_rgba((82,231,253,0.90)),1_-1px_2px_rgba(74,209,239,0.2),-1_1px_2px_rgba(74,209,239,0.2),inset_-1_-1px_2px_rgba(210, 222, 223,0.5),inset_1_1px_2px_rgba(255,255,255,0.3)]"
                } ${isActive ? "*:text-secondary-50" : "text-foreground"}`}
              >
                <i className={`${isActive ? item.fillIcon : item.icon}`}></i>
                {isExpend && <h4 className={`${isActive && "font-semibold"} text-size-md text-nowrap`}>{item.label}</h4>}
              </Link>
            );
          })}
        </div>
      </div>
      <div
        className={`grid ${isExpend ? "grid-cols-2" : "hidden"} gap-space-3 w-full`}
      >
        {social.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className={`h-9 min-w-full flex items-center justify-center *:w-[20px] *:h-[20px] ${item.bg} rounded-[4px]`}
          >
            <Image src={item.icon} alt={item.href} width={24} height={24} />
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar;
