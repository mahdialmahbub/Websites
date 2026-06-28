import Image from "next/image";
import React from "react";
import Button from "../Button";

const FeatureCard = ({ title, subtitle, imageURL, isRight, icon = 'fi fi-rs-home' }) => {
  return (
    <div
      className={`flex items-center ${isRight ? "justify-end" : "justify-start"} p-space-5 gap-space-6 relative border border-primary-2 shadow-[0_0_8px_rgba(13,100,94,0.10)]`}
    >
      <i className={`${icon} text-[348px] text-primary-3 opacity-10 absolute top-0 ${isRight ? "left-25" : "right-25"}`}></i>
      <Image
        alt="featureImage"
        src={imageURL}
        className={`${isRight && "order-2"} w-103 h-58`}
      />
      <div className={`flex flex-col ${isRight ? "justify-end *:text-end" : "justify-start *:text-start"}`}>
        <h3 className="mb-2 font-primary font-semibold text-xl ">{title}</h3>
        <p className="mb-3 font-medium text-md">{subtitle}</p>
        <Button text={"Explore Now"} type={"text"} />
      </div>
    </div>
  );
};

export default FeatureCard;
