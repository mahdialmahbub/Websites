/**
 * HireMe — Footer
 *
 * Eta server component (kono useState nai). Interactive 2 ta ongsho alada
 * client component e ache:
 *   ./FooterLinks.jsx  — mobile/tab accordion  (state: openId)
 *   ./Newsletter.jsx   — email signup          (state: email)
 *   ./shared.jsx       — FOCUS, Title
 * Shob file ek-i folder e rakho.
 *
 * Layout (Tailwind breakpoints):
 *   Mobile   < 768px  (default) → 1 column, niche niche: Brand → Accordion links → Newsletter
 *   Tab      ≥ 768px  (md)      → 2 columns: brand + newsletter left, accordion links right
 *   Desktop  ≥ 1024px (lg)      → 5 columns, links always visible
 *
 * Fluid sizes: shob clamp() 375px → 1440px range er jonno banano.
 *   slope(vw)  = (maxPx - minPx) / (1440 - 375) * 100
 *   intercept  = minPx - slope/100 * 375   (rem e: ÷16)
 * calc() er vitore operator er duidike `_` dewa (Tailwind e space bujhay), jate parse error na hoy.
 *
 * Icons: Flaticon UIcons from the CDN (no react-icons needed).
 * Add these two stylesheets ONCE, in the <head> of app/layout.jsx:
 *
 *   <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/2.6.0/uicons-regular-rounded/css/uicons-regular-rounded.css" />
 *   <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/2.6.0/uicons-brands/css/uicons-brands.css" />
 *
 * Needs: Tailwind CSS, Poppins font (400, 500, 600, 700).
 * Brand colour = Tailwind `purple-600` (#9333EA). Swap it if your theme differs.
 *
 * Usage:
 *   <Footer onSubscribe={(email) => console.log(email)} />
 *
 * NOTE: Footer server component, tai server file (layout.jsx) theke `onSubscribe`
 * e inline function dile Next error dey. Seta Server Action hote hobe
 * ("use server"), ba Footer ke client component theke render korte hobe.
 */

import Link from "next/link";
import FooterLinks from "./FooterLinks";
import Newsletter from "./Newsletter";
import { FOCUS } from "./shared";
import Logo from "../Logo";
import Image from "next/image";
import { icons } from "../../../../assets/iconCollection";

const SOCIALS = [
  { label: "Facebook", href: "#", icon: icons.facebook },
  { label: "X", href: "#", icon: icons.twitter },
  { label: "Instagram", href: "#", icon: icons.instagram },
  { label: "LinkedIn", href: "#", icon: icons.linkedin },
  { label: "WhatsApp", href: "#", icon: icons.whatsapp },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Cookies Policy", href: "/cookies" },
];

export default function Footer({ onSubscribe }) {
  const year = new Date().getFullYear();

  return (
    <footer className="overflow-hidden bg-neutral-50 border-t border-[#7F6FFF]/20 w-full">
      {/* padding-x: 16px@375 → 80px@1440 | padding-y: 32px@375 → 60px@1440 */}
      <div className="mx-auto w-full max-w-300 min-w-[320px] px-[clamp(1rem,calc(6.01vw-0.41rem),5rem)] py-[clamp(2rem,calc(2.629vw+1.384rem),3.75rem)]">
        {/*
          Mobile : 1 column, gap-y-8 diye 3 ta block alada
          Tab    : 2 columns (1fr | 1.4fr), 2 rows (auto | 1fr) — row gap 0, Newsletter e mt-8
          Desktop: 5 columns, rows auto
        */}
        <div className="grid grid-cols-1 gap-y-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:grid-rows-[auto_1fr] md:gap-x-4 md:gap-y-0 lg:gap-x-10 lg:grid-cols-[minmax(0,1.75fr)_repeat(3,minmax(0,1fr))_minmax(0,1.5fr)] lg:grid-rows-none">
          {/* Brand */}
          <div className="md:col-start-1 md:row-start-1 lg:col-auto lg:row-auto">
            {/* 42px@375 → 48px@1440 */}
            <Logo className="h-[clamp(2.625rem,calc(0.563vw+2.493rem),3rem)]" />
            {/* 14px@375 → 16px@1440 (md:text-base soriye dewa hoyeche, noile 768 e jump korto) */}
            <p className="mt-3 text-[clamp(0.875rem,calc(0.188vw+0.831rem),1rem)] text-neutral-400 md:mt-4">
              Build a professional, ATS-friendly resume with AI-powered guidance, smart templates, and personalized content—so you can apply with confidence and stand out to the right employers.
            </p>
            <ul className="mt-4 md:mt-6.5 flex gap-2.5">
              {SOCIALS.map(({ label, href, icon }) => (
                <li key={label}>
                  <Link
                    href={href}
                    aria-label={label}
                    {...(href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border border-[#121212]/10 group transition-transform hover:-translate-y-1.5 ${FOCUS}`}
                  >
                    <Image src={icon} alt={label} width={20} height={20} className="w-auto h-4.5 md:h-[20px] opacity-60 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Link groups: mobile e 1 column accordion, tab e right column, desktop e 3 ta grid column */}
          <FooterLinks />

          {/* Newsletter */}
          <Newsletter
            onSubscribe={onSubscribe}
            className="md:col-start-1 md:row-start-2 md:mt-8 lg:col-auto lg:row-auto lg:mt-0"
          />
        </div>

        {/* Bottom bar — margin-top: 20px@375 → 28px@1440 | text: 12px@375 → 14px@1440 */}
        <div className="flex flex-col items-center gap-2.5 border-t border-black/10 pt-4 sm:flex-row sm:justify-between mt-[clamp(1.25rem,calc(0.751vw+1.074rem),1.75rem)] text-[#121212]/40">
          <p className="text-[clamp(0.75rem,calc(0.706rem+0.188vw),0.875rem)]">
            © {year} HireMe. All rights reserved.
          </p>
          <ul className="flex items-center justify-center text-neutral-500 text-[clamp(0.75rem,calc(0.706rem+0.188vw),0.875rem)]">
            {LEGAL_LINKS.map(({ label, href }, i) => (
              <li
                key={label}
                className={i ? "ml-3 border-l border-[#121212]/40 pl-3 text-[#121212]/40" : ""}
              >
                <Link href={href} className={`transition-colors hover:text-purple-600 ${FOCUS}`}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Watermark — margin-top: 20px@375 → 28px@1440 */}
        <div aria-hidden="true" className="pointer-events-none mt-[clamp(1.25rem,calc(0.752vw+1.074rem),1.75rem)] relative">
          <Image alt="footer watermark image" src="/logoWatermark.svg" width={1280} height={300} className="w-full h-auto opacity-10" />

          {/* overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-neutral-50 to-transparent" />
        </div>
      </div>
    </footer>
  );
}
