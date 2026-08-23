"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { assets } from "../assets/assets";
import NavLink from "./NavLink";
import DarkToggle from "./DarkToggle";
import Button from "./Button";
import { openNavbar } from "../features/ui/uiSlice";
import { useDispatch } from "react-redux";

const Navbar = () => {

  const dispatch = useDispatch()

  return (
    <div className=" top-[8px] md:top-[12px] w-full sticky z-9 mt-[16px] md:mt-7.5 py-[12px] px-[16px] md:py-[12px] md:px-[32px] xl:py-[16px] xl:px-20 rounded-full bg-accent2-bg/90 dark:bg-black/60 border-2 border-accent2/20 dark:border-accent2/40 flex items-center justify-between backdrop-blur-[30px]">
      <Link href={"/"} className="">
        <Image src={assets.logo} alt="logo" className="aspect-square h-full" />
      </Link>
      {/* navLinks */}
      <div className="flex items-center gap-[4px] text-black max-md:hidden">
        <NavLink text="Features" link="/features" />
        <NavLink text="Pricing" link="/features" />
        <NavLink text="How It Works" link="/features" />
        <NavLink text="Blog" link="/features" />
        <NavLink text="Contact" link="/features" />
      </div>
      <div className="flex items-center gap-[12px] xl:gap-[20px]">
        <DarkToggle />
        <i
          onClick={() => dispatch(openNavbar())}
          className="fi fi-br-menu-burger md:hidden inline-flex items-center justify-center text-[26px] text-black dark:text-white"
        ></i>
        <Button className={"max-md:hidden"} text="Get Started" />
      </div>
    </div>
  );
};

export default Navbar;
