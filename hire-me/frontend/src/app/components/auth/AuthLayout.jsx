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

const BrandLogo = ({ className = "" }) => (
  <Link href="/" aria-label="HireMe home" className={className}>
    <Logo
      variant="textWhite"
      className={`${fluid.logo} max-h-11.5 min-h-8.5`}
    />
  </Link>
);

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

/** Left card (sm and up): image + intro / contact info. */
const SidePanel = ({ intro, showContact, onToggle }) => (
  <aside
    className={`relative hidden flex-1/3 flex-col overflow-hidden sm:flex ${fluid.panelGap} ${fluid.panelRadius} ${fluid.panelMinW} ${fluid.panelPad}`}
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

    <BrandLogo className="relative z-10 self-start" />

    <div
      className={`relative z-10 flex min-h-0 flex-1 flex-col ${
        showContact ? "justify-center" : "justify-end"
      }`}
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

    <ViewToggle
      showContact={showContact}
      onToggle={onToggle}
      className="relative z-10"
    />
  </aside>
);

/* -------------------------------------------------------------------------- */
/*  Layout                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * @param {{ intro: { title: string, description: string }, children: React.ReactNode }} props
 */
const AuthLayout = ({ intro, children }) => {
  // Single source of truth for the "Contact" view:
  //  - sm and up : the side panel swaps intro <-> contact info, form stays put
  //  - mobile    : the form area swaps form <-> contact info
  const [showContact, setShowContact] = useState(false);
  const toggleContact = () => setShowContact((prev) => !prev);

  return (
    <main className="relative min-h-dvh bg-background">
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
      <div className="relative mx-auto flex min-h-dvh max-w-300 items-stretch justify-center gap-[clamp(1.5rem,4vw,2.5rem)] px-[clamp(1rem,4vw,2.5rem)] py-[clamp(1.5rem,4vw,2.5rem)]">
        <SidePanel
          intro={intro}
          showContact={showContact}
          onToggle={toggleContact}
        />

        {/* Right: form (light text on mobile image, dark text on desktop) */}
        <section
          className={`relative flex flex-2/3 flex-col items-center justify-center ${fluid.mobilePb} ${fluid.mobilePt}`}
        >
          {/* Mobile logo */}
          <BrandLogo
            className={`absolute left-1/2 z-10 -translate-x-1/2 sm:hidden ${fluid.mobileTop}`}
          />

          {/* Mobile-only contact view (desktop shows it inside the side panel) */}
          {showContact && (
            <div className="z-10 w-full max-w-md sm:hidden">
              <ContactList />
            </div>
          )}

          {/* Form: always visible on desktop, hidden on mobile while contact is open */}
          <div
            className={`w-full max-w-md ${showContact ? "max-sm:hidden" : ""}`}
          >
            {children}
          </div>

          {/* Mobile-only toggle, pinned to the bottom */}
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
