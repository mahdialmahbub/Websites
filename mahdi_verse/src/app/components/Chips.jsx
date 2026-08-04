import React from "react";

const Chips = ({ text, varient }) => {
  return (
    <div
      className={`bg-secondary-50 px-[6px] py-space-3 rounded-full ${varient == small ? "text-text-size-xs" : "text-size-xs_2"} text-secondary-900 font-primary font-semibold shadow-[1_1px_2px_rgba(255, 255, 255), 0.3),-1_-1px_2px_rgba((196, 211, 213, 0.50)),inset_1_-1px_2px_rgba(196, 211, 213, 0.2),inset_-1_1px_2px_rgba(196, 211, 213, 0.2),inset_-1_-1px_2px_rgba(255, 255, 255, 0.9),inset_1_1px_3px_rgba(196, 211, 213, 0.90)]`}
    >
      {text}
    </div>
  );
};

export default Chips;
