"use client";

import Image from "next/image";
import Button from "./Button";
import FormattedNumber from "./FormattedNumber";

export default function PropertyCard({
  property,
  isSelected,
  onSelect,
  isProgress = false,
}) {
  return (
    <div
      className={`bg-background border shadow-md overflow-hidden min-w-95 group ${
        isSelected
          ? "border-primary-5 border-4"
          : "transition-all duration-200 border-4 border-transparent"
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
          <div className="absolute top-3 left-3 flex gap-2">
            {property.badges?.map((badge, i) => (
              <div
                key={badge.tag ?? i}
                className="flex items-center justify-center gap-space-1 bg-primary-9/70 px-space-3 py-space-2 font-medium text-primary-1 backdrop-blur shadow-[inset_1px_1px_6px_rgba(255,255,255,0.10),inset_-1px_-1px_6px_rgba(0,0,0,0.25)]"
              >
                <i
                  className={`${badge.icon} flex items-center justify-center text-[12px] text-primary-1`}
                ></i>
              </div>
            ))}
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
