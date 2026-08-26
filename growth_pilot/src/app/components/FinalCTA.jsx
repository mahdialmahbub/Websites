import React from "react";
import Button from "./Button";
import FadeUp from "./motions/FadeUp";

const FinalCTA = () => {
  return (
    <section className="py-[20px] px-[16px] md:p-[48px] xl:px-46.5 xl:py-20 relative">
      <div className="p-0.75 rounded-3xl bg-[linear-gradient(72deg,#6C5CE7,#56CCF2,#22C55E,#F59E0B,#EC4899,#4F46E5)] bg-size-[200%_200%] animate-[gradientMove_3s_ease_infinite] relative overflow-hidden">
        <div className="rounded-[22px] flex flex-col gap-[20px] py-[24px] px-[16px] md:py-[48px] xl:py-28 md:px-20 xl:px-28 w-full bg-[#ffffff]/95 dark:bg-black/95 items-center justify-center">
          <FadeUp
            as="h2"
            className="font-semibold text-center text-h5 md:text-h4 xl:text-h3 z-10"
          >
            Ready to Simplify Your Marketing and Grow Faster?
          </FadeUp>
          <FadeUp delay={0.3} className="">
            <Button className={" z-10"} text="Start Your Free Trial" />
          </FadeUp>

        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
