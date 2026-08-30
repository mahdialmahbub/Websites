"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const banners = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1800&q=85",
    badge: "LIMITED TIME OFFER",
    title: "Power Up Your Workspace",
    description:
      "Upgrade your everyday setup with powerful laptops built for work, creativity, and performance.",
    buttonText: "Shop Laptops",
    buttonLink: "/products?category=laptops",
  },

  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1800&q=85",
    badge: "NEW ARRIVALS",
    title: "Meet Your Next Smartphone",
    description:
      "Discover the latest smartphones with smarter performance, stunning displays, and premium design.",
    buttonText: "Explore Phones",
    buttonLink: "/products?category=mobile",
  },

  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1800&q=85",
    badge: "CAPTURE MORE",
    title: "Create Without Limits",
    description:
      "Take your photography to the next level with cameras designed to capture every important moment.",
    buttonText: "Explore Cameras",
    buttonLink: "/products?category=cameras",
  },

  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1800&q=85",
    badge: "PREMIUM AUDIO",
    title: "Hear Every Detail",
    description:
      "Experience richer sound and immersive listening with our latest premium audio collection.",
    buttonText: "Shop Audio",
    buttonLink: "/products?category=audio",
  },

  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&w=1800&q=85",
    badge: "LEVEL UP",
    title: "Build Your Ultimate Setup",
    description:
      "Upgrade your gaming experience with high-performance gear made for serious players.",
    buttonText: "Shop Gaming",
    buttonLink: "/products?category=gaming",
  },
];

export default function MarketingCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full">
      {/* =========================
          CAROUSEL
      ========================== */}
      <div className="relative w-full overflow-hidden rounded-[24px]">
        <div className="relative aspect-[2/1] w-full sm:aspect-[3/1] lg:aspect-[3.8/1]">
          {banners.map((banner, index) => {
            const isActive = index === activeIndex;

            return (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  isActive
                    ? "opacity-100"
                    : "pointer-events-none opacity-0"
                }`}
              >
                {/* Image */}
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 1400px"
                  className="object-cover"
                />

                {/* =================================
                    LEFT BLACK GRADIENT OVERLAY
                ================================== */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-transparent" />

                {/* Extra subtle overall overlay */}
                <div className="absolute inset-0 bg-black/10" />

                {/* =================================
                    MARKETING CONTENT
                ================================== */}
                <div className="absolute inset-y-0 left-0 flex w-full items-center">
                  <div className="w-full max-w-[680px] px-6 sm:px-8 md:px-10 lg:px-14 xl:px-16">
                    
                    {/* Badge */}
                    <span
                      className={`mb-3 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[9px] font-semibold tracking-[0.18em] text-white backdrop-blur-sm transition-all duration-700 sm:mb-4 sm:px-4 sm:py-1.5 sm:text-[10px] ${
                        isActive
                          ? "translate-y-0 opacity-100"
                          : "translate-y-3 opacity-0"
                      }`}
                    >
                      {banner.badge}
                    </span>

                    {/* Heading */}
                    <h2
                      className={`max-w-155 font-bold leading-[1.05] tracking-[-0.03em] text-white transition-all duration-700 text-[48px] text-nowrap ${
                        isActive
                          ? "translate-y-0 opacity-100"
                          : "translate-y-5 opacity-0"
                      }`}
                    >
                      {banner.title}
                    </h2>

                    {/* Description */}
                    <p
                      className={`mt-3 max-w-[460px] text-[11px] leading-[1.6] text-white/75 transition-all delay-100 duration-700 sm:mt-4 sm:text-xs md:text-sm lg:text-[15px] ${
                        isActive
                          ? "translate-y-0 opacity-100"
                          : "translate-y-5 opacity-0"
                      }`}
                    >
                      {banner.description}
                    </p>

                    {/* CTA */}
                    <div
                      className={`mt-5 transition-all delay-200 duration-700 sm:mt-6 ${
                        isActive
                          ? "translate-y-0 opacity-100"
                          : "translate-y-5 opacity-0"
                      }`}
                    >
                      <Link
                        href={banner.buttonLink}
                        className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-xs font-semibold text-slate-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-300 sm:px-5 sm:py-3 sm:text-sm"
                      >
                        {banner.buttonText}

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="h-4 w-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 10a.75.75 0 0 1 .75-.75h10.69l-3.22-3.22a.75.75 0 1 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H3.75A.75.75 0 0 1 3 10Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================
          DOT NAVIGATION
      ========================== */}
      <div className="mt-5 flex items-center justify-center gap-2">
        {banners.map((banner, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={banner.id}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={isActive}
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                isActive
                  ? "w-8 bg-cyan-400"
                  : "w-2 bg-slate-600 hover:bg-slate-400"
              }`}
            />
          );
        })}
      </div>
    </section>
  );
}