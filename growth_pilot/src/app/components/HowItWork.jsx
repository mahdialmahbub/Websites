"use client";

import Image from "next/image";
import { useState } from "react";
import { assets } from "../assets/assets";
import SectionHeading from "./SectionHeading";
import FadeRight from "./motions/FadeRight";
import FadeUp from "./motions/FadeUp";

const steps = [
  {
    title: "Connect your tools",
    subtitle:
      "Easily connect your favorite marketing tools and platforms in just a few clicks.",
    image: assets.step1,
  },
  {
    title: "Configure settings",
    subtitle: "Set up your preferences and automate your workflow seamlessly.",
    image: assets.step2,
  },
  {
    title: "Launch campaign",
    subtitle:
      "You are all set! Launch your campaign and track results in real-time.",
    image: assets.step3,
  },
];

const HowItWork = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const goToStep = (index) => setCurrentStep(index);
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));
  const nextStep = () =>
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));

  return (
    <section id="how it work" className="section">
      <SectionHeading
        title={"Everything You Need to Automate Your Marketing"}
        subtitle={
          "Powerful tools designed to save your time, boost conversions, and grow your business — all in one place."
        }
        tagName={"How It Works"}
      />

      <div className="flex max-md:flex-col gap-6 md:gap-[20px] xl:gap-[64px] items-stretch w-full">
        {/* Left: Image */}
        <FadeRight className="relative flex-1 rounded-3xl aspect-video overflow-hidden">
          {/* Gradient border wrapper */}
          <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-accent5/40 via-accent5/10 to-transparent p-[1.5px]">
            <div className="w-full h-full rounded-3xl bg-white dark:bg-[#0B0B14]" />
          </div>

          {/* Content layer */}
          <div className="absolute inset-[1.5px] rounded-3xl bg-accent5/6 overflow-hidden flex items-center justify-center">
            {/* Decorative dot-grid texture */}
            <div className="absolute inset-0 bg-white dark:bg-black" />

            {/* Ambient glow blobs */}
            <div className="absolute -top-16 -left-10 size-48 bg-accent5/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-16 -right-10 size-48 bg-accent5/20 rounded-full blur-3xl" />

            {/* Image, floating with its own soft shadow */}
            <Image
              src={steps[currentStep].image}
              alt={steps[currentStep].title}
              
              className="relative z-10 transition-all duration-500 w-[62%] object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]"
            />
          </div>
        </FadeRight>
        <div className="w-full md:hidden flex justify-center">
          <FadeUp className="flex md:hidden items-center justify-between mt-[16px] md:mt-[20px] xl:mt-[24px]">
            <div className="flex gap-2">
              {steps.map((_, index) => (
                <span
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? "w-6 bg-secondary2"
                      : "w-1.5 bg-black/10 dark:bg-white/15"
                  }`}
                />
              ))}
            </div>
          </FadeUp>
        </div>

        {/* Right: Clickable step list */}
        <div className="w-full md:flex-1 flex flex-col justify-center gap-2">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            return (
              <button
                key={index}
                onClick={() => goToStep(index)}
                className={`
                  group text-left rounded-2xl border transition-all duration-300 cursor-pointer
                  p-[16px] md:p-[20px]
                  ${
                    isActive
                      ? "border-secondary2/30 bg-secondary2/5"
                      : "border-transparent hover:border-black/10 dark:hover:border-white/10"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`
                      flex items-center justify-center shrink-0 size-8 rounded-full text-sm font-semibold transition-colors duration-300
                      ${
                        isActive
                          ? "bg-secondary2/10 text-secondary2"
                          : "bg-black/5 dark:bg-white/10 text-black/50 dark:text-white/50"
                      }
                    `}
                  >
                    {index + 1}
                  </span>
                  <h3
                    className={`text-[clamp(1.125rem,1.0341rem+0.4545vw,1.375rem)] font-semibold  ${
                      isActive
                        ? "text-secondary2"
                        : "text-black/70 dark:text-white/70"
                    }`}
                  >
                    {step.title}
                  </h3>
                </div>

                {isActive && (
                  <FadeUp className="mt-1 pl-[clamp(2.7rem,1.9886rem+0.6818vw,2.8rem)] text-black/60 dark:text-white/60 text-[clamp(0.875rem,0.8295rem+0.2273vw,1rem)]">
                    {step.subtitle}
                  </FadeUp>
                )}
              </button>
            );
          })}

          {/* Progress dots + prev/next */}
          <FadeUp className="flex items-center justify-between mt-[16px] md:mt-[20px] xl:mt-[24px] max-md:hidden">
            <div className="flex gap-2">
              {steps.map((_, index) => (
                <span
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? "w-6 bg-secondary2"
                      : "w-1.5 bg-black/10 dark:bg-white/15"
                  }`}
                />
              ))}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
};

export default HowItWork;
