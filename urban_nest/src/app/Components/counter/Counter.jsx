import React from "react";
import Count from "./Count";
import { counterItems } from "@/app/assets/assets";
import FadeUp from "../motions/FadeUp";

const Counter = () => {
  return (
    <section className="px-space-9 container mx-auto">
      <FadeUp>
        <div className="flex items-center justify-between">
          {counterItems.map((item, index) => (
            <Count key={index} value={item.value} label={item.label} />
          ))}
        </div>
      </FadeUp>
    </section>
  );
};

export default Counter;
