import React from "react";
import Chips from "../Chips";
import Button from "../Button";
import Image from "next/image";
import ProjectImageGallery from "./ProjectImageGallery";
import Link from "next/link";
import TypographyCard from "./TypographyCard";
import FeedbackCard from "./FeedbackCard";
import ScrollThanksBanner from "./ScrollThanksBanner";

const ProjectDetails = ({ project }) => {
  const {
    title,
    description,
    images,
    tags,
    caseStudyLink,
    overview,
    problems,
    solutions,
    projectJourneyIntro,
    projectJourney,
    interactiveFeatures,
    colors,
    spacing,
    typographyIntro,
    typography,
    finalDesign,
    clientIntro,
    client,
    learnings,
  } = project;

  return (
    <div className="bg-secondary-50 rounded-2xl p-space-6">
      <div className="mb-space-6 flex items-center justify-between">
        <Chips text={tags.join(", ")} />
        <Button text={"Development"} />
      </div>
      <div className="space-y-space-10">
        {/* title, description and images */}
        <div className="flex items-center gap-space-4">
          <div className="">
            <h1 className="font-semibold text-size-2xl mb-space-3">{title}</h1>
            <p className="font-medium text-size-base text-placeholder_2 mb-space-7">
              {description}
            </p>
            <Link href={caseStudyLink} className="inline-flex items-center gap-2 *:cursor-pointer">
              <Button text={"Case Study"} />
            </Link>
          </div>
          <ProjectImageGallery images={finalDesign.images} />
        </div>

        {/* project overview, problems and solutions */}
        <div className="space-y-space-4">
          <div className="p-space-4">
            <h2 className="font-primary font-semibold text-size-lg mb-space-2">
              {overview.title}
            </h2>
            <p className="font-medium text-size-base text-placeholder_2">
              {overview.description}
            </p>
          </div>

          <div className="h-0.5 opacity-20 bg-placeholder rounded-full"></div>

          <div className="py-space-4 space-y-space-6">
            <div className="p-space-6 space-y-space-4 rounded-2xl bg-red/5 border border-red/5 relative overflow-hidden">
              {/* watermark */}
              <i className="absolute -bottom-space-4 right-0 text-red/10 text-[103px] fi fi-rr-problem-solving"></i>

              <h3 className="font-primary text-size-md font-semibold text-red">
                Problems
              </h3>
              <div className="space-y-space-3">
                {problems.map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="size-space-3 flex items-center justify-center bg-red/10 rounded-full">
                      <span className="size-1.5 bg-red/50 rounded-full"></span>
                    </div>
                    <p className="font-medium text-size-base">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-space-6 space-y-space-4 rounded-2xl bg-green/5 border border-red/5 relative overflow-hidden">
              {/* watermark */}
              <i className="absolute -bottom-space-4 right-0 text-green/10 text-[103px] fi fi-rr-lightbulb-on"></i>

              <h3 className="font-primary text-size-md font-semibold text-green">
                Solutions
              </h3>
              <div className="space-y-space-3">
                {solutions.map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="size-space-3 flex items-center justify-center bg-green/10 rounded-full">
                      <span className="size-1.5 bg-green/50 rounded-full"></span>
                    </div>
                    <p className="font-medium text-size-base">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product journey */}
        <div className="p-space-5">
          <div className="space-y-space-5 mb-space-7">
            <Chips text={"Product Journey"} />
            <p className="font-medium text-size-base">{projectJourneyIntro}</p>
          </div>
          <div className="grid grid-cols-4 *:w-full gap-space-6 *:min-h-40">
            {projectJourney.map((item, i) => (
              <div
                key={i}
                className="p-space-4 rounded-xl bg-primary-500/5 border border-primary-500/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-space-2 mb-space-2">
                    <div className="size-space-6 flex items-center justify-center bg-primary-500/10 rounded-full *:text-size-xs_2 *:text-primary-500">
                      <i className={item.icon}></i>
                    </div>
                    <h3 className="font-primary font-semibold text-size-sm">
                      {item.title}
                    </h3>
                  </div>
                  <p className="font-medium text-size-xs_2 mb-space-4">
                    {item.subtitle}
                  </p>
                </div>
                <Chips text={item.duration} fullWidth={true} />
              </div>
            ))}
          </div>
        </div>

        {/* interactive features */}
        <div className="space-y-space-4 p-space-6 rounded-2xl bg-secondary-100/30 border border-secondary-500/10 relative overflow-hidden ">
          {/* watermark */}
          <i className="absolute -bottom-space-4 right-0 text-secondary-500/10 text-[103px] fi fi-rr-interactive"></i>

          <h3 className="font-primary font-semibold text-size-md text-secondary-500">
            Interactive Features
          </h3>
          <div className="space-y-space-3">
            {interactiveFeatures.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="size-space-3 flex items-center justify-center bg-secondary-500/10 rounded-full">
                  <span className="size-1.5 bg-secondary-500/50 rounded-full"></span>
                </div>
                <p className="font-medium text-size-base">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-space-10 p-space-5">
          <div className="space-y-space-5 w-[70%]">
            <Chips text={"Colors"} />
            <p className="font-primary text-size-base">{colors.description}</p>
          </div>
          <div className="flex items-center gap-space-6 justify-center">
            {/* primary */}
            <div className="flex flex-col items-center gap-7.5 justify-center">
              <div className="flex items-center justify-center">
                {colors.shades.primary.map((item, i) => (
                  <div
                    key={i}
                    className="size-[80px] rounded-full border-2 border-secondary-50"
                    style={{
                      backgroundColor: item,
                      marginLeft: i === 0 ? 0 : "-30px",
                    }}
                  />
                ))}
              </div>
              <Chips variant={"small"} text={"Primary"} />
            </div>

            {/* Secondary */}
            <div className="flex flex-col items-center gap-7.5">
              <div className="flex items-center justify-center">
                {colors.shades.secondary.map((item, i) => (
                  <div
                    key={i}
                    className="size-[80px] rounded-full border-2 border-secondary-50"
                    style={{
                      backgroundColor: item,
                      marginLeft: i === 0 ? 0 : "-30px",
                    }}
                  />
                ))}
              </div>
              <Chips variant={"small"} text={"Primary"} />
            </div>
          </div>
          <div className="flex rounded-full overflow-hidden h-[80px]">
            {colors.others.map((item, i) => (
              <div
                key={i}
                className="w-full flex items-center justify-center"
                style={{
                  backgroundColor: item.code,
                }}
              >
                <Chips variant={"small"} text={item.name} />
              </div>
            ))}
          </div>
        </div>

        {/* spacing */}
        <div className="space-y-space-10 p-space-5">
          <div className="space-y-space-5 w-[70%]">
            <Chips text={"Spacing"} />
            <p className="font-primary text-size-base">{spacing.description}</p>
          </div>
          <div className="grid grid-cols-3 gap-y-space-6 gap-x-space-10">
            {spacing.scale.map((item, i) => (
              <div key={i} className="flex items-center w-full">
                <Chips variant={"small"} text={item.name} />
                <div className="w-full h-0.5 bg-linear-to-r from-primary-500/0 via-primary-500 to-primary-500/0 opacity-20"></div>
                <Chips variant={"small"} text={item.value + "px"} />
              </div>
            ))}
          </div>
        </div>

        {/* Typography */}
        <div className="space-y-space-10 p-space-5">
          <div className="space-y-space-5 w-[70%]">
            <Chips text={"Typography"} />
            <p className="font-primary text-size-base">{typographyIntro}</p>
          </div>
          <div className="grid grid-cols-2 gap-space-6">
            {typography.map((item, i) => (
              <TypographyCard
                key={i}
                fontName={item.fontName}
                usedFor={item.usedFor}
                weights={item.weights}
              />
            ))}
          </div>
        </div>

        {/* Final Design */}
        <div className="space-y-space-10 p-space-5">
          <div className="space-y-space-5">
            <Chips text={"Final Design"} />
            <div className="flex gap-space-9">
              <p className="font-primary text-size-base w-[70%]">
                {finalDesign.description}
              </p>
              <div className="space-y-space-3">
                <h5 className="font-primary font-semibold text-size-sm text-placeholder_2">
                  Tools used
                </h5>
                <div className="flex flex-wrap w-full items-center gap-space-3 *:w-[32px] *:h-[32px]">
                  {finalDesign.tools.map((item, i) => (
                    <Image key={i} alt={item.name} src={item.logo} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-space-7">
            {finalDesign.images.map((item, i) => (
              <Image
                key={i}
                alt={item.alt}
                src={item.src}
                width={1000}
                height={1000}
                className="w-full h-auto object-cover rounded-2xl"
              />
            ))}
          </div>
        </div>

        {/* Feedback */}
        <div className="space-y-space-10 p-space-5">
          <div className="space-y-space-5 w-[70%]">
            <Chips text={"Client Feedback"} />
            <p className="font-primary text-size-base">{clientIntro}</p>
          </div>
          <div className="flex items-center justify-center flex-col w-full">
            {client.feedback.map((item, i) => (
              <FeedbackCard key={i} feedback={item} />
            ))}
          </div>
        </div>

        {/* interactive features */}
        <div className="space-y-space-4 p-space-6 rounded-2xl bg-primary-100/30 border border-primary-500/10 relative overflow-hidden ">
          {/* watermark */}
          <i className="absolute -bottom-space-4 right-0 text-primary-500/10 text-[103px] fi fi-rr-lesson"></i>

          <h3 className="font-primary font-semibold text-size-md text-primary-500">
            What I learned from this project
          </h3>
          <div className="space-y-space-3">
            {learnings.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="size-space-3 flex items-center justify-center bg-primary-500/10 rounded-full">
                  <span className="size-1.5 bg-primary-500/50 rounded-full"></span>
                </div>
                <p className="font-medium text-size-base">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* links */}
        <ScrollThanksBanner />
      </div>
    </div>
  );
};

export default ProjectDetails;
