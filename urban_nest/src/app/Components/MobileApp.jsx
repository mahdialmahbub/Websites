import React from "react";
import Button from "./Button";
import Image from "next/image";
import { assets } from "../assets/assets";
import FadeRight from "./motions/FadeRight";
import FadeLeft from "./motions/FadeLeft";
import FadeUp from "./motions/FadeUp";

const MobileApp = () => {
  return (
    <section className="p-space-9 gap-space-7 flex items-center max-w-[1440px] container mx-auto">
      <FadeRight className="min-w-131.25 min-h-87.5 order-2">
        <Image
          alt="image"
          src={assets.Mobileapp}
          className="object-cover w-[525px] h-[350px]"
        />
      </FadeRight>
      <div className="">
        <div className="">
          <FadeLeft>
            <h2 className="font-primary text-[32px] font-semibold mb-space-3">
              Real Estate Intelligence in Your Pocket{" "}
            </h2>
          </FadeLeft>
          <FadeLeft delay={0.2}>
            <p className="text-3xl text-placeholder leading-9">
              Search properties, receive AI-powered recommendations, and track
              market trends anytime, anywhere.{" "}
            </p>
          </FadeLeft>
        </div>
        <div className="flex items-center gap-space-5 mt-8">
          <FadeUp delay={0.4}>
          <button className="p-space-3 bg-black border border-placeholder flex items-center gap-space-2 ">
            <Image
              alt="google play"
              src={assets.google_play}
              className="size-[32px]"
              height={32}
              width={32}
            />
            <div className="text-background flex flex-col items-start">
              <p className="text-[16px] font-medium">GET IT ON</p>
              <h3 className="text-[24px] font-primary font-bold">
                Google Play
              </h3>
            </div>
          </button></FadeUp>
          <FadeUp delay={0.6}>
          <button className="p-space-3 bg-black border border-placeholder flex items-center gap-space-2 ">
            <i className="fi fi-brands-apple flex items-center justify-content text-[32px] text-white"></i>
            <div className="text-background flex flex-col items-start">
              <p className="text-[16px] font-medium">GET IT ON</p>
              <h3 className="text-[24px] font-primary font-bold">
                Apple Store
              </h3>
            </div>
          </button></FadeUp>
        </div>
      </div>
    </section>
  );
};

export default MobileApp;
