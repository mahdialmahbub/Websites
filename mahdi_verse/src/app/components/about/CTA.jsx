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
              max-w-125
              text-sm
              leading-6
              text-slate-500
              sm:text-[15px]
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
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
            {contactLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  item.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="
                  relative
                  text-size-xs_2
                  font-medium
                  text-slate-500

                  transition-colors
                  duration-200

                  hover:text-cyan-400

                  after:absolute
                  after:-bottom-1
                  after:left-0
                  after:h-px
                  after:w-0
                  after:bg-cyan-400
                  after:transition-all
                  after:duration-300
                  hover:after:w-full
                "
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </FadeUp>
  );
};

export default ContactCTA;
