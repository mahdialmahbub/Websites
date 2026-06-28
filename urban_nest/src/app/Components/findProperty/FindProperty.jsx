import React from "react";
import SectionHeader from "../SectionHeader";
import FindFrom from "./FindFrom";
import Image from "next/image";
import { assets, propertyProgress } from "@/app/assets/assets";
import Button from "../Button";
import IndividualProgressBar from "./IndividualProgressBar";

const FindProperty = () => {
  return (
    <section className="p-space-9 bg-foreground">
      <div className="">
        <SectionHeader mainText={"Match"} text={"Find your perfect"} isDark />

        {/* content */}
        <div className="mt-space-7">
          {/* form and map */}
          <div className="flex gap-space-7">
            <FindFrom />
            <Image
              src={assets.Map}
              alt="Map"
              className="w-full h-full object-cover"
            />
          </div>

          {/* progress and properties */}
          <div className="flex gap-space-7 mt-space-7">
            <div className="w-100 p-space-5 min-h-[500px] bg-[#182033] flex flex-col items-center shadow-[inset_3px_3px_20px_0px_rgba(255,255,255,0.1),-7px_-7px_10px_rgba(0,0,0,0.25)]">
              {/* title */}
              <h2 className="text-md font-semibold text-background w-full mb-space-6">
                Selected Property Score
              </h2>

              {/* Progress Bar */}
              <div className="w-[171px] h-[90px] bg-amber-50 mb-space-6"></div>

              {/* indevidual progress */}
              <div className="flex flex-col gap-space-5 py-3.5 px-[4px] w-full">
                {propertyProgress.map((item, index) => (
                  <IndividualProgressBar
                    key={index}
                    icon={item.icon}
                    label={item.label}
                    color={item.color}
                    value={item.value}
                  />
                ))}
              </div>

              {/* Button */}
              <Button
                text={"View Details"}
                property="text"
                type="button"
                className="mt-space-6"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FindProperty;
