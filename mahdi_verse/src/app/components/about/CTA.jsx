"use client";

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
    <section className="relative w-full overflow-hidden">
      <div className="relative mx-auto flex min-h-50 w-full items-center justify-center">
        <div className="relative z-10 flex max-w-162.5 flex-col items-center text-center">
          {/* Heading */}
          <FadeUp
            as="h2"
            className="
              mt-4
              text-3xl
              font-semibold
              leading-tight
              tracking-[-0.04em] text-size-2xl
            "
          >
            Have a project in mind?
          </FadeUp>

          {/* Subtitle */}
          <FadeUp
            as="p"
            delay={0.1}
            className="
              mt-4
              max-w-125
              text-sm
              leading-6
              text-slate-500
              sm:text-[15px]
            "
          >
            Tell me what you&apos;re building — I&apos;ll get back to you within
            a day.
          </FadeUp>

          {/* CTA */}
          <FadeUp delay={0.2} className="mt-space-6">
            <Link href={"/contact"}>
              <Button text={"Let's talk about it"} />
            </Link>
          </FadeUp>

          {/* Contact links */}
          <FadeUp
            delay={0.3} distance={0.1}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3"
          >
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
          </FadeUp>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
