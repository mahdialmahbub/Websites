import React from "react";

const TextButton = ({ text, type = "submit", className = "" }) => {
  return (
    <button
      type={type}
      className={`bg-transparent text-primary-5 block items-center
        font-primary font-bold text-[18px] text-center  cursor-pointer ${className}`}
    >
      {text}
    </button>
  );
};

export default TextButton;
