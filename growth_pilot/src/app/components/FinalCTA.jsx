import React from "react";
import Button from "./Button";
import FadeUp from "./motions/FadeUp";

const FinalCTA = () => {
  return (
    <section
      aria-labelledby="final-cta-heading"
      className="relative py-[20px] px-[16px] md:p-[48px] xl:px-46.5 xl:py-20"
    >
      <div
        className="relative overflow-hidden rounded-3xl
                   border border-black/10 dark:border-white/10
                   bg-white dark:bg-[#0e1322]
                   shadow-[0_48px_120px_-32px_rgba(12,16,32,0.4)]
                   dark:shadow-[0_48px_120px_-32px_rgba(0,0,0,0.6)]"
      >
        {/* same grid + glow language as the hero, so the page opens and closes on one idea */}
        <div
          aria-hidden="true"
          className="absolute inset-0
                     bg-[linear-gradient(to_right,rgba(108,92,231,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(108,92,231,0.10)_1px,transparent_1px)]
                     bg-size-[64px_64px]
                     [mask-image:radial-gradient(ellipse_60%_60%_at_50%_30%,black,transparent)]"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 -left-16 h-[280px] w-[320px] rounded-full bg-secondary/18 blur-[110px]"
        />
        <div
          aria-hidden="true"
          className="absolute -top-20 -right-10 h-[240px] w-[280px] rounded-full bg-secondary2/16 blur-[110px]"
        />

        <div className="relative flex flex-col items-center text-center gap-7 md:gap-8 px-6 py-14 md:px-16 md:py-20 xl:px-24 xl:py-24">
          <FadeUp className="flex flex-col items-center gap-3 max-w-xl">
            <h2
              id="final-cta-heading"
              className="font-semibold text-h5 md:text-h4 xl:text-h3 tracking-tight"
            >
              Set the rule once. It runs every time.
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-black/60 dark:text-white/60 max-w-md">
              Connect your signup form and GrowthPilot takes care of the
              rest: scoring, sequencing, and sending your first message,
              every time.
            </p>
          </FadeUp>

          <FadeUp delay={0.3} className="flex flex-col items-center gap-3">
            <Button text="Start free trial" />
            <p className="text-sm text-black/40 dark:text-white/40">
              Free for 14 days. No credit card needed.
            </p>
          </FadeUp>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
