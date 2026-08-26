"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { assets } from "../assets/assets";
import NavLink from "./NavLink";
import DarkToggle from "./DarkToggle";
import Button from "./Button";
import { closeNavbar, openNavbar } from "../features/ui/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import FadeDown from "./motions/FadeDown";

const Navbar = () => {
  const dispatch = useDispatch();
  const isNavbarOpen = useSelector((state) => state.ui.isNavbarOpen);

  return (
    <FadeDown
      as="nav"
      className="top-[8px] md:top-[12px] w-full sticky z-40 mt-[16px] md:mt-7.5 py-[12px] px-[16px] md:py-[12px] md:px-[32px] xl:py-[16px] xl:px-20 rounded-full bg-[#f8fafc]/80 dark:bg-[#080b10]/80 border border-black/10 dark:border-white/10 flex items-center justify-between backdrop-blur-[30px]"
    >
      <Link
        href="/"
        aria-label="GrowthPilot home"
        className="inline-flex shrink-0 items-center"
      >
        <Image
          src="/growthpilot-logo-black.svg"
          width={200}
          height={48}
          alt="GrowthPilot"
          priority
          className="
      h-7
      w-auto
      object-contain
      md:h-[35px]
      xl:h-[47px]
      dark:hidden
    "
        />

        <Image
          src="/growthpilot-logo-white.svg"
          width={200}
          height={48}
          alt=""
          className="
      hidden
      h-7
      w-auto
      object-contain
      md:h-[35px]
      xl:h-[47px]
      dark:block
    "
        />
      </Link>

      {/* navLinks */}
      <div className="flex items-center gap-[12px] text-black dark:text-white max-md:hidden">
        <NavLink text="Home" link="/" />
        <NavLink text="Features" link="#" />
        <NavLink text="Pricing" link="#" />
        <NavLink text="How It Works" link="#" />
        <NavLink text="Blog" link="#" />
        <NavLink text="Contact" link="#" />
      </div>

      <div className="flex items-center gap-[12px] xl:gap-[20px]">
        <DarkToggle />

        <button
          type="button"
          onClick={() => dispatch(!isNavbarOpen ? openNavbar() : closeNavbar())}
          aria-label="Open menu"
          className="md:hidden inline-flex items-center justify-center size-9 rounded-full text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          {!isNavbarOpen ? (
            <i className="fi fi-br-menu-burger text-[22px]"></i>
          ) : (
            <i className="fi fi-rr-cross-small text-[22px]"></i>
          )}
        </button>

        <Button variant="secondary" className="max-md:hidden" text="Login" />
      </div>
    </FadeDown>
  );
};

export default Navbar;
