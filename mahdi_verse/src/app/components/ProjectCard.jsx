import Image from "next/image";
import React from "react";
import Chips from "./Chips";
import Button from "./Button";

const ProjectCard = ({ project, onSelect }) => {
  const { title, tags } = project;
  const image = project?.finalDesign?.coverImage?.src

  return (
    <div className={`rounded-2xl border shadow-[2_2px_6px_rgba(34, 211, 238, 0.2) overflow-hidden max-w-82.5 group ${onSelect ? "border-secondary-500" : "border-secondary-500/20"}`}>
      <div className="relative w-full h-45 overflow-hidden">
        <Image
          alt="project"
          src={image}
          width={300}
          height={160}
          className="w-full h-45 object-cover group-hover:scale-110 transition-all duration-200"
        />
      </div>
      <div className="p-space-4 space-y-space-5 bg-background">
        <h2
          onClick={onSelect}
          className="font-semibold text-size-md cursor-pointer hover:text-primary-500 transition-colors"
        >
          {title}
        </h2>
        <div className="flex flex-wrap gap-space-3">
          {tags.map((item, i) => (
            <Chips varient="small" key={i} text={item} />
          ))}
        </div>
        <div className="flex">
          <Button text={"Preview"} fullWidth={true} variant="text" />
          <div onClick={onSelect} className="cursor-pointer w-full">
            <Button text={"Details"} fullWidth={true} variant="text" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;