import Image from "next/image";
import React from "react";
import { assets } from "./assets/assets";
import Button from "./components/Button";
import CountUp from "react-countup";
import CountUpNumber from "./components/home/CountUpNumber";
import Link from "next/link";
import FadeUp from "./components/motions/FadeUp";
import DevCaseStudyPage from "./components/DevCaseStudyPage";

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
    <div className="flex flex-col items-center justify-center">
      {/* image */}
      <FadeUp delay={0}>
        <div className="px-2.5 flex flex-col items-center justify-center relative gap-12.5">
          <div className="relative">
            <Image
              alt="myImage"
              src={assets.profile}
              className="rounded-full w-37.5 h-auto"
            />

            {/* Node js - top left */}
            <FadeUp delay={0.1} className="rounded-full w-13 h-13 heroIcon bg-linear-to-br from-[#FFFFFF] to-[#EAEAEA] absolute -left-14 -top-9 flex items-center justify-center">
              <Image
                alt="icon"
                src={assets.Node_js}
                height={100}
                width={100}
                className="h-6.25 w-auto"
              />
            </FadeUp>

            {/* react js - top right */}
            <FadeUp delay={0.2} className="rounded-full w-13 h-13 heroIcon bg-linear-to-br from-[#FFFFFF] to-[#EAEAEA] absolute -right-14 -top-9 flex items-center justify-center">
              <Image
                alt="icon"
                src={assets.React_js}
                height={100}
                width={100}
                className="h-6.25 w-auto"
              />
            </FadeUp>

            {/* next js - middle left */}
            <FadeUp delay={0.3} className="rounded-full w-13 h-13 heroIcon bg-linear-to-br from-[#FFFFFF] to-[#EAEAEA] absolute -left-20 top-12 flex items-center justify-center">
              <Image
                alt="icon"
                src={assets.nextjs}
                height={100}
                width={100}
                className="h-6.25 w-auto"
              />
            </FadeUp>

            {/* redux js - middle right */}
            <FadeUp delay={0.4} className="rounded-full w-13 h-13 heroIcon bg-linear-to-br from-[#FFFFFF] to-[#EAEAEA] absolute -right-20 top-12 flex items-center justify-center">
              <Image
                alt="icon"
                src={assets.redux}
                height={100}
                width={100}
                className="h-6.25 w-auto"
              />
            </FadeUp>

            {/* figma - bottom left */}
            <FadeUp delay={0.5} className="rounded-full w-13 h-13 heroIcon bg-linear-to-br from-[#FFFFFF] to-[#EAEAEA] absolute -left-14 -bottom-9 flex items-center justify-center">
              <Image
                alt="icon"
                src={assets.figma}
                height={100}
                width={100}
                className="h-6.25 w-auto"
              />
            </FadeUp>

            {/* VS code - bottom right */}
            <FadeUp delay={0.6} className="rounded-full w-13 h-13 heroIcon bg-linear-to-br from-[#FFFFFF] to-[#EAEAEA] absolute -right-14 -bottom-9 flex items-center justify-center">
              <Image
                alt="icon"
                src={assets.Visual_Studio_Code}
                height={100}
                width={100}
                className="h-6.25 w-auto"
              />
            </FadeUp>
          </div>
          <FadeUp delay={0.7} className="flex items-center justify-center gap-space-2 px-space-7 py-space-2 rounded-xl max-w-max border border-[#00DE00]/20">
            <div className="relative size-4 shrink-0">
              {/* Ping animation */}
              <span className="absolute inset-0 rounded-full bg-green-500/50 animate-ping" />

              {/* Main circle */}
              <span className="absolute top-1/2 left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500" />
            </div>

            <p className="font-primary font-semibold text-size-sm text-[#00DE00]">
              Available for work
            </p>
          </FadeUp>
        </div>
      </FadeUp>

      {/* content */}
      <div className="flex flex-col items-center gap-space-6 mt-space-6">
        <div className="flex flex-col items-center gap-space-4">
          <div className="flex flex-col items-center text-center gap-space-2">
            <FadeUp as="h1" delay={0.1} className="font-primary text-size-2xl font-bold">
              Designing Experiences, Building
              <br />
              <span className="bg-linear-to-r from-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">
                Modern Web Interfaces
              </span>
            </FadeUp>
            <FadeUp as="p" delay={0.2} className=" text-size-base text-placeholder_2 dark:text-placeholder w-175">
              I’m Mahdi — a UI/UX Designer and Next.js Frontend Developer
              focused on creating aesthetic, user-centered, and high-performance
              digital experiences that feel smooth, modern, and impactful.
            </FadeUp>
          </div>
          <FadeUp delay={0.3}>
          <Link
            href={"/about"}
            className="animate-fade-up [animation-delay:360ms]"
          >
            <Button text={"About me"} rightIcon icon="fi fi-rr-arrow-small-right" />
          </Link></FadeUp>
        </div>
        <FadeUp delay={0.4} className="flex items-center gap-space-7 *:animate-fade-up [animation-delay:480ms]">
          {count.map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center gap-space-2 px-space-6 w-60"
            >
            </div>
          ))}
        </FadeUp>
      </div>
    </div>
  );
};

export default page;
