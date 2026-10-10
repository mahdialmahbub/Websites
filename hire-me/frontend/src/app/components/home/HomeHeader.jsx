import React from "react";

const HomeHeader = ({ bg, color, name, title }) => {
  return (
    <div className="space-y-[clamp(0.5rem,calc(0.188vw+0.206rem),1rem)] max-w-max flex flex-col items-start">

    <span
      className="flex items-center justify-center h-[clamp(1.25rem,calc(0.751vw+1.074rem),1.75rem)] gap-[clamp(0.25rem,calc(0.188vw+0.206rem),0.375rem)] px-[clamp(0.75rem,calc(0.188vw+0.206rem),1.125rem)] rounded-full text-[clamp(0.75rem,calc(0.188vw+0.706rem),0.875rem)] font-primary font-medium"
      style={{
        background: `color-mix(in srgb, ${bg} 5%, transparent)`,
        color: color,
      }}
    >
      <span className="size-1.25 sm:size-1.5 rounded-full " style={{
        background: bg,
      }}/>

      {name}
    </span>
    <h2 className="text-[clamp(1.125rem,calc(0.939vw+0.905rem),1.75rem)] font-primary font-semibold">{title}</h2>
    </div>
  );
};

export default HomeHeader;
