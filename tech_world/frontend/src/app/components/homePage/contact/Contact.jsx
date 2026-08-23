"use client";

import React, { useState } from "react";
import SectionHeader from "../SectionHeader";
import { contactInfo, assets } from "@/app/assets/assets";
import Image from "next/image";
import Input from "../../Input";
import Textarea from "../../Textarea";
import Button from "../../Button";
import { useSendMessageMutation } from "@/redux";
import toast from "react-hot-toast";

const initialFormState = {
  name: "",
  email: "",
  message: "",
};

const contactInfoData = [
  {
    name: "Gmail",
    value: "example@gmail.com",
    color: "#ffffff",
    icon: assets.Gmail,
    blackText: true,
    link: "www.gmail.com",
  },
  {
    name: "Facebook",
    value: "mahdialmahbub",
    color: "#0165E1",
    icon: assets.Facebook,
    link: "www.facebook.com",
  },
  {
    name: "Gmail",
    value: "+880 17359 99190",
    color: "#39AE41",
    icon: assets.Whats_App,
    link: "www.whatsapp.com",
  },
];


const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Contact = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [fieldErrors, setFieldErrors] = useState({}); // { name?, email?, message? }
  const [sendMessage, { isLoading }] = useSendMessageMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // clear that field's error as soon as the user starts fixing it
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Please enter your name";

    if (!formData.email.trim()) {
      errors.email = "Please enter your email";
    } else if (!EMAIL_REGEX.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.message.trim()) errors.message = "Please enter some message";

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return; // stop here — show the field errors, don't call the API

    try {
      await sendMessage(formData).unwrap();
      toast.success("Your message has been sent successfully!");
      setFormData(initialFormState);
      setFieldErrors({});
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <section id="contact" className="section relative overflow-hidden">
      <div className="relative z-10">
        {/* Section heading — age import kora chilo kintu kothao use hocchilo na */}

        <div className="flex items-stretch gap-[46px] mt-space-9 *:flex-1">
          {/* left: background image + contact info */}
          <div className="min-h-full flex-1 p-space-8 rounded-[12px] relative overflow-hidden">
                  {/* Background Image */}
                  <Image src={assets.overlay1} alt="bg" fill className="object-cover" />
          
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60" />
          
                  {/* content */}
                  <div className="relative z-10 min-h-full flex flex-col items-start justify-end">
                    <div>
                      <h1 className="font-primary font-medium text-[32px] mb-[8px]">
                        To get help, Contact us Fluently.
                      </h1>
                      <p className="font-medium text-size-h5 text-placeholder mt-[18px]">
                        Sign in to your account to explore the latest tech and manage your
                        orders.
                      </p>
                      <div className="flex items-center gap-space-3 mt-space-6 mb-space-7">
                        {contactInfoData.map((item, i) => (
                          <span
                            key={i}
                            className="flex items-center p-space-3 gap-2.5 w-[180px] rounded-[8px]"
                            style={{
                              backgroundColor: item.color,
                            }}
                          >
                            <Image
                              alt={item.name}
                              src={item.icon}
                              height={24}
                              width={24}
                            />
                            <div>
                              <h3
                                className={`font-primary font-semibold text-size-medium ${item.blackText && "text-background"}`}
                              >
                                {item.name}
                              </h3>
                              <p
                                className={`font-semibold text-size-medium ${item.blackText && "text-background"}`}
                              >
                                {item.value}
                              </p>
                            </div>
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-space-2">
                        <i className="fi fi-sr-marker text-secondary text-size-h5"></i>
                        <p className="font-medium text-[20px] text-placeholder">
                          245 Market Street, San Francisco, CA 94105, USA.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

          {/* right: contact form */}
          <form
            onSubmit={handleSubmit}
            className="w-[500px] p-space-8 rounded-[12px] border border-secondary/60 flex flex-col gap-space-7"
          >
            <h2 className="font-primary font-medium text-[26px] text-placeholder_3">
              Send Us a Message
            </h2>

            <div className="grid grid-cols-2 gap-space-6">
              <Input
                title="Name"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                showError={!!fieldErrors.name}
                errorMessage={fieldErrors.name}
              />

              <Input
                title="Email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                showError={!!fieldErrors.email}
                errorMessage={fieldErrors.email}
              />

              <div className="col-span-2">
                <Textarea
                  title="Message"
                  name="message"
                  placeholder="Write your message"
                  value={formData.message}
                  onChange={handleChange}
                  showError={!!fieldErrors.message}
                  errorMessage={fieldErrors.message}
                />
              </div>
            </div>

            <div>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Message"}
              </Button>
              <div className="flex items-center justify-center gap-space-3 text-placeholder_2 text-size-h6 font-medium mt-space-3">
                <span className="text-secondary">Your information is secure</span>
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
