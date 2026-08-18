"use client";

import { assets, footerItems, socialIcons } from "@/app/assets/assets";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import FooterLinks from "./FooterLinks";
import Input from "../Input";
import Button from "../Button";
import { toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FadeLeft from "../motions/FadeLeft";
import FadeUp from "../motions/FadeUp";

const Footer = () => {
  const { address, phone, email } = footerItems.contact;

  const notify = () => {
    toast.success("Successfully subscribed!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      transition: Slide,
    });
  };

  return (
    <section className="p-space-8 bg-primary-1">
      <div className="container mx-auto max-w-[1440px]">
        {/* Footer Content */}
        <div className="flex flex-wrap justify-between gap-space-6">
          {/* Logo & Social Links */}
          <div className="max-w-[318px]">
            <FadeLeft>
              <Image
  src={assets.logo}
  alt="Urban Nest logo"
  width={320}
  height={80}
  className="h-[48px] w-auto"
/>
            </FadeLeft>
            <FadeLeft delay={0.2}>
              <p className="mt-space-3 text-lg font-medium opacity-70">
                Find your ideal property with confidence. Explore verified
                homes, apartments, and commercial spaces powered by smart search
                and AI-driven recommendations for a seamless buying experience.
              </p>
            </FadeLeft>
            <FadeLeft delay={0.4}>
              <div className="mt-6 flex items-center gap-space-4">
                {socialIcons.map((item, index) => (
                  <FadeUp key={index} delay={index * 0.1}>
                    <Image
                      src={item.icon}
                      alt="Social media icon"
                      width={24}
                      height={24}
                      className="h-space-6 w-auto transition-all duration-200 hover:scale-110"
                    />
                  </FadeUp>
                ))}
              </div>
            </FadeLeft>
          </div>

          {/* Quick Links */}
          <div>
            <FadeLeft>
              <h3 className="mb-space-4 font-primary text-[16px] font-semibold uppercase">
                Quick Links
              </h3>
            </FadeLeft>

            <div className="flex flex-col gap-space-3">
              {footerItems.quickLinks.map((item, index) => (
                <FadeUp key={index} delay={index * 0.1}>
                  <FooterLinks text={item.text} link={item.link} />
                </FadeUp>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <FadeLeft>
              <h3 className="mb-space-4 font-primary text-[16px] font-semibold uppercase">
                Contact
              </h3>
            </FadeLeft>

            <div className="flex flex-col gap-space-3 font-medium">
              <FadeUp delay={0.2}>
                <p className="cursor-pointer text-lg text-primary-9 hover:underline">
                  {address}
                </p>
              </FadeUp>
              <FadeUp delay={0.4}>
                <p className="cursor-pointer text-lg text-primary-9 hover:underline">
                  {phone}
                </p>
              </FadeUp>
              <FadeUp delay={0.6}>
                <p className="cursor-pointer text-lg text-primary-9 hover:underline">
                  {email}
                </p>
              </FadeUp>
            </div>
          </div>

          {/* Newsletter */}
          <div className="max-w-[403px]">
            <FadeLeft>
              <h3 className="mb-space-4 font-primary text-[16px] font-semibold uppercase">
                Unlock Exclusive Deals
              </h3>
            </FadeLeft>
            <FadeUp delay={0.2}>
              <p className="mt-space-2 text-lg font-medium opacity-70">
                Join our community and enjoy early access to offers and premium
                properties.
              </p>
            </FadeUp>

            <FadeUp delay={0.4}>
              <div className="mt-space-4 flex items-end gap-space-3">
                <Input
                  label="Email"
                  placeholder="Enter your email"
                  className="mr-space-3"
                />

                <Button
                  text="Subscribe"
                  property="secondary"
                  onClick={notify}
                />
              </div>
            </FadeUp>
          </div>
        </div>

        {/* Copyright & Terms */}
        <FadeUp>
          <div className="mt-space-5 flex justify-between border-t border-placeholder pt-space-5">
            <p className="text-[12px] text-placeholder">
              &copy; {new Date().getFullYear()} Urban Nest. All rights reserved.
            </p>

            <div className="flex items-center gap-space-5">
              <Link
                href="#"
                className="text-md font-medium text-placeholder transition-all duration-200 hover:text-primary-7 hover:underline"
              >
                Privacy
              </Link>

              <Link
                href="#"
                className="text-md font-medium text-placeholder transition-all duration-200 hover:text-primary-7 hover:underline"
              >
                Cookies
              </Link>

              <Link
                href="#"
                className="text-md font-medium text-placeholder transition-all duration-200 hover:text-primary-7 hover:underline"
              >
                Terms
              </Link>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
};

export default Footer;
