import React from "react";
import SectionHeading from "./SectionHeading";
import Image from "next/image";
import { assets } from "../assets/assets";
import FadeDown from "./motions/FadeDown";
import FadeUp from "./motions/FadeUp";

const Benefit = () => {
  const benefitInfo = [
    {
      title: "Save Time with Automation",
      subtitle:
        "Automate repetitive marketing tasks and focus on what truly matters — growing your business.",
      image: assets.benefit1,
    },
    {
      title: "Boost Your Conversion Rates",
      subtitle:
        "Use smart workflows and data-driven insights to turn more visitors into loyal customers.",
      image: assets.benefit2,
    },
    {
      title: "All-in-One Simple Platform",
      subtitle:
        "Manage campaigns, analytics, and integrations in one place — no more switching between tools.",
      image: assets.benefit3,
    },
  ];

  return (
    <div className="flex max-xl:flex-col xl:items-center gap-[32px] md:gap-[48px] xl:gap-[32px]">
      <div className="px-[16px] xl:flex-1/3">
        <SectionHeading
          isCenter={false}
          title={"Why Choose GrowthPilot?"}
          subtitle={
            "Save time, boost conversions, and simplify your marketing — all from one powerful platform."
          }
          tagName={"Benefit"}
        />
      </div>
      <div className="flex max-md:flex-col md:h-155 xl:h-167.5 xl:flex-2/3">
        {/* Benefit 1 Items */}
        <div className="flex flex-col px-[16px] pb-[32px] bg-accent3-bg max-md:items-center w-full h-full dark:bg-black">
          <FadeUp>
            <Image
              src={assets.benefit1}
              alt="benefit image"
              className="w-full h-50 md:hover: rounded-b-full object-cover top-2.5 mb-[24px] md:mb-[32px] xl:mb-[64px] md:h-91"
            />
          </FadeUp>
          <FadeDown className=" *:max-md:text-center">
            <h3 className="text-h4 md:text-h3 font-bold mb-[4px] md:mb-[8px]">
              Save Time with Automation
            </h3>
            <p className="text-large md:text-h6 font-medium text-black/70 dark:text-white/70">
              Automate repetitive marketing tasks and focus on what truly
              matters — growing your business.
            </p>
          </FadeDown>
        </div>
        {/* Benefit 2 Items */}
        <div className="flex justify-end flex-col px-[16px] pt-[32px] bg-accent4-bg max-md:items-center w-full h-full dark:bg-black">
          <FadeUp delay={0.5} className=" *:max-md:text-center">
            <h3 className="text-h4 md:text-h3 font-bold mb-[4px] md:mb-[8px]">
              Boost Your Conversion Rates
            </h3>
            <p className="text-large md:text-h6 font-medium text-black/70 dark:text-white/70">
              Use smart workflows and data-driven insights to turn more visitors
              into loyal customers.
            </p>
          </FadeUp>
          <FadeDown delay={0.5}>
            <Image
              src={assets.benefit2}
              alt="benefit image"
              className="w-full h-50 md:h-91 md:hover: rounded-t-full object-cover top-2.5 mt-[24px] md:mt-[32px] xl:mt-[64px]"
            />
          </FadeDown>
        </div>
        {/* Benefit 3 Items */}
        <div className="flex flex-col px-[16px] pb-[32px] bg-accent2-bg max-md:items-center w-full h-full dark:bg-black">
          <FadeUp delay={1}>
            <Image
              src={assets.benefit3}
              alt="benefit image"
              className="w-full h-50 md:hover: rounded-b-full object-cover top-2.5 mb-[24px] md:mb-[32px] xl:mb-[64px] md:h-91"
            />
          </FadeUp>
          <FadeDown delay={1} className=" *:max-md:text-center">
            <h3 className="text-h4 md:text-h3 font-bold mb-[4px] md:mb-[8px]">
              All-in-One Simple Platform
            </h3>
            <p className="text-large md:text-h6 font-medium text-black/70 dark:text-white/70">
              Manage campaigns, analytics, and integrations in one place — no
              more switching between tools.
            </p>
          </FadeDown>
        </div>
      </div>
    </div>
  );
};

export default Benefit;
