import Image from "next/image";
import React from "react";
import { trustUser } from "../assets/assets";
import Reveal from "./motions/Reveal";

const TrustNews = () => {
  return (
    <Reveal className="flex items-center gap-[clamp(0.375rem,0.3295rem+0.2273vw,0.5rem)] py-[clamp(0.375rem,0.3295rem+0.2273vw,0.5rem)] px-[clamp(0.75rem,0.6591rem+0.4545vw,1rem)] bg-linear-to-tr from-secondary/5 to-secondary2/5 border border-secondary2/10 rounded-full">
      <div className="flex items-center *:border-2 md:*:border-4 *:border-[#FAF4F9] dark:*:border-[#171525] *:size-[clamp(1.375rem,1.0568rem+1.5909vw,2.25rem)] *:rounded-full *:ml-[clamp(-0.625rem,-0.2841rem-0.4545vw,-0.375rem)]">
        {trustUser.map((item, i) => (
          <Image key={i} src={item} alt="user" />
        ))}
      </div>
      <p className="font-medium text-[clamp(0.625rem,0.5341rem+0.4545vw,0.875rem)]">
        Trusted by{" "}
        <span className="text-secondary2">1000+ Business Owners</span>
      </p>
    </Reveal>
  );
};

export default TrustNews;
