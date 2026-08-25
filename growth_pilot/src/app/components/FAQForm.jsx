'use client'

import Image from "next/image";
import React, { useState } from "react";
import { assets } from "../assets/assets";

const FAQForm = ({ ques, ans }) => {
  const [open, setOpen] = useState(false);

  return (
    <div onClick={() => setOpen(!open)} className="flex flex-col p-[12px] gap-[8px] md:p-4.5 md:gap-3.5 w-full bg-accent1-bg dark:bg-black border border-primary/30 dark:border-2 dark:border-primary2/60 rounded-xl transition-all duration-300 dark:hover:bg-primary2/8">
      <div className="flex w-full items-center justify-between">
        <h2 className="font-medium text-h5">{ques}</h2>
        <Image
          src={assets.downArrow}
          alt="down"
          className={`size-[16px] md:size-7 ${!open && "rotate-180"}  cursor-pointer`}
        />
      </div>
      <p className={`font-medium text-h5 text-black/70  dark:text-white/70 ${!open && "hidden"}`}>
        {ans}
      </p>
    </div>
  );
};

export default FAQForm;
