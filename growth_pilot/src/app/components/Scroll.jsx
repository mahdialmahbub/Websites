import React from "react";
import Image from "next/image";
import { sroll, whiteSroll } from "../assets/assets";
import Reveal from "./motions/Reveal";

const LogoGroup = ({ items }) => (
  <div className="flex shrink-0 items-center gap-[40px] opacity-50 md:gap-[96px]">
    {items.map((item, i) => (
      <div
        key={i}
        className="
          relative
          h-[24px]
          w-25
          md:h-[32px]
          md:w-30
          xl:h-[40px]
          xl:w-37.5
        "
      >
        <Image
          alt="Company Logo"
          src={item}
          fill
          sizes="150px"
          className="object-contain"
        />
      </div>
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
