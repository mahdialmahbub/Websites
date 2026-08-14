"use client";

import React, { useMemo } from "react";

// Ekhane apnar category list gulo change/add/remove korte parben
const CATEGORIES = [
  "Mobile",
  "Computer",
  "Tablets",
  "Headphones",
  "Speakers",
  "Microphones",
  "DSLR Cameras",
  "Action Cameras",
  "Gimbals",
  "Routers",
  "Laptops",
];

function InfiniteCategoryScroll({
  items = CATEGORIES,
  speed = 35, // second — jotoi kom, totoi fast scroll
  direction = "left", // "left" ba "right"
  pauseOnHover = true,
}) {
  // Seamless loop-er jonno list ta duibar render kora hocche
  const loopItems = useMemo(() => [...items, ...items], [items]);

  return (
    <div className="marquee-wrapper">
      <div className="marquee-fade marquee-fade--left" />
      <div className="marquee-fade marquee-fade--right" />

      <div
        className={`marquee-track ${
          pauseOnHover ? "marquee-track--paused-on-hover" : ""
        }`}
        style={{
          "--marquee-duration": `${speed}s`,
          "--marquee-direction": direction === "right" ? "reverse" : "normal",
        }}
      >
        {loopItems.map((item, idx) => (
          <span key={`${item}-${idx}`} className="marquee-item">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

const InfinityScroll = () => {
  return (
    <div>
      <InfiniteCategoryScroll />
    </div>
  );
};

export default InfinityScroll;
