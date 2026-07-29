import React from "react";

const Tag = ({ text, property, className }) => {
  return (
    <div
      className={`${property == "filter" ? "px-[10px] py-[6px] rounded-[6px] text-[13px]" : "px-[12px] py-[8px] rounded-[8px] text-size-large"} bg-secondary/10 text-secondary font-medium ${className}`}
    >
      {text}
    </div>
  );
};

export default Tag;
