import React from "react";
import Button from "../components/Button";
import Image from "next/image";
import { assets } from "../assets/assets";
import FadeLeft from "../components/motions/FadeLeft";
import FadeRight from "../components/motions/FadeRight";
import FadeUp from "../components/motions/FadeUp";
import ServiceCard from "../components/about/ServiceCard";
import TechStack from "../components/about/TechStack";
import ContactCTA from "../components/about/CTA";
import IntroVideoButton from "../components/IntroVideoButton";
import StatsSection from "../components/StateSection";

const page = () => {
  const aboutMeLabel = [
    "Expect a response from us within 24 hours",
    "We’re happy to sign an NDA upon request.",
    "Get access to a team of dedicated product specialists.",
  ];

  const aboutMeContent = [
    {
      icon: "fi fi-rr-website-design",
      title: "UI/UX Design",
      process: ["Research", "Wireframe", "Prototype"],

      description:
        "I chose UI/UX design because I enjoy understanding how people think, what they need, and what makes a digital experience feel simple and intuitive. It gives me the freedom to turn ideas and problems into meaningful experiences that people enjoy using.",

      tags: ["Figma", "User Research", "Wireframing", "Design Systems"],

      btnText: "How I Design",

      workflowHref: "/workflow?workflow=ui-ux-design",
    },
    {
      icon: "fi fi-rr-code-window",
      title: "MERN Stack Development",
      process: ["React", "Node", "MongoDB"],

      description:
        "I chose MERN development because I wanted to go beyond designing interfaces and actually bring those ideas to life. Building with JavaScript across the stack lets me turn thoughtful designs into fast, functional, and scalable products.",

      tags: ["React", "Next.js", "Redux", "Node.js", "MongoDB"],

      btnText: "How I Build",

      workflowHref: "/workflow?workflow=web-development",
    },
  ];

  return (
    <section className="min-w-full space-y-space-12">
      <div className="overflow-hidden w-full bg-foreground dark:bg-background flex items-center gap-space-8 rounded-xl p-space-7 relative">
        {/* Background Pattern */}
        <Image
          alt="background pattern"
          src="/Background_patterns.png"
          fill
          className="pointer-events-none
      absolute
      inset-0
      -z-20
      object-cover
      opacity-[0.035]
      dark:opacity-[0.045]
"
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
              className="font-primary font-semibold text-size-2xl mb-space-4 text-background dark:text-foreground"
            >
              Designing Experiences, Building Websites
            </FadeLeft>
            <FadeLeft
              as="p"
              delay={0.1}
              className=" text-size-md text-placeholder max-w-162.5"
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
                  <p className="text-size-md text-placeholder">
                    {item}
                  </p>
                </FadeLeft>
              ))}
            </FadeLeft>
          </div>
          <FadeLeft delay={0.3} className="flex items-center gap-space-4">
            <IntroVideoButton />
            <Button
              text={"Download Resume"}
              leftIcon
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

        {/* scroll */}
        <div className="absolute bottom-space-7 left-[50%] right-[50%] opacity-20">
          <div className="flex flex-col items-center font-bold font-primary gap-space-1 text-secondary-200 animate-pulse">
            <div className="w-2 h-6 bg-secondary-500 rounded-full"></div>
            Scroll
          </div>
        </div>
      </div>

      <StatsSection />

      <div className="space-y-space-7">
        <div
          className="
            mb-12
            flex
            flex-col
            gap-6
            lg:mb-14
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >
          {/* Heading */}
          <FadeLeft
            as="h2"
            className="
                mt-3
                text-size-xl
                font-semibold
                leading-tight
                tracking-[-0.035em]
              "
          >
            Why I chose these paths
          </FadeLeft>
        </div>
        <div className="space-x-space-6 flex ">
          {aboutMeContent.map((item, i) => (
            <FadeUp key={i} delay={i * 0.2} className="">
              <ServiceCard
                description={item.description}
                process={item.process}
                title={item.title}
                buttonText={item.btnText}
                icon={item.icon}
                tags={item.tags}
                href={item.workflowHref}
              />
            </FadeUp>
          ))}
        </div>
      </div>
      <TechStack />
      <ContactCTA />
    </section>
  );
};

export default page;
