"use client";

import React, { useState } from "react";
import SectionHeading from "./SectionHeading";
import Button from "./Button";
import PlanTag from "./PlanTag";
import FadeUp from "./motions/FadeUp";
import Reveal from "./motions/Reveal";

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);

  const pricingStart = [
    "Basic marketing automation",
    "Email campaign setup",
    "Limited analytics dashboard",
    "Up to 1,000 contacts",
    "Basic integrations",
  ];

  const pricingPro = [
    "Advanced automation workflows",
    "Full analytics & performance tracking",
    "AI-powered suggestions",
    "Up to 10,000 contacts",
    "All integrations included",
    "Priority support",
  ];

  const pricingBusiness = [
    "Unlimited automation workflows",
    "Advanced analytics & reports",
    "AI optimization & insights",
    "Unlimited contacts",
    "Custom integrations",
    "Dedicated account manager",
  ];

  const plans = [
    {
      id: "starter",
      name: "Starter",
      tagline: "For individuals and small teams just getting started",
      monthlyPrice: 29,
      yearlyPrice: 23,
      features: pricingStart,
      cta: "Start Free Trial",
      highlighted: false,
      accentText: "text-accent2",
      accentBg: "bg-accent2-bg",
      accentSolid: "bg-accent2",
    },
    {
      id: "professional",
      name: "Professional",
      tagline: "For growing teams ready to automate at scale",
      monthlyPrice: 79,
      yearlyPrice: 63,
      features: pricingPro,
      cta: "Start Free Trial",
      highlighted: true,
      accentText: "text-accent3",
      accentBg: "bg-accent3-bg",
      accentSolid: "bg-accent3",
    },
    {
      id: "business",
      name: "Business",
      tagline: "For organizations that need unlimited scale and support",
      monthlyPrice: 199,
      yearlyPrice: 159,
      features: pricingBusiness,
      cta: "Start Free Trial",
      highlighted: false,
      accentText: "text-accent5",
      accentBg: "bg-accent5-bg",
      accentSolid: "bg-accent5",
    },
  ];

  return (
    <section className="section">
      <SectionHeading
        title={"Choose the Plan That Fits Your Growth"}
        subtitle={
          "No hidden fees. Start free, upgrade anytime as your business grows."
        }
        tagName={"Pricing"}
      />

      {/* Billing toggle */}
      <Reveal
        delay={0.5}
        className="flex items-center justify-center gap-[16px] mt-[16px] md:mt-[24px] "
      >
        <span
          className={`text-large font-medium transition-colors ${
            !isYearly
              ? "text-black dark:text-white"
              : "text-black/40 dark:text-white/40"
          }`}
        >
          Monthly
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={isYearly}
          aria-label="Toggle annual billing"
          onClick={() => setIsYearly((prev) => !prev)}
          className="relative w-[48px] h-6.5 rounded-full border border-secondary2/20 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary2 focus-visible:ring-offset-2"
        >
          <span
            className={`absolute top-0.75 left-0.75 size-[20px] rounded-full bg-secondary2 shadow-sm transition-transform duration-200 ${
              isYearly ? "translate-x-5.5" : "translate-x-0"
            }`}
          />
        </button>
        <span
          className={`text-large font-medium transition-colors ${
            isYearly
              ? "text-black dark:text-white"
              : "text-black/40 dark:text-white/40"
          }`}
        >
          Annually
        </span>
        <span className="text-medium font-semibold text-nowrap text-secondary2 dark:text-white bg-secondary2-bg dark:bg-white/10 px-2.5 py-[4px] rounded-full">
          Save 20%
        </span>
      </Reveal>

      {/* Pricing cards */}
      <div className="flex flex-col md:flex-row gap-[24px] xl:gap-[32px] items-stretch">
        {plans.map((plan) => (
          <FadeUp
            scale={plan.highlighted}
            delay={!plan.highlighted && 0.5}
            duration={plan.highlighted ? 2.5 : 2}
            key={plan.id}
            className={`relative flex flex-col w-full md:flex-1 rounded-4xl p-[24px] md:p-[32px] gap-[20px] bg-white dark:bg-black transition-shadow duration-300 ${
              plan.highlighted
                ? "border-2 border-secondary2 shadow-[0_16px_40px_-16px] shadow-secondary2/50"
                : "border border-black/10 dark:border-white/15"
            }`}
          >
            {plan.highlighted && (
              <PlanTag
                tagName="Most Popular"
                className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 bg-secondary2"
              />
            )}

            {/* Plan name */}
            <div className="flex flex-col gap-[8px] text-left">
              <div className="flex items-center gap-[8px]">
                <span
                  className={`size-[8px] rounded-full ${plan.accentSolid}`}
                />
                <h3 className="text-h6 xl:text-h5 font-semibold text-black dark:text-white">
                  {plan.name}
                </h3>
              </div>
              <p className="text-large text-black/60 dark:text-white/60">
                {plan.tagline}
              </p>
            </div>

            {/* Price */}
            <div className="flex flex-col gap-[4px] text-left">
              <div className="flex items-end gap-1.5">
                <h2 className="text-h3 xl:text-h2 font-semibold text-black dark:text-white leading-none">
                  ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                </h2>
                <span className="text-large text-black/50 dark:text-white/50 pb-[4px]">
                  /month
                </span>
              </div>
              {isYearly && (
                <p className="text-medium text-black/40 dark:text-white/40">
                  billed annually
                </p>
              )}
            </div>

            {/* Features */}
            <ul className="flex flex-col gap-[12px] text-left">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span
                    className={`flex items-center justify-center shrink-0 size-[20px] rounded-full mt-0.5 ${plan.accentBg} dark:bg-white/10 ${plan.accentText}`}
                  >
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      className="size-[12px]"
                    >
                      <path
                        d="M4 10.5L8 14.5L16 6"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="text-large xl:text-h6 text-black/70 dark:text-white/70 font-medium">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="mt-auto pt-[8px]">
              <Button
                variant={!plan.highlighted ? "text" : "primary"}
                fullWidth
                text={plan.cta}
                isIcon={false}
              />
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
