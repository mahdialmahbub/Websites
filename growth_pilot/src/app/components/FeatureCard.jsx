import React from "react";
import Button from "./Button";

const FeatureCard = ({ title, subtitle, icon, color, bgColor }) => {
  return (
    <div
      className="
        group relative overflow-hidden isolate
        border border-black/[0.06] dark:border-white/5
        bg-white dark:bg-white/[0.03]
        rounded-2xl md:rounded-3xl
        p-[20px] md:p-[28px] xl:p-[32px]
        h-full flex flex-col
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:border-transparent
        hover:shadow-[0_24px_48px_-16px_rgba(0,0,0,0.14)]
        dark:hover:shadow-[0_24px_48px_-16px_rgba(0,0,0,0.55)]
      "
      style={{
        backgroundColor: `color-mix(in srgb, ${bgColor} 8%, transparent)`,
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
          absolute top-0 left-0 h-[3px] w-0 rounded-t-2xl
          transition-all duration-300 ease-out group-hover:w-full
        "
        style={{ backgroundColor: color }}
      />

      {/* Icon */}
      <div
        className="
          size-13 md:size-15.5 xl:size-18.5
          flex items-center justify-center
          text-h4 md:text-h3 xl:text-h2
          rounded-2xl ring-1 ring-inset
          transition-transform duration-300 group-hover:scale-105
        "
        style={{
          color,
          backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
          "--tw-ring-color": `color-mix(in srgb, ${color} 22%, transparent)`,
        }}
      >
        <i className={`${icon} inline-flex items-center justify-center`} />
      </div>

      {/* Content */}
      <div className="mt-5 flex flex-col justify-between flex-1 gap-4">
        <div className="space-y-2">
          <h3 className="text-h4 font-semibold text-black dark:text-white">
            {title}
          </h3>
          <p className="text-h6 xl:text-h5 font-medium leading-relaxed text-black/60 dark:text-white/60">
            {subtitle}
          </p>
        </div>

        <Button variant="text" text="Know more" />
      </div>
    </div>
  );
};

export default FeatureCard;