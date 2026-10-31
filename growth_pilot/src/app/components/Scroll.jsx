import React from "react";
import Image from "next/image";
import { sroll, whiteSroll } from "../assets/assets";
import Reveal from "./motions/Reveal";

const LogoGroup = ({ items }) => (
  <div className="flex shrink-0 items-center gap-[clamp(2rem,0.5455rem+7.2727vw,6rem)]">
    {items.map((item, i) => (
      <div
        key={i}
        className="
          relative
          h-[clamp(1.125rem,0.625rem+2.5vw,2.5rem)]
          w-25
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
      <div className="flex w-max gap-[clamp(2rem,0.5455rem+7.2727vw,6rem)] dark:hidden animate-[marquee_20s_linear_infinite] group-hover:[animation-play-state:paused] opacity-30">
        <LogoGroup items={sroll} />
        <LogoGroup items={sroll} />
      </div>

      {/* Dark mode track */}
      <div className="hidden w-max gap-[clamp(2rem,0.5455rem+7.2727vw,6rem)] dark:flex animate-[marquee_45s_linear_infinite] group-hover:[animation-play-state:paused] opacity-30">
        <LogoGroup items={whiteSroll} />
        <LogoGroup items={whiteSroll} />
      </div>
    </Reveal>
  );
};

export default Scroll;
