"use client";

import React from "react";
import SectionHeader from "../SectionHeader";
import { contactInfo } from "@/app/assets/assets";
import Input from "../../Input";
import Textarea from "../../Textarea";
import Button from "../../Button";

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <section
      className="section relative"
      style={{
        backgroundImage: `url('image.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* overlay */}
      {/* <div className="absolute inset-0 bg-black/50"></div> */}
      {/* content */}
      <div className="z-10">
        <SectionHeader
          type="withSubtitle"
          subtitle={
            "We’re just a message away. Get in touch and we’ll assist you with pleasure"
          }
          title={"Contact Us"}
        />
        <div className="flex items-center justify-between gap-[46px]">
          {/* contact */}
          <div className="flex flex-col gap-space-6">
            {contactInfo.map((item, i) => (
              <div key={i} className="flex items-center gap-space-6">
                {/* icon */}
                <div className="rounded-full w-[42px] h-[42px] bg-secondary/20 flex items-center justify-center *:text-secondary">
                  <i className={`${item.icon} text-size-h5`}></i>
                </div>
                <h2 className="text-size-h4 text-foreground font-medium">
                  {item.contact}
                </h2>
              </div>
            ))}
          </div>

          {/* form */}
          <form onSubmit={handleSubmit} className="w-[734px]">
            {/* input and textarea */}
            <div className="grid grid-cols-2 gap-space-6">
              <Input title="Name" placeholder="Enter your name" required />

              <Input title="Email" placeholder="Enter your email " required />
              <div className="col-span-2">
              <Textarea title="Message" placeholder="White your message" required /></div>
            </div>

            {/* button */}
            <div>
              <Button className="w-full">Send Message</Button>
              <div className="flex items-center justify-center gap-space-3 text-placeholder_2 text-size-h6 font-semibold mt-space-3">
                <span className="text-secondary">
                  Your information is secure
                </span>
                <div className="w-1.5 h-1.5 bg-placeholder_2 rounded-full"></div>
                Response within 2 hours
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
