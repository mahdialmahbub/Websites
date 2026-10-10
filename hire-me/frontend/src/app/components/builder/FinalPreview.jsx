import React from "react";
import { icons } from "../../../../assets/iconCollection";
import Image from "next/image";

const FinalPreview = ({creating= false, completed= false, preview= false}) => {
  return (
    <div
      className={`md:max-w-135.5 sm:max-w-95 w-full aspect-210/297 overflow-hidden shadow-[0_12px_16px_rgba(0,0,0,0.12)] rounded-[13px] relative`}
    >
      <Image
        src={"/preview.jpg"}
        alt="Resume Preview"
        width={550}
        height={766}
        className="w-full h-full aspect-210/297"
      />
      {!preview && <div
        className={`flex items-center justify-center gap-[clamp(0.875rem,calc(0.727vw+0.705rem),1.25rem)] absolute inset-0 bg-white/5 backdrop-blur-[60px] ${creating ? "*:animate-spin text-blue-500" : "text-green-500"}`}
      >
        <i className={`${creating ? icons.ai : icons.resume} `}></i>
        <h3 className="text-[clamp(1.375rem,calc(1.212vw+1.091rem),2rem)] font-primary font-medium"></h3>
      </div>}
    </div>
  );
};

export default FinalPreview;
