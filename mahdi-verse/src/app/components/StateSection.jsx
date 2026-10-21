// components/StatsSection.jsx
// "use client" nai -> eta Server Component. Data server e fetch hoy.

import React from "react";
import FadeUp from "./motions/FadeUp"; // FadeUp er file e "use client" thaka lagbe
import StatCounter from "./StatCounter";
import { getStats } from "../assets/stats";

const StatsSection = async () => {
  const stats = await getStats();

  return (
    <section className="w-full -mt-space-8 mb-space-8">
      <FadeUp
        className="
          grid
          overflow-hidden
          rounded-3xl
          grid-cols-4 divide-x divide-secondary-200/70 dark:divide-white/7
        "
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="
              group
              relative
              flex
              min-h-31.25
              flex-col
              items-center
              justify-center
              px-5
              py-7
              text-center
              transition-all
              duration-300
              hover:bg-cyan-500/2.5
              dark:hover:bg-white/2
            "
          >
            {/* Top accent */}
            <span
              className="
                absolute
                left-1/2
                top-0
                h-px
                w-0
                -translate-x-1/2
                bg-cyan-400
                transition-all
                duration-500
                group-hover:w-10
              "
            />

            {/* Counter (client) */}
            <StatCounter end={stat.number} suffix={stat.suffix} />

            {/* Label */}
            <p
              className="
                mt-3
                font-primary
                text-size-base
                font-medium
                
                text-placeholder
                dark:text-placeholder_2
              "
            >
              {stat.label}
            </p>
          </div>
        ))}
      </FadeUp>
    </section>
  );
};

export default StatsSection;
