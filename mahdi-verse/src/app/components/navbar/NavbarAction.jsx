"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";
import Button from "../Button";

const NavbarAction = () => {
  const pathname = usePathname();

  const isProjectsPage = pathname === "/projects";
  const buttonHref = isProjectsPage ? "/contact" : "/projects";
  const buttonText = isProjectsPage ? "Contact" : "Projects";

  return (
    <Link href={buttonHref}>
      <Button varient="secondary" text={buttonText} />
    </Link>
  );
};

export default NavbarAction;