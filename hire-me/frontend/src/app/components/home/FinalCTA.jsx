import React from "react";
import HomeHeader from "./HomeHeader";
import { Button } from "../Button";
import Link from "next/link";

const FinalCTA = () => {
  return (
    <section className="px-[clamp(1rem,calc(5.258vw+0.268rem),5rem)] py-[clamp(2rem,calc(6.009vw+0.592rem),6rem)] space-y-[clamp(1.5rem,calc(1.690vw+1.104rem),2.625rem)] min-w-[320px] max-w-300">
      <div className=" flex flex-col items-center justify-center bg-neutral-950 rounded-[clamp(1rem,calc(0.751vw+0.824rem),1.5rem)] h-[clamp(16.25rem,calc(9.39vw+14.049rem),22.5rem)] px-6 text-center">
        <h3 className="font-semibold font-primary text-[clamp(1.375rem,calc(1.315vw+1.067rem),2.25rem)] text-neutral-50">
          Ready to{" "}
          <span className="bg-linear-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Transform
          </span>{" "}
          your data?
        </h3>
        <p className=" mt-space-2 mb-[clamp(1.25rem,calc(1.127vw+0.986rem),2rem)] text-neutral-300 text-[clamp(0.875rem,calc(0.563vw+0.743rem),1.25rem)]">
          Get and AI-powered breakdown of your resume’s effectiveness and create
          a resume that gets you noticed
        </p>
        <Link href={"/create-resume"}>
          <Button className="sm:w-75">Start for Free</Button>
        </Link>
      </div>
    </section>
  );
};

export default FinalCTA;
