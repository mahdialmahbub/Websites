import React from "react";
import { assets, contactPageInfo } from "../assets/assets";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Form from "../components/contact/Form";
import LogoMarquee from "../components/contact/LogoMarquee";

const page = () => {
  const { title, trust, contact, infiniteScrollIcon, socialLinks } =
    contactPageInfo;

  return (
    <section className="min-w-full space-y-space-9">
      {/* form and content */}
      <div className="flex gap-space-7">
        <div className="flex-1">
          <h1 className="font-primary font-semibold text-size-3xl mb-space-6">
            {title}
          </h1>
          <div className="space-y-4.5 mb-space-7">
            {trust.map((item, i) => (
              <div key={i} className="flex items-center gap-space-1">
                <Image
                  alt="checked"
                  src={assets.CheckBox_L}
                  width={22}
                  height={22}
                />
                <h3 className="font-medium text-size-md text-placeholder_2">
                  {item}
                </h3>
              </div>
            ))}
          </div>
          <div className="space-y-space-5">
            <h2 className="font-primary font-semibold text-size-lg ">
              Contact me with
            </h2>
            <div className="space-y-space-5">
              {contact.map((item, i) => (
                <div key={i} className="flex items-center gap-space-2">
                  <div className="w-[24px] h-[24px] flex items-center justify-center bg-secondary-500/10 rounded-md *:text-[11px] text-secondary-600">
                    <i className={item.icon}></i>
                  </div>
                  <Link
                    href={item.value}
                    className="font-medium text-size-md hover:underline transition-all duration-200"
                  >
                    {item.value}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* form */}
        <Form />
      </div>

      {/* Infinite Scroll */}
      <div>
        <LogoMarquee />
      </div>

      {/* Socials */}
      <div className="relative w-full mx-auto rounded-3xl overflow-hidden shadow-xl">
        <Image
          src={assets.backgroundImage}
          alt="background"
          fill
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/65" />

        <div className="relative flex flex-col items-center justify-center gap-4 py-10 sm:py-12 px-6 text-center">
          <div>
            <h2 className="text-background text-xl sm:text-2xl font-bold">
              Let&apos;s Build Something Amazing Together
            </h2>
            <p className="text-background/70 text-sm mt-1.5 font-medium">
              Contact us
            </p>
          </div>

          <div className="grid grid-cols-5 content-center gap-space-6 mt-2 *:w-full">
            {/* Behance case study link */}
            {socialLinks.map((link, i) => (
              <Link
                key={i}
                href={link.userName}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex flex-1 items-center gap-2.5 rounded-lg py-space-3 px-space-4 font-semibold shadow-lg transition-all`}
                style={{
                  backgroundColor: link.color,
                  color: link.blackText ? "black" : "white",
                }}
              >
                <Image
                  alt={link.title}
                  src={link.icon}
                  width={24}
                  height={24}
                />
                <div className="flex flex-col items-start">
                  <span className="font-semibold italic tracking-tight text-sm">
                    {link.title}
                  </span>
                  <p className="text-size-xs font-medium">{link.userName}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
