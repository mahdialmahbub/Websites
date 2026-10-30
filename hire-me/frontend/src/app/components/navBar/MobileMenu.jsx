"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import NavLink from "./NavLink";
import LoginBTN from "./LoginBTN";
// Open/close animation (modal er motion er moto). Chaile global CSS e
// .modal-dialog-motion er pashe paste kore ei import ta soriye dite paro.
import "@/app/globals.css";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Templates", href: "/templates" },
];

// Tailwind er `md` breakpoint (default 768px). `md:hidden` er sathe milte hobe,
// tai Tailwind e md bodlale ekhaneo bodlao.
const DESKTOP_QUERY = "(min-width: 768px)";

// Exit animation er por menu DOM theke soranor delay (CSS er exit 150-180ms er cheye ektu beshi).
const EXIT_MS = 200;

// Toggle button er design: shared class + open/closed er rong.
const TOGGLE_BASE =
  "md:hidden size-11 flex items-center justify-center rounded-[5px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 text-[20px] cursor-pointer transition-colors duration-200 motion-reduce:transition-none";
const TOGGLE_OPEN =
  "bg-red-500/10 text-red-500 hover:bg-red-500/15 focus-visible:ring-red-500/50";
const TOGGLE_CLOSED =
  "bg-primary-300/10 text-primary-300 hover:bg-primary-300/15 focus-visible:ring-primary-300/50";

const MobileMenu = () => {
  // open: user er intent (toggle, aria, rong eita diye).
  // mounted: menu DOM e ache kina. Exit animation shesh na howa porjonto true thake.
  // entered: mount hoyar por 2 frame pore true hoy, jate enter transition cholte pare.
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);

  const menuId = useId();
  const toggleRef = useRef(null);
  const pathname = usePathname();

  // Open hole sathe sathe mount kori (render er shomoy state adjust, effect e na).
  if (open && !mounted) setMounted(true);

  // Animation class: open + enter shuru hole tobei visible.
  const shown = open && entered;

  // Route bodlale (link click, browser back/forward, router.push...) menu bondho.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  const close = () => setOpen(false);

  // Menu er bhitore kono link ba button e click korle menu bondho.
  // NavLink / LoginBTN bodlate hoy na, event bubble kore ekhane ashe.
  const handleMenuClick = (event) => {
    const target = event.target.closest("a[href], button");
    if (target && event.currentTarget.contains(target)) close();
  };

  // Enter: prothom frame e hidden state paint hoy, tarpor visible kori,
  // na hole browser transition chalay na.
  useEffect(() => {
    if (!open || !mounted) return;

    let frameTwo;
    const frameOne = requestAnimationFrame(() => {
      frameTwo = requestAnimationFrame(() => setEntered(true));
    });

    return () => {
      cancelAnimationFrame(frameOne);
      if (frameTwo !== undefined) cancelAnimationFrame(frameTwo);
    };
  }, [open, mounted]);

  // Exit: animation cholar shomoy DOM e rekhe, tarpor unmount. Cleanup e timer
  // cancel hoy, tai exit cholar majhkhane abar open korle thik moto kaj kore.
  useEffect(() => {
    if (open || !mounted) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const timer = window.setTimeout(
      () => {
        setMounted(false);
        setEntered(false);
      },
      prefersReducedMotion ? 0 : EXIT_MS,
    );

    return () => window.clearTimeout(timer);
  }, [open, mounted]);

  // Menu DOM e thakle: page scroll lock + Esc + desktop size e gele auto-close.
  // `mounted` e bandha, tai exit animation er shomoy-o scroll lock thake.
  useEffect(() => {
    if (!mounted) return;

    // 1) Page scroll lock. html + body duitaite lagai, karon kono site e html
    //    ei scroll container hoy (jemon html e overflow-x-hidden thakle).
    //    Kono extra padding dei na, tai header / layout er width bodlay na.
    const { body, documentElement: html } = document;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    // 2) Esc dile bondho, focus abar toggle button e fire jay.
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    // 3) Window boro hoye desktop size e gele (rotate / resize) menu bondho,
    //    na hole `md:hidden` e lukano menu r scroll lock theke jabe.
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onBreakpointChange = (event) => {
      if (event.matches) setOpen(false);
    };
    mq.addEventListener("change", onBreakpointChange);

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      document.removeEventListener("keydown", onKeyDown);
      mq.removeEventListener("change", onBreakpointChange);
    };
  }, [mounted]);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((prev) => !prev)}
        // `relative z-50`: menu DOM e thakle (exit animation shoho) button ta overlay er upore thake.
        className={`${TOGGLE_BASE} ${open ? TOGGLE_OPEN : TOGGLE_CLOSED} ${
          mounted ? "relative z-50" : ""
        }`}
      >
        <i
          aria-hidden="true"
          className={open ? "fi fi-rr-cross-small" : "fi fi-rr-bars-staggered"}
        ></i>
      </button>

      {mounted && (
        <>
          {/* Backdrop overlay: click korle menu bondho. Portal e body te render hoy,
              tai parent e transform / backdrop-blur thakleo pura screen dhake. */}
          {createPortal(
            <div
              aria-hidden="true"
              onClick={close}
              className={`mobile-menu-overlay ${
                shown ? "is-visible" : ""
              } fixed inset-0 z-40 touch-none overscroll-contain bg-neutral-950/40 md:hidden`}
            />,
            document.body,
          )}

          {/* Mobile Menu Content */}
          <div
            id={menuId}
            onClick={handleMenuClick}
            className={`mobile-menu-panel ${
              shown ? "is-visible" : ""
            } md:hidden absolute top-18 w-[90%] max-h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain bg-neutral-50 text-neutral-950 shadow-lg z-50 p-space-6 flex flex-col gap-space-5 rounded-xl`}
          >
            <ul className="flex flex-col gap-3.5 ">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <NavLink name={link.name} href={link.href} />
                </li>
              ))}
            </ul>

            {/* login Button */}
            <LoginBTN />
          </div>
        </>
      )}
    </>
  );
};

export default MobileMenu;
