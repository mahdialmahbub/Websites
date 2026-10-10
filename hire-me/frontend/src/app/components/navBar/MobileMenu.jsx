"use client"

import React, { useState } from "react";
import { Button } from "../Button";
import Link from "next/link";
import NavLink from "./NavLink";

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Contact', href: '/contact' },
]

const MobileMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open ? (
        <span className="md:hidden size-11 flex items-center justify-center rounded-[5px] bg-red-500/10 text-red-500 hover:bg-red-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 focus-visible:ring-offset-2 text-[20px] cursor-pointer" onClick={() => setOpen(false)}>
          <i className="fi fi-rr-cross-small"></i>
        </span>
      ) : (
        <span className="md:hidden size-11 flex items-center justify-center rounded-[5px] bg-primary-300/10 text-primary-300 hover:bg-primary-300/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300/50 focus-visible:ring-offset-2 text-[20px] cursor-pointer" onClick={() => setOpen(true)}>
          <i className="fi fi-rr-bars-staggered"></i>
        </span>
      )}

      {/* Mobile Menu Content */}
      {open && (
        <div className="md:hidden absolute top-[4.5rem] w-[90%] bg-neutral-50 text-neutral-950 shadow-lg z-50 p-space-6 flex flex-col gap-space-5">
          <ul className="flex flex-col gap-3.5 ">
            {navLinks.map((link) => (
            <li key={link.name}>
              <NavLink name={link.name} href={link.href}  />
            </li>
          ))}
          </ul>

          {/* login Button */}
          <Button variant="secondary">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
