import React from "react";

const Tag = ({ text, property, className, isIcon = false, icon = "fi fi-ss-star" }) => {
  return (
    <div
      className={`${property == "filter" ? "px-2.5 py-1.5 rounded-md text-[13px]" : "px-[12px] py-[8px] rounded-lg text-size-large"} bg-secondary/10 text-secondary font-medium ${className} flex gap-space-1 max-w-max`}
    >
      {isIcon && <i className={`${icon}`}></i>}
      {text}
    </div>
  );
};

export default Tag;
