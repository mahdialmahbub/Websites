"use client";

/**
 * "Stay Updated" signup box.
 * State: `email` (controlled input) — tai eta client component.
 *
 *   <Newsletter onSubscribe={(email) => ...} className="..." />
 *
 * Fluid values (375px → 1440px):
 *   heading → text gap : 12px → 16px
 *   text size          : 16px → 13px
 *   text → form gap    : 16px → 26px
 */

import { useState } from "react";
import { Title } from "./shared";

export default function Newsletter({ className = "", onSubscribe }) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = email.trim();
    if (!value) return;
    onSubscribe?.(value);
    setEmail("");
  };

  return (
    <div className={className}>
      <h3>
        <Title>Stay Updated</Title>
      </h3>
      <p className="mt-[clamp(0.75rem,calc(0.662rem+0.3756vw),1rem)] text-[clamp(0.8125rem,calc(1.066rem-0.2817vw),1rem)] leading-4.5 text-[#0B1120]/60">
        Subscribe To Get The Latest Updates, Tips And Resources.
      </p>

      <form onSubmit={handleSubmit} className="mt-[clamp(1rem,calc(0.781rem+0.939vw),1.625rem)]">
        <label htmlFor="footer-subscribe-email" className="sr-only">
          Email address
        </label>
        <div className="flex h-11 overflow-hidden rounded-lg border border-neutral-300 bg-white transition-shadow focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-600/20 md:h-12">
          <input
            id="footer-subscribe-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="youremail@example.com"
            className="min-w-0 flex-1 text-ellipsis bg-transparent text-neutral-950 outline-none placeholder:text-neutral-400 px-3 text-body"
          />
          <button
            type="submit"
            aria-label="Subscribe"
            className="flex w-11 shrink-0 items-center justify-center bg-primary-200 text-white transition-colors hover:bg-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white md:w-13.5"
          >
            <i className="fi-rr-arrow-small-right text-[22px] md:text-[24px]" />
          </button>
        </div>
      </form>
    </div>
  );
}
