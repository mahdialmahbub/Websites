import React from "react";
import FadeLeft from "./motions/FadeLeft";
import TextButton from "./TextButton";

const SectionHeader = ({ text, mainText, isDark = false, className, isButton= false }) => {
  return (
    <FadeLeft>
      <div className="flex items-center justify-between">
      <div
        className={`flex items-center gap-space-3 ${isDark && "text-background"} ${className} `}
      >
        <p className=" font-medium text-4xl">{text}</p>
        <div className="py-space-4 px-space-3 hTitle">
          <h2 className="font-primary font-semibold text-4xl uppercase border-primary-6">
            {mainText}
          </h2>
        </div>
      </div>
      {isButton && <TextButton text={"View All"} />}
      </div>
    </FadeLeft>
  );
};

export default SectionHeader;
