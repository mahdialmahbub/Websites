"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProjectDetails from "../../components/project/ProjectDetails";
import projectsData from "../../../../public/projects/projects";
import slugify from "@/app/utils/slugify";
import ProjectDetailsSkeleton from "@/app/components/project/ProjectDetailsSkeleton";

const SKELETON_DELAY = 700;

const ProjectDetailsPage = ({ params }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), SKELETON_DELAY);
    return () => clearTimeout(timer);
  }, []);

  // Next.js 15+ e params Promise hoye gese, React-er use() diye unwrap korte hoy.
  // Purono Next.js (13/14) e params age-i plain object thake — tokhon eita
  // already-resolved value, tai `params?.then` check kore duitai support korchi.
  const resolvedParams = params?.then ? use(params) : params;
  const { slug } = resolvedParams;

  const project = projectsData.find(
    (p) => (p.slug || slugify(p.title)) === slug,
  );

  return (
    <section className="min-w-full space-y-space-7">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-size-sm font-medium text-placeholder_2 dark:text-placeholder/80 hover:text-secondary-500 transition-colors w-fit cursor-pointer mb-space-4 mt-space-4"
      >
        <i className="fi fi-rr-arrow-small-left"></i>
        Back
      </button>
      {loading ? (
        <ProjectDetailsSkeleton />
      ) : project ? (
        <ProjectDetails project={project} />
      ) : (
        <div className="bg-secondary-50 dark:bg-background rounded-2xl min-h-75 flex flex-col items-center justify-center gap-space-3">
          <p className="font-medium text-size-base text-placeholder_2 dark:text-placeholder/80">
            Project not found.
          </p>
          <Link
            href="/projects"
            className="text-size-sm font-semibold text-secondary-500 hover:underline"
          >
            Back to all projects
          </Link>
        </div>
      )}
    </section>
  );
};

export default ProjectDetailsPage;