import React from "react";

const SwitchBTN = ({
  text = "Switch",
  isActive = false,
  onClick,
  icon = "fi fi-rr-code-window",
}) => {
  return (
    <div
      className={`p-1.5 rounded-md cursor-pointer ${isActive ? "switch-btn--active" : "switch-btn--inactive"} flex items-center gap-space-1 transition-all duration-200`}
      onClick={onClick}
    >
      <div className="min-w-space-6 min-h-space-6 flex items-center justify-center bg-secondary-50 dark:bg-secondary-900 rounded-sm switch-icon-shadow overflow-hidden">
        <i
          className={` ${icon} text-size-sm ${isActive ? "text-secondary-600 dark:text-secondary-500" : "text-secondary-900 dark:text-secondary-500/60"} `}
        ></i>
      </div>
      <h3
        className={`text-nowrap font-primary font-semibold text-size-sm max-w-max  ${isActive ? "text-secondary-50" : "dark:text-secondary-100"}`}
      >
        {text}
      </h3>
    </div>
  );
};

export default SwitchBTN;
