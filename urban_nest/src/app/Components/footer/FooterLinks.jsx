import Link from "next/link";
import React from "react";

const FooterLinks = ({ text, link }) => {
  return (
    <div>
      <Link
        href={link}
        className="text-white text-sm hover:text-gray-400 transition-all duration-300 group flex items-center gap-space-2"
      >
        <p className="font-medium text-md text-primary-9 group-hover:text-primary-5">
          {text}
        </p>
        <i className="fi fi-rs-arrow-small-right transition-all group-hover:translate-x-1.5 duration-200 flex items-center justify-center text-[12px] text-primary-9 hover:text-primary-5"></i>
      </Link>
    </div>
  );
};

export default FooterLinks;
