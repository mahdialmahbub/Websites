/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import projectsData from "../../../../public/projects/projects";
import FadeRight from "../motions/FadeRight";
import FadeLeft from "../motions/FadeLeft";
import SwitchBTN from "../SwitchBTN";
import ProjectCard from "../ProjectCard";
import ProjectCardSkeleton from "../ProjectCardSkeleton";
import ProjectDetailsSkeleton from "./ProjectDetailsSkeleton";
import ProjectDetailsPage from "@/app/projects/[slug]/page";

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

// URL er "project" query id diye projectsData theke actual project ta ber kora
const findProjectById = (id) =>
  projectsData.find((project) => String(project.id) === String(id)) || null;

const ProjectsPageInner = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const projectIdFromUrl = searchParams.get("project");

  // URL e already ?project=id thakle (reload ba direct link) oita diyei prothom render e select kore rakhtesi
  const [selectedProject, setSelectedProject] = useState(() =>
    findProjectById(projectIdFromUrl),
  );
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true); // cards grid skeleton
  const [detailsLoading, setDetailsLoading] = useState(false); // project details skeleton
  const detailsRef = useRef(null);
  const detailsTimerRef = useRef(null);

  // browser back/forward e URL change hole selectedProject o shathe shathe sync hobe
  useEffect(() => {
    setSelectedProject(findProjectById(projectIdFromUrl));
  }, [projectIdFromUrl]);

  // category change hole (ba prothom load e) cards grid-er skeleton abar dekhabe
  useEffect(() => {
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

    // URL e ?project=id boshaye dicchi — reload dile ba link share korleo eita thakbe
    const params = new URLSearchParams(searchParams.toString());
    params.set("project", project.id);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });

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
          <ProjectDetailsPage project={selectedProject} />
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

// useSearchParams next.js e Suspense boundary chay, tai wrap kore dilam
const Page = () => (
  <Suspense fallback={null}>
    <ProjectsPageInner />
  </Suspense>
);

export default Page;