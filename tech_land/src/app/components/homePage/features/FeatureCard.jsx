import Image from "next/image";
import React from "react";

const FeatureCard = ({ img, title, description }) => {
  return (
    <div className="flex items-center gap-space-4 p-space-2 border-4 border-secondary/30 rounded-[30px] w-full">
      <Image width={1000} height={1000}
        src={img}
        alt="title"
        className="rounded-[24px] h-[200px] w-[200px]"
      />
      <div className="">
        <h3 className="font-primary font-semibold text-size-h3 mb-space-2">
          {title}
        </h3>
        <p className="font-medium text-size-h5 text-placeholder_3">
          {description}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;
