import React from "react";
import Reveal from "./motions/Reveal";

const SectionTag = ({ text = "Text" }) => {
  return (
    <Reveal
      duration={0.6}
      className="inline-flex items-center gap-[8px] p-[clamp(0.625rem,0.5795rem+0.2273vw,0.75rem)] rounded-full text-[clamp(0.75rem,0.7045rem+0.2273vw,0.875rem)] font-semibold text-secondary2 bg-linear-to-tr from-secondary/10 to-secondary2/10 border border-secondary2/5 w-max h-[clamp(1.375rem,1.3295rem+0.2273vw,1.5rem)]"
    >
      <span>{text}</span>
    </Reveal>
  );
};

export default SectionTag;
