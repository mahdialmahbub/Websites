import React from "react";
import Button from "./Button";
import Image from "next/image";
import { assets } from "../assets/assets";

const MobileApp = () => {
  return (
    <section className="p-space-9 gap-space-7 flex items-center w-[1440px] container mx-auto">
      <Image alt="image" src={assets.Mobileapp} className="object-cover w-[525px] h-[350px] order-2" />
      <div className="">
        <div className="">
          <h2 className="font-primary text-[32px] font-semibold mb-space-3">
            Real Estate Intelligence in Your Pocket{" "}
          </h2>
          <p className="text-3xl text-placeholder">
            Search properties, receive AI-powered recommendations, and track
            market trends anytime, anywhere.{" "}
          </p>
        </div>
        <div className="flex items-center gap-space-5 mt-[25px]">
          <button className="p-space-3 bg-black border border-placeholder flex items-center gap-space-2 ">
            <Image
              alt="google play"
              src={assets.google_play}
              className="w-auto h-space-5"
            />
            <div className="text-background flex flex-col items-start">
              <p className="text-[10px] font-primary">
                GET IT ON
              </p>
              <h3 className="text-[24px]">Google Play</h3>
            </div>
          </button>
          <button className="p-space-3 bg-black border border-placeholder flex items-center gap-space-2">
            <i className="fi fi-brands-apple flex items-center justify-content text-[24px] text-white"></i>
            <div className="text-background flex flex-col items-start">
              <p className="text-[10px] font-primary mb-space-1">
                Download on the
              </p>
              <h3 className="text-[24px]">App Store</h3>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default MobileApp;
