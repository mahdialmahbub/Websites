import React from "react";

const SectionHeader = ({ text, mainText, isDark = false }) =>  {
  return (
    <div className={`flex items-center gap-space-3 ${isDark && 'text-background'}`}>
      <p className=" font-medium text-4xl">{text}</p>
      <div className="py-space-4 px-space-3">
        <h2 className="font-primary font-semibold text-4xl uppercase border border-primary-6">{mainText}</h2>
      </div>
    </div>
  );
};

export default SectionHeader;
