"use client";

import Image from "next/image";
import { Popup } from "react-leaflet";
import FormattedNumber from "./FormattedNumber";

/**
 * Compact version of PropertyCard, made for a Leaflet marker popup.
 *
 * Usage (inside <Marker>):
 *
 *   <PropertyPopup
 *     property={property}
 *     onMore={(p) => router.push(`/properties/${p.id}`)}
 *   />
 *
 * - <div>/<span> are used instead of <p> on purpose: Leaflet's CSS sets
 *   `.leaflet-popup-content p { margin: 1em 0 }`, which beats Tailwind margins.
 * - The `[&_.leaflet-popup-...]` classes strip Leaflet's default white box,
 *   padding and radius so the card's own border/background shows cleanly.
 */
export default function PropertyPopup({ property, onMore, showScore = false }) {
  if (!property) return null;

  return (
    <Popup
      closeButton={false}
      className="
      "
    >
      <div className="group w-64 overflow-hidden border-2 border-primary-3/50 bg-background shadow-lg">
        {/* Image */}
        <div className="relative h-28 w-full overflow-hidden">
          <Image
            src={property.image}
            alt={property.name}
            fill
            sizes="256px"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />

          {/* Chips — top left */}
          {property.badges?.length > 0 && (
            <div className="absolute left-2 top-2 flex items-center gap-1.5">
              {property.badges.map((badge, i) => (
                <div
                  key={badge.tag ?? i}
                  title={badge.tag}
                  className="flex items-center justify-center bg-primary-9/70 px-2 py-1.5 text-primary-1 shadow-[inset_1px_1px_6px_rgba(255,255,255,0.10),inset_-1px_-1px_6px_rgba(0,0,0,0.25)] backdrop-blur"
                >
                  <i
                    className={`${badge.icon} flex items-center justify-center text-[10px] text-primary-1`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-3">
          {/* Title + location (+ optional score) */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="truncate text-[14px] font-bold leading-tight text-gray-900">
                {property.name}
              </div>
              <div className="mt-0.5 truncate text-xs text-gray-400">
                {property.location}
              </div>
            </div>

            {showScore && property.overallScore != null && (
              <div className="flex shrink-0 flex-col items-center gap-1">
                <div className="flex items-end gap-0.5">
                  <span className="text-sm font-semibold">
                    {property.overallScore}
                  </span>
                  <span className="text-[7px] font-semibold">/100</span>
                </div>
                <div className="h-1.5 w-12 bg-[#8B5CF6]/20">
                  <div
                    className="h-full bg-[#8B5CF6]"
                    style={{
                      width: `${Math.min(100, Math.max(0, property.overallScore))}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="my-2 h-px bg-gray-100" />

          {/* Stats */}
          <div className="flex items-center justify-between text-[11px] text-gray-500">
            <span className="flex items-center gap-1">
              <i className="fi fi-rs-bed-alt flex items-center justify-center text-[13px] text-placeholder" />
              {property.beds} Bed
            </span>

            <span className="text-gray-200">|</span>

            <span className="flex items-center gap-1">
              <i className="fi fi-rs-bath flex items-center justify-center text-[13px] text-placeholder" />
              {property.baths} Bath
            </span>

            <span className="text-gray-200">|</span>

            <span className="flex items-center gap-1">
              <i className="fi fi-rs-ruler-combined flex items-center justify-center text-[13px] text-placeholder" />
              {property.sqft} Sqft
            </span>
          </div>

          <div className="my-2 h-px bg-gray-100" />

          {/* Price + More */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary-6">
              <FormattedNumber number={property.price} currency="USD" />
            </span>

            <button
              type="button"
              onClick={() => onMore?.(property)}
              className="group/more inline-flex items-center gap-0.5 text-primary-6 transition-colors duration-200 font-bold font-primary text-[12px] text-nowrap hover:underline underline-offset-2 cursor-pointer"
            >
              Details
              <i class="fi fi-ss-arrow-small-right text-[16px]"></i>
            </button>
          </div>
        </div>
      </div>
    </Popup>
  );
}
