"use client"

import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import SectionHeader from "../SectionHeader";
import FindFrom from "./FindFrom";
import Image from "next/image";
import { assets, properties as allProperties } from "@/app/assets/assets";
import PropertyExplorer from "./PropertyExplorer";
import { filterProperties } from "./filterProperties";


const FindProperty = () => {

    const [filteredProperties, setFilteredProperties] = useState(allProperties);
  const resultsRef = useRef(null);

  const handleSearch = (filters) => {
    const results = filterProperties(allProperties, filters);
    setFilteredProperties(results);

    if (results.length === 0) {
      toast.error("Property not found. Search Again");
      return; // কিছু না মিললে স্ক্রল করার দরকার নেই
    }

    // ম্যাচ পাওয়া গেলে একটু নিচে স্কোর-চার্ট + প্রপার্টি সেকশনে স্ক্রল করা
    resultsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };


  return (
    <section className="p-space-9 bg-foreground overflow-hidden ">
      <div className="">
        <SectionHeader mainText={"Match"} text={"Find your perfect"} isDark />

        {/* content */}
        <div className="mt-space-7">
          {/* form and map */}
          <div className="flex gap-space-7">
            <FindFrom onSearch={handleSearch} />
            <Image
              src={assets.Map}
              alt="Map"
              className="w-full h-full object-cover"
            />
          </div>
          <div ref={resultsRef}>
          <PropertyExplorer properties={filteredProperties} /></div>
        </div>
      </div>
    </section>
  );
};

export default FindProperty;
