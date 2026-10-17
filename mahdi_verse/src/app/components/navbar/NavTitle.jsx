"use client";

import { usePathname } from "next/navigation";
import React from "react";

const pageTitles = {
  "/": "",
  "/about": "About Me",
  "/workflow": "Workflow",
  "/projects": "Projects",
  "/clients": "Clients",
  "/contact": "Contact",
};

const NavbarTitle = () => {
  const pathname = usePathname();

  // dynamic project details route ("/projects/some-slug") match korar jonno
  // exact "/projects" theke alada check — nahole listing page-eo eita true hoye jabe
  const isProjectDetailsPage =
    pathname.startsWith("/projects/") && pathname !== "/projects";

  const title = isProjectDetailsPage
    ? "Project Details"
    : (pageTitles[pathname] ?? "");

  return (
    <h4 className="font-primary text-size-xl font-semibold opacity-50 text-secondary-900/70 dark:text-secondary-200/50">
      {title}
    </h4>
  );
};

export default NavbarTitle;