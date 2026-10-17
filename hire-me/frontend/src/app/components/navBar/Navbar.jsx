import React from "react";
import Logo from "../Logo";
import NavLink from "./NavLink";
import { Button } from "../Button";
import MobileMenu from "./MobileMenu";
import Link from "next/link";
import LoginBTN from "./LoginBTN";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
];

const Navbar = () => {
  return (
    <nav className="bg-neutral-50 text-white h-[clamp(3.5rem,calc(2.04vw+3.02rem),4.5rem)] border-b border-[#7F6FFF]/20 w-full">
      <div className="flex items-center justify-between h-full max-w-300 mx-auto px-[clamp(1rem,calc(6.01vw-0.41rem),5rem)]">
        {/* Logo */}
        <Link href={"/"}>
          <Logo className="h-[clamp(1.75rem,calc(1.69vw+1.35rem),2.875rem)]" />
        </Link>

        {/* Navigation Links */}
        <ul className="flex gap-space-6 items-center max-md:hidden">
          {navLinks.map((link) => (
            <li key={link.name}>
              <NavLink name={link.name} href={link.href} />
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <MobileMenu />

        {/* login button */}
        <div className="hidden md:flex">
          <LoginBTN />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
