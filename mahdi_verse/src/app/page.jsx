import Image from "next/image";
import React from "react";
import { assets } from "./assets/assets";
import Button from "./components/Button";
import CountUp from "react-countup";
import CountUpNumber from "./components/home/CountUpNumber";

const page = () => {
  const count = [
    {
      label: "Years of Experience",
      number: "5",
      icon: "fi fi-sr-briefcase",
    },
    {
      label: "Completed Projects",
      number: "100",
      icon: "fi fi-sr-browser",
    },
    {
      label: "Happy Clients",
      number: "50",
      icon: "fi fi-sr-employee-man-alt",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* image */}
      <div className="px-2.5 flex flex-col items-center justify-center relative gap-[50px]">
        <div className="relative">
  <Image
    alt="myImage"
    src={assets.profile}
    className="rounded-full w-[150px] h-auto"
  />

  {/* Node js - top left */}
  <div className="rounded-full w-13 h-13 shadow-[2px_2px_5px_rgba(196,196,196,0.9),-2px_-2px_4px_rgba(255,255,255,0.9),2px_-2px_4px_rgba(196,196,196,0.2),-2px_2px_4px_rgba(196,196,196,0.2),inset_-1px_-1px_2px_rgba(196,196,196,0.5),inset_1px_1px_2px_rgba(255,255,255,0.3)] bg-linear-to-br from-[#FFFFFF] to-[#EAEAEA] absolute -left-14 -top-9 flex items-center justify-center">
    <Image alt="icon" src={assets.Node_js} height={100} width={100} className="h-6.25 w-auto" />
  </div>

  {/* react js - top right */}
  <div className="rounded-full w-13 h-13 shadow-[2px_2px_5px_rgba(196,196,196,0.9),-2px_-2px_4px_rgba(255,255,255,0.9),2px_-2px_4px_rgba(196,196,196,0.2),-2px_2px_4px_rgba(196,196,196,0.2),inset_-1px_-1px_2px_rgba(196,196,196,0.5),inset_1px_1px_2px_rgba(255,255,255,0.3)] bg-linear-to-br from-[#FFFFFF] to-[#EAEAEA] absolute -right-14 -top-9 flex items-center justify-center">
    <Image alt="icon" src={assets.React_js} height={100} width={100} className="h-6.25 w-auto" />
  </div>

  {/* next js - middle left */}
  <div className="rounded-full w-13 h-13 shadow-[2px_2px_5px_rgba(196,196,196,0.9),-2px_-2px_4px_rgba(255,255,255,0.9),2px_-2px_4px_rgba(196,196,196,0.2),-2px_2px_4px_rgba(196,196,196,0.2),inset_-1px_-1px_2px_rgba(196,196,196,0.5),inset_1px_1px_2px_rgba(255,255,255,0.3)] bg-linear-to-br from-[#FFFFFF] to-[#EAEAEA] absolute -left-20 top-12 flex items-center justify-center">
    <Image alt="icon" src={assets.nextjs} height={100} width={100} className="h-6.25 w-auto" />
  </div>

  {/* redux js - middle right */}
  <div className="rounded-full w-13 h-13 shadow-[2px_2px_5px_rgba(196,196,196,0.9),-2px_-2px_4px_rgba(255,255,255,0.9),2px_-2px_4px_rgba(196,196,196,0.2),-2px_2px_4px_rgba(196,196,196,0.2),inset_-1px_-1px_2px_rgba(196,196,196,0.5),inset_1px_1px_2px_rgba(255,255,255,0.3)] bg-linear-to-br from-[#FFFFFF] to-[#EAEAEA] absolute -right-20 top-12 flex items-center justify-center">
    <Image alt="icon" src={assets.redux} height={100} width={100} className="h-6.25 w-auto" />
  </div>

  {/* figma - bottom left */}
  <div className="rounded-full w-13 h-13 shadow-[2px_2px_5px_rgba(196,196,196,0.9),-2px_-2px_4px_rgba(255,255,255,0.9),2px_-2px_4px_rgba(196,196,196,0.2),-2px_2px_4px_rgba(196,196,196,0.2),inset_-1px_-1px_2px_rgba(196,196,196,0.5),inset_1px_1px_2px_rgba(255,255,255,0.3)] bg-linear-to-br from-[#FFFFFF] to-[#EAEAEA] absolute -left-14 -bottom-9 flex items-center justify-center">
    <Image alt="icon" src={assets.figma} height={100} width={100} className="h-6.25 w-auto" />
  </div>

  {/* VS code - bottom right */}
  <div className="rounded-full w-13 h-13 shadow-[2px_2px_5px_rgba(196,196,196,0.9),-2px_-2px_4px_rgba(255,255,255,0.9),2px_-2px_4px_rgba(196,196,196,0.2),-2px_2px_4px_rgba(196,196,196,0.2),inset_-1px_-1px_2px_rgba(196,196,196,0.5),inset_1px_1px_2px_rgba(255,255,255,0.3)] bg-linear-to-br from-[#FFFFFF] to-[#EAEAEA] absolute -right-14 -bottom-9 flex items-center justify-center">
    <Image alt="icon" src={assets.Visual_Studio_Code} height={100} width={100} className="h-6.25 w-auto" />
  </div>
</div>
        <div className="flex items-center justify-center gap-space-2 px-space-7 py-space-2 rounded-xl max-w-max border border-[#00DE00]/20">
          <span className="relative flex size-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00dE00] opacity-75"></span>
            <span className="relative inline-flex size-3 rounded-full bg-[#00de00]"></span>
          </span>
          <p className="font-primary font-semibold text-size-sm text-[#00de00]">
            Available for work
          </p>
        </div>
      </div>

      {/* content */}
      <div className="flex flex-col items-center gap-space-6 mt-space-6">
        <div className="flex flex-col items-center gap-space-4">
          <div className="flex flex-col items-center text-center gap-space-2">
            <h1 className="font-primary text-size-2xl font-bold">
              Designing Experiences, Building
              <br />
              <span className="bg-linear-to-r from-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">
                Modern Web Interfaces
              </span>
            </h1>
            <p className="font-medium text-size-base opacity-70 w-[700px]">
              I’m Mahdi — a UI/UX Designer and Next.js Frontend Developer
              focused on creating aesthetic, user-centered, and high-performance
              digital experiences that feel smooth, modern, and impactful.
            </p>
          </div>
          <Button text={"About me"} />
        </div>
        <div className="flex items-center gap-space-7">
          {count.map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center gap-space-2 px-space-6 w-[240px]"
            >
              <div >
                <div className="flex items-center gap-space-3 text-secondary-700">
                  <i className={`text-[26px] ${item.icon}`}></i>
                  <CountUpNumber key={i} number={item.number} />
                </div>
                <h4 className="font-semibold text-size-base text-placeholder mt-space-1">
                  {item.label}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
