"use client";

import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Input";
import Logo from "@/app/components/Logo";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

const AUTH_IMAGE = "/authImage.jpg";

const intro = {
  title: "Your Career Starts With a Strong Resume",
  description:
    "Create a professional, ATS-friendly resume with AI-powered content suggestions and smart templates—so you can present your skills with confidence.",
};

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
/*  Fluid tokens                                                              */
/*  Every value scales linearly between its min and max with the viewport      */
/*  (clamp), so nothing jumps at a breakpoint.                                 */
/*  - shared tokens : 375px -> 1280px                                          */
/*  - panel tokens  : 640px -> 1280px (the side panel only exists from sm up)  */
/* -------------------------------------------------------------------------- */

const fluid = {
  // side panel (640 -> 1280)
  panelRadius: "rounded-[clamp(0.75rem,0rem_+_1.875vw,1.5rem)]", // 12 -> 24
  panelMinW: "min-w-[clamp(17.5rem,15rem_+_6.25vw,20rem)]", // 280 -> 320
  panelPad: "p-[clamp(1.5rem,1rem_+_1.25vw,2rem)]", // 24 -> 32

  // shared (375 -> 1280)
  logo: "h-[clamp(2.125rem,calc(1.13vw+1.86rem),2.875rem)]", // 34 -> 46
  panelTitle: "text-[length:clamp(1.625rem,1.47rem_+_0.663vw,2rem)]", // 26 -> 32
  panelDesc: "text-[length:clamp(1rem,0.948rem_+_0.221vw,1.125rem)]", // 16 -> 18
  panelStack: "gap-[clamp(0.5rem,0.396rem_+_0.442vw,0.75rem)]", // 8 -> 12
  helpText: "text-[length:clamp(0.875rem,0.823rem_+_0.221vw,1rem)]", // 14 -> 16

  // contact list
  contactMt: "mt-[clamp(1rem,0.793rem_+_0.884vw,1.5rem)]", // 16 -> 24
  contactText: "text-[length:clamp(1rem,0.948rem_+_0.221vw,1.125rem)]", // 16 -> 18
  contactBox: "size-[clamp(1.875rem,1.72rem_+_0.663vw,2.25rem)]", // 30 -> 36
  contactGlyph: "text-[length:clamp(0.75rem,0.698rem_+_0.221vw,0.875rem)]", // 12 -> 14

  // login form
  formGap: "gap-[clamp(1.5rem,1.137rem_+_1.547vw,2.375rem)]", // 24 -> 38
  headGap: "gap-[clamp(0.25rem,0.146rem_+_0.442vw,0.5rem)]", // 4 -> 8
  welcome: "text-[length:clamp(1.5rem,1.293rem_+_0.884vw,2rem)]", // 24 -> 32
  subtitle: "text-[length:clamp(0.75rem,0.698rem_+_0.221vw,0.875rem)]", // 12 -> 14
  fieldsGap: "gap-[clamp(1rem,0.793rem_+_0.884vw,1.5rem)]", // 16 -> 24
  forgot: "text-[length:clamp(0.813rem,0.735rem_+_0.331vw,1rem)]", // 13 -> 16
  orText: "text-[length:clamp(0.75rem,0.698rem_+_0.221vw,0.875rem)]", // 12 -> 14
  socialH: "h-[clamp(2.75rem,2.698rem_+_0.221vw,2.875rem)]", // 44 -> 46
  socialIcon: "text-[length:clamp(1.25rem,0.991rem_+_1.105vw,1.875rem)]", // 20 -> 30
  googleIcon: "size-[clamp(1.25rem,0.991rem_+_1.105vw,1.875rem)]", // 20 -> 30
  signupMt: "mt-[clamp(1.5rem,1.396rem_+_0.442vw,1.75rem)]", // 24 -> 28
  signupText: "text-[length:clamp(1rem,0.948rem_+_0.221vw,1.125rem)]", // 16 -> 18
  signupLink: "text-[length:clamp(0.938rem,0.912rem_+_0.11vw,1rem)]", // 15 -> 16

  // spacing (375 -> 1280)
  gapIcon: "gap-[clamp(0.25rem,0.198rem_+_0.221vw,0.375rem)]", // 4 -> 6   text <-> arrow icon
  gapInline: "gap-[clamp(0.5rem,0.448rem_+_0.221vw,0.625rem)]", // 8 -> 10  icon <-> text, "Don't have an account?"
  gapTight: "gap-[clamp(0.375rem,0.323rem_+_0.221vw,0.5rem)]", // 6 -> 8   password field <-> forgot link
  helpGap: "gap-[clamp(0.625rem,0.573rem_+_0.221vw,0.75rem)]", // 10 -> 12 "Need Help?" <-> link
  gapMd: "gap-[clamp(1rem,0.793rem_+_0.884vw,1.5rem)]", // 16 -> 24 divider / social buttons
  dividerMy: "my-[clamp(0.5rem,0.396rem_+_0.442vw,0.75rem)]", // 8 -> 12
  contactGap: "gap-[clamp(1.5rem,1.293rem_+_0.884vw,2rem)]", // 24 -> 32 between contact rows

  // side panel spacing (640 -> 1280)
  panelGap: "gap-[clamp(1.5rem,1rem_+_1.25vw,2rem)]", // 24 -> 32

  // mobile-only offsets (375 -> 640): room for the pinned logo / toggle
  mobilePt: "max-sm:pt-[clamp(6rem,4.585rem_+_6.038vw,7rem)]", // 96 -> 112
  mobilePb: "max-sm:pb-[clamp(5rem,3.585rem_+_6.038vw,6rem)]", // 80 -> 96
  mobileTop: "top-[clamp(1.5rem,0.792rem_+_3.019vw,2rem)]", // 24 -> 32
  mobileBottom: "bottom-[clamp(1.5rem,0.792rem_+_3.019vw,2rem)]", // 24 -> 32
};

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
 *  - login view   -> "Need Help? Contact Support"
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
const SidePanel = ({ showContact, onToggle }) => (
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

const SignUpForm = () => (
  <>
    <form action="" className={`flex flex-col ${fluid.formGap}`}>
      <div className={`flex flex-col *:text-center ${fluid.headGap}`}>
        <h2
          className={`font-semibold text-background sm:text-neutral-950 ${fluid.welcome}`}
        >
          Create Your Account
        </h2>
        <p
          className={`text-neutral-300 opacity-70 sm:text-neutral-600 ${fluid.subtitle}`}
        >
          Sign up to build, manage, and improve your professional resume with
          powerful AI-driven tools and modern resume templates.
        </p>
      </div>

      <div className={`flex flex-col ${fluid.fieldsGap}`}>
        <Input
          label="Name"
          placeholder="John Doe"
          isLabelIcon
          labelIcon="fi fi-rr-user"
          darkBg
        />

        <Input
          label="Email"
          placeholder="you@example.com"
          isLabelIcon
          labelIcon="fi fi-rr-envelope"
          darkBg
        />

        {/* Password + forgot link */}
        <Input
          label="Create a Password"
          placeholder="Enter your password"
          type="password"
          isLabelIcon
          labelIcon="fi fi-rr-lock"
          className="max-sm:text-black"
          darkBg
        />

        <Button type="submit">Sign Up</Button>

        {/* Divider */}
        <div
          className={`flex items-center text-neutral-300 ${fluid.dividerMy} ${fluid.gapMd}`}
        >
          <span className="h-px flex-1 rounded-full bg-current opacity-50" />
          <span className={`font-medium uppercase ${fluid.orText}`}>or</span>
          <span className="h-px flex-1 rounded-full bg-current opacity-50" />
        </div>

        {/* Social login */}
        <div className={`flex *:flex-1 ${fluid.gapMd}`}>
          <button
            type="button"
            aria-label="Continue with Facebook"
            className={`flex min-h-11 items-center justify-center rounded-xs bg-[#0165E1] text-neutral-50 ${fluid.socialH}`}
          >
            <i
              className={`fi fi-brands-facebook leading-none ${fluid.socialIcon}`}
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            aria-label="Continue with Google"
            className={`flex min-h-11 items-center justify-center rounded-xs bg-neutral-50 text-neutral-950 sm:border sm:border-neutral-200 ${fluid.socialH}`}
          >
            <Image
              src="/googleLogo.svg"
              alt=""
              width={30}
              height={30}
              className={fluid.googleIcon}
            />
          </button>
        </div>
      </div>
    </form>

    <p
      className={`flex items-center justify-center text-center font-medium text-neutral-300 sm:text-neutral-500 ${fluid.gapInline} ${fluid.signupMt} ${fluid.signupText}`}
    >
      Already Have an Account?
      <Link
        href="/login"
        className={`inline-flex min-h-11 items-center font-semibold text-primary-100 sm:text-primary-300 ${fluid.gapIcon} ${fluid.signupLink}`}
      >
        Login
        <i
          className="fi fi-rr-arrow-small-right leading-none"
          aria-hidden="true"
        />
      </Link>
    </p>
  </>
);

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

const Page = () => {
  // Single source of truth for the "Contact" view:
  //  - sm and up : the side panel swaps intro <-> contact info, form stays put
  //  - mobile    : the form area swaps login <-> contact info
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
        <SidePanel showContact={showContact} onToggle={toggleContact} />

        {/* Right: login form (light text on mobile image, dark text on desktop) */}
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
            <SignUpForm />
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

export default Page;
