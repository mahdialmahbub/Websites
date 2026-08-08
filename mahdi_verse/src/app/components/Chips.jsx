import React from "react";

const Chips = ({ text, variant, fullWidth = false }) => {
  return (
    <div
      className={`bg-secondary-50 py-[6px] px-space-3 rounded-full ${
        variant === "small" ? "text-size-xs" : "text-size-xs_2"
      } text-secondary-900 font-primary font-semibold flex items-center justify-center text-nowrap ${fullWidth ? "w-full" : "max-w-max"} `}
      style={{
        boxShadow:
          "1px 1px 2px rgba(255, 255, 255, 0.3), -1px -1px 2px rgba(196, 211, 213, 0.50), inset 1px -1px 2px rgba(196, 211, 213, 0.2), inset -1px 1px 2px rgba(196, 211, 213, 0.2), inset -1px -1px 2px rgba(255, 255, 255, 0.9), inset 1px 1px 3px rgba(196, 211, 213, 0.90)",
      }}
    >
      <p>{text}</p>
    </div>
  );
};

export default Chips;
