import React from "react";

const Chips = ({ text, isSelected, onClick }) => {
  return (
    <div
      className={`cursor-pointer  text-xs font-semibold  px-space-2 py-1.5 ${isSelected ? "bg-primary-8 text-background" : "bg-primary-2 text-primary-9 hover:bg-primary-3"}`}
      onClick={onClick}
    >
      {text}
    </div>
  );
};

export default Chips;
