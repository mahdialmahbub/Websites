import React from "react";
import Button from "./Button";
import FadeUp from "./motions/FadeUp";
import GridSpotlight from "./GridSpotlight";

const FinalCTA = () => {
  return (
    <section
      aria-labelledby="final-cta-heading"
      className="relative py-[20px] px-[16px] md:p-[48px] xl:px-46.5 xl:py-20"
    >
      <GridSpotlight
        className="rounded-[clamp(1rem,0.9091rem+0.4545vw,1.25rem)]
          border border-black/10 dark:border-white/10
          bg-[#f8fafc] dark:bg-[#080b10]
          p-[clamp(2rem,1.2727rem+3.6364vw,4rem)]"
      >
        <div
          aria-hidden="true"
          className="absolute -bottom-24 -left-16 h-70 w-[320px] rounded-full bg-accent5/5 blur-[100px]"
        />
        <div
          aria-hidden="true"
          className="absolute -top-20 -right-10 h-60 w-70 rounded-full bg-accent5/5 blur-[100px]"
        />

        <div className="relative flex flex-col items-center text-center gap-7 md:gap-8 px-6 py-7 md:px-16 md:py-8 xl:px-24 xl:py-4">
          <FadeUp className="flex flex-col items-center gap-2 max-w-xl">
            <h2
              id="final-cta-heading"
              className="font-semibold text-h4 md:text-h3 tracking-tight"
            >
              Set the rule once. It runs every time.
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-black/60 dark:text-white/60 max-w-md">
              Connect your signup form and GrowthPilot takes care of the rest:
              scoring, sequencing, and sending your first message, every time.
            </p>
          </FadeUp>

          <FadeUp delay={0.3} className="flex flex-col items-center gap-3">
            <Button text="Start free trial" />
            <p className="text-sm text-black/40 dark:text-white/40">
              Free for 14 days. No credit card needed.
            </p>
          </FadeUp>
        </div>
      </GridSpotlight>
    </section>
  );
};

export default FinalCTA;
