"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeNavbar, openNavbar } from "../features/ui/uiSlice";
import NavLink from "./NavLink";
import Image from "next/image";
import FadeUp from "./motions/FadeUp";
import { socialIcons } from "../assets/assets";
import Button from "./Button";

// Tailwind `xl` breakpoint — the menu is hidden from here up.
const DESKTOP_QUERY = "(min-width: 1280px)";

export const MobileMenuButton = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.isNavbarOpen);

  const handleToggle = () => {
    dispatch(isOpen ? closeNavbar() : openNavbar());
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
      className="xl:hidden inline-flex items-center justify-center size-9 rounded-full text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
    >
      {isOpen ? (
        <i className="fi fi-rr-cross-small text-[24px]" aria-hidden="true" />
      ) : (
        <i className="fi fi-br-menu-burger text-[24px]" aria-hidden="true" />
      )}
    </button>
  );
};

/* -------------------------------------------------------------------------- */
/*  Menu panel (sits under the navbar)                                        */
/* -------------------------------------------------------------------------- */

/**
 * @typedef {Object} MobileMenuLink
 * @property {string} text Label shown in the menu.
 * @property {string} link Route ("/pricing") or in-page anchor ("#feature").
 */

/**
 * @typedef {Object} MobileMenuSocial
 * @property {"facebook" | "twitter" | "instagram" | "youtube" | "gmail"} name Which icon to show.
 * @property {string} href Profile URL, or "mailto:..." for Gmail.
 */

/**
 * @typedef {Object} MobileMenuProps
 * @property {MobileMenuLink[]} [links=[]] Navigation links, top to bottom.
 * @property {MobileMenuSocial[]} [socials=[]] Social icons shown under "Contact us".
 * @property {string} [ctaText="Get Started"] Label of the main button.
 * @property {string} [ctaHref="/sign-up"] Where the main button goes.
 */

/** @param {MobileMenuProps} props */
const MobileMenu = ({
  links = [],
  socials = [],
  ctaText = "Get Started",
  ctaHref = "/sign-up",
}) => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const isOpen = useSelector((state) => state.ui.isNavbarOpen);

  const close = useCallback(() => dispatch(closeNavbar()), [dispatch]);

  // Close after navigating to another route (back button, programmatic push…)
  useEffect(() => {
    close();
  }, [pathname, close]);

  // While open: lock page scroll, close on Escape, close if the screen grows to desktop
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") close();
    };
    const mediaQuery = window.matchMedia(DESKTOP_QUERY);
    const onBreakpointChange = (event) => {
      if (event.matches) close();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    mediaQuery.addEventListener("change", onBreakpointChange);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      mediaQuery.removeEventListener("change", onBreakpointChange);
    };
  }, [isOpen, close]);

  return (
    <>
      {/* Backdrop — tap outside to close */}
      <div
        aria-hidden="true"
        onClick={close}
        className={`
          fixed inset-0 z-0 xl:hidden
          bg-black/25 backdrop-blur-[3px] overscroll-contain
          transition-opacity duration-300 motion-reduce:transition-none
          ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}
        `}
      />

      {/* Panel */}
      <div
        id="mobile-menu"
        aria-hidden={!isOpen}
        className={`
          absolute inset-x-0 top-full z-20 mt-3 xl:hidden
          origin-top flex flex-col gap-5 p-6
          rounded-[28px] border border-black/10 dark:border-white/10
          bg-[#f8fafc]/80 dark:bg-[#080b10]/80 backdrop-blur-[30px]
          shadow-[0_24px_60px_-20px_rgba(0,0,0,0.25)]
          transition-[opacity,transform,visibility] duration-300
          ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none max-w-100
          ${
            isOpen
              ? "visible translate-y-0 scale-100 opacity-100"
              : "invisible -translate-y-2 scale-[0.98] opacity-0"
          }
        `}
      >
        {/* Links */}
        <nav aria-label="Mobile" className="flex flex-col gap-4">
          {links.map(({ text, link }) => (
            <NavLink key={link} text={text} link={link} block onClick={close} />
          ))}
        </nav>

        {/* Main action */}
        <Link href={"/"}>
          <Button text={ctaText} fullWidth variant="secondary" />
        </Link>

        {/* Contact */}
        {socials.length > 0 && (
          <>
            <div className="flex items-center gap-3 text-medium text-black/30 dark:text-white/30 font-semibold">
              <span className="h-px flex-1 bg-black/10 dark:bg-white/10" />
              Contact us
              <span className="h-px flex-1 bg-black/10 dark:bg-white/10" />
            </div>

            <div className="flex items-center justify-center gap-3.5">
              {socialIcons.map((icon, index) => (
                <FadeUp key={index} delay={index * 0.2}>
                  <Link
                    href="#"
                    aria-label={`Social media ${index + 1}`}
                    className="
                    group flex size-10 items-center justify-center
                    rounded-xl
                    border border-black/10
                    bg-white
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:border-primary/30
                    hover:bg-primary/5
                    dark:border-white/10
                    dark:bg-white/5
                    dark:hover:bg-primary/10
                  "
                  >
                    <Image
                      src={icon}
                      alt={`Social Icon ${index + 1}`}
                      width={20}
                      height={20}
                      className="
                      size-4.5
                      object-contain
                      transition-transform duration-300
                      group-hover:scale-110
                    "
                    />
                  </Link>
                </FadeUp>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default MobileMenu;
