import React from "react";
import { sroll, whiteSroll } from "../assets/assets";
import Image from "next/image";

const Scroll = () => {
  return (
    <div className="overflow-hidden w-full py-[20px] md:py-[40px] xl:py-13">
      <div className="flex gap-[40px] md:gap-[96px] w-max dark:hidden">
        <div className="grou flex items-center gap-[40px] md:gap-[96px]">
          {sroll.map((item, i) => (
            <Image
              key={i}
              alt="Company Icon"
              src={item}
              width={120}
              height={40}
              className="h-[24px] md:h-[32px] xl:h-[40px] w-auto object-contain"
            />
          ))}
        </div>

        <div className="grou flex items-center gap-[40px] md:gap-[96px]">
          {sroll.map((item, i) => (
            <Image
              key={i}
              alt="Company Icon"
              src={item}
              width={120}
              height={40}
              className="h-[24px] md:h-[32px] xl:h-[40px] w-auto object-contain"
            />
          ))}
        </div>
      </div>
      <div className="gap-[40px] md:gap-[96px] w-max hidden dark:flex">
        <div className="grou flex items-center gap-[40px] md:gap-[96px] *:**:forced-colors:text-white">
          {whiteSroll.map((item, i) => (
            <Image
              key={i}
              alt="Company Icon"
              src={item}
              width={120}
              height={40}
              className="h-[24px] md:h-[32px] xl:h-[40px] w-auto object-contain"
            />
          ))}
        </div>

        <div className="grou flex items-center gap-[40px] md:gap-[96px]">
          {whiteSroll.map((item, i) => (
            <Image
              key={i}
              alt="Company Icon"
              src={item}
              width={120}
              height={40}
              className="h-[24px] md:h-[32px] xl:h-[40px] w-auto object-contain"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Scroll;
