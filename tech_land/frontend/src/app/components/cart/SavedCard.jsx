import Image from "next/image";
import React from "react";
import { assets } from "../../assets/assets";

const SavedCard = ({
  cardName = "masterCard",
  number = "1234 5678 9012 3456",
  handleDelete,
  handleEdit,
}) => {
  return (
    <div className="flex items-center gap-space-4 p-space-3 rounded-[8px] border border-secondary/30 hover:bg-secondary/20 bg-secondary/5">
      {/* Icon */}
      <div className="p-space-1 rounded-[4px] h-[22px] w-[32px] relative bg-[#6366F1]/10 flex items-center justify-center">
        <Image
          alt="card logo"
          width={50}
          height={500}
          src={
            cardName == "mastercard"
              ? assets.mastercardLogo
              : assets.visaCardLogo
          }
          className=""
        />
      </div>
      <h4 className="w-full font-primary font-medium text-[16px] text-[#CBD5F5]">
        hh
      </h4>
      <div className="flex items-center gap-space-3">
        <i className="fi fi-rr-trash text-size-h6 text-red cursor-pointer"></i>
        <i className="fi fi-rr-edit text-size-h6 text-secondary cursor-pointer"></i>
      </div>
    </div>
  );
};

export default SavedCard;
