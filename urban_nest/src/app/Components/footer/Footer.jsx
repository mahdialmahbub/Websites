import { assets, footerItems, socialIcons } from "@/app/assets/assets";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import FooterLinks from "./FooterLinks";
import Input from "../Input";
import Button from "../Button";

const Footer = () => {
  const { address, phone, email } = footerItems.contact;

  return (
    <section className="p-space-8 bg-primary-1">
      {/* footer content */}
      <div className="flex justify-between flex-wrap gap-space-6">
        {/* logo and social links */}
        <div className="max-w-79.5">
          <Image src={assets.logo} alt="logo" className="w-auto h-[48px]" />
          {/* description */}
          <p className="font-medium text-md opacity-70 mt-space-2">
            Find your ideal property with confidence. Explore verified homes,
            apartments, and commercial spaces powered by smart search and
            AI-driven recommendations for a seamless buying experience.
          </p>
          <div className="flex items-center gap-space-4 mt-5.5">
            {socialIcons.map((item, i) => (
              <Image
                key={i}
                src={item.icon}
                alt={item.icon}
                className="w-auto h-space-6 hover:scale-110 transition-all duration-200"
                height={100}
                width={100}
              />
            ))}
          </div>
        </div>
        {/* Quick Links */}
        <div className="">
          <h3 className="font-semibold text-[16px] font-primary mb-space-4 uppercase">
            Quick Links
          </h3>
          <div className="flex flex-col gap-space-3">
            {footerItems.quickLinks.map((item, i) => (
              <FooterLinks key={i} text={item.text} link={item.link} />
            ))}
          </div>
        </div>
        {/* contact */}
        <div className="">
          <h3 className="font-semibold text-[16px] font-primary mb-space-4 uppercase">
            contact
          </h3>
          <div className="flex flex-col gap-space-3 *:text-md *:text-primary-9 font-medium *:hover:underline *:cursor-pointer">
            <p className="">{address}</p>
            <p className="">{phone}</p>
            <p className="">{email}</p>
          </div>
        </div>
        {/* NewsLater */}
        <div className="max-w-100.75">
          <h3 className="font-semibold text-[16px] font-primary mb-space-4 uppercase">
            Unlock Exclusive Deals
          </h3>
          <p className="font-medium text-md opacity-70 mt-space-2">
            Join our community and enjoy early access to offers and premium
            Properties.
          </p>
          <div className="mt-space-4 flex items-end gap-space-3">
            <Input label="Email" placeholder="Enter your email" className={"mr-space-3"} />
            <Button text="Subscribe" property="secondary" />
          </div>
        </div>
      </div>
      {/* copyright and terms */}
      <div className="border-t border-placeholder mt-space-5 pt-space-5 flex justify-between">
        <p className="text-[12px] text-placeholder">
          &copy; {new Date().getFullYear()} Urban Nest. All rights reserved.
        </p>
        <div className="flex items-center gap-space-5">
          <Link
            href={"#"}
            className="text-md font-medium hover:text-primary-7 hover:underline transition-all duration-200 text-placeholder"
          >
            Privacy
          </Link>
          <Link
            href={"#"}
            className="text-md font-medium hover:text-primary-7 hover:underline transition-all duration-200 text-placeholder"
          >
            cookies
          </Link>

          <Link
            href={"#"}
            className="text-md font-medium hover:text-primary-7 hover:underline transition-all duration-200 text-placeholder"
          >
            Terms
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Footer;
