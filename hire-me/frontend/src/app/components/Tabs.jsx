import React from "react";
import { icons } from "../../../assets/iconCollection";

const VARIANT_STYLES = {
  default: "bg-orange-500/10 text-orange-500",
  add: "bg-neutral-500/10 text-neutral-500/90",
  remove: "bg-orange-500/10 text-orange-500/90",
};

const ICON_CONFIG = {
  add: {
    icon: icons.addSmall,
    color: "text-green-500",
    ariaLabel: "Remove",
  },
  remove: {
    icon: icons.cross,
    color: "text-red-500",
    ariaLabel: "Add",
  },
};

const Tabs = ({
  label = "Label",
  state = "default", // "default" | "disabled"
  variant = "default", // "default" | "remove" | "add"
  onIconClick,
  className = "",
}) => {
  const isDisabled = state === "disabled";
  const iconConfig = ICON_CONFIG[variant];
  const variantStyle = VARIANT_STYLES[variant] ?? VARIANT_STYLES.default;

  return (
    <div
      className={`px-space-3 flex h-[32px] items-center gap-space-1 rounded-full font-semibold ${variantStyle} ${
        isDisabled ? "pointer-events-none opacity-50" : ""
      } ${className}`}
      aria-disabled={isDisabled}
    >
      <span>{label}</span>

      {iconConfig && (
        <button
          type="button"
          onClick={onIconClick}
          disabled={isDisabled}
          aria-label={`${iconConfig.ariaLabel} ${label}`}
          className="flex items-center justify-center"
        >
          <i
            aria-hidden="true"
            className={`${iconConfig.color} ${iconConfig.icon} text-[18px]`}
          />
        </button>
      )}
    </div>
  );
};

export default Tabs;
