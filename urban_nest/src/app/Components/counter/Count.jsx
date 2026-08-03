"use client";

import React from "react";
import CountUp from "react-countup";

const Count = ({ value, label }) => {
  return (
    <div className="">
      <h2 className="text-[58px] font-primary font-semibold text-primary-6 mb-2">
        <CountUp
          end={value}
          duration={5}
          start={0}
          suffix="k+"
        />
      </h2>
      <p className="text-placeholder font-semibold text-[24px]">{label}</p>
    </div>
  );
};

export default Count;
