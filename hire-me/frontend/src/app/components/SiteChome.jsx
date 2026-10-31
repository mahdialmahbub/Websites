"use client";

import { usePathname } from "next/navigation";

// Routes that run full screen, without the site navbar and footer.
const BARE_ROUTES = [
  "/builder",
  "/login",
  "/email-verify",
  "/forgot-password",
  "/password-reset-otp",
  "/reset-password",
  "/sign-up",
];

const isBare = (pathname) =>
  BARE_ROUTES.some(
    (route) => pathname === route || pathname?.startsWith(`${route}/`),
  );

export default function SiteChrome({ navbar, footer, children }) {
  const bare = isBare(usePathname());

  return (
    <>
      {!bare && navbar}
      {children}
      {!bare && footer}
    </>
  );
}
