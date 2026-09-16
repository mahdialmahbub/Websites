import React from "react";
import Button from "./Button";
import FadeUp from "./motions/FadeUp";

const FinalCTA = () => {
  return (
    <section className="py-[20px] px-[16px] md:p-[48px] xl:px-46.5 xl:py-20 relative">
      <div className="p-0.75 rounded-3xl bg-[linear-gradient(72deg,#6C5CE7,#56CCF2,#22C55E,#F59E0B,#EC4899,#4F46E5)] bg-size-[200%_200%] animate-[gradientMove_3s_ease_infinite] relative overflow-hidden shadow-[0_25px_60px_-25px_rgba(108,92,231,0.5)] dark:shadow-[0_25px_60px_-25px_rgba(108,92,231,0.65)] transition-transform duration-500 ease-out hover:-translate-y-1">
        <div className="rounded-[22px] flex flex-col gap-[24px] py-[32px] px-[20px] md:py-13 xl:py-28 md:px-20 xl:px-28 w-full bg-[#ffffff]/95 dark:bg-black/95 items-center justify-center">
          <FadeUp className="flex flex-col items-center gap-[12px] text-center z-10 max-w-2xl">
            <h2 className="font-semibold text-h5 md:text-h4 xl:text-h3">
              Ready to Simplify Your Marketing and Grow Faster?
            </h2>
            <p className="text-base md:text-lg text-black/60 dark:text-white/60 max-w-md">
              Set up your first campaign in minutes. No complicated tools, no learning curve.
            </p>
          </FadeUp>
          <FadeUp delay={0.3} className="z-10">
            <Button className={"z-10"} text="Start Your Free Trial" />
          </FadeUp>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;