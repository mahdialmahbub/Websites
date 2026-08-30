"use client";

import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import logo from "@/app/assets/logo.png"; // adjust to your actual logo asset path
import Button from "./Button";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

const categoryLinks = [
  { label: "Home Decor", href: "/category/home-decor" },
  { label: "Kitchen Accessories", href: "/category/kitchen-accessories" },
  { label: "Small Home Appliances", href: "/category/small-home-appliances" },
  { label: "Lifestyle Products", href: "/category/lifestyle-products" },
];

const supportLinks = [
  { label: "FAQ", href: "/faq" },
  { label: "Shipping & Delivery", href: "/shipping" },
  { label: "Returns & Refunds", href: "/returns" },
  { label: "Track My Order", href: "/track-order" },
];

const legalLinks = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Cookies", href: "/cookies" },
];

const paymentMethods = ["Visa", "Mastercard", "American Express"];

// Simple, monochrome inline icons — no external icon-set dependency, always render.
const socialLinks = [
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="w-4 h-4"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31 31 0 000 12a31 31 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1A31 31 0 0024 12a31 31 0 00-.5-5.8zM9.6 15.6V8.4l6.4 3.6-6.4 3.6z" />
      </svg>
    ),
  },
];

const FooterColumn = ({ title, links }) => (
  <div>
    <h4 className="font-primary font-semibold text-size-h6 text-foreground uppercase tracking-wide mb-space-4">
      {title}
    </h4>
    <ul className="space-y-space-3">
      {links.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            className="text-placeholder_3 hover:text-secondary text-size-large transition-colors"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    // TODO: wire this up to your real newsletter-subscription endpoint
    toast.success("Thanks for subscribing!");
    setEmail("");
  };

  return (
    <footer className="bg-background border-t border-secondary/10">
      <div className="max-w-7xl mx-auto px-space-6 md:px-space-9">
        {/* Newsletter strip */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-space-4 py-space-7 border-b border-secondary/10">
          <div className="text-center md:text-left">
            <h3 className="font-primary font-semibold text-size-h5 text-foreground">
              Get 10% off your first order
            </h3>
            <p className="text-placeholder_3 text-size-large mt-1">
              Subscribe for exclusive deals, new arrivals, and tech tips.
            </p>
          </div>

          <form
            onSubmit={handleNewsletterSubmit}
            className="flex items-center gap-space-2 w-full md:w-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 md:w-72 bg-background border border-secondary/15 rounded-lg px-space-4 py-space-3 text-size-large text-foreground placeholder:text-placeholder_3 outline-none focus:border-secondary transition-colors"
            />
            <Button
              type="submit"
              variant="secondary"
            >
              Subscribe
            </Button>
          </form>
        </div>

        {/* Main columns */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-space-7 py-space-9">
          {/* Brand */}
          <div className="col-span-2">
            <Image src={logo} alt="TechWorld" height={40} className="h-9 w-auto" />

            <p className="text-placeholder_3 text-size-large mt-space-3 max-w-xs">
              Your trusted destination for the latest tech gadgets, accessories,
              and smart devices at the best prices.
            </p>

            <div className="flex items-center gap-space-3 mt-space-5">
              {socialLinks.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-secondary/10 text-secondary hover:bg-secondary hover:text-background transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Quick Links" links={quickLinks} />
          <FooterColumn title="Shop by Category" links={categoryLinks} />
          <FooterColumn title="Customer Service" links={supportLinks} />

          {/* Contact */}
          <div>
            <h4 className="font-primary font-semibold text-size-h6 text-foreground uppercase tracking-wide mb-space-4">
              Contact
            </h4>
            <ul className="space-y-space-3">
              <li className="flex items-start gap-space-2 text-placeholder_3 text-size-large">
                <i className="fi fi-rr-marker mt-1 text-secondary shrink-0" />
                <span>245 Market Street, San Francisco, CA 94105, USA.</span>
              </li>
              <li className="flex items-center gap-space-2 text-placeholder_3 text-size-large">
                <i className="fi fi-rr-phone-call text-secondary shrink-0" />
                <span>+1 (415) 987-6543</span>
              </li>
              <li className="flex items-center gap-space-2 text-placeholder_3 text-size-large">
                <i className="fi fi-rr-envelope text-secondary shrink-0" />
                <span>support@techworld.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-space-4 py-space-5 border-t border-secondary/10">
          <p className="text-placeholder_3 text-size-medium order-3 md:order-1">
            © {new Date().getFullYear()} TechWorld. All rights reserved.
          </p>

          <div className="flex items-center gap-space-5 order-1 md:order-2">
            {legalLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-placeholder_3 hover:text-secondary text-size-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-space-2 order-2 md:order-3">
            {paymentMethods.map((method) => (
              <span
                key={method}
                className="text-size-medium font-medium text-placeholder_3 border border-secondary/15 rounded px-space-2 py-1"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
