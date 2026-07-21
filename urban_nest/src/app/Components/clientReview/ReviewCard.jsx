import Image from "next/image";
import React from "react";
import { assets } from "../../assets/assets";
import StarRating from "./StarRating";
import Button from "../Button";
import FormattedNumber from "../FormattedNumber";

const ReviewCard = ({
  content = "Booking was super easy, and the car was spotless and ready right on time. The pickup location was just 5 minutes from my hotel — super convenient!",
  clientInfo,
  clientProperty,
  rating = "4",
  aiRecommended,
  detailsLink,
}) => {
  const { name: clientName, role: clientRole, clientAvatar } = clientInfo;

  const { propertyName, propertyLocation, propertyImage, beds, baths, sqft } =
    clientProperty;

  return (
    <div className="flex items-center gap-space-4 p-space-5 min-w-140 mb-space-4 border-2 border-primary-3 relative">
      <i className="fi fi-bs-quote-right flex items-center justify-center text-[120px] text-primary-5 absolute -top-5 left-0 opacity-10"></i>
      {/* review content, client information, and rating*/}
      <div className="w-full">
        <p className="text-lg font-medium">
          &quot;
          {content}
          &quot;
        </p>
        <div className="mt-space-4 py-space-3 border-t-2 border-placeholder/20">
          <div className="flex items-center gap-space-3">
            {/* client avatar and name */}
            <Image
              alt="Client Avatar"
              src={clientAvatar || assets.User}
              width={100}
              height={100}
              className="rounded-full size-10.5 object-cover object-top"
            />
            <div className="">
              <h2 className="font-primary font-semibold text-[12px]">
                {clientName}
              </h2>
              <p className="font-medium text-[10px] text-placeholder">{clientRole}</p>
            </div>
          </div>
          {/* Rating */}
          <div className="flex gap-space-4 items-center">
            <StarRating rating={rating} size={"20"} className={"mt-space-3"} />
          </div>
        </div>
      </div>

      {/* Property information */}
      <div className="w-42 flex flex-col gap-space-3">
        <div>
          <Image
            alt=""
            src={propertyImage || assets.Property_1}
            className="h-25 mb-space-2 object-cover"
          />
          <div>
            <div>
              <h2 className="font-primary text-[12px] font-semibold mt-space-1">
                {propertyName || "Property Name"}
              </h2>
              <p className="font-medium text-placeholder text-[10px]">
                {propertyLocation || "Location"}
              </p>
            </div>
            <div className="flex items-center justify-between border-t border-b border-placeholder/20 py-space-2">
              {/* beds */}
              <span className="px-space-2 flex items-center">
                <i className="fi fi-rs-bed-alt flex items-center justify-center text-[10px]"></i>
                <p className="font-medium text-[10px] text-placeholder ml-space-1">
                  {beds || "2"}
                </p>
              </span>
              <span className="w-px h-full bg-placeholder/20"></span>

              {/* beds */}
              <span className="px-space-2 flex items-center">
                <i className="fi fi-rs-bath flex items-center justify-center text-[10px]"></i>
                <p className="font-medium text-[10px] text-placeholder ml-space-1">
                  {baths || "2"}
                </p>
              </span>
              <span className="w-px h-full bg-placeholder/20"></span>

              {/* sqft */}
              <span className="px-space-2 flex items-center">
                <i className="fi fi-rs-ruler-combined flex items-center justify-center text-[10px]"></i>
                <p className="font-medium text-[10px] text-placeholder ml-space-1">
                  <FormattedNumber number={sqft || "1,400"} />
                </p>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-space-3 justify-center mt-space-3">
            <div className="p-space-2 flex items-center gap-space-1 bg-primary-1 text-primary-5">
              <i className="fi fi-ss-sparkles flex items-center justify-center text-[10px]"></i>
              <p className="font-semibold text-[10px] text-nowrap">
                AI Recommended
              </p>
            </div>
            <div className="p-space-1 flex items-center gap-0.5 text-primary-5">
              {" "}
              <p className="font-bold font-primary text-[12px] text-nowrap hover:underline cursor-pointer">
                Details
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
