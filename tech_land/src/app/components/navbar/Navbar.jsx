import { assets } from "@/app/assets/assets";
import Image from "next/image";
import React from "react";
import Navbar_Searchbar from "./Navbar_Searchbar";

const Navbar = ({ number }) => {
  return (
    <nav className="rounded-full bg-linear-to-r from-[#0F172A] via-[#1E293B] to-[#1E1B4B] border border-secondary/5 flex items-center justify-between px-space-11 py-space-3 w-full">
      {/* logo */}
      <Image
        width={1000}
        height={1000}
        alt="logo"
        src={assets.logo}
        className="h-10 w-auto"
      />
      <Navbar_Searchbar />
      {/* buttons */}
      <div className="flex items-center gap-space-5">
        <button className="bg-secondary text-background p-space-4 rounded-lg w-[48px] h-[48px] relative">
          <div className="absolute top-0 right-0 w-[16px] h-[16px] bg-background text-foreground flex items-center justify-center rounded-[4px]">
            <label
              htmlFor="wishlist"
              className="text-[8px] font-primary font-medium leading-none"
            >
              {number || "1"}
            </label>
          </div>
          <i className="fi fi-rr-wishlist-heart flex items-center justify-center text-[20px]"></i>
        </button>
        <button className="bg-secondary text-background p-space-4 rounded-lg w-[48px] h-[48px]">
          <i className="fi fi-rr-cart-shopping-fast flex items-center justify-center text-[20px]"></i>
        </button>
        <button className="font-primary text-size-h6 text-secondary font-semibold">
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
