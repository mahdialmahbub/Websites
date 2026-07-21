// components/PropertyExplorer.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import { properties as allProperties } from "../../assets/assets";
import PropertyScoreChart from "./PropertyScoreChart";
import PropertyCard from "../PropertyCard";

// props.properties না দিলে ডিফল্টভাবে পুরো লিস্ট দেখাবে (আগের মতোই কাজ করবে)
export default function PropertyExplorer({ properties = allProperties }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardRefs = useRef([]);

  const total = properties.length;
  const selectedProperty = properties[currentIndex] ?? null;

  // বাইরে থেকে নতুন (filtered) property list এলে index রিসেট করে দাও,
  // নাহলে পুরনো index দিয়ে ভুল কার্ড সিলেক্টেড দেখাবে
  useEffect(() => {
    cardRefs.current = [];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentIndex(0);
  }, [properties]);

  // নির্দিষ্ট index-এ যাওয়া + সেই কার্ডটাকে ভিউতে স্ক্রল করা
  const goTo = (index) => {
    const clamped = Math.max(0, Math.min(total - 1, index));
    setCurrentIndex(clamped);
    cardRefs.current[clamped]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  const goPrev = () => goTo(currentIndex - 1);
  const goNext = () => goTo(currentIndex + 1);

  // কার্ডে সরাসরি ক্লিক করলেও সিলেকশন সিঙ্ক থাকবে
  const handleSelect = (id) => {
    const index = properties.findIndex((p) => p.id === id);
    if (index !== -1) goTo(index);
  };

  if (total === 0) {
    return (
      <div className="mt-space-7">
        <div className="p-10 text-center text-placeholder font-medium">
          No property match in your search.{" "}
          <span className=" cursor-pointer text-background hover:text-primary-5 ">
            Search Again
          </span>
        </div>
      </div>
    );
  } else {
    return (
      <div className=" mt-space-7">
        <div className="mx-auto flex flex-col gap-6 lg:flex-row">
          {/* বামে: সিলেক্টেড কার্ডের স্কোর চার্ট */}
          <div className="flex justify-center lg:justify-start w-100">
            <PropertyScoreChart property={selectedProperty} />
          </div>

          {/* ডানে: কার্ড রো + নিচে arrow/counter */}
          <div className="flex flex-1 flex-col gap-3 overflow-hidden">
            <div className="flex gap-4 overflow-x-auto pb-2 scroll-smooth scrollbar-hide overflow-hidden relative">
              {properties.map((property, index) => (
                <div
                  key={property.id}
                  ref={(el) => (cardRefs.current[index] = el)}
                >
                  <PropertyCard
                    property={property}
                    isSelected={index === currentIndex}
                    onSelect={handleSelect}
                  />
                </div>
              ))}
            </div>

            {/* নিচে ডানদিকে: prev arrow, current/total, next arrow */}
            <div className="flex items-center justify-end gap-3 pr-1">
              <button
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="text-primary-1 transition hover:text-primary-5 disabled:opacity-30 disabled:hover:text-placeholder"
                aria-label="Previous property"
              >
                <i className="fi fi-rr-arrow-small-left flex items-center justify-center text-[32px]"></i>{" "}
              </button>

              <span className="">
                <span className="font-semibold text-md text-[#2F8CFF]">
                  {String(currentIndex + 1).padStart(2, "0")}
                </span>
                <span className="text-placeholder font-semibold text-[10px]">
                  {" "}
                  / {String(total).padStart(2, "0")}
                </span>
              </span>

              <button
                onClick={goNext}
                disabled={currentIndex === total - 1}
                className="text-primary-1 transition hover:text-primary-5 disabled:opacity-30 disabled:hover:text-placeholder"
                aria-label="Next property"
              >
                <i className="fi fi-rr-arrow-small-right flex items-center justify-center text-[32px]"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
