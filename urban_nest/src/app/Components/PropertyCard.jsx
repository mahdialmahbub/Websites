import Image from "next/image";
import { assets } from "../assets/assets";


export default function PropertyCard({
  image = assets.Aiassistent,
  propertyName,
  location = "Location",
  price = 160000,
  beds = 2,
  baths = 2,
  sqft = 1400,
  showAIRecommended = false,
  showBestChoice = false,
  onViewDetails,
}) {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <div className="bg-white shadow-md overflow-hidden w-[426px] h-[450px]">
      {/* Image Section */}
      <div className="relative w-full h-52">
        <Image
          src= {assets.Aiassistent}
          alt={propertyName}
          fill
          className="object-cover h-full w-full"
        />

        {/* Chips — top left */}
        <div className="absolute top-3 left-3 flex gap-2">
          {showAIRecommended && (
            <span className="flex items-center gap-1 bg-slate-800/80 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
              {/* Sparkle icon */}
              <svg
                className="w-3 h-3"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
              </svg>
              AI Recommended
            </span>
          )}

          {showBestChoice && (
            <span className="flex items-center gap-1 bg-slate-800/80 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
              {/* Trophy icon */}
              <svg
                className="w-3 h-3"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M19 3H5v2c0 3.87 3.13 7 7 7s7-3.13 7-7V3zm-7 15c-1.66 0-3 1.34-3 3h6c0-1.66-1.34-3-3-3zm-4 0v-2h8v2H8z" />
              </svg>
              Best Choice
            </span>
          )}
        </div>

        {/* Favourite heart — top right */}
        <button
          aria-label="Save to favourites"
          className="absolute top-3 right-3 bg-white/90 p-1.5 shadow hover:scale-110 transition-transform"
        >
          <svg
            className="w-4 h-4 text-rose-500"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Title & Location */}
        <h2 className="text-[17px] font-bold text-gray-900 leading-tight">
          {propertyName}
        </h2>
        <p className="text-sm text-gray-400 mt-0.5">{location}</p>

        {/* Divider */}
        <hr className="my-3 border-gray-100" />

        {/* Stats */}
        <div className="flex items-center justify-between text-gray-500 text-sm">
          {/* Bed */}
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M3 12V8a1 1 0 011-1h16a1 1 0 011 1v4" />
              <path d="M2 19v-7h20v7" />
              <path d="M2 19h20" />
              <rect x="6" y="11" width="4" height="3" rx="1" />
              <rect x="14" y="11" width="4" height="3" rx="1" />
            </svg>
            {beds} Bed
          </span>

          <span className="text-gray-200">|</span>

          {/* Bath */}
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M4 12h16v4a4 4 0 01-4 4H8a4 4 0 01-4-4v-4z" />
              <path d="M6 12V7a2 2 0 012-2h1" />
              <circle cx="9" cy="4.5" r=".5" fill="currentColor" />
            </svg>
            {baths} Bath
          </span>

          <span className="text-gray-200">|</span>

          {/* Sqft */}
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 3v18" />
            </svg>
            {sqft.toLocaleString()} Sqft
          </span>
        </div>

        {/* Divider */}
        <hr className="my-3 border-gray-100" />

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-extrabold text-emerald-600">
            {formattedPrice}
          </span>
          <button
            onClick={onViewDetails}
            className="bg-teal-700 hover:bg-teal-800 active:scale-95 text-white text-sm font-semibold px-4 py-2 transition-all duration-150"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
