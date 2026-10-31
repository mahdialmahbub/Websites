import React from "react";
import Button from "./Button";

const FeatureCard = ({ title, subtitle, icon, color, bgColor }) => {
  return (
    <div
      className="
        group relative overflow-hidden isolate
        border border-black/10 dark:border-white/10
        bg-[#f8fafc] dark:bg-[#080b10]
        rounded-2xl md:rounded-3xl
        p-[clamp(1rem,0.8182rem+0.9091vw,1.5rem)]
        h-full flex flex-col
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:border-transparent
        hover:shadow-[0_24px_30px_-16px_rgba(0,0,0,0.14)]
        dark:hover:shadow-[0_24px_30px_-16px_rgba(0,0,0,0.55)]
      "
      style={{
      }}
    >
      {/* soft accent glow, only visible on hover */}
      <div
        className="
          pointer-events-none absolute -top-14 -right-14 size-36 -z-10
          rounded-full blur-3xl opacity-0
          transition-opacity duration-300 group-hover:opacity-30
        "
        style={{ backgroundColor: color }}
      />

      {/* accent line, sweeps in on hover */}
      <div
        className="
          absolute top-0 left-0 h-[clamp(0.125rem,0.1023rem+0.1136vw,0.1875rem)] w-0 rounded-t-2xl
          transition-all duration-300 ease-out group-hover:w-full
        "
        style={{ backgroundColor: color }}
      />

      {/* Icon */}
      <div
        className="
          size-[clamp(3.125rem,2.5795rem+2.7273vw,4.625rem)]
          flex items-center justify-center
          text-[clamp(1.75rem,1.5682rem+0.9091vw,2.25rem)]
          rounded-full
          transition-transform duration-300 group-hover:scale-105
        "
        style={{
          color,
          backgroundColor: `color-mix(in srgb, ${color} 5%, transparent)`,
        }}
      >
        <i className={`${icon} inline-flex items-center justify-center`} />
      </div>

      {/* Content */}
      <div className="mt-5 flex flex-col justify-between flex-1">
        <div className="space-y-2">
          <h3 className="text-[clamp(1.125rem,0.8977rem+1.1364vw,1.75rem)] font-semibold text-black dark:text-white">
            {title}
          </h3>
          <p className="text-[clamp(0.875rem,0.8295rem+0.2273vw,1.13rem)] font-regular leading-relaxed text-black/60 dark:text-white/60">
            {subtitle}
          </p>
        </div>

        <Button variant="text" text="Know more" />
      </div>
    </div>
  );
};

export default FeatureCard;
