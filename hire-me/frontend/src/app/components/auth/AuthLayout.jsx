"use client";

import Logo from "@/app/components/Logo";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { fluid } from "./fluid";

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

const AUTH_IMAGE = "/authImage.jpg";

const contactInfo = [
  { label: "Phone", value: "+1 (555) 123-4567", icon: "fi fi-rr-phone-flip" },
  { label: "Email", value: "support@hireme.com", icon: "fi fi-rr-envelope" },
  {
    label: "Address",
    value: "123 Main Street, City, State 12345",
    icon: "fi fi-rr-marker",
  },
];

/* -------------------------------------------------------------------------- */
/*  Building blocks                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Logo that links back to the home page.
 *
 * @param {Object} props
 * @param {string} [props.className] Extra classes for positioning the link.
 */
const BrandLogo = ({ className = "" }) => (
  <Link href="/" aria-label="HireMe home" className={className}>
    <Logo
      variant="textWhite"
      className={`${fluid.logo} max-h-11.5 min-h-8.5`}
    />
  </Link>
);

/** Phone / email / address list shown in the "Contact" view. */
const ContactList = () => (
  <div className="w-full">
    <h2
      className={`font-primary font-semibold text-background ${fluid.panelTitle}`}
    >
      Contact Us
    </h2>
    <ul
      className={`flex flex-col text-neutral-300 ${fluid.contactGap} ${fluid.contactMt} ${fluid.contactText}`}
    >
      {contactInfo.map(({ label, value, icon }) => (
        <li key={label} className={`flex items-center ${fluid.gapInline}`}>
          <span
            className={`flex shrink-0 items-center justify-center rounded-sm border border-neutral-800 bg-[#111722] text-blue-500 ${fluid.contactBox} ${fluid.contactGlyph}`}
          >
            <i className={`${icon} leading-none`} aria-hidden="true" />
          </span>
          <span className="sr-only">{label}: </span>
          <span>{value}</span>
        </li>
      ))}
    </ul>
  </div>
);

/**
 * One control for both directions:
 *  - form view    -> "Need Help? Contact Support"
 *  - contact view -> "Back to Login"
 *
 * @param {Object} props
 * @param {boolean} props.showContact Whether the contact view is open.
 * @param {() => void} props.onToggle Switches between form and contact view.
 * @param {"start" | "center"} [props.align] Horizontal alignment of the control.
 * @param {string} [props.className] Extra classes for the wrapper.
 */
const ViewToggle = ({
  showContact,
  onToggle,
  align = "start",
  className = "",
}) => {
  const justify = align === "center" ? "justify-center" : "justify-start";
  const action = `inline-flex min-h-11 items-center font-semibold text-primary-100 ${fluid.gapIcon}`;

  return (
    <div className={`flex w-full ${justify} ${className}`}>
      {showContact ? (
        <button
          type="button"
          onClick={onToggle}
          className={`${action} ${fluid.helpText}`}
        >
          <i
            className="fi fi-rr-arrow-small-left leading-none"
            aria-hidden="true"
          />
          Back to Login
        </button>
      ) : (
        <p
          className={`flex items-center font-medium text-background ${fluid.helpGap} ${fluid.helpText}`}
        >
          Need Help?
          <button type="button" onClick={onToggle} className={action}>
            Contact Support
            <i
              className="fi fi-rr-arrow-small-right leading-none"
              aria-hidden="true"
            />
          </button>
        </p>
      )}
    </div>
  );
};

/**
 * Left card (sm and up): image + intro / contact info.
 *
 * @param {Object} props
 * @param {{ title: string, description: string }} props.intro Intro copy shown in the form view.
 * @param {boolean} props.showContact Whether the contact view is open.
 * @param {() => void} props.onToggle Switches between form and contact view.
 */
const SidePanel = ({ intro, showContact, onToggle }) => (
  <aside
    className={`relative hidden min-h-0 flex-1/3 flex-col overflow-hidden sm:flex ${fluid.panelGap} ${fluid.panelRadius} ${fluid.panelMinW} ${fluid.panelPad}`}
  >
    <Image
      alt=""
      src={AUTH_IMAGE}
      fill
      sizes="(min-width: 1024px) 33vw, 50vw"
      className="object-cover"
    />
    <div
      aria-hidden="true"
      className={`absolute inset-0 transition-colors duration-300 ${
        showContact ? "bg-neutral-950/80" : "bg-neutral-950/50"
      }`}
    />

    <BrandLogo className="relative z-10 shrink-0 self-start" />

    {/* Scrolls internally if the panel is too short, instead of growing */}
    <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto">
      <div
        className={`w-full ${showContact ? "my-auto" : "mt-auto"}`}
      >
        {showContact ? (
          <ContactList />
        ) : (
          <div className={`flex w-full flex-col ${fluid.panelStack}`}>
            <h2
              className={`font-primary font-semibold text-background ${fluid.panelTitle}`}
            >
              {intro.title}
            </h2>
            <p className={`text-neutral-300 ${fluid.panelDesc}`}>
              {intro.description}
            </p>
          </div>
        )}
      </div>
    </div>

    <ViewToggle
      showContact={showContact}
      onToggle={onToggle}
      className="relative z-10 shrink-0"
    />
  </aside>
);

/* -------------------------------------------------------------------------- */
/*  Layout                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Shared layout for the auth pages.
 *
 * Height behaviour:
 *  - below lg : locked to the screen height (h-dvh). Overflowing content
 *               scrolls inside the form area, the page itself never grows.
 *  - lg and up: at least the screen height, can grow with the content.
 *
 * @param {Object} props
 * @param {{ title: string, description: string }} props.intro Title and description for the side panel.
 * @param {React.ReactNode} props.children The page form.
 */
const AuthLayout = ({ intro, children }) => {
  // Single source of truth for the "Contact" view:
  //  - sm and up : the side panel swaps intro <-> contact info, form stays put
  //  - mobile    : the form area swaps form <-> contact info
  const [showContact, setShowContact] = useState(false);
  const toggleContact = () => setShowContact((prev) => !prev);

  return (
    <main className="relative h-dvh  bg-background ">
      {/* Mobile: full-screen background + overlay */}
      <div className="absolute inset-0 sm:hidden">
        <Image
          alt=""
          src={AUTH_IMAGE}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className={`absolute inset-0 transition-colors duration-300 ${
            showContact ? "bg-neutral-950/80" : "bg-neutral-950/60"
          }`}
        />
      </div>

      {/* Content container */}
      <div className="relative mx-auto flex h-full max-w-300 items-stretch justify-center gap-[clamp(1.5rem,4vw,2.5rem)] px-[clamp(1rem,4vw,2.5rem)] py-[clamp(1.5rem,4vw,2.5rem)] lg:h-auto lg:min-h-dvh">
        <SidePanel
          intro={intro}
          showContact={showContact}
          onToggle={toggleContact}
        />

        {/* Right: form (light text on mobile image, dark text on desktop) */}
        <section className="relative flex min-h-0 flex-2/3 flex-col">
          {/* Mobile logo (pinned, does not scroll) */}
          <BrandLogo
            className={`absolute left-1/2 z-10 -translate-x-1/2 sm:hidden ${fluid.mobileTop}`}
          />

          {/* Scroll area: only this part scrolls when content is taller than the screen */}
          <div
            className={`flex min-h-0 flex-1 flex-col items-center overflow-y-auto lg:overflow-visible ${fluid.mobilePb} ${fluid.mobilePt}`}
          >
            {/* my-auto = centered when short, top-aligned (no clipping) when tall */}
            <div className="my-auto w-full max-w-md">
              {/* Mobile-only contact view (desktop shows it inside the side panel) */}
              {showContact && (
                <div className="z-10 w-full sm:hidden">
                  <ContactList />
                </div>
              )}

              {/* Form: always visible on desktop, hidden on mobile while contact is open */}
              <div className={showContact ? "max-sm:hidden" : ""}>
                {children}
              </div>
            </div>
          </div>

          {/* Mobile-only toggle (pinned to the bottom, does not scroll) */}
          <ViewToggle
            showContact={showContact}
            onToggle={toggleContact}
            align="center"
            className={`absolute inset-x-0 z-10 sm:hidden ${fluid.mobileBottom}`}
          />
        </section>
      </div>
    </main>
  );
};

export default AuthLayout;