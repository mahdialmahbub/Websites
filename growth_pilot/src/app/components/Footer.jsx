import React from "react";
import Image from "next/image";
import { assets, socialIcons } from "../assets/assets";
import Link from "next/link";

const Footer = () => {
  const footerLinks = {
    productLinks: [
      { name: "Features", href: "#" },
      { name: "Pricing", href: "#" },
      { name: "Integrations", href: "#" },
      { name: "Updates", href: "#" },
    ],
    companyLinks: [
      { name: "About Us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Contact", href: "#" },
    ],
    supportAndLegal: [
      { name: "Help Center", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "FAQs", href: "#" },
    ],
  };

  return (
    <section className="px-[16px] py-[48px] md:p-[48px] xl:px-46.5 xl:py-20">
      <footer className="rounded-lg md:rounded-[20px] p-4 md:px-12 xl:px-[64px] pt-4 md:pt-12 xl:pt-[64px] pb-[4px] md:pb-2 border-3 border-accent2/20 dark:border-[#56CCF2/40 bg-accent2-bg dark:bg-black">
        <div className="flex max-md:flex-col items-center justify-between flex-wrap gap-[24px] md:gap-[40px]">
          <div className="flex flex-col justify-between gap-[16px] md:gap-[24px] max-w-79.5">
            {/* logo, subtitle and social links */}
            <div className="mb-[16px] md:mb-[24px] max-md:text-center max-md:flex max-md:flex-col max-md:items-center">
              <Image
                src={assets.logo}
                alt="Logo"
                className="size-9 md:size-14 "
              />
              <p className="text-medium xl:text-large text-black/70 mt-3 md:mt-2 dark:text-white/70">
                Your trusted destination for the latest tech gadgets,
                accessories, and smart devices at the best prices.
              </p>
            </div>
            <div className="flex items-center gap-5 md:gap-3.5">
              {socialIcons.map((icon, index) => (
                <Image
                  key={index}
                  src={icon}
                  alt={`Social Icon ${index + 1}`}
                  className="size-4.5 md:size-5.5 cursor-pointer hover:scale-110 transition-transform duration-200"
                />
              ))}
            </div>
          </div>
          {/* product links */}
          <div className="flex flex-col max-md:items-center gap-3">
            <h3 className="text-3.5 md:text-4.5 font-semibold uppercase">
              Product Links
            </h3>
            <div className="flex flex-col max-md:items-center gap-2 md:gap-2.5">
              {footerLinks.productLinks.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="font-medium text-4 text-black/70 dark:text-white/70 hover:text-primary transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          {/* Company Links */}
          <div className="flex flex-col max-md:items-center gap-3">
            <h3 className="text-3.5 md:text-4.5 font-semibold uppercase">
              Company Links
            </h3>
            <div className="flex flex-col max-md:items-center gap-2 md:gap-2.5">
              {footerLinks.companyLinks.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="font-medium text-4 text-black/70 dark:text-white/70 hover:text-primary transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Support & Legal */}
          <div className="flex flex-col max-md:items-center gap-3">
            <h3 className="text-3.5 md:text-4.5 font-semibold uppercase">
              Support & Legal
            </h3>
            <div className="flex flex-col max-md:items-center gap-2 md:gap-2.5">
              {footerLinks.supportAndLegal.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="font-medium text-4 text-black/70 dark:text-white/70 hover:text-primary transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <p className="text-large md:text-h6 text-black/70 mt-4 md:mt-6 py-[16px] md:py-4.5 text-center w-full font-medium dark:text-white/70">
          &copy; {new Date().getFullYear()} GrowthPilot. All rights reserved.
        </p>
      </footer>
    </section>
  );
};

export default Footer;
