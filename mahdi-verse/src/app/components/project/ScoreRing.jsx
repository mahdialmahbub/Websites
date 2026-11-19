"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animated Lighthouse-style score ring.
 * Viewport e ashle ring ta bhore ar number 0 theke count up kore.
 *
 * @param {{
 *   score: number,
 *   label: string,
 *   color: string,
 *   size?: number,
 *   strokeWidth?: number,
 *   featured?: boolean,
 * }} props
 */
export default function ScoreRing({
  score,
  label,
  color,
  size = 80,
  strokeWidth = 7,
  featured = false,
}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  const [value, setValue] = useState(0);

  const safeScore = Math.min(Math.max(score, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - safeScore / 100);

  // 1) Viewport e ashle trigger
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShown(true);
      setValue(safeScore);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [safeScore]);

  // 2) Number count-up
  useEffect(() => {
    if (!shown) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame;
    const duration = 1300;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(safeScore * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [shown, safeScore]);

  return (
    <li
      ref={ref}
      className="flex flex-col items-center gap-space-3 text-center"
    >
      <div
        className="relative"
        style={{ width: size, height: size }}
        role="img"
        aria-label={`${label}: ${safeScore} out of 100`}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          aria-hidden="true"
        >
          {/* Track + soft fill */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill={color}
            fillOpacity="0.1"
            stroke={color}
            strokeOpacity="0.18"
            strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={shown ? offset : circumference}
            style={{
              transition: "stroke-dashoffset 1.3s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        </svg>

        <span
          className={`absolute inset-0 flex items-center justify-center font-primary font-semibold tabular-nums ${
            featured ? "text-size-3xl" : "text-size-lg"
          }`}
          style={{ color }}
        >
          {value}
        </span>
      </div>

      <span
        className={`font-medium ${featured ? "text-size-base" : "text-size-sm"}`}
      >
        {label}
      </span>
    </li>
  );
}