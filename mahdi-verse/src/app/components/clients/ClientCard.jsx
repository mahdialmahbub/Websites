import Image from "next/image";
import React from "react";
import Chips from "../Chips";
import { assets } from "../../assets/assets";

const ClientCard = ({
  name = "Default Client",
  country = "Default Country",
  shortIntro = "Default shortIntro",
  image,
  onSelect,
  isSelected,
  index,
}) => {
  return (
    <div
      onClick={onSelect}
      className={`animate-fade-up p-space-3 rounded-xl clientCard-shadow hover:bg-secondary-50 dark:hover:bg-secondary-500/5 flex items-center gap-space-3 w-90 max-h-[126px] cursor-pointer border-2 transition-colors ${
        isSelected
          ? "border-secondary-500/30 bg-secondary-50 dark:bg-secondary-500/5 dark:border-secondary-500/30"
          : "border-transparent bg-[#E9F7F8] dark:bg-secondary-500/5 hover:border-secondary-500 dark:hover:border-secondary-500/10"
      }`}
    >
      <Image
        alt="client"
        src={image || "/clientPlaceholder.png"}
        width={60}
        height={72}
        loading={index < 2 ? "eager" : "lazy"}
        className="w-15 h-18 object-cover rounded-lg"
      />
      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-size-base">{name}</h3>
          <Chips text={country} varient={"small"} />
        </div>
        <p className="text-size-sm text-placeholder_2/80 dark:text-placeholder/80 mt-space-2 line-clamp-2">
          {shortIntro}
        </p>
      </div>
    </div>
  );
};

export default ClientCard;
