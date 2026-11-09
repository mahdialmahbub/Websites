import React from "react";

const Boxes = ({icon = "fi fi-rr-shield-check", title = "3rd-party tested", subtitle= "for heavy metarials"}) => {
  return (
    <div className="flex items-center justify-center flex-col bg-secondary/5 py-space-6 rounded-2xl">
      <div className="size-12.5 rounded-full flex items-center justify-center mb-2.5 bg-secondary/10 *:text-secondary *:text-[24px]">
        <i className={icon}></i>
      </div>
      <h4 className="font-semibold text-size-h6 mb-0.5">{title}</h4>
      <p className="text-size-large text-placeholder">{subtitle}</p>
    </div>
  );
};

export default Boxes;
