"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "./Button";
import FormattedNumber from "./FormattedNumber";

export default function PropertyCard({
  property,
  isSelected,
  onSelect,
  isProgress = false,
}) {
  const [hoveredBadge, setHoveredBadge] = useState(null);

  return (
    <div
      className={`bg-background border overflow-hidden min-w-95 group ${
        isSelected
          ? "border-primary-5 border-4"
          : "transition-all duration-200 border-4 border-primary-3/50"
      }`}
      onClick={onSelect ? () => onSelect(property.id) : undefined}
    >
      {/* Image Section */}
      <div className="relative w-full h-52 overflow-hidden">
        <Image
          src={property.image}
          alt={property.name}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Chips — top left */}
        {property.badges && (
          <div className="absolute top-3 left-3 flex items-center gap-2">
            {property.badges.map((badge, i) => (
              <div
                key={badge.tag ?? i}
                onMouseEnter={() => setHoveredBadge(badge)}
                onMouseLeave={() => setHoveredBadge(null)}
                className="flex items-center justify-center gap-space-1 bg-primary-9/70 px-space-3 py-space-2 font-medium text-primary-1 backdrop-blur shadow-[inset_1px_1px_6px_rgba(255,255,255,0.10),inset_-1px_-1px_6px_rgba(0,0,0,0.25)] cursor-pointer"
              >
                <i
                  className={`${badge.icon} flex items-center justify-center text-[12px] text-primary-1`}
                ></i>
              </div>
            ))}

            {/* Tooltip - joto gulai badge thakuk, sob shesh e right side e boshbe */}
            <div
              className={`absolute left-full top-1/2 -translate-y-1/2 ml-2 transition-all duration-150 pointer-events-none z-10 ${
                hoveredBadge ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              <div className="relative bg-slate-900 text-white text-xs font-medium px-2.5 py-1 rounded-md whitespace-nowrap">
                {hoveredBadge?.tag}
                <div className="absolute right-full top-1/2 -translate-y-1/2 -mr-1 w-2 h-2 bg-slate-900 rotate-45"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Title, Location & Progress */}
        <div className="flex items-center justify-between">
          <div className="">
            <h2 className="text-[17px] font-bold text-gray-900 leading-tight">
              {property.name}
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">{property.location}</p>
          </div>
          {isProgress && (
            <div className="flex flex-col gap-space-2 items-center">
              <div className="flex items-end gap-0.5">
                <p className="font-semibold text-md">{property.overallScore}</p>
                <p className="font-semibold text-[8px]">/100</p>
              </div>
              <div className="w-17 h-2 bg-[#8B5CF6]/20">
                <div
                  className="h-full bg-[#8B5CF6]"
                  style={{
                    width: `${Math.min(100, Math.max(0, property.overallScore))}%`,
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>
        {/* Divider */}
        <hr className="my-3 border-gray-100" />

        {/* Stats */}
        <div className="flex items-center justify-between text-gray-500 text-sm">
          {/* Bed */}
          <span className="flex items-center gap-1.5 px-space-3">
            <i className="fi fi-rs-bed-alt flex items-center justify-center text-[18px] text-placeholder"></i>
            {property.beds} Bed
          </span>

          <span className="text-gray-200">|</span>

          {/* Bath */}
          <span className="flex items-center gap-1.5 px-space-3">
            <i className="fi fi-rs-bath flex items-center justify-center text-[18px] text-placeholder"></i>
            {property.baths} Bath
          </span>

          <span className="text-gray-200">|</span>

          {/* Sqft */}
          <span className="flex items-center gap-1.5 px-space-3">
            <i className="fi fi-rs-ruler-combined flex items-center justify-center text-[18px] text-placeholder"></i>
            {property.sqft} Sqft
          </span>
        </div>

        {/* Divider */}
        <hr className="my-3 border-gray-100" />

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-extrabold text-emerald-600">
            <FormattedNumber number={property.price} currency="USD" />
          </span>
          <Button text={"View Details"} />
        </div>
      </div>
    </div>
  );
}
