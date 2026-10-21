import React from "react";

const Bone = ({ className = "" }) => (
  <div
    className={`animate-shimmer bg-[linear-gradient(110deg,#e5e7eb,45%,#f3f4f6,55%,#e5e7eb)] dark:bg-[linear-gradient(110deg,#1f2937,45%,#374151,55%,#1f2937)] bg-size-[200%_100%] ${className}`}
  />
);

const ClientCardSkeleton = () => {
  return (
    <div className="p-space-3 rounded-xl clientCard-shadow flex items-center gap-space-3 max-w-85 border-2 border-transparent bg-[#E9F7F8] dark:bg-secondary-500/5">
      <Bone className="w-15 h-17.75 rounded-lg shrink-0" />

      <div className="flex-1 space-y-space-2">
        <div className="flex items-center justify-between gap-space-2">
          <Bone className="h-4 w-24 rounded" />
          <Bone className="h-5 w-14 rounded-full" />
        </div>
        <Bone className="h-3 w-full rounded" />
        <Bone className="h-3 w-4/5 rounded" />
      </div>
    </div>
  );
};

export default ClientCardSkeleton;
