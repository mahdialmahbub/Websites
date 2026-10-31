import React from "react";
import SectionTag from "./SectionTag";
import FadeUp from "./motions/FadeUp";

const SectionHeading = ({ title, subtitle, tagName, isCenter = true }) => {
  return (
    <header
      className={`flex flex-col gap-[clamp(1rem,0.8636rem+0.6818vw,1.375rem)] w-full ${isCenter && "items-center *:text-center"}`}
    >
      <SectionTag text={tagName}/>
      <div className={`${isCenter && "*:text-center items-center justify-center"} flex flex-col space-y-[clamp(0.25rem,0.0682rem+0.9091vw,0.75rem)]`}>
        <FadeUp delay={0.3} as="h2" className="text-[clamp(1.375rem,1.1477rem+1.1364vw,2rem)] font-semibold leading-8">{title}</FadeUp>
        <FadeUp delay={0.6} as="p" className="text-[clamp(0.875rem,0.7841rem+0.4545vw,1.125rem)] font-regular text-black/70 dark:text-white/70 max-w-175">{subtitle}</FadeUp>
      </div>
    </header>
  );
};

export default SectionHeading;
