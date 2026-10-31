import React from "react";
import SectionHeading from "./SectionHeading";
import Image from "next/image";
import { assets } from "../assets/assets";
import FadeDown from "./motions/FadeDown";
import FadeUp from "./motions/FadeUp";

const Benefit = () => {
  return (
    <section className="flex max-xl:flex-col xl:items-center gap-[clamp(2rem,1.6364rem+1.8182vw,3rem)] xl:gap-[32px] py-[clamp(3rem,1.9091rem+5.4545vw,6rem)]">
      <div className=" xl:flex-1/3">
        <SectionHeading
          isCenter={false}
          title={"Why Choose GrowthPilot?"}
          subtitle={
            "Save time, boost conversions, and simplify your marketing — all from one powerful platform."
          }
          tagName={"Benefit"}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-fr xl:flex-2/3">
        {/* Benefit 1 Items */}
        <div className="flex flex-col px-[16px] pb-[32px] bg-accent3-bg max-md:items-center w-full dark:bg-black">
          <FadeUp>
            <Image
              src={assets.benefit1}
              alt="benefit image"
              className="w-full h-[clamp(12.5rem,8.7727rem+18.6364vw,22.75rem)] rounded-b-full object-cover top-2.5 mb-[clamp(1.5rem,0.5909rem+4.5455vw,4rem)]"
            />
          </FadeUp>
          <FadeDown className="*:max-md:text-center">
            <h3 className="text-[clamp(1.125rem,0.8977rem+1.1364vw,1.75rem)] font-semibold mb-[clamp(0.25rem,0.1591rem+0.4545vw,0.5rem)]">
              Save Time with Automation
            </h3>
            <p className="text-[clamp(0.75rem,0.6591rem+0.4545vw,1rem)] text-black/70 dark:text-white/70">
              Automate repetitive marketing tasks and focus on what truly
              matters — growing your business.
            </p>
          </FadeDown>
        </div>
        {/* Benefit 2 Items */}
        <div className="flex flex-col justify-end px-[16px] pt-[32px] bg-accent4-bg max-md:items-center w-full dark:bg-black">
          <FadeUp delay={0.5} className=" *:max-md:text-center">
            <h3 className="text-[clamp(1.125rem,0.8977rem+1.1364vw,1.75rem)] font-semibold mb-[clamp(0.25rem,0.1591rem+0.4545vw,0.5rem)]">
              Boost Your Conversion Rates
            </h3>
            <p className="text-[clamp(0.75rem,0.6591rem+0.4545vw,1rem)] text-black/70 dark:text-white/70">
              Use smart workflows and data-driven insights to turn more visitors
              into loyal customers.
            </p>
          </FadeUp>
          <FadeDown delay={0.5}>
            <Image
              src={assets.benefit2}
              alt="benefit image"
              className="w-full h-[clamp(12.5rem,8.7727rem+18.6364vw,22.75rem)] rounded-t-full object-cover top-2.5 mt-[clamp(1.5rem,0.5909rem+4.5455vw,4rem)]"
            />
          </FadeDown>
        </div>
        {/* Benefit 3 Items */}
        <div className="flex flex-col px-[16px] pb-[32px] bg-accent2-bg max-md:items-center w-full dark:bg-black">
          <FadeUp delay={1}>
            <Image
              src={assets.benefit3}
              alt="benefit image"
              className="w-full h-[clamp(12.5rem,8.7727rem+18.6364vw,22.75rem)] rounded-b-full object-cover top-2.5 mb-[clamp(1.5rem,0.5909rem+4.5455vw,4rem)]"
            />
          </FadeUp>
          <FadeDown delay={1} className=" *:max-md:text-center">
            <h3 className="text-[clamp(1.125rem,0.8977rem+1.1364vw,1.75rem)] font-semibold mb-[clamp(0.25rem,0.1591rem+0.4545vw,0.5rem)]">
              All-in-One Simple Platform
            </h3>
            <p className="text-[clamp(0.75rem,0.6591rem+0.4545vw,1rem)] text-black/70 dark:text-white/70">
              Manage campaigns, analytics, and integrations in one place — no
              more switching between tools.
            </p>
          </FadeDown>
        </div>
      </div>
    </section>
  );
};

export default Benefit;