import React from "react";

const Tag = ({ text, property, className, isIcon = false, icon = "fi fi-ss-star" }) => {
  return (
    <div
      className={`${property == "filter" ? "px-[10px] py-[6px] rounded-[6px] text-[13px]" : "px-[12px] py-[8px] rounded-[8px] text-size-large"} bg-secondary/10 text-secondary font-medium ${className} flex gap-space-1 max-w-max`}
    >
      {isIcon && <i className={`${icon}`}></i>}
      {text}
    </div>
  );
};

export default Tag;
