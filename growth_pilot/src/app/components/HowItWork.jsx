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
    <section className="flex flex-col py-[40px] px-[16px] gap-[32px] md:py-[40px] md:px-[48px] md:gap-[48px] xl:py-20 xl:px-20 xl:gap-[64px]">
      <SectionHeading
        title={"Everything You Need to Automate Your Marketing"}
        subtitle={
          "Powerful tools designed to save your time, boost conversions, and grow your business — all in one place."
        }
        tagName={"How It Works"}
      />

      <div className="flex max-md:flex-col gap-6 md:gap-[20px] xl:gap-[64px] items-stretch">
        {/* Left: Image */}
        <FadeRight
          key={`image-${currentStep}`}
          className="relative flex-1 rounded-3xl aspect-video overflow-hidden"
        >
          {/* Gradient border wrapper */}
          <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-accent1/40 via-accent1/10 to-transparent p-[1.5px]">
            <div className="w-full h-full rounded-3xl bg-white dark:bg-[#0B0B14]" />
          </div>

          {/* Content layer */}
          <div className="absolute inset-[1.5px] rounded-3xl bg-accent1/6 overflow-hidden flex items-center justify-center">
            {/* Decorative dot-grid texture */}
            <div
              className="absolute inset-0 opacity-[0.4]"
              style={{
                backgroundImage:
                  "radial-gradient(currentColor 1px, transparent 1px)",
                backgroundSize: "18px 18px",
                color: "#9B9BF5",
                maskImage:
                  "radial-gradient(ellipse at center, black 0%, transparent 70%)",
              }}
            />

            {/* Ambient glow blobs */}
            <div className="absolute -top-16 -left-10 size-48 bg-accent1/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-16 -right-10 size-48 bg-primary/20 rounded-full blur-3xl" />

            {/* Image, floating with its own soft shadow */}
            <Image
              src={steps[currentStep].image}
              alt={steps[currentStep].title}
              className="relative z-10 transition-all duration-500 w-[62%] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)]"
            />
          </div>
        </FadeRight>

        {/* Right: Clickable step list */}
        <div className="w-full md:flex-1 flex flex-col justify-center gap-2">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            return (
              <button
                key={step.title}
                onClick={() => goToStep(index)}
                className={`
                  group text-left rounded-2xl border transition-all duration-300 cursor-pointer
                  p-[16px] md:p-[20px]
                  ${
                    isActive
                      ? "border-primary/30 bg-primary/5"
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
                          ? "bg-primary/10 text-primary"
                          : "bg-black/5 dark:bg-white/10 text-black/50 dark:text-white/50"
                      }
                    `}
                  >
                    {index + 1}
                  </span>
                  <h3
                    className={`text-h5 md:text-h4 font-semibold transition-colors duration-300 ${
                      isActive
                        ? "text-primary"
                        : "text-black/70 dark:text-white/70"
                    }`}
                  >
                    {step.title}
                  </h3>
                </div>

                {isActive && (
                  <FadeUp className="mt-2 pl-11 text-black/60 dark:text-white/60 text-h6 xl:text-h5">
                    {step.subtitle}
                  </FadeUp>
                )}
              </button>
            );
          })}

          {/* Progress dots + prev/next */}
          <FadeUp className="flex items-center justify-between mt-[16px] md:mt-[20px] xl:mt-[24px] pl-11">
            <div className="flex gap-2">
              {steps.map((_, index) => (
                <span
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? "w-6 bg-primary"
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
