"use client";

import React, { useState, useRef, useEffect } from "react";
import SwitchBTN from "../components/SwitchBTN";
import ProjectCard from "../components/ProjectCard";
import ProjectCardSkeleton from "../components/ProjectCardSkeleton";
import ProjectDetails from "../components/project/ProjectDetails";
import projectsData from "../../../public/projects/projects";
import FadeRight from "../components/motions/FadeRight";
import FadeLeft from "../components/motions/FadeLeft";
import ProjectDetailsSkeleton from "../components/project/ProjectDetailsSkeleton";

// category text compare korar jonno normalize helper
// "UI/UX Design" ar "UI UX Design" duitake same dhore neyar jonno
const normalize = (str = "") => str.toLowerCase().replace(/[^a-z0-9]/g, "");

const categories = [
  { label: "All", icon: "fi fi-rr-browser" },
  { label: "UI UX Design", icon: "fi fi-rr-browser" },
  { label: "Web Development", icon: "fi fi-rr-browser" },
];

// ei delay ta ichchhakrito — real fetch na, sudhu skeleton ta
// client ke dekhanor jonno halka pause. khub kom rakhbo jate slow na lage
const SKELETON_DELAY = 700;

const Page = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true); // cards grid skeleton
  const [detailsLoading, setDetailsLoading] = useState(false); // project details skeleton
  const detailsRef = useRef(null);
  const detailsTimerRef = useRef(null);

  // category change hole (ba prothom load e) cards grid-er skeleton abar dekhabe
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), SKELETON_DELAY);
    return () => clearTimeout(timer);
  }, [activeCategory]);

  // cleanup: component unmount hole pending details-timer clear
  useEffect(() => {
    return () => {
      if (detailsTimerRef.current) clearTimeout(detailsTimerRef.current);
    };
  }, []);

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setDetailsLoading(true);

    // fatafati click korle purono timer ke cancel kore notun ta boshai
    if (detailsTimerRef.current) clearTimeout(detailsTimerRef.current);
    detailsTimerRef.current = setTimeout(() => {
      setDetailsLoading(false);
    }, SKELETON_DELAY);

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
            (tag) => normalize(tag) === normalize(activeCategory),
          ),
        );

  // skeleton grid e real grid er shathe count mile jate layout shift na hoy
  const skeletonCount = Math.min(filteredProjects.length || 3, 6);

  return (
    <section className="min-w-full space-y-space-7">
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-space-7">
          <FadeLeft className="font-primary text-size-xl font-semibold">
            All Projects
          </FadeLeft>
          <FadeRight className="flex items-center gap-space-3 p-space-3 rounded-lg bg-secondary-50 *:w-50 dark:bg-secondary-500/5">
            {categories.map((cat) => (
              <SwitchBTN
                key={cat.label}
                icon={cat.icon}
                text={cat.label}
                isActive={activeCategory === cat.label}
                onClick={() => setActiveCategory(cat.label)}
              />
            ))}
          </FadeRight>
        </div>

        {loading ? (
          <div className="flex gap-space-6">
            {Array.from({ length: skeletonCount }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="flex gap-space-6">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onSelect={() => handleSelectProject(project)}
              />
            ))}
          </div>
        ) : (
          <p className="font-medium text-size-base text-placeholder_2 py-space-6">
            No projects found in this category.
          </p>
        )}
      </div>

      <div className="w-full h-0.5 rounded-full opacity-20 bg-placeholder"></div>

      <div ref={detailsRef}>
        {selectedProject && detailsLoading ? (
          <ProjectDetailsSkeleton />
        ) : selectedProject ? (
          <ProjectDetails project={selectedProject} />
        ) : (
          <div className="bg-secondary-50 dark:bg-background rounded-2xl min-h-25 flex items-center justify-center">
            <p className="font-primary font-semibold text-size-sm text-placeholder_2 dark:text-placeholder/80">
              Select a project to see details
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Page;