import React from "react";
import Image from "next/image";
import { sroll, whiteSroll } from "../assets/assets";
import Reveal from "./motions/Reveal";

const LogoGroup = ({ items }) => (
  <div className="flex items-center gap-[40px] md:gap-[96px] shrink-0 opacity-50">
    {items.map((item, i) => (
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
);

const Scroll = () => {
  return (
    <Reveal className="group relative overflow-hidden w-full py-[20px] md:py-[40px] xl:py-13 mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      {/* Light mode track */}
      <div className="flex w-max gap-[40px] md:gap-[96px] dark:hidden animate-[marquee_20s_linear_infinite] group-hover:[animation-play-state:paused]">
        <LogoGroup items={sroll} />
        <LogoGroup items={sroll} />
      </div>

      {/* Dark mode track */}
      <div className="hidden w-max gap-[40px] md:gap-[96px] dark:flex animate-[marquee_45s_linear_infinite] group-hover:[animation-play-state:paused]">
        <LogoGroup items={whiteSroll} />
        <LogoGroup items={whiteSroll} />
      </div>
    </Reveal>
  );
};

export default Scroll;