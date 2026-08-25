import React from "react";
import Reveal from "./motions/Reveal";

const SectionTag = ({ text = "Text" }) => {
  return (
    <Reveal
      duration={0.6}
      className="inline-flex items-center gap-[8px] py-[8px] px-[16px] md:py-[12px] md:px-[20px] xl:py-[16px] xl:px-[24px] rounded-full text-medium md:text-h6 xl:text-h5 font-bold text-secondary2 bg-linear-to-tr from-secondary/10 to-secondary2/10 border border-secondary2/40 w-max"
    >
      <span>{text}</span>
    </Reveal>
  );
};

export default SectionTag;
