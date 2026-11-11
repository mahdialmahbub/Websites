import React from "react";
import TrustNews from "./TrustNews";
import Button from "./Button";
import Image from "next/image";
import { assets } from "../assets/assets";
import FadeUp from "./motions/FadeUp";
import FadeUpText from "./motions/FadeUpText";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative flex flex-col items-center w-full pt-[clamp(1.5rem,0.2273rem+6.3636vw,3rem)] pb-[clamp(2.5rem,1.5909rem+4.5455vw,5rem)] px-[clamp(1rem,calc(5.455vw-0.091rem),4rem)]"
    >
      {/* Ambient background glow — adds depth behind the content
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-100 md:w-225 md:h-150 bg-[radial-gradient(ellipse_at_center,var(--color-secondary),transparent_70%)]/12 -z-10 pointer-events-none" /> */}

      <FadeUp
        className="flex flex-col items-center "
        initial="hidden"
        animate="show"
      >
        <TrustNews />

        {/* texts and button */}
        <div className="flex flex-col items-center gap-[clamp(1rem,0.6364rem+1.8182vw,2rem)] mt-[clamp(1rem,0.7273rem+1.3636vw,1.75rem)]">
          {/* texts */}
          <div className="flex flex-col items-center justify-center gap-[clamp(0.375rem,0.2386rem+0.6818vw,0.75rem)]">
            {/* heading text */}
            <FadeUpText className="max-w-225">
              <h1 className="text-[clamp(1.5rem,0.9545rem+2.7273vw,3rem)] font-bold leading-[clamp(2.5rem,1.9545rem+2.7273vw,4rem)] text-center  ">
                Automate Your Marketing. Convert More Leads. Grow Faster.
              </h1>
            </FadeUpText>

            <FadeUp
              as="p"
              delay={0.2}
              className="text-[clamp(0.875rem,0.5568rem+1.5909vw,1.375rem)] text-black/70 dark:text-white/70 flex items-center justify-center max-w-175 text-center"
            >
              No more juggling multiple tools. GrowthPilot helps you automate,
              analyze, and scale your business effortlessly.
            </FadeUp>
          </div>

          <FadeUp delay={0.5}>
            <Button text="Start Free Trial" />
          </FadeUp>
        </div>
      </FadeUp>

      {/* Dashboard Image */}
      <FadeUp
        blur
        scale
        duration={3}
        className="shadow-[0_20px_24px_rgba(16,24,40,0.14)] mt-[clamp(2rem,1.2727rem+3.6364vw,4rem)]"
      >
        <Image
          src={assets.dashboard}
          alt="Dashboard"
          preload
          fetchPriority="high"
          sizes="(max-width: 768px) 90vw, 720px"
          className="h-[clamp(12.5rem,calc(31.818vw+6.136rem),30rem)] w-[clamp(18.75rem,calc(47.727vw+9.205rem),45rem)] object-cover object-top rounded-[clamp(0.75rem,calc(1.136vw+0.523rem),1.375rem)] z-10"
        />
      </FadeUp>
    </section>
  );
};

export default Hero;
