/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import { Faqs } from "@/app/assets/assets";
import Button from "@/app/components/Button";
import FaqAccordion from "@/app/components/homePage/FAQ/FaqAccordion";
import TextareaField from "@/app/components/Textarea";
import React, { useState } from "react";
import toast from "react-hot-toast";

const StatusDot = ({ colorClass = "bg-red" }) => (
  <span
    className={`size-[8px] shadow-[0px_0px_7px_4px_rgba(212,36,6,0.25)] rounded-full ${colorClass}`}
  ></span>
);

const socialInfo = [
  {
    icon: "fi fi-sr-phone-flip",
    value: "+1 (415) 987-6543",
  },
  {
    icon: "fi fi-sr-marker",
    value: "245 Market Street, San Francisco, CA 94105, USA.",
  },
  {
    icon: "fi fi-sr-envelope",
    value: "support@speedwheels.com",
  },
];

const socialLinks = [
  {
    name: "Facebook",
    href: "www.facebook.com",
    icon: "fi fi-brands-facebook",
    color: "#0165E1",
  },
  {
    name: "Twitter",
    href: "www.twitter.com",
    icon: "fi fi-brands-twitter-alt-circle",
    color: "#000000",
  },
  {
    name: "Youtube",
    href: "www.youtube.com",
    icon: "fi fi-brands-youtube-circle",
    color: "#FF0000",
  },
  {
    name: "WhatsApp",
    href: "www.whatsapp.com",
    icon: "fi fi-brands-whatsapp-circle",
    color: "#1B9F4D",
  },
];

const page = () => {

    const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setError("Enter your message");
      return;
    }

    // TODO: ekhane actual send logic (API call) lagbe
    setError("");
    setMessage("");
    toast.success("Message sent successfully!");
  };


  return (
    <div className="space-y-space-9 w-full">
      {/* contact informations */}
      <div className="flex items-center gap-space-4 *:flex-1">
        {/* number, location and email */}
        <div className="space-y-space-6 p-space-6 bg-[#1A1E3D]/50 min-h-full">
          {socialInfo.map((item, i) => (
            <div key={i} className="flex items-center gap-space-4">
              <div className="size-9.5 rounded-full bg-secondary/10 text-secondary text-size-h5 flex items-center justify-center">
                <i className={`${item.icon}`}></i>
              </div>
              {item.value}
            </div>
          ))}
        </div>

        {/* social links */}
        <div className="bg-[#1A1E3D]/50 p-space-6">
          <div className="flex items-center gap-space-3 mb-space-3">
            <StatusDot />
            <h2 className="font-primary font-semibold text-size-h6 text-placeholder_3 uppercase">
              Frequently Asked
            </h2>
          </div>
          <div className="grid grid-cols-2 *:w-full gap-space-4">
            {socialLinks.map((item, i) => (
              <div
                className="px-space-6 py-space-4 rounded-[10px] font-semibold text-size-h5"
                style={{
                  backgroundColor: item.color,
                }}
                key={i}
              >
                <i className={`${item.icon} text-[26px] text-white`}></i>
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div>
        <div className="mb-space-6">
          <div className="flex items-center gap-space-3 mb-space-2">
            <StatusDot />
            <h2 className="font-primary font-semibold text-size-h6 text-placeholder_3 uppercase">
              Frequently Asked
            </h2>
          </div>
          <h2 className="font-medium text-size-h3">
            Answers before your need to ask twice
          </h2>
        </div>
        <div className="flex flex-col items-center gap-space-5">
          {Faqs.map((faq, index) => (
            <FaqAccordion key={index} ques={faq.question} ans={faq.answer} />
          ))}
        </div>
      </div>

      {/* contact form */}
      <div className="bg-[#1A1E3D]/50 p-space-6 rounded-2xl">
        <div className="mb-space-6">
          <div className="flex items-center gap-space-3 mb-space-2">
            <StatusDot />
            <h2 className="font-primary font-semibold text-size-h6 text-placeholder_3 uppercase">
              Report and problem
            </h2>
          </div>
          <h2 className="font-medium text-size-h3">
            Answers before your need to ask twice
          </h2>
        </div>
        <form onSubmit={handleSubmit}>
      <TextareaField
        title="Message"
        placeholder="Write your message"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          if (error) setError("");
        }}
        showError={!!error}
        errorMessage={error}
      />
      <div className="*:w-full mt-space-4">
        <Button type="submit">Send</Button>
        <div className="flex items-center gap-space-3 text-secondary justify-center mt-space-3">
          Your information is secure{" "}
          <span className="size-1.25 bg-placeholder_3 rounded-full"></span>
          <span className="font-semibold text-size-h6 text-placeholder_3">
            Response within 2 hours
          </span>
        </div>
      </div>
    </form>
      </div>
    </div>
  );
};

export default page;
