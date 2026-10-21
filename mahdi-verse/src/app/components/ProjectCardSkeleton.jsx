import React from "react";

// repeated shimmer classes baar baar likhte na hoy tai ekta chhoto reusable "bone"
const Bone = ({ className = "" }) => (
  <div
    className={`animate-shimmer bg-[linear-gradient(110deg,#e5e7eb,45%,#f3f4f6,55%,#e5e7eb)] dark:bg-[linear-gradient(110deg,#1f2937,45%,#374151,55%,#1f2937)] bg-size-[200%_100%] ${className}`}
  />
);

const ProjectCardSkeleton = () => {
  return (
    <div className="w-87.5 rounded-2xl border border-secondary-500/20 overflow-hidden">
      <Bone className="w-full h-45" />

      <div className="p-space-4 space-y-space-5 bg-background">
        <Bone className="h-5 w-3/4 rounded" />

        <div className="flex flex-wrap gap-space-3">
          <Bone className="h-6 w-16 rounded-full" />
          <Bone className="h-6 w-20 rounded-full" />
          <Bone className="h-6 w-14 rounded-full" />
        </div>

        <div className="flex gap-space-3">
          <Bone className="h-10 flex-1 rounded-lg" />
          <Bone className="h-10 flex-1 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default ProjectCardSkeleton;