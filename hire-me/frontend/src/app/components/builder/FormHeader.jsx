import React from "react";

const FormHeader = ({ title = "Title", subtitle = "Subtitle" }) => {
  return (
    <div className="mt-[clamp(0.8125rem,calc(0.282vw+0.746rem),1rem)]">
      <h1 className="text-[clamp(1rem,calc(0.563vw+0.868rem),1.375rem)] font-primary font-semibold mb-[clamp(0.25rem,calc(0.188vw+0.206rem),0.375rem)]">
        {title}
      </h1>
      <p className="text-[clamp(0.75rem,calc(0.188vw+0.706rem),0.875rem)] text-neutral-500">
        {subtitle}
      </p>
    </div>
  );
};

export default FormHeader;
