import React from "react";

const SwitchBTN = ({
  text = "Switch",
  isActive = false,
  onClick,
  icon = "fi fi-rr-code-window",
}) => {
  return (
    <div
      className={`p-1.5 rounded-md cursor-pointer ${isActive ? "bg-linear-to-br from-[#20C8E2] to-[#24DEFA] text-secondary-50" : "bg-linear-to-br hover:from-[#DDE8E9] hover:to-[#F5FFFF] text-foreground hover:bg-linear-to-br from-[#F5FFFF] to-[#DDE8E8]"} flex items-center gap-space-1 `}
      onClick={onClick}
    >
      <div className="min-w-space-6 min-h-space-6 shadow-[1_1px_2px_rgba(255, 255, 255, 0.3),-1_-1px_2px_rgba((210, 226, 228, 0.50)),1_-1px_2px_rgba(210, 226, 228, 0.2),-1_1px_2px_rgba(210, 226, 228, 0.2),inset_-1_-1px_2px_rgba(210, 226, 228, 0.9),inset_1_1px_3px_rgba(210, 226, 228, 0.90)] flex items-center justify-center bg-secondary-50 rounded-sm">
        <i
          className={` ${icon} text-size-sm ${isActive ? "text-secondary-600" : "text-secondary-900"} `}
        ></i>
      </div>
      <h3 className="text-nowrap font-primary font-semibold text-size-sm max-w-max">{text}</h3>
    </div>
  );
};

export default SwitchBTN;
