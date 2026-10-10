"use client";

/**
 * Footer er link columns.
 *   Desktop (>= 1024px, lg) : 3 ta column, link gulo shobshomoy dekha jay
 *   Tab (>= 768px, md)      : accordion, Footer grid er right column e
 *   Mobile (< 768px)        : accordion, 1 column e niche niche
 *
 * State: `openId` (kon accordion khola) — tai eta client component.
 * Wrapper div desktop e `lg:contents`, tai Footer er grid er 3 ta column hoye jay.
 *
 * Fluid values (375px → 1440px):
 *   heading gap : 12px → 16px
 *   link text   : 16px → 13px   (mobile e boro, desktop e choto)
 *   link gap    : 14px → 16px
 */

import { useState } from "react";
import { FOCUS, Title } from "./shared";
import Link from "next/link";

// Desktop order: Product Links · Resources · Company
// Tab/Mobile order: Product Links · Company · Resources (`layout` handles that)
const LINK_GROUPS = [
  {
    id: "product",
    title: "Product Links",
    layout: "order-1 border-b",
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Templates", href: "/templates" },
      { label: "AI Score", href: "/ai-score" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    id: "resources",
    title: "Resources",
    layout: "order-3 pb-0",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Resume Tips", href: "/resume-tips" },
      { label: "Career Guide", href: "/career-guide" },
      { label: "Help Center", href: "/help" },
      { label: "Support", href: "/support" },
    ],
  },
  {
    id: "company",
    title: "Company",
    layout: "order-2 border-b",
    links: [
      { label: "About Us", href: "/about" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Our Mission", href: "/mission" },
      { label: "Careers", href: "/careers" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
];

function LinkGroup({ id, title, links, layout, open, onToggle }) {
  const panelId = `footer-${id}-links`;

  return (
    <div
      className={`border-neutral-200 py-4 first:pt-0 lg:order-0 lg:border-b-0 lg:py-0 ${layout}`}
    >
      {/* Desktop: plain heading */}
      <h3 className="hidden lg:block mb-[clamp(0.75rem,calc(0.662rem+0.3756vw),1rem)]">
        <Title>{title}</Title>
      </h3>

      {/* Tab / Mobile: accordion trigger (margin ta panel er vitore, jate bondho obosthay extra gap na thake) */}
      <h3 className="lg:hidden">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className={`flex w-full items-start justify-between text-left ${FOCUS}`}
        >
          <Title>{title}</Title>
          <i
            className={`fi-rr-angle-small-down text-[20px] text-neutral-800 transition-transform duration-300 motion-reduce:transition-none ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </h3>

      {/* Panel: lg er niche collapse hoy, desktop e shobshomoy open */}
      <div
        id={panelId}
        className={`grid transition-[grid-template-rows,visibility] duration-300 motion-reduce:transition-none lg:visible lg:grid-rows-[1fr] ${
          open ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <ul className="pt-[clamp(0.75rem,calc(0.662rem+0.3756vw),1rem)] lg:pt-0 space-y-[clamp(0.875rem,calc(0.831rem+0.188vw),1rem)]">
            {links.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className={`rounded-sm text-[clamp(0.8125rem,calc(1.066rem-0.2817vw),1rem)] leading-5 text-[#0B1120]/60 transition-colors hover:text-purple-600 ${FOCUS}`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function FooterLinks() {
  const [openId, setOpenId] = useState("company");

  return (
    <div className="flex flex-col md:col-start-2 md:row-span-2 md:row-start-1 lg:contents">
      {LINK_GROUPS.map((group) => (
        <LinkGroup
          key={group.id}
          {...group}
          open={openId === group.id}
          onToggle={() => setOpenId(openId === group.id ? null : group.id)}
        />
      ))}
    </div>
  );
}
