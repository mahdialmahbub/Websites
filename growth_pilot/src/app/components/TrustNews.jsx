import Image from "next/image";
import React from "react";
import { trustUser } from "../assets/assets";

const TrustNews = () => {
  return (
    <div className="flex items-center gap-[4px] md:gap-2.5 py-[8px] px-[12px] md:py-[12px] md:px-[20px] bg-linear-to-tr from-secondary/10 to-secondary2/10 border border-secondary2 rounded-full">
      <div className="flex items-center -gap-[6px] md:-gap-[10px] *:border-4 *:border-[#F9EEF9] dark:*:border-[#221C31] *:size-5.5 *:md:size-9 *:rounded-full *:-ml-1.5 md:*:-ml-2.5">
        {trustUser.map((item, i) => (
          <Image key={i} src={item} alt="user" />
        ))}
      </div>
      <p className="font-bold text-small md:text-h6">
        Trusted by{" "}
        <span className="text-secondary2">1000+ Business Owners</span>
      </p>
    </div>
  );
};

export default TrustNews;
