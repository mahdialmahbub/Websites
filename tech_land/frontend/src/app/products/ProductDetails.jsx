"use client";

import React, { useState, useMemo } from "react";
import { notFound, useParams } from "next/navigation";
import { assets, products } from "@/app/assets/assets";
import Image from "next/image";
import StarRating from "@/app/components/StarRating";
import CounterField from "@/app/components/CounterField";
import Button from "@/app/components/Button";
import Chips from "@/app/components/Chips";
import { ProductCard } from "@/app/components/ProductCard";
import Tag from "../components/Tag";
import ReviewCard from "../components/ReviewCard";

const money = (n) => (typeof n === "number" ? `$ ${n.toFixed(2)}` : n);

const ProductDetails = ({ product, relatedProducts, isAdmin= false }) => {
  const {
    title,
    tags,
    rating,
    reviewCount,
    soldCount,
    description,
    images,
    colors,
    ramOptions,
    storageOptions,
    processorOptions,
    price,
    originalPrice,
    discountNote,
    cancelNote,
    specifications,
    guarantees,
    reviews,
  } = product;

  /* ---------------- gallery ---------------- */
  const [activeImage, setActiveImage] = useState(0);

  /* ---------------- option selection (default: first option) ---------------- */
  const [selectedColor, setSelectedColor] = useState(colors?.[0]?.id);
  const [selectedRam, setSelectedRam] = useState(ramOptions?.[0]?.id);
  const [selectedStorage, setSelectedStorage] = useState(
    storageOptions?.[0]?.id,
  );
  const [selectedProcessor, setSelectedProcessor] = useState(
    processorOptions?.[0]?.id,
  );

  /* ---------------- quantity counter ---------------- */
  const [quantity, setQuantity] = useState(1);

  /* ---------------- review star filter ---------------- */
  const [reviewFilter, setReviewFilter] = useState("All");

  const filteredReviews = useMemo(() => {
    if (!reviews?.items) return [];
    if (reviewFilter === "All") return reviews.items;
    return reviews.items.filter((r) => Math.round(r.rating) === reviewFilter);
  }, [reviews, reviewFilter]);

  /* ---------------- price (base + extras from selected options) ---------------- */
  const extraFromOptions = (options, selectedId) =>
    options?.find((o) => o.id === selectedId)?.extraPrice ?? 0;

  const totalPrice =
    price +
    extraFromOptions(ramOptions, selectedRam) +
    extraFromOptions(storageOptions, selectedStorage) +
    extraFromOptions(processorOptions, selectedProcessor);

  return (
    <div>
      <div className="px-space-11 py-space-7">back Button</div>

      {/* product details */}
      <div className="px-space-11">
        {/* images and other info */}
        <div className="mb-space-10 flex gap-space-7 ">
          {/* images and description */}
          <div className="w-179.25">
            {/* images */}
            <div>
              <div className="flex gap-space-7 h-78.5 w-179.25">
                {/* images */}
                <div className="flex flex-col w-43 h-full gap-3.75">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImage(i)}
                      className={`h-25 overflow-hidden rounded-lg border-2 transition-colors ${
                        activeImage === i
                          ? "border-cyan-400"
                          : "border-white/10"
                      }`}
                    >
                      <Image
                        width={1000}
                        height={1000}
                        src={img}
                        alt={`${title} ${i + 1}`}
                        className="h-full w-full object-cover hover:scale-110 transition-all"
                      />
                    </button>
                  ))}
                </div>

                {/* Active Image */}
                <div className="h-full w-full relative overflow-hidden rounded-lg">
                  <Image
                    width={1000}
                    height={1000}
                    src={images[activeImage]}
                    alt={title}
                    className="h-105 w-full object-cover object-center"
                  />
                  <span className="absolute bottom-3 right-3 rounded-md bg-black/50 px-2 py-1 text-xs text-white backdrop-blur">
                    {String(activeImage + 1).padStart(2, "0")} /{" "}
                    {String(images.length).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>

            {/* description and key spacifications */}
            <div className="mt-space-7">
              <p className="font-medium text-[20px] text-foreground/80 mb-space-8">
                {description}
              </p>

              <div className="">
                <h6 className="font-primary font-semibold text-size-h5 text-placeholder_3 mb-space-6">
                  Specifications & Features :
                </h6>

                {/* key spacifications */}
                <div className="flex flex-col gap-space-5">
                  {specifications.map((spec, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <i className="fi fi-rr-microchip w-[12px] h-[12px]"></i>
                      <p className="font-primary font-medium text-size-h5">
                        {spec}
                      </p>
                    </li>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* title and other info */}
          <div className="flex flex-col gap-space-8 w-full">
            {/* tags, title,rating and total sold */}
            <div className="space-y-space-6">
              <div className="flex items-center gap-space-4 flex-wrap">
                {tags?.map((tag) => (
                  <Tag
                    key={tag}
                    text={tag}
                    isIcon
                    icon={
                      tag.toLowerCase().includes("discount")
                        ? "fi fi-sr-badge-percent"
                        : "fi fi-sr-trophy-star"
                    }
                  />
                ))}
              </div>
              <h1 className="font-medium text-size-h2">{title}</h1>
              <div className="flex items-center gap-2.75">
                <div className="flex items-center gap-space-2">
                  <StarRating rating={rating} size={18} />
                  <p className="font-semibold text-size-large text-placeholder">
                    ({reviewCount} Reviews)
                  </p>
                </div>
                <div className="w-px h-full rounded-full bg-linear-to-b from-placeholder_2/0 via-placeholder_2 to-placeholder_2/0"></div>
                <div className="flex gap-space-1 items-center">
                  <Image
                    alt="fire"
                    src={assets.fire}
                    width={16}
                    height={16}
                    className="w-[16px] h-[16px]"
                  />

                  {soldCount && (
                    <p className="font-semibold text-size-large">
                      {" "}
                      {soldCount} Sold this week{" "}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* requirements sellects */}
            <div className="space-y-space-7">
              {/* Colors */}
              {colors?.length > 0 && (
                <div>
                  <p className="text-size-large uppercase tracking-wide mb-space-4">
                    Colors:
                  </p>
                  <div className="flex gap-6">
                    {colors.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        aria-label={c.id}
                        onClick={() => setSelectedColor(c.id)}
                        style={{ backgroundColor: c.hex }}
                        className={`h-[32px] w-7 rounded-xs outline-2 outline-offset-4 transition-transform cursor-pointer ${
                          selectedColor === c.id
                            ? "scale-110 outline-cyan-400"
                            : "outline-white/20 hover:scale-105"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
              {/* RAM */}
              {ramOptions?.length > 0 && (
                <OptionGroup
                  className={""}
                  label="RAM"
                  options={ramOptions}
                  selected={selectedRam}
                  onSelect={setSelectedRam}
                />
              )}
              {/* Storage */}
              {storageOptions?.length > 0 && (
                <OptionGroup
                  label="Storage"
                  options={storageOptions}
                  selected={selectedStorage}
                  onSelect={setSelectedStorage}
                />
              )}
              {/* Processor */}
              {processorOptions?.length > 0 && (
                <OptionGroup
                  label="Processor"
                  options={processorOptions}
                  selected={selectedProcessor}
                  onSelect={setSelectedProcessor}
                />
              )}
            </div>

            {/* counter and price */}
            <div className="flex items-center justify-between">
              <CounterField
                min={1}
                max={10}
                value={quantity}
                onChange={setQuantity}
              />
              <div className="flex items-end gap-space-3">
                {originalPrice && (
                  <p className="text-size-h6 font-primary font-medium text-placeholder_3">
                    {money(originalPrice)}
                  </p>
                )}
                <p className="text-size-h2 font-primary font-semibold">
                  {money(totalPrice)}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div>
              <div className="flex items-center gap-space-2 mb-3.5">
                <p className="font-primary text-size-medium font-medium text-placeholder">
                  Cancel Anytime - no fees
                </p>
                <div className="w-px h-full rounded-full bg-linear-to-t from-placeholder_2/0 via-placeholder_2 to-placeholder_2/0"></div>
                <p className="font-primary text-size-medium font-medium text-placeholder">
                  Save 15% - Free shipping
                </p>
              </div>
              <div className="flex gap-space-2">
                <Button variant="secondary" className="w-full">
                  Add to cart
                </Button>
                <Button className="w-full">Buy Now</Button>
              </div>
            </div>

            {/* footer */}
            <div className="flex items-center gap-space-2 justify-between">
              {/* 3rd-party tested */}
              <div className="flex flex-col items-center">
                <div className="w-12.5 h-12.5 bg-secondary/10 rounded-full text-secondary text-[24px] mb-2.5 flex items-center justify-center">
                  <i className="fi fi-rr-shield-check"></i>
                </div>
                <div className="flex flex-col items-center justify-center text-center gap-0.5">
                  <h6 className="font-semibold text-size-h6">
                    3rd-party tested
                  </h6>
                  <p className="text-size-large text-placeholder">
                    for heavy materials
                  </p>
                </div>
              </div>

              {/* 60-days guarantee */}
              <div className="flex flex-col items-center">
                <div className="w-12.5 h-12.5 bg-secondary/10 rounded-full text-secondary text-[24px] mb-2.5 flex items-center justify-center">
                  <i className="fi fi-rr-wrench-alt"></i>
                </div>
                <div className="flex flex-col items-center justify-center text-center gap-0.5">
                  <h6 className="font-semibold text-size-h6">
                    60-days guarantee
                  </h6>
                  <p className="text-size-large text-placeholder">
                    for heavy materials
                  </p>
                </div>
              </div>

              {/* 15-days replacement */}
              <div className="flex flex-col items-center">
                <div className="w-12.5 h-12.5 bg-secondary/10 rounded-full text-secondary text-[24px] mb-2.5 flex items-center justify-center">
                  <i className="fi fi-rr-replace"></i>
                </div>
                <div className="flex flex-col items-center justify-center text-center gap-0.5">
                  <h6 className="font-semibold text-size-h6">
                    15-days replacement
                  </h6>
                  <p className="text-size-large text-placeholder">
                    for heavy materials
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* reviews */}
        <div className="mb-space-10">
          <div className="flex items-center justify-between py-space-2 mb-space-7">
            <div className="flex items-center gap-space-2">
              <p className="text-size-h4 font-primary font-semibold text-placeholder_3">
                Review
              </p>{" "}
              <span className="px-2.5 py-1.5 rounded-md bg-secondary/10 text-size-large font-medium text-secondary">
                129
              </span>
            </div>
            <div className="flex gap-2">
              <FilterPill
                label="All"
                active={reviewFilter === "All"}
                onClick={() => setReviewFilter("All")}
              />
              {[1, 2, 3, 4, 5].map((star) => (
                <FilterPill
                  key={star}
                  label={`★ ${star}`}
                  active={reviewFilter === star}
                  onClick={() => setReviewFilter(star)}
                />
              ))}
            </div>
          </div>

          {/* review card */}

          {filteredReviews.length === 0 ? (
            <p className="text-sm text-slate-500">
              No reviews found for this rating.
            </p>
          ) : (
            <div className="flex items-center gap-space-6">
              {filteredReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>

        {/* related products */}
        {!isAdmin && relatedProducts?.length > 0 && (
          <div className="">
            <div className="flex items-center justify-between mb-space-7 w-full">
              <h2 className="font-primary text-size-h4 font-semibold">
                Related Products
              </h2>
              <button className="cursor-pointer flex items-center gap-[4px] text-placeholder_3 hover:text-foreground *:transition-all *:duration-200 ">
                <p htmlFor="" className="text-size-h6 font-primary font-medium">
                  View More
                </p>
                <i className="fi fi-rr-arrow-small-right"></i>
              </button>
            </div>

            {/* Product Cards */}
            <div className="flex mt-space-7 gap-space-7">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  variant="primary"
                  data={{
                    id: p.id,
                    image: p.images?.[0],
                    badge: p.category,
                    title: p.title,
                    rating: p.rating,
                    reviewCount: p.reviewCount,
                    price: p.price,
                    originalPrice: p.originalPrice,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------------- helpers ---------------- */

function OptionGroup({ label, options, selected, onSelect, className }) {
  return (
    <div className={`${className}`}>
      <p className="text-size-large uppercase tracking-wide mb-space-4">
        {label}:
      </p>
      <div className="flex gap-3">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            className={`rounded-sm border min-w-25 h-16.25 p-space-3 text-size-h6 font-primary font-semibold transition-colors text-center ${
              selected === option.id
                ? "border-secondary bg-secondary/5 text-secondary"
                : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/5"
            }`}
          >
            <p className="font-semibold">{option.label}</p>
            {option.extraPrice > 0 && (
              <p className="text-size-medium text-placeholder_2/80">
                + ${option.extraPrice}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function FilterPill({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-[12px] py-1.5 rounded-lg *:text-size-large font-medium transition-colors ${
        active
          ? "bg-secondary/10 text-secondary font-medium ring-1 ring-secondary/50"
          : "bg-white/5 text-slate-400 hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}

export default ProductDetails;
