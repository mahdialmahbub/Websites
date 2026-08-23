"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { openNavbar, closeNavbar } from "../features/ui/uiSlice";
import NavLink from "./NavLink";

const MobileNav = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.isNavbarOpen);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // cleanup (important 🔥)
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <div>
      <div
        onClick={() => dispatch(closeNavbar())}
        className={`${isOpen ? "block" : "hidden"} w-full h-full absolute top-0 left-0 bg-black/20 dark:bg-white/5 z-10 backdrop-blur-[2px]`}
      ></div>
      <div onClick={(e) => e.stopPropagation()} className="flex md:hidden">
        {/* Mobile menu content goes here */}

        <div
          className={`${isOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out fixed top-0 right-0 w-[50%] h-full bg-white/80 dark:bg-black/80 backdrop-blur-[30px] z-20 p-4 flex items-center flex-col justify-start`}
        >
          {/* Close button */}
          <div onClick={() => dispatch(closeNavbar())} className="w-full flex justify-end absolute top-4 right-4 z-30">
            <i className="fi fi-sr-cross-circle inline-flex items-center justify-center text-2xl text-secondary2"></i>
          </div>

          <ul className="space-y-4 flex flex-col items-center justify-center mt-10.5">
            <NavLink text="Home" link="/" />
            <NavLink text="Features" link="/features" />
            <NavLink text="Pricing" link="/pricing" />
            <NavLink text="Contact" link="/contact" />
          </ul>
        </div>
        <button
          className="p-2 text-black dark:text-white z-30"
          onClick={() => dispatch(toggleNavbar())}
        >
        </button>
      </div>
    </div>
  );
};

export default MobileNav;
