import Image from "next/image";
import React from "react";
import Chips from "../Chips";
import { CARD_BASE, getCardStateClass } from "../../utils/cardStyles";

const ClientCard = ({
  name = "Default Client",
  country = "Default Country",
  shortIntro = "Default shortIntro",
  image,
  isSelected,
  index,
}) => {
  return (
    <div
      className={`animate-fade-up p-space-4 rounded-xl flex items-center gap-space-3 w-90 max-h-31.5 cursor-pointer overflow-hidden h-full ${CARD_BASE} ${getCardStateClass(isSelected)}`}
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
