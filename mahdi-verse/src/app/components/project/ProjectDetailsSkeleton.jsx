import React from "react";

// repeated shimmer classes baar baar likhte na hoy tai ekta chhoto reusable "bone"
const Bone = ({ className = "" }) => (
  <div
    className={`animate-shimmer bg-[linear-gradient(110deg,#e5e7eb,45%,#f3f4f6,55%,#e5e7eb)] dark:bg-[linear-gradient(110deg,#1f2937,45%,#374151,55%,#1f2937)] bg-size-[200%_100%] ${className}`}
  />
);

const ProjectDetailsSkeleton = () => {
  return (
    <div className="bg-secondary-50 dark:bg-background rounded-2xl p-space-6 animate-pulse">
      {/* top chips + button */}
      <div className="mb-space-6 flex items-center justify-between">
        <Bone className="h-7 w-32 rounded-full" />
        <Bone className="h-7 w-28 rounded-full" />
      </div>

      <div className="space-y-space-10">
        {/* title, description and images */}
        <div className="flex items-center gap-space-4">
          <div className="w-full space-y-space-3">
            <Bone className="h-8 w-3/4 rounded" />
            <div className="space-y-space-2 mb-space-7">
              <Bone className="h-4 w-full rounded" />
              <Bone className="h-4 w-5/6 rounded" />
              <Bone className="h-4 w-2/3 rounded" />
            </div>
            <Bone className="h-11 w-36 rounded-xl" />
          </div>
          <Bone className="w-100 h-70 rounded-2xl shrink-0" />
        </div>

        {/* overview */}
        <div className="space-y-space-4">
          <div className="p-space-4 space-y-space-3">
            <Bone className="h-6 w-40 rounded" />
            <Bone className="h-4 w-full rounded" />
            <Bone className="h-4 w-4/5 rounded" />
          </div>

          <div className="h-0.5 opacity-20 bg-placeholder rounded-full"></div>

          {/* problems / solutions */}
          <div className="py-space-4 space-y-space-6">
            <div className="p-space-6 space-y-space-4 rounded-2xl bg-red/5 border border-red/5">
              <Bone className="h-5 w-24 rounded" />
              <div className="space-y-space-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Bone className="size-space-3 rounded-full shrink-0" />
                    <Bone className="h-4 w-2/3 rounded" />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-space-6 space-y-space-4 rounded-2xl bg-green/5 border border-red/5">
              <Bone className="h-5 w-24 rounded" />
              <div className="space-y-space-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Bone className="size-space-3 rounded-full shrink-0" />
                    <Bone className="h-4 w-1/2 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* product journey */}
        <div className="p-space-5">
          <div className="space-y-space-5 mb-space-7">
            <Bone className="h-7 w-40 rounded-full" />
            <Bone className="h-4 w-3/4 rounded" />
          </div>
          <div className="grid grid-cols-4 *:w-full gap-space-6 *:min-h-40">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="p-space-4 rounded-xl bg-primary-500/5 border border-primary-500/10 flex flex-col justify-between"
              >
                <div className="space-y-space-3">
                  <div className="flex items-center gap-space-2">
                    <Bone className="size-6.5 rounded-full shrink-0" />
                    <Bone className="h-4 w-2/3 rounded" />
                  </div>
                  <Bone className="h-3 w-full rounded" />
                  <Bone className="h-3 w-4/5 rounded" />
                </div>
                <Bone className="h-6 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* interactive features */}
        <div className="space-y-space-4 p-space-6 rounded-2xl bg-primary-100/30 dark:bg-primary-500/5 border border-secondary-500/10">
          <Bone className="h-5 w-48 rounded" />
          <div className="space-y-space-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Bone className="size-space-3 rounded-full shrink-0" />
                <Bone className="h-4 w-1/2 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* colors */}
        <div className="space-y-space-10 p-space-5">
          <div className="space-y-space-5 w-[70%]">
            <Bone className="h-7 w-24 rounded-full" />
            <Bone className="h-4 w-full rounded" />
          </div>
          <div className="flex items-center gap-space-6 justify-center">
            {[...Array(2)].map((_, group) => (
              <div key={group} className="flex flex-col items-center gap-7.5">
                <div className="flex items-center justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Bone
                      key={i}
                      className="size-[80px] rounded-full border-2 border-secondary-50 dark:border-background"
                      // eslint-disable-next-line
                      style={{ marginLeft: i === 0 ? 0 : "-30px" }}
                    />
                  ))}
                </div>
                <Bone className="h-5 w-16 rounded-full" />
              </div>
            ))}
          </div>
          <Bone className="w-full h-[80px] rounded-full" />
        </div>

        {/* spacing */}
        <div className="space-y-space-10 p-space-5">
          <div className="space-y-space-5 w-[70%]">
            <Bone className="h-7 w-24 rounded-full" />
            <Bone className="h-4 w-full rounded" />
          </div>
          <div className="grid grid-cols-3 gap-y-space-6 gap-x-space-10">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-space-3 w-full">
                <Bone className="h-5 w-14 rounded-full shrink-0" />
                <Bone className="h-0.5 w-full rounded-full opacity-40" />
                <Bone className="h-5 w-10 rounded-full shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* typography */}
        <div className="space-y-space-10 p-space-5">
          <div className="space-y-space-5 w-[70%]">
            <Bone className="h-7 w-32 rounded-full" />
            <Bone className="h-4 w-full rounded" />
          </div>
          <div className="grid grid-cols-2 gap-space-6">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="p-space-5 rounded-2xl border border-secondary-500/10 space-y-space-4"
              >
                <Bone className="h-6 w-1/2 rounded" />
                <Bone className="h-4 w-3/4 rounded" />
                <div className="flex gap-space-2">
                  {[...Array(4)].map((_, j) => (
                    <Bone key={j} className="h-6 w-12 rounded-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* final design */}
        <div className="space-y-space-10 p-space-5">
          <div className="space-y-space-5">
            <Bone className="h-7 w-36 rounded-full" />
            <div className="flex gap-space-9">
              <div className="w-[70%] space-y-space-2">
                <Bone className="h-4 w-full rounded" />
                <Bone className="h-4 w-5/6 rounded" />
                <Bone className="h-4 w-2/3 rounded" />
              </div>
              <div className="space-y-space-3">
                <Bone className="h-4 w-24 rounded" />
                <div className="flex flex-wrap gap-space-3">
                  {[...Array(4)].map((_, i) => (
                    <Bone key={i} className="size-[32px] rounded" />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Bone className="w-full h-90 rounded-2xl" />
        </div>

        {/* feedback */}
        <div className="space-y-space-10 p-space-5">
          <div className="space-y-space-5 w-[70%]">
            <Bone className="h-7 w-40 rounded-full" />
            <Bone className="h-4 w-full rounded" />
          </div>
          <div className="flex items-center justify-center flex-col w-full space-y-space-6">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="p-space-6 border-2 border-secondary-500/30 dark:border-secondary-500/20 rounded-2xl space-y-space-6 w-[70%]"
              >
                <div className="space-y-space-2">
                  <Bone className="h-3.5 w-full rounded" />
                  <Bone className="h-3.5 w-3/4 rounded" />
                </div>
                <div className="border-t-2 border-placeholder/20 pt-space-4 flex items-center justify-between">
                  <div className="flex items-center gap-space-3">
                    <Bone className="rounded-full w-10.5 h-10.5 shrink-0" />
                    <div className="space-y-1.5">
                      <Bone className="h-3.5 w-24 rounded" />
                      <Bone className="h-3 w-16 rounded" />
                    </div>
                  </div>
                  <Bone className="h-4.5 w-24 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* what I learned */}
        <div className="space-y-space-4 p-space-6 rounded-2xl bg-primary-100/30 dark:bg-primary-500/5 border border-primary-500/10">
          <Bone className="h-5 w-64 rounded" />
          <div className="space-y-space-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Bone className="size-space-3 rounded-full shrink-0" />
                <Bone className="h-4 w-3/5 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsSkeleton;