"use client";

import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import SectionHeader from "../SectionHeader";
import FindFrom from "./FindFrom";
import { properties as allProperties } from "@/app/assets/assets";
import PropertyExplorer from "./PropertyExplorer";
import { filterProperties } from "./filterProperties";
import FindForm from "./FindFrom";
import FadeLeft from "../motions/FadeLeft";
import FadeUp from "../motions/FadeUp";
import FadeRight from "../motions/FadeRight";

// Leaflet window/document ইউজ করে, তাই SSR বন্ধ রেখে dynamic import করতে হবে
const PropertyMap = dynamic(() => import("./PropertyMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-100 text-slate-400">
      ম্যাপ লোড হচ্ছে...
    </div>
  ),
});

const FindProperty = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [filteredProperties, setFilteredProperties] = useState(allProperties);
  const [selectedId, setSelectedId] = useState(allProperties[0]?.id ?? null);
  const resultsRef = useRef(null);

  const handleSearch = (filters) => {
    const results = filterProperties(allProperties, filters);
    setFilteredProperties(results);
    setSelectedId(results[0]?.id ?? null);

    if (results.length === 0) {
      toast.error("Property not found. Search Again");
      return; // কিছু না মিললে স্ক্রল করার দরকার নেই
    }

    // ম্যাচ পাওয়া গেলে একটু নিচে স্কোর-চার্ট + প্রপার্টি সেকশনে স্ক্রল করা
    window.lenis?.scrollTo(resultsRef.current, {
      offset: -100, // scroll-mt-[100px]-এর মতো navbar-এর জন্য gap
    });
  };

  return (
    <section className="p-space-9 bg-foreground overflow-hidden relative">
      <i className="fi fi-rs-house-chimney text-[350px] absolute top-0 right-0 text-primary-3/10"></i>
      <div className="max-w-360 container mx-auto"> 
        <SectionHeader
          mainText={"Match"}
          text={"Find your perfect"}
          isDark
          className={"sectionTitle"}
        />

        {/* content */}
        <div className="mt-space-7">
          {/* form and map */}
          <div className="flex gap-space-7">
            <FadeLeft>
              <FindForm onSearch={handleSearch} onLocate={setUserLocation} />
            </FadeLeft>
            {/* w-full/h-full এর বদলে flex-1 + নির্দিষ্ট পিক্সেল height —
                Leaflet-কে 0x0 container-এ mount হতে দেওয়া যাবে না */}

            <div className="flex-1 relative z-10 *:h-full">
              <FadeRight className="*:h-full">
                <PropertyMap
                  properties={filteredProperties}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  flyToLocation={userLocation}
                />
              </FadeRight>
            </div>
          </div>

          {/* scroll-mt-* = sticky navbar-er height jotota, tar smoi scrollIntoView
              korle content ta navbar-er niche na giye thik gap rekhe dekhabe.
              Tomar actual navbar height onujayi value ta adjust koro
              (e.g. navbar 88px hole scroll-mt-[88px]) */}
          <FadeUp>
            <div ref={resultsRef} className="scroll-mt-25">
              <PropertyExplorer
                properties={filteredProperties}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
};

export default FindProperty;
