import React from "react";

const Chips = ({ text, varient, fullWidth = false }) => {
  return (
    <div
      className={`bg-secondary-50 rounded-full dark:bg-[#0C1E28] dark:text-secondary-100 chips-shadow ${
        varient == "small" ? "text-size-xs py-[8px] px-space-4" : "text-size-xs_2 py-2.5 px-space-5"
      } text-secondary-900 font-primary font-semibold flex items-center justify-center text-nowrap ${
        fullWidth ? "w-full" : "max-w-max"
      }`}
    >
      <p>{text}</p>
    </div>
  );
};

export default Chips;