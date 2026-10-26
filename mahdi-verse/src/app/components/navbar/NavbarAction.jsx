"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";
import Button from "../Button";
import { useErrorPage } from "../ErrorPageContext";

const NavbarAction = () => {
  const pathname = usePathname();
  const { isErrorPage } = useErrorPage();

  const isProjectsPage = pathname === "/projects";
  const showContact = isErrorPage || isProjectsPage;

  const buttonHref = showContact ? "/contact" : "/projects";
  const buttonText = isErrorPage
    ? "Contact Me"
    : isProjectsPage
    ? "Contact"
    : "Projects";

  return (
    <Link href={buttonHref}>
      <Button varient="secondary" text={buttonText} />
    </Link>
  );
};

export default NavbarAction;