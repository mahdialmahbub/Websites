import React from "react";
import DarkToggleBTN from "../DarkToggleBTN";
import NavbarTitle from "./NavTitle";
import NavbarAction from "./NavbarAction";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between py-space-4 h-[64px]">
      <NavbarTitle />
      <div className="flex items-center gap-space-6">
        {/* Dark Button */}
        <DarkToggleBTN />
        <NavbarAction />
      </div>
    </div>
  );
};

export default Navbar;