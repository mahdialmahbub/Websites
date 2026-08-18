import Image from "next/image";
import React from "react";
import { assets } from "../assets/assets";
import TextButton from "./TextButton";
import FadeRight from "./motions/FadeRight";
import FadeLeft from "./motions/FadeLeft";

const AiAssistent = () => {
  return (
    <section className="p-space-9 gap-space-7 flex items-center w-360 container mx-auto">
      <FadeLeft className="min-w-131.25 min-h-87.5">
        <Image
          alt="image"
          className="object-cover w-131.25 h-87.5"
          src={assets.Aiassistent}
        />
      </FadeLeft>
      <div className="">
        <div className="">
          <FadeRight>
            <h2 className="font-primary text-[32px] font-semibold mb-space-3">
              Meet Your Personal AI Real Estate Assistant
            </h2>
          </FadeRight>
          <FadeRight delay={0.2}>
            <p className="text-3xl text-placeholder">
              Ask questions, discover properties, and receive intelligent
              recommendations tailored to your goals in seconds.
            </p>
          </FadeRight>
        </div>
        <FadeRight delay={0.4}>
          <TextButton className="mt-space-5" text={"Explore Now"} />
        </FadeRight>
      </div>
    </section>
  );
};

export default AiAssistent;
