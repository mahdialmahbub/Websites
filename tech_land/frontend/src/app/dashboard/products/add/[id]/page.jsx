/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { products } from "@/app/assets/assets";
import Button from "@/app/components/Button";
import CounterField from "@/app/components/CounterField";
import FeatureTag from "@/app/components/dashboard/FeatureTag";
import InputField from "@/app/components/Input";
import Tag from "@/app/components/Tag";
import TextareaField from "@/app/components/Textarea";
import Image from "next/image";
import React, { useState } from "react";

const images = [
  "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80",
  "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&q=80",
  "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80",
  "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80",
];

const colors = [
  { id: "yellow", hex: "#F4C542" },
  { id: "red", hex: "#E14848" },
  { id: "blue", hex: "#3E6BF0" },
  { id: "green", hex: "#3EAE5A" },
  { id: "black", hex: "#1A1A1A" },
];

const ramOptions = [
  { id: "8gb", label: "8GB", extraPrice: 0 },
  { id: "64gb", label: "64GB", extraPrice: 1000 },
  { id: "16gb", label: "16GB", extraPrice: 0 },
];

const storageOptions = [
  { id: "128gb", label: "128GB", extraPrice: 0 },
  { id: "16gb", label: "16GB", extraPrice: 1000 },
  { id: "16gb-2", label: "16GB", extraPrice: 0 },
];

const processorOptions = [
  { id: "i5", label: "16GB", extraPrice: 0 },
  { id: "i7", label: "16GB", extraPrice: 1000 },
  { id: "i9", label: "16GB", extraPrice: 0 },
];

function OptionGroup({ label, options, selected, onSelect, className }) {
  return (
    <div className={`${className}`}>
      <p className="text-size-h6 font-primary font-semibold tracking-wide mb-space-3">
        {label}:
      </p>
      <div className="flex gap-3">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            className={`rounded-sm border min-w-25 h-16.25 p-space-3 text-size-h6 font-primary font-semibold transition-colors text-center ${
              selected === option.id
                ? "border-secondary bg-secondary/5 text-secondary"
                : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/5"
            }`}
          >
            <p className="font-semibold">{option.label}</p>
            {option.extraPrice > 0 && (
              <p className="text-size-medium text-placeholder_2/80">
                + ${option.extraPrice}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

const page = () => {
  const [selectedColor, setSelectedColor] = useState(colors?.[0]?.id);
  const [selectedRam, setSelectedRam] = useState(ramOptions?.[0]?.id);
  const [selectedStorage, setSelectedStorage] = useState(
    storageOptions?.[0]?.id,
  );
  const [selectedProcessor, setSelectedProcessor] = useState(
    processorOptions?.[0]?.id,
  );

  return (
    <section className="px-space-6 pb-space-6 pt-space-3">
      <div className="p-space-6 space-y-space-7 rounded-2xl bg-[#1A1E3D]/50">
        <Button
          variant="text"
          showLeftIcon
          leftIcon="fi fi-rr-arrow-small-left"
        >
          Back
        </Button>
        <h1 className="font-semibold text-[20px] text-placeholder_3 ">
          Add New Product
        </h1>

        {/* product details */}
        <div className="flex gap-space-6 *:p-space-4 *:rounded-lg *:flex-1 *:bg-[#1A1E3D]/50 *:space-y-space-9">
          {/* product informations */}
          <div className="*:space-y-space-6 ">
            {/* Basic Information */}
            <div className="">
              <h2 className="font-medium text-size-h6 text-placeholder_3">
                Basic Information
              </h2>
              <div className="grid grid-cols-2 gap-x-space-7 gap-y-space-8">
                <InputField title="Brand" placeholder="e.g. NovaTech" />
                <InputField
                  title="Product Category"
                  placeholder="	e.g. Gaming Laptop"
                />
                <div className="col-span-2">
                  <TextareaField
                    title="Product Description"
                    placeholder="The NovaTech X15 Pro is a high-performance gaming laptop built with a powerful processor, dedicated graphics, and an ultra-smooth display — ideal for gaming, streaming, and heavy multitasking."
                  />
                </div>
              </div>
            </div>

            {/* Product Variants */}
            <div className="">
              <div className="flex items-center gap-space-4">
                <h2 className="font-medium text-size-h6 text-placeholder_3">
                  Product Variants
                </h2>
                <div className="flex gap-1.5 text-secondary font-medium text-size-medium">
                  <i className="fi fi-rr-info text-size-large"></i>
                  You can select multiple variants
                </div>
              </div>
              <div className="space-y-space-9">
                {/* color */}
                <div>
                  <p className="text-size-h6 uppercase tracking-wide mb-space-3 font-primary font-semibold">
                    Colors:
                  </p>
                  <div className="flex gap-6 items-center">
                    <button
                      aria-label={"edit"}
                      className="w-12.5 h-12.5 flex items-center justify-center text-[20px] border border-dashed border-secondary text-secondary rounded-lg"
                    >
                      <i class="fi fi-rr-edit"></i>
                    </button>
                    {colors.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        aria-label={c.id}
                        onClick={() => setSelectedColor(c.id)}
                        style={{ backgroundColor: c.hex }}
                        className={`h-[32px] w-7 rounded-xs outline-2 outline-offset-4 transition-transform cursor-pointer ${
                          selectedColor === c.id
                            ? "scale-110 outline-cyan-400"
                            : "outline-white/20 hover:scale-105"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* RAM */}
                {ramOptions?.length > 0 && (
                  <OptionGroup
                    className={""}
                    label="RAM"
                    options={ramOptions}
                    selected={selectedRam}
                    onSelect={setSelectedRam}
                  />
                )}
                {/* Storage */}
                {storageOptions?.length > 0 && (
                  <OptionGroup
                    label="Storage"
                    options={storageOptions}
                    selected={selectedStorage}
                    onSelect={setSelectedStorage}
                  />
                )}
                {/* Processor */}
                {processorOptions?.length > 0 && (
                  <OptionGroup
                    label="Processor"
                    options={processorOptions}
                    selected={selectedProcessor}
                    onSelect={setSelectedProcessor}
                  />
                )}
              </div>
            </div>

            {/* Features */}
            <div>
              <h2 className="font-medium text-size-h6 text-placeholder_3">
                Features
              </h2>
              <div className="px-space-3 space-y-space-6">
                <div className="flex items-end gap-space-2 ">
                  <InputField
                    showInfo={true}
                    infoMessage="You can add multiple features"
                    title="Feature"
                    required
                  />
                  <Button
                    variant="secondary"
                    className="text-size-large mb-space-7"
                  >
                    Add Feature
                  </Button>
                </div>
                <div className="flex w-full flex-wrap gap-space-3">
                  <FeatureTag text={"NVIDIA RTX 4060 8GB"} />
                </div>
              </div>
            </div>
          </div>

          {/* key informations */}
          <div className="">
            {/* images */}
            <div className="flex gap-space-3">
              <span className="min-w-37.5 min-h-space-12 flex flex-col items-center justify-center gap-space-1 rounded-lg bg-secondary/10 border-2 border-dashed border-secondary/50">
                <div className="flex items-center justify-center size-7 rounded-lg bg-secondary/10 text-secondary text-[24px]">
                  <i className="fi fi-rr-plus-small"></i>
                </div>
                <h6 className="font-semibold text-size-medium text-secondary">
                  Upload Image
                </h6>
                <p className="font-semibold text-[8px] text-placeholder_2">
                  PNG or JPG, up to 5MB
                </p>
              </span>
              <div className="flex items-center gap-space-3 w-full overflow-x-auto">
                {images.map((item, i) => (
                  <Image
                    key={i}
                    src={item}
                    alt={item}
                    width={150}
                    height={120}
                    className="w-[150px] h-[120px] rounded-lg object-cover"
                  />
                ))}
              </div>
            </div>

            {/* pricing and discount */}
            <div className="flex items-center gap-space-7 w-full *:w-full">
              <CounterField title="Started Price" required />
              <CounterField title="Available Stock" />
            </div>
            <div className="">
              <label className="font-semibold font-primary text-size-h6 text-foreground ">
                Discount
              </label>
              <div className="flex items-center gap-space-3 mt-space-3">
                <button
                  aria-label={"edit"}
                  className="w-12.5 min-h-[40px] flex items-center justify-center text-[20px] border border-dashed border-secondary text-secondary rounded-lg"
                >
                  <i class="fi fi-rr-edit"></i>
                </button>
                <div className="flex gap-space-3">
                  <Tag text={"30%"} isIcon icon="fi fi-sr-badge-percent" />
                </div>
              </div>
            </div>
            <div className="">
              <label className="font-semibold font-primary text-size-h6 text-foreground ">
                Title Tag
              </label>
              <div className="flex items-center gap-space-3 mt-space-3">
                <button
                  aria-label={"edit"}
                  className="w-12.5 min-h-[40px] flex items-center justify-center text-[20px] border border-dashed border-secondary text-secondary rounded-lg"
                >
                  <i class="fi fi-rr-edit"></i>
                </button>
                <div className="flex gap-space-3">
                  <Tag
                    text={"International Best Seller"}
                    isIcon
                    icon="fi fi-sr-trophy-star"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-space-7 w-full *:w-full">
              <CounterField title="Started Price" required />
              <CounterField title="Available Stock" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
