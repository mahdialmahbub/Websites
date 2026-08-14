"use client";

import Link from "next/link";
import React from "react";
import InputField from "../Input";
import CounterField from "../CounterField";
import Image from "next/image";
import { assets } from "@/app/assets/assets";
import Button from "../Button";

const LocationSelectModal = ({
}) => {
  return (
    <div className="p-space-7 rounded-2xl bg-background border-2 border-secondary max-w-[700px]">
      <div className="flex items-center gap-space-3 mb-space-7">
        <i className="text-[32px] fi fi-sr-land-layer-location text-secondary"></i>
        <h2 className="font-semibold text-size-h3">Verify your email</h2>
      </div>
      <div>
        <div className="mb-space-4 px-space-1 flex flex-col items-center justify-between *:flex *:gap-space-6 **:w-full gap-space-8">
          <Image alt="map" src={assets.map} width={300} height={200} className="relative w-full h-[200px] object-cover" />
          <div className="flex gap-space-6">
            <CounterField title="Apartment/Floor Number" />
            <CounterField title="House/Building Number" />
          </div>
          <div className="flex gap-space-6">
            <CounterField title="Road Number/Street" />
            <InputField title="Area/Locality" placeholder="e.g. Kafrul" />
          </div>
          <div className="flex gap-space-6">
            <InputField
              title="Apartment/Floor Number"
              placeholder="e.g. Kafrul"
            />
            <InputField title="Area/Locality" placeholder="e.g. Kafrul" />
          </div>
          <div className="flex gap-space-6">
            <InputField title="Thana/Area" placeholder="e.g. Mirpur" />
            <InputField title="City" placeholder="e.g. Dhaka" />
          </div>
          <div className="flex gap-space-6">
            <InputField title="Postal/ZIP Code" placeholder="e.g. 1212" />
            <InputField title="Country" placeholder="e.g. Bangladesh" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-space-3">
          <Button >Save</Button>
          <div className="flex items-center gap-1.5 font-semibold text-size-large">
            <i className=""></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSelectModal;
