import React from "react";

const IndividualProgressBar = ({
  icon = "fi fi-rs-marker",
  label,
  color,
  value,
}) => {
  const progress = value * 10;

  return (
    <div className="flex items-center gap-space-3 w-full">
      {/* Icon and Label */}
      <div className="flex items-center gap-space-1 text-background">
        <i
          className={`${icon} flex items-center justify-center text-[12px]`}
        ></i>
        <p className="font-medium text-[12px]">{label}</p>
      </div>

      {/* progress bar */}
      <div className="w-full h-2" style={{ backgroundColor: `${color}33` }}>
        <div
          className={`h-full shadow-[inset_1px_1px_2px_0px_rgba(255,255,255,0.25),-1px_-1px_2px_rgba(0,0,0,0.25)] `}
          style={{
            width: `${progress}%`,
            backgroundColor: color,
          }}
        ></div>
      </div>

      {/* value */}
      <div className="flex items-end gap-0.5">
        <h3 className="font-semibold text-md" style={{ color }}>
          {value}
        </h3>
        <p className="text-placeholder text-[8px]">/10</p>
      </div>
    </div>
  );
};

export default IndividualProgressBar;
