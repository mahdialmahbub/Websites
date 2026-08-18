"use client";

import React, { useEffect, useState } from "react";
import Button from "../Button";
import Input from "../Input";
import Chips from "../Chips";
import { propertyBudgets, propertyTypes } from "@/app/assets/assets";

// onSearch: (filters: { location, propertyType, budget }) => void
// onLocate: (coords: { lat, lng }) => void — location button click korle call hobe
const FindForm = ({ onSearch, onLocate }) => {
  const [location, setLocation] = useState("");
  const [selectedPropertyType, setSelectedPropertyType] = useState("Apartment");
  const [selectedBudget, setSelectedBudget] = useState("Under $100K");
  const [locating, setLocating] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const filters = {
      location,
      propertyType: selectedPropertyType,
      budget: selectedBudget,
    };

    onSearch?.(filters);
  };

  // browser-er geolocation API diye current position ber kora
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Apnar browser-e geolocation support nei");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocate?.({ lat: latitude, lng: longitude });
        setLocating(false);
      },
      (error) => {
        console.error(error);
        alert("Location access deoya hoyni, ba location pawa jayni");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-space-5 bg-background findForm max-w-[480px]"
    >
      <div className="mb-space-7">
        <div className="flex items-end gap-space-3">
          <Input
            label={"Location"}
            placeholder={"Search your location "}
            type={"location"}
            icon="fi fi-rs-marker"
            className="w-full mr-3"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={locating}
            aria-label="Use my current location"
            className="flex items-center justify-center p-space-2 bg-primary-1 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <div
              className={`size-[24px] rounded-full bg-[#6393F2]/30 flex items-center justify-center ${locating ? "animate-pulse" : ""}`}
            >
              <div className="size-2.5 rounded-full bg-[#6393F2] ring-2 ring-white"></div>
            </div>
          </button>
        </div>

        {/* Property Type */}
        <div className="mt-space-6">
          <div className="mb-space-3 flex items-center gap-1.5 text-placeholder">
            <i
              className={`fi fi-rs-apartment text-[12px] flex items-center justify-center`}
            ></i>
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
          <div className="mb-space-3 flex items-center gap-1.5 text-placeholder">
            <i
              className={`fi fi-ss-dollar text-[12px] flex items-center justify-center`}
            ></i>
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
      <Button
        text={"Search"}
        type="submit"
        property="secondary"
        className="w-full"
      />
    </form>
  );
};

export default FindForm;
