"use client";

import { assets } from "@/app/assets/assets";
import Button from "@/app/components/Button";
import PhoneInput from "@/app/components/PhoneInput";
import { useUpdateMyProfileMutation } from "@/redux";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const contactInfo = [
  { name: "Gmail", value: "example@gmail.com", color: "#ffffff", icon: assets.Gmail, blackText: true, link: "www.gmail.com" },
  { name: "Facebook", value: "mahdialmahbub", color: "#0165E1", icon: assets.Facebook, link: "www.facebook.com" },
  { name: "WhatsApp", value: "+880 17359 99190", color: "#39AE41", icon: assets.Whats_App, link: "www.whatsapp.com" },
];

const Page = () => {
  const router = useRouter(); // was missing entirely — "Back to Home" was throwing before
  const [phoneValue, setPhoneValue] = useState(null); // { countryCode, dialCode, number, fullNumber, isValid }
  const [error, setError] = useState("");

  const [updateProfile, { isLoading }] = useUpdateMyProfileMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!phoneValue?.isValid) {
      setError("Please enter a valid phone number.");
      return;
    }

    try {
      await updateProfile({ phone: phoneValue.fullNumber }).unwrap();
      router.push("/delivery_location"); // ⚠️ replace with your real address page route
    } catch (err) {
      setError(err?.data?.message || "Could not save phone number.");
    }
  };

  return (
    <section className="min-h-screen min-w-full flex justify-center p-space-11 gap-space-11">
      {/* form */}
      <div className="w-[500px] p-space-8 rounded-[12px] border border-secondary/60 flex flex-col items-center justify-center gap-space-8">
        <div className="w-full text-center">
          <h2 className="font-primary font-medium text-[32px] mb-space-1">Get in Touch</h2>
          <p className="font-medium text-size-h6 mb-space-7 text-placeholder_3">We need your number & address to deliver fast</p>
          <form onSubmit={handleSubmit} className="space-y-space-3 *:w-full">
            <PhoneInput
              title="Phone Number"
              required
              onChange={setPhoneValue}
              showError={!!error}
              errorMessage={error}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Saving..." : "Next"}
            </Button>
          </form>
        </div>
      </div>

      {/* image and other contact informations */}
      <div className="min-h-full flex-1 p-space-8 rounded-[12px] relative overflow-hidden">
        <Image src={assets.overlay2} alt="bg" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 min-h-full flex flex-col items-start justify-between">
          <Button showLeftIcon leftIcon="fi fi-rr-arrow-small-left" variant="text" className="text-secondary" onClick={() => router.back()}>
            Back to Home
          </Button>
          <div>
            <h1 className="font-primary font-medium text-[32px] mb-[8px]">To get help, Contact us Fluently.</h1>
            <p className="font-medium text-size-h5 text-placeholder mt-[18px]">
              Sign in to your account to explore the latest tech and manage your orders.
            </p>
            <div className="flex items-center gap-space-3 mt-space-6 mb-space-7">
              {contactInfo.map((item) => (
                <span key={item.name + item.value} className="flex items-center p-space-3 gap-2.5 w-[180px] rounded-[8px]" style={{ backgroundColor: item.color }}>
                  <Image alt={item.name} src={item.icon} height={24} width={24} />
                  <div>
                    <h3 className={`font-primary font-semibold text-size-medium ${item.blackText && "text-background"}`}>{item.name}</h3>
                    <p className={`font-semibold text-size-medium ${item.blackText && "text-background"}`}>{item.value}</p>
                  </div>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-space-2">
              <i className="fi fi-sr-marker text-secondary text-size-h5"></i>
              <p className="font-medium text-[20px] text-placeholder">245 Market Street, San Francisco, CA 94105, USA.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;