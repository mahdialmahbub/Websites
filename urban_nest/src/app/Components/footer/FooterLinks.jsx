import Link from "next/link";
import React from "react";

const FooterLinks = ({ text, link }) => {
  return (
    <div>
      <Link
        href={link}
        className=" transition-all duration-300 group flex items-center gap-space-2 font-medium text-lg text-primary-9 group"
      >
        {text}
        <i className="fi fi-rs-arrow-small-right transition-all group-hover:translate-x-1.5 duration-200 flex items-center justify-center text-[12px] text-primary-9 group-hover:text-primary-5"></i>
      </Link>
    </div>
  );
};

export default FooterLinks;
