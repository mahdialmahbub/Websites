import React from "react";
import Chips from "../Chips";
import Button from "../Button";
import Image from "next/image";
import ProjectImageGallery from "./ProjectImageGallery";
import Link from "next/link";
import TypographyCard from "./TypographyCard";
import FeedbackCard from "./FeedbackCard";
import ScrollThanksBanner from "./ScrollThanksBanner";
import StarRating from "./StarRating";
import ProjectGallery from "./ProjectGallery";

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
    <div className="bg-secondary-50 dark:bg-background rounded-2xl p-space-6">
      <div className="mb-space-6 flex items-center justify-between">
        <Chips text={tags.join(", ")} />
        <Button varient="text" text={"Development"} rightIcon />
      </div>
      <div className="space-y-space-10">
        {/* title, description and images */}
        <div className="flex items-center gap-space-4">
          <div className="">
            <h1 className="font-semibold text-size-2xl mb-space-3">{title}</h1>
            <p className="font-medium text-size-base text-placeholder_2 dark:text-placeholder/80 mb-space-7">
              {description}
            </p>
            <Link
              href={caseStudyLink}
              className="inline-flex items-center gap-2 *:cursor-pointer"
            >
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
            <p className="font-medium text-size-base text-placeholder_2 dark:text-placeholder/80">
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
                    <div className="size-6.5 flex items-center justify-center bg-primary-500/10 rounded-full *:text-size-xs *:text-primary-500">
                      <i className={item.icon}></i>
                    </div>
                    <h3 className="font-primary font-semibold text-size-base">
                      {item.title}
                    </h3>
                  </div>
                  <p className="font-medium text-size-sm mb-space-4 text-placeholder_2 dark:text-placeholder/80">
                    {item.subtitle}
                  </p>
                </div>
                <Chips text={item.duration} fullWidth={true} />
              </div>
            ))}
          </div>
        </div>

        {/* interactive features */}
        <div className="space-y-space-4 p-space-6 rounded-2xl bg-primary-100/30 dark:bg-primary-500/5 border border-secondary-500/10 relative overflow-hidden ">
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
                    className="size-[80px] rounded-full border-2 border-secondary-50 dark:border-background"
                    style={{
                      backgroundColor: item,
                      marginLeft: i === 0 ? 0 : "-30px",
                    }}
                  />
                ))}
              </div>
              <Chips varient={"small"} text={"Primary"} />
            </div>

            {/* Secondary */}
            <div className="flex flex-col items-center gap-7.5">
              <div className="flex items-center justify-center">
                {colors.shades.secondary.map((item, i) => (
                  <div
                    key={i}
                    className="size-[80px] rounded-full border-2 border-secondary-50 dark:border-background"
                    style={{
                      backgroundColor: item,
                      marginLeft: i === 0 ? 0 : "-30px",
                    }}
                  />
                ))}
              </div>
              <Chips varient={"small"} text={"Primary"} />
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
                <Chips varient={"small"} text={item.name} />
              </div>
            ))}
          </div>
          {colors.dark && (
            <div className="space-y-space-7">
              <Chips text={"Dark Colors"} />
              <div className="flex rounded-full overflow-hidden h-[80px]">
                {colors.dark?.map((item, i) => (
                  <div
                    key={i}
                    className="w-full flex items-center justify-center"
                    style={{
                      backgroundColor: item.code,
                    }}
                  >
                    <Chips varient={"small"} text={item.name} />
                  </div>
                ))}
              </div>
            </div>
          )}
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
                <Chips varient={"small"} text={item.name} />
                <div className="w-full h-0.5 bg-linear-to-r from-primary-500/0 via-primary-500 to-primary-500/0 opacity-20"></div>
                <Chips varient={"small"} text={item.value + "px"} />
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
                <h5 className="font-primary font-semibold text-size-sm text-placeholder_2 dark:text-placeholder/80">
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
          <ProjectGallery images={finalDesign.images} />
        </div>

        {/* Feedback */}
        <div className="space-y-space-10 p-space-5">
          <div className="space-y-space-5 w-[70%]">
            <Chips text={"Client Feedback"} />
            <p className="font-primary text-size-base">{clientIntro}</p>
          </div>
          <div className="flex items-center justify-center flex-col w-full">
            {client.feedback.map((item, i) => (
              <div
                key={i}
                className="p-space-6 border-2 border-secondary-500/30 dark:border-secondary-500/20 rounded-2xl space-y-space-6 w-[70%]"
              >
                <p className="font-medium leading-4.5 text-size-base">
                  {item.comment}
                </p>
                <div className="border-t-2 border-placeholder/20 pt-space-4 flex items-center justify-between">
                  <div className="flex items-center gap-space-3">
                    {/* image */}
                    <Image
                      alt="client"
                      src={client.image}
                      width={42}
                      height={42}
                      className="rounded-full object-cover w-10.5 h-10.5"
                    />
                    <div className="">
                      <div className="flex items-center gap-0.5 cursor-pointer group">
                        <h4 className="font-primary font-semibold text-size-xs_2 ">
                          {client.name}
                        </h4>
                        <i className="fi fi-rr-arrow-small-right text-size-md transition-all duration-200 group-hover:translate-x-1"></i>
                      </div>
                      <p className="font-medium text-[11px] opacity-70">
                        {client.position}
                      </p>
                    </div>
                  </div>
                  <StarRating size={18} rating={item.rating} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What I learned from this project */}
        <div className="space-y-space-4 p-space-6 rounded-2xl bg-primary-100/30 dark:bg-primary-500/5 border border-primary-500/10 relative overflow-hidden ">
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
