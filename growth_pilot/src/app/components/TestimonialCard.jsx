import Image from "next/image";
import React from "react";
import { assets } from "../assets/assets";

const TestimonialCard = ({ name, position, rating, comment }) => {
  return (
    <div className="relative h-41.5 w-72.5 md:h-50 md:w-87.5 xl:h-60 xl:w-87.5 flex">
      <Image
        src={assets.user}
        alt="userImage"
        className="aspect-square size-9.25 md:size-12.5 rounded-full mt-2.5 md:mt-3.5 xl:mt-[16px]"
      />
      <div className="testiCard pt-3.5 md:pt-[24px] h-full rounded-xl md:rounded-2xl">
        <div className="w-58.25 md:w-66.5">
          {/* name, position and rating */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-medium md:text-large xl:text-h6 font-medium">
                {name}
              </h3>
              <p className="text-small md:text-medium font-medium text-black/70 dark:text-white/70">
                {position}
              </p>
            </div>
            <div className="flex items-center gap-[4px] rounded-lg py-[4px] px-[8px] md:px-[12px] border border-secondary2 bg-linear-to-tr from-secondary/10 to-secondary2/10 text-secondary2">
              <Image
                src={assets.star}
                alt="star"
                className="size-[12px] md:size-3.5 xl:size-[16px]"
              />
              <p className="text-large md:text-h6 xl:text-h5 font-semibold">
                {rating}
              </p>
            </div>
          </div>
        </div>
        {/* comment */}
        <p className="text-large md:text-h6 xl:text-h5 font-semibold mt-[8px] md:mt-[12px]">
          &quot; {comment} &quot;
        </p>
      </div>
      <Image
        src={assets.feedback}
        alt="feedback"
        className="size-5.5 md:size-7.5 xl:size-8.5 absolute bottom-2.5 right-1.25"
      />
    </div>
  );
};

export default TestimonialCard;
