import Image from "next/image";
import React from "react";
import { assets } from "../assets/assets";
import StarRating from "./StarRating";

const ReviewCard = ({
  cusImg,
  cusName,
  cusAddress,
  rating,
  isAdmin,
  content,
  date,
  reviewImages,
}) => {
  return (
    <div className="px-space-6 py-space-5 w-[500px] border-3 border-secondary/30 rounded-[12px]">
      {/* review content */}
      <div className="mb-space-5 space-y-space-4 border-2 border-secondary/30 pb-[14px]">
        {/* cusImage, name, loaction, rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-3">
            <Image
              alt={cusName}
              src={cusImg || assets.user_1}
              className="rounded-full w-[48px] h-[48px] object-cover object-top"
            />
            <div className="">
              <h4 className="font-primary text-size-h6 font-semibold">
                {cusName}
              </h4>
              <p className="text-size-h6 font-medium text-placeholder_3">{cusAddress}</p>
            </div>
            <div className="flex items-center gap-space-4">
                <StarRating rating={"4.5"} size={"16"} className={"text-secondary"} />
                {
                  isAdmin && 
                  <div className="flex items-center justify-center w-[36px] h-[36px] hover:bg-red/10"><i className="fi fi-rr-trash w-[18px] h-[18px] text-red"></i></div>
                }
            </div>
          </div>
        </div>
        <p className="font-primary font-medium text-size-h5">{content}</p>
        <p className="text-size-medium font-medium font-primary text-placeholder_3">{date || 'October 12, 2025'}</p>
      </div>

      {/* review image */}
      <div className="">
        <p className="font-primary text-size-large font-medium">
          Photos
        </p>
        <div className="flex items-center gap-space-3 overflow-x-scroll">
          {Image}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
