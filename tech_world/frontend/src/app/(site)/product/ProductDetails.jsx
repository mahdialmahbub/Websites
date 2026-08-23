/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { assets } from "@/app/assets/assets";
import Image from "next/image";
import StarRating from "@/app/components/StarRating";
import Button from "@/app/components/Button";
import { ProductCard } from "@/app/components/ProductCard";
import toCardData from "@/app/components/ToCardData";
import Tag from "@/app/components/Tag";
import ReviewCard from "@/app/components/ReviewCard";
import { Minus, Plus, ShieldCheck } from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  useGetProductByIdQuery,
  useGetProductReviewsQuery,
  useAddToCartMutation,
} from "@/redux";

const supportIcons = {
  guarantee: "fi-rr-wrench-alt",
  replacement: "fi-rr-replace",
  tested: "fi-rr-shield-check",
};

const money = (n) => (typeof n === "number" ? `$ ${n.toFixed(2)}` : n);

const ProductDetails = ({ productId }) => {
  const router = useRouter();

  const [selectedVariantIds, setSelectedVariantIds] = useState([]);
  const [userPickedVariants, setUserPickedVariants] = useState(false); // false = "still using backend defaults"
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [reviewFilter, setReviewFilter] = useState("All"); // "All" | 1 | 2 | 3 | 4 | 5
  const [syncedProductId, setSyncedProductId] = useState(null); // tracks which product we've already applied defaults for

  const { data, isLoading, isError } = useGetProductByIdQuery({
    id: productId,
    variantIds: userPickedVariants ? selectedVariantIds : undefined, // undefined -> backend applies its own defaults
    quantity,
  });

  const user = useSelector((state) => state.auth.customer); // tomar auth slice onujayi adjust koro

  const { product, pricing, relatedProducts } = data?.data || {};
  const { data: reviewsData } = useGetProductReviewsQuery(productId);
  const reviews = reviewsData?.data || [];

  const filteredReviews = useMemo(() => {
    if (reviewFilter === "All") return reviews;
    return reviews.filter((r) => r.rating === reviewFilter);
  }, [reviews, reviewFilter]);

  const [addToCart, { isLoading: addingToCart }] = useAddToCartMutation();

  /**
   * Whenever we land on a genuinely different product (route changed to a
   * new productId — not just a re-fetch triggered by changing variant/
   * quantity on the SAME product), reset local selections to the backend's
   * defaults for that product.
   *
   * This runs directly in the render body (guarded so it only fires once
   * per product) instead of in a useEffect — React's own docs recommend
   * this pattern for "adjust state when a prop changes" cases, since it
   * avoids the extra render pass a useEffect+setState would cause.
   * https://react.dev/learn/you-might-not-need-an-effect
   */
  if (product && productId !== syncedProductId) {
    setSyncedProductId(productId);
    setUserPickedVariants(false);
    setSelectedVariantIds(data.data.selectedVariantIds || []);
    setSelectedColor(product.colors?.[0]?.name || null);
    setActiveImage(0);
    setQuantity(1);
  }

  if (isLoading) return <p className="p-8">Loading product...</p>;
  if (isError || !product) return <p className="p-8">Product not found.</p>;

  const isOutOfStock = product.stock <= 0;

  // Group variants by their `group` label (RAM / Storage / Processor / ...)
  const variantGroups = (product.variants || []).reduce((acc, v) => {
    const key = v.group || "Options";
    acc[key] = acc[key] || [];
    acc[key].push(v);
    return acc;
  }, {});

  const toggleVariant = (variantId, group) => {
    setUserPickedVariants(true);
    setSelectedVariantIds((prev) => {
      // one selection per group: drop any other variant from the same group first
      const withoutGroup = prev.filter(
        (id) =>
          !product.variants.find((v) => v._id === id && v.group === group),
      );
      return [...withoutGroup, variantId];
    });
  };

  const buildCartPayload = () => ({
    productId: product._id,
    selectedVariantIds,
    selectedColor,
    quantity,
  });

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please log in to add items to cart");
      router.push("/login");
      return;
    }

    try {
      await addToCart(buildCartPayload()).unwrap();
      toast.success("Added to cart!");
    } catch (err) {
      if (err?.status === 401) {
        toast.error("Session expired. Please log in again.");
        router.push("/login");
        return;
      }
      console.warn("Add to cart failed:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast.error("Please log in to continue");
      router.push("/login");
      return;
    }

    try {
      await addToCart(buildCartPayload()).unwrap();
      router.push("/cart");
    } catch (err) {
      if (err?.status === 401) {
        toast.error("Session expired. Please log in again.");
        router.push("/login");
        return;
      }
      console.warn("Buy now failed:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };
  return (
    <div>
      <div className="px-space-11 py-space-7">
        <Button
          variant="text"
          showLeftIcon
          leftIcon="fi fi-rr-arrow-small-left"
          onClick={() => router.back()}
        >
          Back
        </Button>
      </div>

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
                  {product.images.map((img, i) => (
                    <button
                      key={img._id}
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
                        src={img.url}
                        alt={"product Image"}
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
                    src={product.images[activeImage]?.url}
                    alt={product.title}
                    className="h-105 w-full object-cover object-center"
                  />
                  <span className="absolute bottom-3 right-3 rounded-md bg-black/50 px-2 py-1 text-xs text-white backdrop-blur">
                    {String(activeImage + 1).padStart(2, "0")} /{" "}
                    {String(product.images.length).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>

            {/* description and key spacifications */}
            <div className="mt-space-7">
              <p className="font-medium text-[20px] text-foreground/80 mb-space-8">
                {product.description}
              </p>

              <div className="">
                <h6 className="font-primary font-semibold text-size-h5 text-placeholder_3 mb-space-6">
                  Specifications & Features :
                </h6>

                {/* key spacifications */}
                <div className="flex flex-col gap-space-5">
                  {product.specifications.map((spec, i) => (
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
            <div className="">
              <div className="flex items-center gap-space-4 flex-wrap mb-space-6">
                {product.badges?.map((badge) => (
                  <Tag
                    key={badge._id}
                    text={badge.name}
                    isIcon
                    icon={
                      badge.name.toLowerCase().includes("%")
                        ? "fi fi-sr-badge-percent"
                        : "fi fi-sr-trophy-star"
                    }
                  />
                ))}
              </div>
              <h1 className="font-medium text-size-h2">{product.title}</h1>
              {product.rating.average > 0 && product.soldCount > 0 && (
                <div className="flex items-center gap-2.75 mt-space-6">
                  {product.rating.average > 0 && (
                    <div className="flex items-center gap-space-2">
                      <StarRating rating={product.rating.average} size={18} />
                      <p className="font-semibold text-size-large text-placeholder">
                        ({product.rating.count} Reviews)
                      </p>
                    </div>
                  )}
                  {product.soldCount > 0 && (
                    <>
                      <div className="w-px h-full rounded-full bg-linear-to-b from-placeholder_2/0 via-placeholder_2 to-placeholder_2/0"></div>
                      <div className="flex gap-space-1 items-center">
                        <Image
                          alt="fire"
                          src={assets.fire}
                          width={16}
                          height={16}
                          className="w-[16px] h-[16px]"
                        />

                        <p className="font-semibold text-size-large">
                          {product.soldCount} Sold this week
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* requirements sellects */}
            <div className="space-y-space-8">
              {/* ---- Colors ---- */}
              {product.colors?.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-3 font-primary">Color</p>
                  <div className="flex gap-4">
                    {product.colors.map((c) => (
                      <button
                        key={c._id}
                        onClick={() => setSelectedColor(c.name)}
                        style={{ backgroundColor: c.hexCode }}
                        className={`h-9 w-8 rounded-xs outline-2 outline-offset-2 ${
                          selectedColor === c.name
                            ? "outline-secondary"
                            : "outline-transparent"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ---- Variants, grouped ---- */}
              {Object.entries(variantGroups).map(([group, variants]) => (
                <div key={group}>
                  <p className="text-sm font-medium font-primary mb-3">
                    {group}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {variants.map((v) => (
                      <button
                        key={v._id}
                        onClick={() => toggleVariant(v._id, group)}
                        className={`px-5 h-16.25 rounded-lg border text-sm ${
                          selectedVariantIds.includes(v._id)
                            ? "border-secondary text-secondary bg-secondary/5"
                            : "border-white/10 text-slate-400"
                        }`}
                      >
                        {v.name}{" "}
                        {v.priceAdjustment !== 0 &&
                          `(${v.priceAdjustment > 0 ? "+" : ""}$${v.priceAdjustment})`}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* counter and price */}
              <div className="flex items-start justify-between">
                {/* ---- Quantity ---- */}
                <div>
                  <div className="flex items-center gap-3 min-w-42.5 rounded-lg bg-background h-12.5 justify-between outline-2 outline-offset-2 outline-secondary/20 mb-space-3">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="text-[43px] text-[#2BE7C4] hover:bg-[#2BE7C4]/10 rounded-full "
                    >
                      <i className="fi fi-rr-minus-small"></i>
                    </button>
                    <span className="font-primary font-bold text-size-h6">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity((q) => Math.min(product.stock, q + 1))
                      }
                      className="text-[43px] text-[#2BE7C4] hover:bg-[#2BE7C4]/10 rounded-full"
                    >
                      <i className="fi fi-rr-plus-small"></i>
                    </button>
                  </div>
                  <span className="text-size-large text-secondary/70">
                    {product.stock} in stock
                  </span>
                </div>
                <div className="flex items-end gap-space-3">
                  {pricing.discountPercentage > 0 && (
                    <p className="text-size-h5 font-primary font-medium text-placeholder_3 line-through text-nowrap">
                      {money(pricing.unitOriginalPrice)}
                    </p>
                  )}
                  <p className="text-size-h2 font-primary font-semibold text-nowrap">
                    {money(pricing.totalPrice)}
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div>
              <div className="flex items-center gap-space-2 mb-3.5">
                <p className="text-size-large font-medium text-placeholder">
                  Cancel Anytime - no fees
                </p>
                <div className="w-px h-full rounded-full bg-linear-to-t from-placeholder_2/0 via-placeholder_2 to-placeholder_2/0"></div>
                <p className="text-size-large font-medium text-placeholder">
                  Save 15% - Free shipping
                </p>
              </div>
              {isOutOfStock ? (
                <div className="w-full rounded-xl border border-red-500/20 bg-red-500/5 py-3 text-center text-size-h6 font-bold tracking-wide text-red-500">
                  Out of Stock
                </div>
              ) : (
                <div className="flex gap-space-2">
                  <Button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    variant="secondary"
                    className="flex-1"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    disabled={addingToCart}
                    className="flex-1"
                  >
                    Buy Now
                  </Button>
                </div>
              )}
            </div>

            {/* footer */}
            <div className="flex items-center gap-2 justify-between">
              {["guarantee", "replacement", "tested"].map((key) => (
                <div key={key} className="flex flex-col items-center gap-3">
                  <div className="flex items-center justify-center bg-secondary/20 text-secondary rounded-full size-12.5 text-[24px]">
                    <i className={`fi ${supportIcons[key]}`}></i>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold mb-space-1 text-size-h6">
                      {product.supportInfo[key].title}
                    </p>
                    <p className="text-slate-500 text-size-large">
                      {product.supportInfo[key].subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* reviews */}
        <div className="mb-space-10">
          <div className="flex items-center justify-between py-space-2 mb-space-7">
            <div className="flex items-center gap-space-2">
              <p className="text-size-h4 font-primary font-semibold text-placeholder_3">
                Review
              </p>
              <span className="px-2.5 py-1.5 rounded-md bg-secondary/10 text-size-large font-medium text-secondary">
                {reviews.length}
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
              {filteredReviews.map((r) => (
                <ReviewCard key={r._id} r={r} />
              ))}
            </div>
          )}
        </div>

        {/* related products */}
        {relatedProducts?.length > 0 && (
          <div className="">
            <div className="flex items-center justify-between mb-space-7 w-full">
              <h2 className="font-primary text-size-h4 font-semibold">
                Related Products
              </h2>
              <button className="cursor-pointer flex items-center gap-[4px] text-placeholder_3 hover:text-foreground *:transition-all *:duration-200 ">
                <p className="text-size-h6 font-primary font-medium">
                  View More
                </p>
                <i className="fi fi-rr-arrow-small-right"></i>
              </button>
            </div>

            {/* Product Cards */}
            <div className="flex mt-space-7 gap-space-7">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p._id}
                  variant="primary"
                  data={toCardData(p)}
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
