import React from "react";
import Button from "./Button";
import { assets } from "../assets/assets";

const FinalCTA = () => {
  return (
    <section className="p-space-9">
      <div
        className="flex flex-col items-center justify-center gap-space-5 bg-cover bg-center py-space-8 relative"
        style={{ backgroundImage: `url(${assets.FinalCTA.src})` }}
      >
        {/* overlay */}
        <div className="absolute w-full h-full bg-black/60 top-0 left-0 "></div>
        <div className="flex flex-col items-center gap-space-2 z-10">
          <h2 className="font-primary font-semibold text-[40px] text-background text-center">
            Turn Your Dream Home Into Reality
          </h2>
          <p className="text-center text-[18px] text-background/80 font-medium">
            From modern apartments to luxury villas, we help you find the
            perfect place to call home.{" "}
          </p>
        </div>
        <Button text={"Start Exploring"} />
      </div>
    </section>
  );
};

export default FinalCTA;
