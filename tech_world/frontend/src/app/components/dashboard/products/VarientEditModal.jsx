/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { assets } from "@/app/assets/assets";
import InputField from "../../Input";
import CounterField from "../../CounterField";
import Button from "../../Button";

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

const [selectedProcessor, setSelectedProcessor] = useState(
  processorOptions?.[0]?.id,
);

const VarientEditModal = ({}) => {
  return (
    <div className="p-space-7 rounded-2xl bg-background border-2 border-secondary max-w-[700px] space-y-space-8">
      <div className="flex items-center gap-space-3 mb-space-7">
        <i className="text-[32px] fi fi-sr-microchip"></i>
        <h2 className="font-semibold text-size-h3">Processor</h2>
      </div>
      <div>
        <div className="px-space-3 space-y-space-4">
          <div className="flex gap-space-6">
            <InputField title="Varient" placeholder="e.g. i7" />
            <CounterField title="Increased Price" />
            <Button
              showRightIcon
              rightIcon="fi fi-sr-add"
              variant="secondary"
            />
          </div>

          <div className="flex gap-space-4">
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
      </div>
    </div>
  );
};

export default VarientEditModal;
