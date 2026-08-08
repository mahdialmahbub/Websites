/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useState, useRef } from "react";
import SwitchBTN from "../components/SwitchBTN";
import ProjectCard from "../components/ProjectCard";
import Chips from "../components/Chips";
import Button from "../components/Button";
import ProjectDetails from "../components/project/ProjectDetails";
import projectsData from "../../../public/projects/projects";

// category text compare korar jonno normalize helper
// "UI/UX Design" ar "UI UX Design" duitake same dhore neyar jonno
const normalize = (str = "") => str.toLowerCase().replace(/[^a-z0-9]/g, "");

const categories = [
  { label: "All", icon: "fi fi-rr-browser" },
  { label: "UI UX Design", icon: "fi fi-rr-browser" },
  { label: "Web Development", icon: "fi fi-rr-browser" },
];

const page = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const detailsRef = useRef(null);

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setTimeout(() => {
      detailsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  };

  // category onujayi projects filter
  const filteredProjects =
    activeCategory === "All"
      ? projectsData
      : projectsData.filter((project) =>
          project.tags.some(
            (tag) => normalize(tag) === normalize(activeCategory)
          )
        );

  return (
    <section className="min-w-full space-y-space-7">
      {/* projects card */}
      <div className=" flex flex-col ">
        <div className="flex items-center justify-between mb-space-7">
          <h2 className="font-primary text-size-xl font-semibold">
            All Projects
          </h2>
          <div className="flex items-center gap-space-3 p-space-3 rounded-lg bg-secondary-50 *:w-50">
            {categories.map((cat) => (
              <SwitchBTN
                key={cat.label}
                icon={cat.icon}
                text={cat.label}
                isActive={activeCategory === cat.label}
                onClick={() => setActiveCategory(cat.label)}
              />
            ))}
          </div>
        </div>

        {/* projects cards */}
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={() => handleSelectProject(project)}
            />
          ))
        ) : (
          <p className="font-medium text-size-base text-placeholder_2 py-space-6">
            No projects found in this category.
          </p>
        )}
      </div>

      {/*  */}
      <div className="w-full h-0.5 rounded-full opacity-20 bg-placeholder"></div>

      <div ref={detailsRef}>
        {selectedProject ? (
          <ProjectDetails project={selectedProject} />
        ) : (
          <div className="bg-secondary-50 rounded-2xl min-h-25 flex items-center justify-center">
            <p className="font-primary font-semibold text-size-sm text-placeholder_2">
              Select a project to see details
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default page;