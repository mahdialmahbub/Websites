"use client";

import ProjectCard from "../ProjectCard";
import StarRating from "../project/StarRating";
import Chips from "../Chips";
import Image from "next/image";
import { getClientProjects } from "../../assets/clients/clients";
import ProjectCardSkeleton from "../ProjectCardSkeleton";
import { useEffect, useState } from "react";
import ScrollToDetails from "../ScrollToDetails";

const SKELETON_DELAY = 700;

export default function ClientInfoSection({ client, allProjects = [] }) {
  const [loading, setLoading] = useState(true);

  // category change hole (ba prothom load e) skeleton abar dekhabe
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), SKELETON_DELAY);
    return () => clearTimeout(timer);
  }, []);

  const clientProjects = getClientProjects(client.id, allProjects);

  const skeletonCount = Math.min(clientProjects.length || 3, 6);

  return (
    <div className="w-full rounded-2xl bg-secondary-50 dark:bg-background p-6">
      <div className="flex items-center justify-between gap-space-6 ">
        <div className="flex items-center gap-4 w-full">
          <Image
            src={client.image}
            alt={client.name}
            width={210}
            height={150}
            className="object-cover rounded-2xl h-37.5"
          />

          <div className="">
            <h2 className="text-size-xl font-semibold text-slate-900 dark:text-foreground">
              {client.name}
            </h2>
            <p className="text-size-base text-placeholder_2 dark:text-placeholder/80 mt-2 max-w-2xl">
              {client.shortIntro}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <StarRating rating={client.rating} size={16} />
          <Chips text={client.mood} varient={"small"} fullWidth />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-8 mb-8">
        <h3 className="text-size-base font-semibold text-placeholder_2 dark:text-placeholder/80">
          Projects of this client
        </h3>
        <Chips text={clientProjects.length} varient={"small"} />
      </div>

      {loading ? (
        <div className="flex gap-space-6">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : clientProjects.length > 0 ? (
        <div className="flex gap-space-6">
          {clientProjects.map((project) => (
            <>
              <ScrollToDetails
                key={project.id}
                targetId="project-details"
              />

              <ProjectCard key={project.id} project={project} />
            </>
          ))}
        </div>
      ) : (
        <p className="font-medium text-size-base text-placeholder_2 py-space-6">
          No projects found in this category.
        </p>
      )}
    </div>
  );
}
