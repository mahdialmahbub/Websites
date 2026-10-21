"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const ProjectGallery = ({ images = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const isOpen = selectedIndex !== null;

  const closeLightbox = useCallback(() => setSelectedIndex(null), []);

  const showPrev = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const showNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // Keyboard navigation + body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeLightbox, showPrev, showNext]);

  return (
    <>
      {/* Grid gallery */}
      {/* Bento Grid Gallery */}
      <div
        className="
    grid grid-cols-2 gap-space-7
    auto-rows-40
    sm:auto-rows-50
    md:grid-cols-3 md:auto-rows-55
    xl:auto-rows-65
  "
      >
        {images.map((item, i) => (
          <button
            key={`${item.src}-${i}`}
            type="button"
            onClick={() => setSelectedIndex(i)}
            className={`
        relative group overflow-hidden rounded-2xl cursor-pointer
        ${i === 0 && images.length > 2 ? "col-span-2 md:row-span-2" : ""}
      `}
            aria-label={`View image: ${item.alt}`}
          >
            <Image
              alt={item.alt}
              src={item.src}
              fill
              sizes={
                i === 0
                  ? "(min-width: 768px) 66vw, 100vw"
                  : "(min-width: 768px) 33vw, 50vw"
              }
              className="
          object-cover transition-transform duration-300
          ease-in-out group-hover:scale-105
        "
            />

            <div
              className="
          absolute inset-0 flex items-center justify-center
          bg-black/0 transition-colors duration-300
          group-hover:bg-black/30
        "
            >
              <i
                aria-hidden="true"
                className="
            fi fi-rr-expand text-white text-size-xl
            opacity-0 transition-opacity duration-300
            group-hover:opacity-100
          "
              />
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white text-[28px] hover:text-secondary-300 transition-colors duration-200 cursor-pointer"
            aria-label="Close"
          >
            <i className="fi fi-rr-cross"></i>
          </button>

          {/* Prev button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            className="absolute left-4 md:left-8 text-white text-size-2xl hover:text-secondary-300 transition-colors duration-200 cursor-pointer"
            aria-label="Previous image"
          >
            <i className="fi fi-rr-angle-left"></i>
          </button>

          {/* Image */}
          <div
            className="relative w-[90vw] h-[80vh] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              alt={images[selectedIndex].alt}
              src={images[selectedIndex].src}
              fill
              className="object-contain rounded-xl"
            />
          </div>

          {/* Next button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            className="absolute right-4 md:right-8 text-white text-size-2xl hover:text-secondary-300 transition-colors duration-200 cursor-pointer"
            aria-label="Next image"
          >
            <i className="fi fi-rr-angle-right"></i>
          </button>

          {/* Counter */}
          <div className="absolute bottom-6 text-white/70 text-size-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectGallery;
