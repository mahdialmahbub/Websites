import React from "react";

const TextButton = ({ text, type = "submit", className = "" }) => {
  return (
    <button
      type={type}
      className={`bg-transparent text-primary-5 block items-center
        font-primary font-bold text-[18px] text-center  cursor-pointer group flex items-center ${className}`}
    >
      <label>{text}</label>
      <i className="fi fi-rs-arrow-small-right flex items-center justify-center text-[28px] text-primary-5 group-hover:translate-x-2 transition-all duration-100"></i>
    </button>
  );
};

export default TextButton;
