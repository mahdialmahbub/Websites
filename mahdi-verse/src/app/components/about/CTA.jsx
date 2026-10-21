import React from "react";
import Link from "next/link";
import Button from "../Button";
import FadeUp from "../motions/FadeUp";

const contactLinks = [
  {
    label: "Email",
    href: "mailto:hello@example.com",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
  },
  {
    label: "GitHub",
    href: "https://github.com",
  },
  {
    label: "Behance",
    href: "https://behance.net",
  },
];

const ContactCTA = () => {
  return (
    <FadeUp as="section" className="relative w-full overflow-hidden">
      <div className="relative mx-auto flex min-h-50 w-full items-center justify-center">
        <div className="relative z-10 flex max-w-162.5 flex-col items-center text-center">
          {/* Heading */}
          <h2
            className="
              mt-4
              text-3xl
              font-semibold
              leading-tight
              tracking-[-0.04em] text-size-2xl
            "
          >
            Have a project in mind?
          </h2>

          {/* Subtitle */}
          <p
            className="
              mb-6
              mt-2
              text-base
              leading-6
              text-placeholder/90
              dark:text-placeholder_2/90
            "
          >
            Tell me what you&apos;re building — I&apos;ll get back to you within
            a day.
          </p>

          {/* CTA */}
          <Link href={"/contact"}>
            <Button text={"Let's talk about it"} />
          </Link>

          {/* Contact links */}
        </div>
      </div>
    </FadeUp>
  );
};

export default ContactCTA;
