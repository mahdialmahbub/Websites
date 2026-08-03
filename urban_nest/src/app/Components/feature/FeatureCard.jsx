"use client";

import Image from "next/image";
import React from "react";
import Button from "../Button";
import TextButton from "../TextButton";
import { motion } from "motion/react";

const FeatureCard = ({
  title,
  subtitle,
  imageURL,
  isRight,
  icon = "fi fi-rs-home",
}) => {
  return (
    <motion.div
      ininitial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{
        amount: "all",
      }}
      className={`flex items-center ${isRight ? "justify-end featureLeft" : "justify-start featureRight"} p-space-5 gap-space-6 relative border border-primary-2 shadow-[0_0_8px_rgba(13,100,94,0.10)] overflow-hidden`}
    >
      <i
        className={`${icon} text-[348px] text-primary-3 opacity-10 absolute top-0 ${isRight ? "-left-25" : "-right-25"}`}
      ></i>
      <Image
        alt="featureImage"
        src={imageURL}
        className={`${isRight && "order-2"} w-103 h-58`}
      />
      <div>
        <div
          className={`${isRight ? "justify-end *:text-end " : "justify-start *:text-start"}`}
        >
          <h3 className="mb-2 font-primary font-semibold text-[24px] ">
            {title}
          </h3>
          <p className="mb-3 font-medium text-xl text-placeholder">
            {subtitle}
          </p>
        </div>
        <TextButton
          text="Explore Now"
          type="text"
          className={`${isRight && "justify-end content-end"}`}
        />{" "}
      </div>
    </motion.div>
  );
};

export default FeatureCard;
