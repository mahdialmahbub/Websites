"use client";

import React from "react";
import { motion } from "framer-motion";
import TrustNews from "./TrustNews";
import Button from "./Button";
import Image from "next/image";
import { assets } from "../assets/assets";
import FadeUp from "./motions/FadeUp";
import FadeUpText from "./motions/FadeUpText";
import Reveal from "./motions/Reveal";

const Hero = () => {
  return (
    <section className="relative flex flex-col items-center gap-[24px] md:gap-[48px] w-full pt-5.5 pb-[40px] md:pt-13 md:pb-22.5 xl:pt-18 xl:pb-22.5 px-4 md:px-8 xl:px-16">
      {/* Ambient background glow — adds depth behind the content */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-100 md:w-225 md:h-150 bg-[radial-gradient(ellipse_at_center,var(--color-secondary),transparent_70%)]/12 -z-10 pointer-events-none" />

      <FadeUp
        className="flex flex-col items-center gap-5.5 md:gap-[32px] xl:gap-[48px]"
        initial="hidden"
        animate="show"
      >
        <TrustNews />

        {/* texts and button */}
        <div className="flex flex-col items-center gap-5 md:gap-[24px] xl:gap-[32px]">
          {/* texts */}
          <div className="flex flex-col text-center items-center gap-2 xl:gap-4">
            {/* heading text */}
            <FadeUpText className="flex flex-col items-center justify-center ">
              <h1 className="text-h4 md:text-h2 xl:text-h1 font-bold text-center content-center">
                Struggling with Low Conversions?
              </h1>

              <div className="flex flex-wrap items-center justify-center gap-[4px] md:gap-[12px]">
                <h1 className="text-h4 md:text-h2 xl:text-h1 font-bold text-center content-center">
                  Let <span className="text-secondary2">Automation</span> Do the
                  Work
                </h1>
                <Reveal
                  distance={0}
                  delay={0.4}
                  className="text-large md:text-h3 xl:text-h2 py-space-xs md:py-space-sm px-space-sm2 text-secondary2 bg-linear-to-tr from-secondary/10 to-secondary2/10 border-2 border-secondary2/20 rounded-full text-nowrap md:rotate-15 font-semibold hover:rotate-0 transition-transform duration-300 cursor-pointer"
                >
                  For You
                </Reveal>
              </div>
            </FadeUpText>

            <FadeUp
              as="p"
              delay={0.5}
              className="font-medium text-medium md:text-h6 xl:text-h4 text-black/70 dark:text-white/70 text-center content-center"
            >
              No more juggling multiple tools. GrowthPilot helps you automate,
              analyze, and scale your business effortlessly.
            </FadeUp>
          </div>

          <FadeUp delay={0.7}>
            <Button text="Start Free Trial" />
          </FadeUp>
        </div>
      </FadeUp>

      {/* Dashboard Image */}
      <FadeUp
        blur
        scale
        duration={3}
        amount={0.01}
        delay={1}
        className="p-0.75 md:p-1.25 rounded-3xl bg-[linear-gradient(72deg,#6C5CE7,#56CCF2,#22C55E,#F59E0B,#EC4899,#4F46E5)] bg-size-[200%_200%] animate-[gradientMove_3s_ease_infinite] relative shadow-2xl shadow-secondary/10"
      >
        <Image
          src={assets.dashboard}
          alt="Dashboard"
          className="h-50 md:h-100 xl:h-120 w-75 md:w-150 xl:w-180 object-cover object-top rounded-[22px] z-10"
        />
      </FadeUp>
    </section>
  );
};

export default Hero;
