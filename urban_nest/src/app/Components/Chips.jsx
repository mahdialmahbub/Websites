import React from "react";

const Chips = ({ text, isSelected, onClick }) => {
  return (
    <div
      className={`cursor-pointer text-[12px] px-space-2 py-1.5 ${isSelected ? "bg-primary-8 text-background font-semibold" : "bg-primary-1 text-primary-9 hover:bg-primary-2 font-medium"}  transition-all duration-300`}
      onClick={onClick}
    >
      {text}
    </div>
  );
};

export default Chips;
