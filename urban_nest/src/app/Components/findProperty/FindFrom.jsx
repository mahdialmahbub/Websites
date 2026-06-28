'use client';

import React, { useState } from "react";
import Button from "../Button";
import Input from "../Input";
import Chips from "../Chips";
import { propertyBudgets, propertyTypes } from "@/app/assets/assets";

const FindFrom = () => {
  const [selectedPropertyType, setSelectedPropertyType] = useState('Apartment');
  const [selectedBudget, setSelectedBudget] = useState('Under $100K');

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="p-space-5 bg-background ">
      <div className="mb-space-7">
        <div className='flex items-end gap-space-3'>
        <Input
          label={"Location"}
          placeholder={"Search your location "}
          type={"location"}
          icon="fi fi-rs-marker" className="w-full"
        />
        <button type='button' className="flex items-center justify-center p-space-2 bg-primary-1 cursor-pointer">
            <div className='size-[24px] rounded-full bg-[#6393F2]/30 flex items-center justify-center'>
            <div className='size-2.5 rounded-full bg-[#6393F2] ring-2 ring-white'>

            </div>
            </div>
        </button>
        </div>

        {/* Property Type */}
        <div className="mt-space-6">
          <div className="mb-space-3 flex items-center gap-space-1 text-placeholder">
            <i className={`fi fi-rs-apartment text-[12px] flex items-center justify-center`}></i>
            <p className="font-primary font-semibold text-lg">Property Type</p>
          </div>
          <div className="px-space-3 flex flex-wrap gap-space-3">
            {propertyTypes.map((type) => (
              <Chips
                key={type}
                text={type}
                isSelected={selectedPropertyType === type}
                onClick={() => setSelectedPropertyType(type)}
              />
            ))}
          </div>
          
        </div>

        {/* Budget */}
        <div className="mt-space-6">
          <div className="mb-space-3 flex items-center gap-space-1 text-placeholder">
            <i className={`fi fi-ss-dollar text-[12px] flex items-center justify-center`}></i>
            <p className="font-primary font-semibold text-lg">Budget</p>
          </div>
          <div className="px-space-3 flex flex-wrap gap-space-3">
            {propertyBudgets.map((budget) => (
              <Chips
                key={budget}
                text={budget}
                isSelected={selectedBudget === budget}
                onClick={() => setSelectedBudget(budget)}
              />
            ))}
          </div>
          
        </div>

      </div>
      <Button text={"Search"} type="submit" property="secondary" className="w-full" />
    </form>
  );
};

export default FindFrom;
