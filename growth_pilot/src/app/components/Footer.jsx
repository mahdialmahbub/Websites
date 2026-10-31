"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { assets, socialIcons } from "../assets/assets";
import FadeUpText from "./motions/FadeUpText";
import FadeRight from "./motions/FadeRight";
import FadeUp from "./motions/FadeUp";
import Reveal from "./motions/Reveal";

const Footer = () => {
  const footerLinks = {
    productLinks: [
      { name: "Features", href: "#" },
      { name: "Pricing", href: "#" },
      { name: "Integrations", href: "#" },
      { name: "Updates", href: "#" },
    ],

    companyLinks: [
      { name: "About Us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Contact", href: "#" },
    ],

    supportAndLegal: [
      { name: "Help Center", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "FAQs", href: "#" },
    ],
  };

  return (
      <footer
        className="
          relative overflow-hidden
          rounded-[clamp(1rem,0.9091rem+0.4545vw,1.25rem)]
          border border-black/10 dark:border-white/10
          bg-[#f8fafc] dark:bg-[#080b10]
          p-[clamp(2rem,1.2727rem+3.6364vw,4rem)]
        "
      >
        {/* Background Glow */}
        <div
          className="
            pointer-events-none absolute
            -top-28 -right-20
            size-72 rounded-full
            bg-accent5/5 blur-3xl
          "
        />

        <div
          className="
            pointer-events-none absolute
            -bottom-30 -left-20
            size-80 rounded-full
            bg-accent5/5 blur-3xl
          "
        />

        {/* Top Content */}
        <div
          className="
            relative z-10
            grid grid-cols-1
            gap-10
            md:grid-cols-2
            xl:grid-cols-[1.6fr_1fr_1fr_1fr]
            xl:gap-12
          "
        >
          {/* Brand */}
          <div className="max-w-105">
            {/* Logo */}

            {/* Heading */}
            <FadeRight className="max-w-90 text-2xl font-semibold leading-tight tracking-tight text-black dark:text-white md:text-3xl">
              Build smarter.
              <FadeRight as="span" className="block text-secondary2">
                Grow faster.
              </FadeRight>
            </FadeRight>

            {/* Description */}
            <FadeRight
              as="p"
              delay={0.3}
              className="mt-2 max-w-97.5  leading-6 text-black/60 dark:text-white/60 text-base"
            >
              Your trusted destination for the latest tech gadgets, accessories,
              and smart devices at the best prices.
            </FadeRight>
          </div>

          {/* Product */}
          <div>
            <FadeRight
              as="h3"
              delay={0.3}
              className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-black dark:text-white"
            >
              Product
            </FadeRight>

            <FadeUp delay={0.3} className="flex flex-col gap-4">
              {footerLinks.productLinks.map((item, i) => (
                <FadeUp key={i} delay={i * 0.5}>
                  <Link
                    href={item.href}
                    className="
                    group flex w-fit items-center
                    text-sm font-medium
                    text-black/60
                    transition-colors duration-200
                    hover:text-primary
                    dark:text-white/60
                    dark:hover:text-primary
                  "
                  >
                    <span>{item.name}</span>
                  </Link>
                </FadeUp>
              ))}
            </FadeUp>
          </div>

          {/* Company */}
          <div>
            <FadeRight
              as="h3"
              delay={0.6}
              className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-black dark:text-white"
            >
              Company
            </FadeRight>

            <FadeUp delay={0.6} className="flex flex-col gap-4">
              {footerLinks.companyLinks.map((item, i) => (
                <FadeUp key={i} delay={i * 0.5}>
                  <Link
                    href={item.href}
                    className="
                    group flex w-fit items-center
                    text-sm
                    text-black/70
                    transition-colors duration-200
                    hover:text-primary
                    dark:text-white/70
                    dark:hover:text-primary
                  "
                  >
                    <span>{item.name}</span>
                  </Link>
                </FadeUp>
              ))}
            </FadeUp>
          </div>

          {/* Support */}
          <div>
            <FadeRight
              as="h3"
              delay={0.9}
              className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-black dark:text-white space-x-xl"
            >
              Support
            </FadeRight>

            <FadeUp delay={0.9} className="flex flex-col gap-4">
              {footerLinks.supportAndLegal.map((item, i) => (
                <FadeUp key={i} delay={i * 0.5}>
                  <Link
                    href={item.href}
                    className="
                    group flex w-fit items-center
                    text-sm font-medium
                    text-black/60
                    transition-colors duration-200
                    hover:text-primary
                    dark:text-white/60
                    dark:hover:text-primary
                  "
                  >
                    <span>{item.name}</span>
                  </Link>
                </FadeUp>
              ))}
            </FadeUp>
          </div>
        </div>

        {/* Social */}
        <div className="flex justify-between max-md:flex-col space-y-space-md2 items-center mt-6">
          <div className="flex items-center gap-3.5">
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
                    hover:border-secondary2/30
                    hover:bg-secondary2/5
                    dark:border-white/10
                    dark:bg-white/5
                    dark:hover:bg-secondary2/10
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
          <Reveal delay={0.3} distance={0}>
            <Image
              src="/growthpilot-logo-black.svg"
              alt="GrowthPilot"
              width={120}
              height={50}
              className="h-11 object-contain dark:hidden cursor-pointer"
            />

            <Image
              src="/growthpilot-logo-white.svg"
              alt="GrowthPilot"
              width={120}
              height={50}
              className="hidden h-11 object-contain dark:block cursor-pointer"
            />
          </Reveal>
        </div>

        {/* Divider */}
        <div className="relative z-10 my-8 h-px w-full bg-black/8 dark:bg-white/8 rounded-full" />

        {/* Bottom Bar */}
        <div
          className="
            relative z-10
            flex flex-col gap-3
            text-center
            md:flex-row
            md:items-center
            md:justify-between
            md:text-left
          "
        >
          <p className="text-[clamp(0.75rem,0.7045rem+0.2273vw,0.875rem)] text-black/50 dark:text-white/50">
            © {new Date().getFullYear()} GrowthPilot. All rights reserved.
          </p>

          <div className="flex items-center justify-center gap-2 text-[clamp(0.75rem,0.7045rem+0.2273vw,0.875rem)] text-black/40 dark:text-white/40">
            <span>Built for better digital experiences</span>

            <span className="text-primary animate-bounce">✦</span>
          </div>
        </div>
      </footer>
  );
};

export default Footer;
