"use client";

import { assets } from "@/app/assets/assets";
import Button from "@/app/components/Button";
import InputField from "@/app/components/Input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAddAddressMutation } from "@/redux";
import toast from "react-hot-toast";

const contactInfo = [
  { name: "Gmail", value: "example@gmail.com", color: "#ffffff", icon: assets.Gmail, blackText: true, link: "www.gmail.com" },
  { name: "Facebook", value: "mahdialmahbub", color: "#0165E1", icon: assets.Facebook, link: "www.facebook.com" },
  { name: "WhatsApp", value: "+880 17359 99190", color: "#39AE41", icon: assets.Whats_App, link: "www.whatsapp.com" },
];

const initialForm = {
  apartmentNumber: "", buildingNumber: "", roadNumber: "", locality: "",
  area: "", city: "", postCode: "", country: "", isDefault: false,
};

const Page = () => {
  const router = useRouter(); // was missing — "Back to Home" was throwing before
  const [form, setForm] = useState(initialForm);
  const [addAddress, { isLoading }] = useAddAddressMutation();

  const handleChange = (field) => (e) =>
    setForm((prev) => ({
      ...prev,
      [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.city.trim() || !form.country.trim()) {
      toast.error("City and Country are required.");
      return;
    }

    try {
      await addAddress(form).unwrap();
      toast.success("Address saved. Welcome to TechWorld Store!");
      router.push("/"); // onboarding complete -> home
    } catch (err) {
      toast.error(err?.data?.message || "Could not add address");
    }
  };

  const fields = [
    ["apartmentNumber", "Apartment Number", "e.g. 5"],
    ["buildingNumber", "Building Number", "e.g. 12"],
    ["roadNumber", "Road Number", "e.g. 2"],
    ["locality", "Locality", "e.g. Kafrul"],
    ["area", "Area", "e.g. Mirpur"],
    ["city", "City", "e.g. Dhaka"],
    ["postCode", "Post Code", "e.g. 1212"],
    ["country", "Country", "e.g. Bangladesh"],
  ];

  return (
    <section className="min-h-screen min-w-full flex justify-center p-space-11 gap-space-11">
      {/* form */}
      <div className="w-[500px] p-space-8 rounded-[12px] border border-secondary/60">
        <div className="flex items-center gap-space-3 mb-space-8">
          <i className="fi fi-sr-marker text-secondary text-[32px]"></i>
          <h2 className="font-semibold text-size-h3 text-[]">Select Location</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-space-4">
            {fields.map(([key, label, placeholder]) => (
              <InputField key={key} value={form[key]} onChange={handleChange(key)} placeholder={placeholder} title={label} />
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-400 mt-space-3">
            <input type="checkbox" checked={form.isDefault} onChange={handleChange("isDefault")} className="size-4" />
            Set as default address
          </label>

          <div className="mt-space-8">
            <div className="flex gap-space-4 *:w-full">
              <Button variant="secondary" type="button" onClick={() => router.push("/")}>
                Skip for now
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
            <div className="mt-space-3 flex items-center justify-center gap-1.5 text-secondary text-[14px] font-semibold">
              <i className="fi fi-rr-shield-check"></i>
              Your location information is safe
            </div>
          </div>
        </form>
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