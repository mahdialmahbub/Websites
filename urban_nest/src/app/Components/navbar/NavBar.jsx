"use client";

import React from "react";
import { navbarItems } from "../../assets/assets";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Navlink from "./Navlink";
import Button from "../Button";
import TextButton from "../TextButton";

const NavBar = () => {
  const pathname = usePathname();

  const handleLogoClick = (e) => {
    if (pathname === "/") {
      e.preventDefault();
      if (window.lenis) {
        window.lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="navbar fixed top-0 left-0 w-full z-50 bg-primary-1/80 backdrop-blur-2xl shadow-[0px_2px_4px_rgba(13,100,94,0.2)]">
      <div className="px-space-7 py-space-3 flex items-center justify-between container mx-auto min-w-300 max-w-360">
        {/* Logo */}
        <Link href="/" onClick={handleLogoClick} aria-label="Go to homepage">
          <Image
            src="/logo.png"
            alt="Urban Nest logo"
            width={320}
            height={80}
            className="h-[48px] w-auto"
          />
        </Link>

        {/* navLinks */}
        <div className="flex items-center gap-space-3">
          {navbarItems.navLinks.map((item, index) => (
            <Navlink key={index} item={item} index={index} />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-space-4">
          <TextButton text={"Login"} />

          <Button text={navbarItems.buttons.primary} type={"primary"} />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
