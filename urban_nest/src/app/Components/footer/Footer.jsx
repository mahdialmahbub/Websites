import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <section className="p-space-8 bg-primary-1">
      {/* footer content */}
      <div className="flex justify-center ">
        {/* logo and social links */}
        <div className="">
          <Image src={assets.logo} alt="logo" className="w-auto h-[32px]" />
          {/* description */}
          <p className="font-medium text-[12px] text-placeholder">
            Find your ideal property with confidence. Explore verified homes,
            apartments, and commercial spaces powered by smart search and
            AI-driven recommendations for a seamless buying experience.
          </p>
          <div className="flex items-center gap-space-4">{socialIcons}</div>
        </div>
      </div>
      {/* copyright and terms */}
      <div></div>
    </section>
  );
};

export default Footer;
