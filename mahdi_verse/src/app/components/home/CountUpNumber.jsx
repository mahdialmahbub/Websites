'use client'

import React from "react";
import CountUp from "react-countup";

const CountUpNumber = ({number}) => {
  return (
    <CountUp
      start={0}
      end={number}
      duration={3}
      suffix="+"
      className="font-primary text-[26px] font-semibold text-secondary-700"
    />
  );
};

export default CountUpNumber;
