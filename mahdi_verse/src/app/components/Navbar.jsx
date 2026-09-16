"use client";

import { usePathname } from "next/navigation";
import React from "react";
import DarkToggleBTN from "./DarkToggleBTN";
import Button from "./Button";
import Link from "next/link";

const pageTitles = {
  "/": "",
  "/about": "About Me",
  "/workflow": "Workflow",
  "/projects": "Projects",
  "/clients": "Clients",
  "/contact": "Contact",
};

const Navbar = () => {
  const pathname = usePathname();

  // dynamic project details route ("/projects/some-slug") match korar jonno
  // exact "/projects" theke alada check — nahole listing page-eo eita true hoye jabe
  const isProjectDetailsPage =
    pathname.startsWith("/projects/") && pathname !== "/projects";

  const title = isProjectDetailsPage
    ? "Project Details"
    : (pageTitles[pathname] ?? "");

  const isProjectsPage = pathname === "/projects";
  const buttonHref = isProjectsPage ? "/contact" : "/projects";
  const buttonText = isProjectsPage ? "Contact" : "Projects";

  return (
    <div className="flex items-center justify-between py-space-4 h-[64px]">
      <h4 className="font-primary text-size-xl font-semibold opacity-50 text-secondary-900/70 dark:text-secondary-200/50">
        {title}
      </h4>
      <div className="flex items-center gap-space-6">
        {/* Dark Button */}
        <DarkToggleBTN />
        <Link href={buttonHref}>
          <Button varient="secondary" text={buttonText} />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;