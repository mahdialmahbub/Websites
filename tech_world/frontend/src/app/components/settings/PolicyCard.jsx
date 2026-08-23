import React from "react";
import Button from "../Button";

const PolicyCard = ({
  icon = "fi fi-rr-shield-check",
  title = "Pending Orders",
  subtitle = "Learn how we collect, use, store, and protect your personal information. ",
  detailsLink = "www.facebook.com",
}) => {
  return (
    <div className="flex items-center px-space-6 py-space-5 gap-space-5 rounded-xl bg-secondary/5 border-2 border-secondary/30 overflow-hidden justify-between relative">
      {/* left fill */}
      <div className="absolute w-2 inset-0 bg-secondary transition-all duration-300"></div>

      {/* icon title and subtitle */}
      <div className="flex items-center gap-space-4">
        <div className="p-2.5 flex items-center justify-center rounded-lg bg-[#2BE7C4]/10 text-[#2BE7C4] text-[24px]">
          <i className={`${icon}`}></i>
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-size-h4 mb-space-1">{title}</h3>
          <p className="text-size-h5 text-placeholder_3">{subtitle}</p>
        </div>
      </div>

      <button className="flex items-center gap-space-1 font-primary text-size-h6 text-[#2BE7C4] font-medium">
        Details
        <i className="fi fi-rr-arrow-small-right text-[20px]"></i>
      </button>
    </div>
  );
};

export default PolicyCard;
