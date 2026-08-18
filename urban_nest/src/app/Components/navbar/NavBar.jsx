import React from "react";
import { navbarItems } from "../../assets/assets";
import Link from "next/link";
import Image from "next/image";
import Navlink from "./Navlink";
import Button from "../Button";

const NavBar = () => {
  return (
    <nav className=" bg-primary-1/80 backdrop-blur-2xl shadow-[0px_2px_4px_rgba(13,100,94,0.2)] navbar fixed top-0 left-0 w-full z-50">
      <div className="px-space-7 py-space-3 flex items-center justify-between container mx-auto">
        {/* Logo */}
        <Image
          src={navbarItems.logo}
          alt="Urban Nest logo"
          width={320}
          height={80}
          className="h-[48px] w-auto"
        />

        {/* navLinks */}
        <div className="flex items-center gap-space-3">
          {navbarItems.navLinks.map((item, index) => (
            <Navlink key={index} item={item} index={index} />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-space-3">
          <Button text={navbarItems.buttons.primary} type={"primary"} />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
