import React from "react";
import Button from "./Button";
import { assets } from "../assets/assets";
import FadeUp from "./motions/FadeUp";

const FinalCTA = () => {
  return (
    <section className="p-space-9 w-[1440px] container mx-auto">
      <FadeUp>
        <div
          className="flex flex-col items-center justify-center gap-space-5 bg-cover bg-center py-space-8 relative"
          style={{ backgroundImage: `url(${assets.FinalCTA.src})` }}
        >
          {/* overlay */}
          <div className="absolute w-full h-full bg-black/60 top-0 left-0 "></div>
          <div className="flex flex-col items-center gap-space-2 z-10">
            <FadeUp delay={0.2}>
              <h2 className="font-primary font-semibold text-[40px] text-background text-center">
                Turn Your Dream Home Into Reality
              </h2>
            </FadeUp>
            <FadeUp delay={0.4}>
              <p className="text-center text-[18px] text-background/80 font-medium">
                From modern apartments to luxury villas, we help you find the
                perfect place to call home.{" "}
              </p>
            </FadeUp>
          </div>
          <FadeUp delay={0.6}>
            <Button text={"Start Exploring"} />
          </FadeUp>
        </div>
      </FadeUp>
    </section>
  );
};

export default FinalCTA;
