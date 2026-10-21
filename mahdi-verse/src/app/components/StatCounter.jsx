"use client";

import React, { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";

// Component er baire rakhsi jate prottek render e notun function na bone
const easeOutCubic = (t, b, c, d) => {
  const progress = t / d;
  const eased = 1 - Math.pow(1 - progress, 3);

  return b + c * eased;
};

const StatCounter = ({ end, suffix }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-label={`${end}${suffix}`}
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
          end={end}
          duration={2}
          useEasing
          easingFn={easeOutCubic}
        />
      ) : (
        0
      )}

      <span className="text-cyan-500 dark:text-cyan-400">{suffix}</span>
    </div>
  );
};

export default StatCounter;
