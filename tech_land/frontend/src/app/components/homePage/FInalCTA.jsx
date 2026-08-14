import React from "react";
import SectionHeader from "./SectionHeader";
import InputField from "../Input";
import Button from "../Button";
import Image from "next/image";
import { assets } from "@/app/assets/assets";

const FInalCTA = () => {
  return (
    <section className="section">
      <div
        className="rounded-[20px] w-full h-[344px] flex flex-col items-center justify-center overflow-hidden"
      >
        <div className=" overflow-hidden w-full h-full"><Image
        src={assets.bgOverlay}
        alt="bg"
        className="object-cover "
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" /></div>
        <div className="flex flex-col items-center justify-center text-center mb-space-5">
          <h2 className="font-primary text-size-h2 font-semibold">
            Be Part of Our Family
          </h2>
          <p className="font-medium text-size-h5 text-placeholder_3">
            Join us for updates, deals, and curated product recommendations
            you’ll love.
          </p>
        </div>

        <div className="flex items-center gap-space-2 mt-space-5">
          <div className="h-full w-100">
            <InputField
              showIcon
              icon="fi fi-sr-envelope"
              placeholder="e.g. example@gmail.com"
            />
          </div>
          <Button className="">Send</Button>
        </div>
      </div>
    </section>
  );
};

export default FInalCTA;
