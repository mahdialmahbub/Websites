'use client'

import Image from "next/image";
import { useState } from "react";
import { assets } from "../assets/assets";
import SectionHeading from "./SectionHeading";

const steps = [
  {
    title: "Step 01: Connect Your Tools",
    subtitle:
      "Easily connect your favorite marketing tools and platforms in just a few clicks.",
    image: assets.step1, // Apnar image path
  },
  {
    title: "Step 02: Configure Settings",
    subtitle: "Set up your preferences and automate your workflow seamlessly.",
    image: assets.step2,
  },
  {
    title: "Step 03: Launch Campaign",
    subtitle:
      "You are all set! Launch your campaign and track results in real-time.",
    image: assets.step3,
  },
];

const HowItWork = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <section className="flex flex-col py-[40px] px-[16px] gap-[32px] md:py-[40px] md:px-[48px] md:gap-[48px] xl:py-20 xl:px-20 xl:gap-[64px]">
        <SectionHeading 
        title={"Everything You Need to Automate Your Marketing"}
        subtitle={
          "Powerful tools designed to save your time, boost conversions, and grow your business — all in one place."
        }
        tagName={"How It Work"}
      />
    <div className="flex max-md:flex-col gap-2 md:gap-[20px] xl:gap-[64px] justify-start">
      {/* Left Side: Dynamic Image */}
      <div className="border border-[#9B9BF5]/30 bg-accent1/10 p-5 rounded-3xl flex-1 items-center justify-center flex aspect-video inset-shadow-[0_0_20px_2px] inset-shadow-accent1">
        <Image
          src={steps[currentStep].image}
          alt={steps[currentStep].title}
          className=" transition-all duration-500 aspect-auto w-[70%] object-contain"
        />
      </div>

      {/* Right Side: Content & Buttons */}
      <div className="w-full flex md:flex-1 flex-col p-[16px] md:p-[20px] justify-center">
        <h2 className="text-3xl font-bold">{steps[currentStep].title}</h2>
        <p className="text-black/70 mt-[8px] xl:mt-[12px] dark:text-white/70">{steps[currentStep].subtitle}</p>

        <div className="flex gap-4 items-center mt-[16px] md:mt-[20px] xl:mt-[32px]">
          {/* Previous Button */}
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`${currentStep === 0 ? "text-[#D1D5DB]" : "text-primary hover:text-primary"} rotate-180 cursor-pointer flex items-center justify-center hover:-translate-x-0.5 transition-transform duration-200`}
          >
            <i className="fi fi-sr-angle-circle-right inline-flex items-center justify-center text-[32px] xl:text-h2"></i>
          </button>

          {/* Next Button */}
          <button
            onClick={nextStep}
            disabled={currentStep === 2}
            className={` ${currentStep === 2 ? "text-[#D1D5DB]" : "text-primary hover:text-primary"} cursor-pointer flex items-center justify-center hover:translate-x-0.5 transition-transform duration-200 `}
          >
            <i className="fi fi-sr-angle-circle-right inline-flex items-center justify-center text-[32px] xl:text-h2"></i>
          </button>
        </div>
      </div>
    </div>
    </section>
  );
};

export default HowItWork;
