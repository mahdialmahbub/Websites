"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import Image from "next/image";

// Demo data — shape matches the `images` array from projectsData.js
// ({ src, alt }). Swap this for projectsData[0].images in real use.
const DEMO_IMAGES = [
  {
    src: "https://picsum.photos/seed/landingui/900/620",
    alt: "UI Kit Landing Page",
  },
  {
    src: "https://picsum.photos/seed/metaversepromo/900/620",
    alt: "Metaverse promo video preview",
  },
  {
    src: "https://picsum.photos/seed/wireframegrid/900/620",
    alt: "Wireframe grid layout",
  },
  {
    src: "https://picsum.photos/seed/appuikit/900/620",
    alt: "Purple app UI kit",
  },
  {
    src: "https://picsum.photos/seed/appuikit/900/620",
    alt: "Purple app UI kit",
  },
  {
    src: "https://picsum.photos/seed/appuikit/900/620",
    alt: "Purple app UI kit",
  },
];

const THUMB_SLOT = 124; // 112px thumb (w-28) + 12px gap (gap-3)

export default function ProjectImageGallery({ images = DEMO_IMAGES }) {
  const [selected, setSelected] = useState(0);
  const trackRef = useRef(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  const active = images[selected] ?? images[0];

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setEdges({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [updateEdges, images]);

  const scrollBy = (dir) => {
    trackRef.current?.scrollBy({
      left: dir * THUMB_SLOT * 2,
      behavior: "smooth",
    });
  };

  const select = (i) => {
    setSelected(i);
    const el = trackRef.current;
    if (!el) return;
    const target = i * THUMB_SLOT;
    if (
      target < el.scrollLeft ||
      target + 112 > el.scrollLeft + el.clientWidth
    ) {
      el.scrollTo({
        left: target - el.clientWidth / 2 + 56,
        behavior: "smooth",
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight")
      select(Math.min(selected + 1, images.length - 1));
    if (e.key === "ArrowLeft") select(Math.max(selected - 1, 0));
  };

  return (
    <div className="w-100 mx-auto">
      <style>{`
        @keyframes previewFade {
          from { opacity: 0; transform: scale(1.015); }
          to { opacity: 1; transform: scale(1); }
        }
        .preview-fade { animation: previewFade 350ms ease-out; }
        @media (prefers-reduced-motion: reduce) {
          .preview-fade { animation: none; }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>

      <div className="">
        {/* Main preview */}
        <div className="relative rounded-lg overflow-hidden aspect-video bg-violet-100">
          <Image
            key={selected}
            src={active?.src}
            alt={active?.alt}
            width={900}
            height={620}
            className="preview-fade w-full h-full object-cover"
            priority={selected[0]}
          />
          <div className="absolute" />

          <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-secondary-50/90 backdrop-blur px-3 py-1 text-xs font-semibold tracking-wide text-secondary-800 shadow-[0px_0px_5px_rgba(34,211,238,0.5)]">
            {String(selected + 1).padStart(2, "0")} /{" "}
            {String(images.length).padStart(2, "0")}
          </span>
        </div>

        {/* Thumbnail rail */}
        <div className="relative mt-space-3">
          {edges.left && (
            <div className="pointer-events-none absolute left-0 top-0 bottom-3 w-10 bg-linear-to-r from-secondary-50 dark:from-background to-transparent z-10" />
          )}
          {edges.right && (
            <div className="pointer-events-none absolute right-0 top-0 bottom-3 w-10 bg-linear-to-l from-secondary-50 dark:from-background to-transparent z-10" />
          )}

          {edges.left && (
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Scroll thumbnails left"
              className="hidden sm:flex items-center justify-center absolute -left-3 top-9 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-white border border-violet-200 shadow text-violet-700 hover:bg-violet-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          {edges.right && (
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Scroll thumbnails right"
              className="hidden sm:flex items-center justify-center absolute -right-3 top-9 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-white border border-violet-200 shadow text-violet-700 hover:bg-violet-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}

          <div
            ref={trackRef}
            onScroll={updateEdges}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="listbox"
            aria-label="Project image thumbnails"
            className="relative flex gap-3 overflow-x-auto scrollbar-hide pb-3 pt-1 px-1 scroll-smooth focus:outline-none"
          >
            {/* sliding indicator, scrolls together with the thumbnails */}
            <div
              className="absolute bottom-0 h-0.75 w-28 rounded-full bg-linear-to-r from-primary-500 to-secondary-500 transition-transform duration-300 ease-out"
              style={{ transform: `translateX(${selected * THUMB_SLOT}px)` }}
            />

            {images.map((img, i) => {
              const isSelected = i === selected;
              return (
                <button
                  key={img.src + i}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => select(i)}
                  className={[
                    "relative shrink-0 w-28 aspect-video rounded-sm overflow-hidden transition-all duration-200",
                    isSelected
                      ? "border-secondary-600 ring-2 ring-secondary-300/50"
                      : "opacity-80 hover:opacity-100 ring-2 ring-transparent hover:ring-secondary-200",
                  ].join(" ")}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={900}
                    height={620}
                    className="w-full h-full object-cover transition-all duration-200"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-linear-to-t from-secondary-700/70 via-secondary-600/20 to-transparent flex items-end justify-center pb-1.5">
                      <Eye className="h-3.5 w-3.5 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
