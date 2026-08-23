import React from "react";
import TrustNews from "./TrustNews";
import Button from "./Button";
import Image from "next/image";
import { assets } from "../assets/assets";

const Hero = () => {
  return (
    <section className="flex flex-col items-center gap-[24px] md:gap-[48px] w-full pt-5.5 pb-[40px] md:pt-13 md:pb-22.5 xl:pt-18 xl:pb-22.5 px-4 md:px-8 xl:px-16">
      <div className="flex flex-col items-center gap-5.5 md:gap-[32px] xl:gap-[48px]">
        <TrustNews />
        {/* texts and button */}
        <div className="flex flex-col items-center gap-5 md:gap-[24px] xl:gap-[32px]">
          {/* texts */}
          <div className="flex flex-col text-center items-center gap-2 xl:gap-4">
            {/* heading text */}
            <div className="flex flex-col items-center justify-center md:gap-[8px] xl:gap-[20px]">
            <h1 className="text-h4 md:text-h2 xl:text-h1 font-bold text-center content-center">
              Struggling with Low Conversions?</h1>
              <div className="flex flex-wrap items-center justify-center gap-[4px] md:gap-[12px]">
              <h1 className="text-h4 md:text-h2 xl:text-h1 font-bold text-center content-center">
              Let <span className="text-secondary2">Automation</span> Do the
              Work{" "}</h1>
              <div className="text-large md:text-h3 xl:text-h2 py-[8px] px-[16px] md:py-2.5 md:px-[24px] text-secondary2 bg-linear-to-tr from-secondary/10 to-secondary2/10 border-3 border-secondary2 rounded-full text-nowrap">
                For You
              </div>
              </div>
              </div>
            

            <p className="font-medium md:text-h5 xl:text-h4 text-black/70 dark:text-white/70 text-center content-center">
              No more juggling multiple tools. GrowthPilot helps you automate,
              analyze, and scale your business effortlessly.
            </p>
          </div>
          <Button text="Start Free Trial" />
        </div>
      </div>
      {/* Dashboard Image */}
      <div className="p-0.75 md:p-1.25 rounded-3xl bg-[linear-gradient(72deg,#6C5CE7,#56CCF2,#22C55E,#F59E0B,#EC4899,#4F46E5)] bg-size-[200%_200%] animate-[gradientMove_3s_ease_infinite] relative">
        {/* Blob 11 */}
        <div className="absolute size-25 md:size-37.5 bg-accent4 blur-[50px] md:blur-[80px] rounded-full animate-blob11 -z-10"></div>

        {/* Blob 22 */}
        <div className="absolute size-25 md:size-37.5 bg-accent2 blur-[50px] md:blur-[80px] rounded-full animate-blob22 -z-10"></div>

        {/* Blob 33 */}
        <div className="absolute size-25 md:size-37.5 bg-accent5 blur-[50px] md:blur-[80px] rounded-full animate-blob33 -z-10"></div>

        {/* Blob 44 */}
        <div className="absolute size-25 md:size-37.5 bg-accent3 blur-[50px] md:blur-[80px] rounded-full animate-blob44 -z-10"></div>


        <Image
          src={assets.dashboard}
          alt="Dashboard"
          className="h-50 md:h-100 xl:h-120 w-75 md:w-150 xl:w-180 object-cover object-top rounded-xl md:rounded-3xl z-10"
        />
      </div>
    </section>
  );
};

export default Hero;
