import { assets } from "@/app/assets/assets";
import Image from "next/image";
import React from "react";

const ClientCard = ({ client, onSelect, isSelected }) => {
  const {
    name,
    country,
    description,
    image,
  } = client || {
    name: "Default Client",
    country: "Default Country",
    description: "Default description",
    image: assets.backgroundImage,
  };

  return (
    <div
      onClick={onSelect}
      className={`p-space-3 rounded-xl shadow-[2px_2px_5px_rgba(210,222,223,0.9),-2px_-2px_4px_rgba(225,225,255,0.9),2px_-2px_4px_rgba(210,222,223,0.2),-2px_2px_4px_rgba(210,222,223,0.2),inset_-1px_-1px_2px_rgba(210,222,223,0.5),inset_1px_1px_2px_rgba(255,255,255,0.3)] hover:bg-secondary-50 hover:shadow-[1px_1px_2px_rgba(225,225,255,0.3),-1px_-1px_2px_rgba(210, 222, 223,0.5),inset_2px_-2px_4px_rgba(210,222,223,0.2),inset_-2px_2px_4px_rgba(210,222,223,0.2),inset_-2px_-2px_4px_rgba(255,255,255,0.9),inset_2px_2px_5px_rgba(210,222,223,0.9)] flex items-center gap-space-3 max-w-75 cursor-pointer border-2 transition-colors hover:border-secondary-500 ${
        isSelected
          ? "border-secondary-500 bg-secondary-50"
          : "border-transparent bg-[#E9F7F8]"
      }`}
    >
      <Image
        alt="client"
        src={assets.backgroundImage}
        width={100}
        height={100}
        className="w-15 h-17.75 object-cover rounded-lg"
      />
      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-size-base">{name}</h3>
          <div
            className="bg-secondary-50 py-1.5 px-space-3 rounded-full text-size-xs text-secondary-900 font-primary font-semibold flex items-center justify-center text-nowrap"
            style={{
              boxShadow:
                "1px 1px 2px rgba(255, 255, 255, 0.3), -1px -1px 2px rgba(196, 211, 213, 0.50), inset 1px -1px 2px rgba(196, 211, 213, 0.2), inset -1px 1px 2px rgba(196, 211, 213, 0.2), inset -1px -1px 2px rgba(255, 255, 255, 0.9), inset 1px 1px 3px rgba(196, 211, 213, 0.90)",
            }}
          >
            <p>🇦🇪 UAE</p>
          </div>
        </div>
        <p className="font-medium text-size-xs_2 text-placeholder_2 mt-space-2">
          Trusted by clients across different industries to design and develop
          ...
        </p>
      </div>
    </div>
  );
};

export default ClientCard;