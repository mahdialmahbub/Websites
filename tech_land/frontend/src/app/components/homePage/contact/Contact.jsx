"use client";

import React, { useState } from "react";
import SectionHeader from "../SectionHeader";
import { contactInfo } from "@/app/assets/assets";
import Input from "../../Input";
import Textarea from "../../Textarea";
import Button from "../../Button";
import { useSendMessageMutation } from "@/redux";

const initialFormState = {
  name: "",
  email: "",
  message: "",
};

const Contact = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [sendMessage, { isLoading }] = useSendMessageMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await sendMessage(formData).unwrap();
      setFormData(initialFormState); // success হলে form reset
    } catch (err) {
      console.error("Failed to send message:", err);
    }
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
              <Input
                title="Name"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <Input
                title="Email"
                name="email"
                type="email"
                placeholder="Enter your email "
                value={formData.email}
                onChange={handleChange}
                required
              />
              <div className="col-span-2">
                <Textarea
                  title="Message"
                  name="message"
                  placeholder="White your message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* button */}
            <div>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Message"}
              </Button>
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