import React from "react";

const Count = ({ value, label }) => {
  return (
    <div className="">
      <h2 className="text-[58px] font-primary font-semibold text-primary-6 mb-2">
        {value}
      </h2>
      <p className="text-placeholder font-semibold text-[24px]">{label}</p>
    </div>
  );
};

export default Count;
