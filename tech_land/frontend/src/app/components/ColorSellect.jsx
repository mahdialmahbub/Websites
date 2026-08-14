import React from "react";

const ColorSellect = ({ color }) => {
  return (
    <div className="h-space-7 w-[28px] p-space-1 rounded-[4px]">
      <div
        className={`w-full h-full rounded-[2px]`}
        style={{
          backgroundColor: color,
        }}
      ></div>
    </div>
  );
};

export default ColorSellect;
