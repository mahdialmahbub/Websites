import React from "react";
import SectionTag from "./SectionTag";

const SectionHeading = ({ title, subtitle, tagName, isCenter = true }) => {
  return (
    <header
      className={`flex flex-col gap-[16px] md:gap-[20px] xl:gap-[32px]  w-full ${isCenter && "items-center *:text-center"}`}
    >
      <SectionTag text={tagName}/>
      <div className={`${isCenter && "items-center *:text-center"} w-full`}>
        <h2 className="text-h4 md:text-h3 xl:text-h2 font-bold">{title}</h2>
        <p className="text-large md:text-h5 xl:text-[20px] font-medium text-black/70 dark:text-white/70">{subtitle}</p>
      </div>
    </header>
  );
};

export default SectionHeading;
