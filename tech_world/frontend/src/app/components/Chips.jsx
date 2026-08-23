import React from "react";

const Chips = ({
  text,
  property,
  className,
  isIcon = false,
  icon = "fi fi-ss-star",
  isSelected = false,
}) => {
  return (
    <div
      className={`${property == "filter" ? "px-2.5 py-1.5 rounded-md text-[13px]" : "px-[12px] py-[8px] rounded-lg text-size-large"}  text-secondary font-medium ${className} cursor-pointer flex gap-space-1 hover:bg-secondary/20 ${isSelected ? "bg-secondary/20" : "bg-secondary/5 hover:bg-secondary/10"}`}
    >
      {isIcon && <i className={`${icon}`}></i>}
      {text}
    </div>
  );
};

export default Chips;
