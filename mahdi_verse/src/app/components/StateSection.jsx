"use client";

import React, { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import FadeUp from "./motions/FadeUp";

const stats = [
  {
    number: 40,
    suffix: "+",
    label: "Projects delivered",
  },
  {
    number: 5,
    suffix: "+",
    label: "Years of experience",
  },
  {
    number: 18,
    suffix: "+",
    label: "Clients worldwide",
  },
  {
    number: 98,
    suffix: "%",
    label: "Client satisfaction",
  },
];

const StatsSection = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.35,
      },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="w-full -mt-space-8 mb-space-8">
      <FadeUp
        className="
          grid
          overflow-hidden
          rounded-3xl
          grid-cols-4 divide-x  divide-secondary-200/70 dark:divide-white/7
        "
      >
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`
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

            `}
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

            {/* Counter */}
            <div
              className="
                font-primary
                font-bold
                leading-none
                tracking-[-0.045em]
                text-secondary-900

                dark:text-white

                text-size-3xl
              "
            >
              {isVisible ? (
                <CountUp
                  start={0}
                  end={stat.number}
                  duration={2}
                  useEasing
                  easingFn={(t, b, c, d) => {
                    const progress = t / d;
                    const eased = 1 - Math.pow(1 - progress, 3);

                    return b + c * eased;
                  }}
                />
              ) : (
                0
              )}

              <span className="text-cyan-500 dark:text-cyan-400">
                {stat.suffix}
              </span>
            </div>

            {/* Label */}
            <p
              className="
                mt-3
                font-primary
                text-size-sm
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
