import Image from "next/image";
import React from "react";
import { Button } from "./Button";
import { icons } from "../../../assets/iconCollection";

const TempleteCard = ({ templete, isActive= false }) => {
  return (
    <div
      className={`rounded-[clamp(0.625rem,calc(0.727vw+0.455rem),1rem)] w-[clamp(13.125rem,calc(4.242vw+12.131rem),15.3125rem)] group aspect-210/297 overflow-hidden border border-neutral-500/10  relative ${!isActive && "bg-blend-luminosity hover:bg-blend-normal"} w-[clamp(13.125rem,calc(4.242vw+12.131rem),15.3125rem)]`}
    >
      <Image
        alt="Preview this resume template design"
        width={310}
        height={440}
        className="h-full w-full object-cover"
        src={"/preview.jpg"}
      />

      {/* tag */}
      <span className="absolute bg-violet-900/60 text-violet-50 backdrop-blur-xs rounded-sm sm:rounded-lg py-space-2 px-space-3 top-2.5 right-2.5 font-primary font-semibold text-[12px] z-10">
        {templete || "Modern"}
      </span>

      {/* Details */}
      <div className="p-[8px] rounded-lg shadow-[0_0_4px_rgba(0,0,0,1)] bg-linear-to-b to-black from-black/50 text-neutral-50 z-10 absolute bottom-2 left-2 right-2 ">
        <h4 className="font-primary font-semibold text-[clamp(0.875rem,calc(0.242vw+0.818rem),1rem)] mb-space-1">
          {templete || "Modern Professional"}
        </h4>
        <p className="text-[12px] opacity-80 mb-space-3 line-clamp-2 w-full">
          Clean, polished, and job-ready
        </p>
        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            className="bg-blue-500/5 hover:bg-blue-500/20 text-blue-500 border-blue-500/5"
            icon={icons.preview}
          />
          <Button
            variant="text"
            className=" hover:bg-green-500/20 text-green-500 hover:text-green-500
             flex-1"
          >
            Use This
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TempleteCard;
