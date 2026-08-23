"use client";

import React from "react";
import Button from "../components/Button";
import Image from "next/image";
import { assets } from "../assets/assets";
import Link from "next/link";
import { motion } from "framer-motion";
import FadeLeft from "../components/motions/FadeLeft";
import FadeRight from "../components/motions/FadeRight";
import FadeUp from "../components/motions/FadeUp";

const page = () => {
  const aboutMeLabel = [
    "Expect a response from us within 24 hours",
    "We’re happy to sign an NDA upon request.",
    "Get access to a team of dedicated product specialists.",
  ];

  const aboutMeContent = [
    {
      image:
        "https://images.unsplash.com/photos/3d-abstract-shapes-and-emojis-on-purple-background-zrOBY-0hF-g",
      title: "UI UX design",
      subtitle:
        "I'm a UI/UX and Product Designer who creates user-centered websites that balance great design with real business goals.",
      descripiton:
        "Beyond design, I also build responsive frontends using React, Next.js, and Redux, ensuring every detail is implemented as intended. By handling both design and development, I streamline the process, reduce communication gaps, and deliver a smoother experience from concept to launch.",
    },
    {
      image:
        "https://images.unsplash.com/photos/silver-imac-turned-on-inside-room-DtDlVpy-vvQ",
      title: "MERN stact website development",
      subtitle:
        "I'm a UI/UX and Product Designer who creates user-centered websites that balance great design with real business goals.",
      descripiton:
        "Beyond design, I also build responsive frontends using React, Next.js, and Redux, ensuring every detail is implemented as intended. By handling both design and development, I streamline the process, reduce communication gaps, and deliver a smoother experience from concept to launch.",
    },
  ];

  return (
    <section className="min-w-full ">
      <div className="overflow-hidden w-full bg-foreground dark:bg-background flex items-center gap-space-6 rounded-xl p-space-7 relative">
        {/* Background Pattern */}
        <Image
          alt="background pattern"
          src="/Background_patterns.png"
          fill
          className="object-cover z-0 top-0 opacity-8"
        />
        {/* content */}
        <div className="w-full">
          <div>
            <FadeLeft
              delay={0}
              className="rounded-full px-space-5 py-space-3 mb-space-3 font-primary font-semibold text-size-xs_2 bg-secondary-600/10 text-secondary-50 max-w-max "
            >
              UI/UX Design • MERN stack website development
            </FadeLeft>
            <FadeLeft
              as="h1"
              className="font-primary font-semibold text-size-2xl mb-space-5 text-background dark:text-foreground"
            >
              Designing Experiences, Building Websites
            </FadeLeft>
            <FadeLeft
              as="p"
              delay={0.1}
              className="font-medium text-size-md text-placeholder"
            >
              I&apos;m a UI/UX and Product Designer who creates user-centered
              websites that balance great design with real business goals.
            </FadeLeft>
            <FadeLeft
              delay={0.2}
              className="flex flex-col gap-space-4 mt-space-7 mb-space-7"
            >
              {aboutMeLabel.map((item, i) => (
                <FadeLeft
                  key={i}
                  delay={i * 0.08}
                  className="flex items-center gap-1.5"
                >
                  <Image
                    alt="checkBox"
                    width={22}
                    height={22}
                    src={assets.CheckBox}
                  />
                  <p className="font-medium text-size-md text-placeholder">
                    {item}
                  </p>
                </FadeLeft>
              ))}
            </FadeLeft>
          </div>
          <FadeLeft delay={0.3} className="flex items-center gap-space-4">
            <Button varient="text" text={"Intro Video"} />
            <Button
              text={"Download Resume"}
              rightIcon
              icon="fi fi-sr-file-download"
            />
          </FadeLeft>
        </div>
        <FadeRight delay={0.2} className="relative">
          {/* overlay */}
          <div className="box after:blur-[20px]">
            <i className="fi fi-rr-website-design absolute top-1 left-1 transform -translate-x-1/2 -translate-y-1/2 z-20 text-secondary-500/10 text-[86px]"></i>

            <i className="fi fi-rr-code-window absolute -bottom-20 left-1 transform -translate-x-1/2 -translate-y-1/2 z-20 text-secondary-500/10 text-[86px]"></i>

            <Image
              alt="about"
              src={assets.about}
              width={600}
              height={400}
              className="relative z-30"
            />
          </div>
        </FadeRight>
      </div>
      <FadeLeft
        delay={0.4}
        as="h2"
        className="font-primary font-semibold text-size-lg mt-space-7 mb-space-7 "
      >
        Why I choose these professions
      </FadeLeft>
      <div className="space-y-space-6">
        {aboutMeContent.map((item, i) => (
          <FadeUp key={i}>
            <div className="bg-secondary-50 dark:bg-background flex items-center gap-space-6 p-space-7 rounded-xl border border-secondary-500/20 dark:border-secondary-500/10">
              <Image
                width={250}
                height={250}
                src={assets.backgroundImage}
                alt="image"
                className="object-cover h-full rounded-xl"
              />
              <div>
                <FadeUp
                  as="h3"
                  delay={0.1}
                  className="font-primary font-semibold text-size-md mb-space-5"
                >
                  {item.title}
                </FadeUp>
                <FadeUp
                  as="h4"
                  delay={0.2}
                  className="font-medium text-size-sm mb-2.5"
                >
                  {item.subtitle}
                </FadeUp>
                <FadeUp
                  as="p"
                  delay={0.3}
                  className="font-medium text-size-sm text-placeholder mb-space-5"
                >
                  {item.descripiton}
                </FadeUp>
                <FadeUp delay={0.35}>
                  <Link href={"/workflow"}>
                    <Button varient="text" text={"View Workflow"} rightIcon />
                  </Link>
                </FadeUp>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
};

export default page;
