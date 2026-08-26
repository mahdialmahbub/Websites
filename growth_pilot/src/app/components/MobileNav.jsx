"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { openNavbar, closeNavbar } from "../features/ui/uiSlice";
import NavLink from "./NavLink";
import Button from "./Button";

const MobileNav = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.isNavbarOpen);

  // Lock page scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Let Escape close the drawer
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        dispatch(closeNavbar());
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, dispatch]);

  return (
    <div className="flex md:hidden  items-center">
      {/* Backdrop */}
      <div
        onClick={() => dispatch(closeNavbar())}
        aria-hidden="true"
        className={`${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        } fixed inset-0 bg-black/40 backdrop-blur-sm z-10 transition-opacity duration-300 ease-in-out`}
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        aria-hidden={!isOpen}
        onClick={(e) => e.stopPropagation()}
        className={`${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out fixed top-0 right-0 w-[80%] max-w-[360px] h-full bg-white/80 dark:bg-black/80 backdrop-blur-[30px] border-l border-black/10 dark:border-white/10 z-20 flex flex-col overflow-y-auto`}
      >
        <ul
          onClick={() => dispatch(closeNavbar())}
          className="flex flex-col items-start space-y-[8px] px-7 pt-25"
        >
          <NavLink text="Home" link="/" />
          <NavLink text="Features" link="/features" />
          <NavLink text="Pricing" link="/pricing" />
          <NavLink text="Contact" link="/contact" />
        </ul>

        <div className="mt-auto px-[24px] pt-[20px] pb-[32px] border-t border-black/10 dark:border-white/10">
          <Button fullWidth text="Start Free Trial" />
        </div>
      </div>

    </div>
  );
};

export default MobileNav;
