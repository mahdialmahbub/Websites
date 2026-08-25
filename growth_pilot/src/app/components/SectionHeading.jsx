import React from "react";
import SectionTag from "./SectionTag";
import FadeUp from "./motions/FadeUp";

const SectionHeading = ({ title, subtitle, tagName, isCenter = true }) => {
  return (
    <header
      className={`flex flex-col gap-[16px] md:gap-[20px] xl:gap-[32px]  w-full ${isCenter && "items-center *:text-center"}`}
    >
      <SectionTag text={tagName}/>
      <div className={`${isCenter && "items-center *:text-center"} w-full`}>
        <FadeUp delay={0.3} as="h2" className="text-h4 md:text-h3 xl:text-h2 font-bold">{title}</FadeUp>
        <FadeUp delay={0.6} as="p" className="text-large md:text-h5 xl:text-[20px] font-medium text-black/70 dark:text-white/70">{subtitle}</FadeUp>
      </div>
    </header>
  );
};

export default SectionHeading;
