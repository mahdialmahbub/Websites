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

const ProductDetails = ({ productId, isAdmin = false }) => {
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
    <div className="w-full">
      {/* =========================================================
        BACK
    ========================================================== */}
      {!isAdmin && (
        <div className="px-4 py-4 sm:px-6 lg:px-10 xl:px-14">
          <Button
            variant="text"
            showLeftIcon
            leftIcon="fi fi-rr-arrow-small-left"
            onClick={() => router.back()}
            className="text-placeholder_3 transition-colors hover:text-foreground"
          >
            Back
          </Button>
        </div>
      )}

      <main
        className={`${
          !isAdmin ? "px-4 sm:px-6 lg:px-10 xl:px-14" : "px-4 lg:px-6"
        } pb-16`}
      >
        {/* =========================================================
          PRODUCT HERO
      ========================================================== */}
        <section className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.12fr)_minmax(380px,0.88fr)] xl:gap-10">
          {/* =====================================================
            LEFT — IMAGE GALLERY
        ====================================================== */}
          <div className="min-w-0">
            <div className="grid grid-cols-[72px_minmax(0,1fr)] gap-4 sm:grid-cols-[88px_minmax(0,1fr)] sm:gap-5">
              {/* Thumbnails */}
              <div className="flex max-h-[620px] flex-col gap-3 overflow-y-auto pr-1 scrollbar-none">
                {product.images?.map((img, i) => (
                  <button
                    key={img._id}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    aria-label={`Show product image ${i + 1}`}
                    className={`
                    group
                    relative aspect-square w-full shrink-0
                    overflow-hidden rounded-2xl
                    border
                    bg-white/[0.03]
                    transition-all duration-300
                    ${
                      activeImage === i
                        ? "border-secondary shadow-[0_0_0_2px_rgba(34,211,238,0.15)]"
                        : "border-white/10 hover:border-white/25"
                    }
                  `}
                  >
                    <Image
                      width={120}
                      height={120}
                      src={img.url}
                      alt={`${product.title} image ${i + 1}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {activeImage === i && (
                      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-secondary/30" />
                    )}
                  </button>
                ))}
              </div>

              {/* Main image */}
              <div className="relative min-w-0 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.025]">
                <div className="relative aspect-square w-full overflow-hidden sm:aspect-[1.08/1]">
                  {product.images?.[activeImage]?.url && (
                    <Image
                      width={1400}
                      height={1400}
                      src={product.images[activeImage].url}
                      alt={product.title}
                      priority
                      className="h-full w-full object-cover transition-transform duration-500"
                    />
                  )}

                  {/* Image overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

                  {/* Image counter */}
                  <div className="absolute bottom-4 right-4 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                    {String(activeImage + 1).padStart(2, "0")}
                    <span className="mx-1 text-white/40">/</span>
                    {String(product.images?.length || 0).padStart(2, "0")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
            RIGHT — PRODUCT INFORMATION
        ====================================================== */}
          <div className="min-w-0">
            <div className="flex flex-col rounded-[28px] border border-white/10 bg-white/[0.025] p-5 sm:p-6 lg:p-7">
              {/* Badges */}
              {product.badges?.length > 0 && (
                <div className="mb-5 flex flex-wrap items-center gap-2">
                  {product.badges.map((badge) => (
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
              )}

              {/* Title */}
              <div>
                <h1 className="max-w-[720px] font-primary text-2xl font-semibold leading-[1.15] tracking-[-0.03em] sm:text-3xl lg:text-4xl">
                  {product.title}
                </h1>

                {/* Rating + sold */}
                {(product.rating?.average > 0 || product.soldCount > 0) && (
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                    {product.rating?.average > 0 && (
                      <div className="flex items-center gap-2">
                        <StarRating rating={product.rating.average} size={18} />
                        <span className="text-sm font-semibold text-placeholder">
                          {product.rating.average.toFixed(1)}
                        </span>
                        <span className="text-sm text-placeholder_3">
                          ({product.rating.count} reviews)
                        </span>
                      </div>
                    )}

                    {product.rating?.average > 0 && product.soldCount > 0 && (
                      <span className="hidden h-4 w-px bg-white/15 sm:block" />
                    )}

                    {product.soldCount > 0 && (
                      <div className="flex items-center gap-1.5 text-sm font-medium text-placeholder_3">
                        <Image
                          alt="Popular"
                          src={assets.fire}
                          width={16}
                          height={16}
                          className="h-4 w-4"
                        />
                        <span>{product.soldCount} sold this week</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="my-6 h-px bg-white/10" />

              {/* Price */}
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  {pricing.discountPercentage > 0 && (
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-sm font-medium text-placeholder_3">
                        Regular price
                      </span>

                      <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-semibold text-red-400">
                        -{pricing.discountPercentage}%
                      </span>
                    </div>
                  )}

                  <div className="flex items-end gap-3">
                    <span className="font-primary text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
                      {pricing.discountPercentage > 0
                        ? money(pricing.totalPrice)
                        : money(pricing.unitOriginalPrice)}
                    </span>

                    {pricing.discountPercentage > 0 && (
                      <span className="pb-1 text-base text-placeholder_3 line-through">
                        {money(pricing.unitOriginalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stock */}
                <div
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    isOutOfStock
                      ? "bg-red-500/10 text-red-400"
                      : "bg-emerald-500/10 text-emerald-400"
                  }`}
                >
                  {isOutOfStock ? "Out of stock" : `${product.stock} in stock`}
                </div>
              </div>

              {/* =================================================
                OPTIONS
            ================================================== */}
              <div className="mt-7 space-y-6">
                {/* Color */}
                {product.colors?.length > 0 && (
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <p className="font-primary text-sm font-semibold">
                        Color
                      </p>

                      {selectedColor && (
                        <span className="text-sm text-placeholder_3">
                          {selectedColor}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {product.colors.map((color) => {
                        const active = selectedColor === color.name;

                        return (
                          <button
                            key={color._id}
                            type="button"
                            onClick={() => setSelectedColor(color.name)}
                            aria-label={`Select ${color.name}`}
                            className={`
                            relative flex h-10 w-10 items-center justify-center
                            rounded-full border
                            transition-all duration-200
                            ${
                              active
                                ? "border-secondary"
                                : "border-white/10 hover:border-white/30"
                            }
                          `}
                          >
                            <span
                              className="h-7 w-7 rounded-full border border-black/20"
                              style={{
                                backgroundColor: color.hexCode,
                              }}
                            />

                            {active && (
                              <span className="absolute inset-[-4px] rounded-full border border-secondary/30" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Variant groups */}
                {Object.entries(variantGroups).map(([group, variants]) => (
                  <div key={group}>
                    <div className="mb-3 flex items-center justify-between">
                      <p className="font-primary text-sm font-semibold">
                        {group}
                      </p>

                      <span className="text-xs text-placeholder_3">
                        Select one
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      {variants.map((variant) => {
                        const active = selectedVariantIds.includes(variant._id);

                        return (
                          <button
                            key={variant._id}
                            type="button"
                            onClick={() => toggleVariant(variant._id, group)}
                            className={`
                            min-w-[88px]
                            rounded-xl
                            border
                            px-4 py-3
                            text-center
                            transition-all duration-200
                            ${
                              active
                                ? "border-secondary bg-secondary/10 text-secondary shadow-[0_0_0_1px_rgba(34,211,238,0.12)]"
                                : "border-white/10 bg-white/[0.025] text-placeholder_3 hover:border-white/25 hover:bg-white/[0.05]"
                            }
                          `}
                          >
                            <span className="block text-sm font-semibold">
                              {variant.name}
                            </span>

                            {variant.priceAdjustment !== 0 && (
                              <span className="mt-1 block text-xs text-placeholder_2">
                                {variant.priceAdjustment > 0 ? "+" : ""}
                                {money(variant.priceAdjustment)}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* =================================================
                QUANTITY
            ================================================== */}
              <div className="mt-7 flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 p-3">
                <div>
                  <p className="text-sm font-semibold">Quantity</p>
                  <p className="mt-1 text-xs text-placeholder_3">
                    {product.stock} available
                  </p>
                </div>

                <div className="flex items-center rounded-xl border border-white/10 bg-white/[0.03]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="flex h-10 w-10 items-center justify-center rounded-l-xl text-placeholder_3 transition-colors hover:bg-white/10 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Minus size={17} />
                  </button>

                  <span className="flex h-10 min-w-10 items-center justify-center border-x border-white/10 text-sm font-bold">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stock, q + 1))
                    }
                    disabled={quantity >= product.stock}
                    className="flex h-10 w-10 items-center justify-center rounded-r-xl text-placeholder_3 transition-colors hover:bg-white/10 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus size={17} />
                  </button>
                </div>
              </div>

              {/* =================================================
                PURCHASE ACTIONS
            ================================================== */}
              {!isAdmin && (
                <div className="mt-6">
                  {isOutOfStock ? (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-4 text-center text-sm font-semibold text-red-400">
                      This product is currently unavailable
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Button
                          onClick={handleAddToCart}
                          disabled={addingToCart}
                          variant="secondary"
                          className="!h-13 w-full rounded-xl"
                        >
                          {addingToCart ? "Adding..." : "Add to Cart"}
                        </Button>

                        <Button
                          onClick={handleBuyNow}
                          disabled={addingToCart}
                          className="!h-13 w-full rounded-xl"
                        >
                          Buy Now
                        </Button>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-placeholder_3">
                        <span className="flex items-center gap-1.5">
                          <ShieldCheck size={14} />
                          Secure checkout
                        </span>

                        <span className="hidden h-3.5 w-px bg-white/10 sm:block" />

                        <span>Free shipping</span>

                        <span className="hidden h-3.5 w-px bg-white/10 sm:block" />

                        <span>Easy returns</span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* =================================================
                SUPPORT FEATURES
            ================================================== */}
              <div className="mt-7 grid grid-cols-3 gap-2 border-t border-white/10 pt-6">
                {["guarantee", "replacement", "tested"].map((key) => (
                  <div
                    key={key}
                    className="flex min-w-0 flex-col items-center text-center"
                  >
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-secondary sm:h-11 sm:w-11">
                      <i className={`fi ${supportIcons[key]} text-[18px]`} />
                    </div>

                    <p className="line-clamp-1 text-[11px] font-semibold sm:text-xs">
                      {product.supportInfo[key].title}
                    </p>

                    <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-placeholder_3 sm:text-[11px]">
                      {product.supportInfo[key].subtitle}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
          DESCRIPTION + SPECIFICATIONS
      ========================================================== */}
        <section className="mt-10 rounded-[28px] border border-white/10 bg-white/[0.02] p-5 sm:p-7 lg:p-8">
          {/* Description */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-6 w-1 rounded-full bg-secondary" />

              <h2 className="font-primary text-xl font-semibold tracking-[-0.02em] sm:text-2xl">
                Product Description
              </h2>
            </div>

            <p className="max-w-5xl text-sm leading-7 text-placeholder_3 sm:text-base">
              {product.description}
            </p>
          </div>

          {/* Specifications */}
          {product.specifications?.length > 0 && (
            <div className="mt-8 border-t border-white/10 pt-8">
              <div className="mb-5 flex items-center gap-3">
                <span className="h-6 w-1 rounded-full bg-secondary" />

                <h2 className="font-primary text-xl font-semibold tracking-[-0.02em] sm:text-2xl">
                  Specifications & Features
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {product.specifications.map((spec, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4"
                  >
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                      <i className="fi fi-rr-microchip text-[12px]" />
                    </span>

                    <p className="text-sm font-medium leading-6 text-placeholder">
                      {spec}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* =========================================================
          REVIEWS
      ========================================================== */}
        <section className="mt-10">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <h2 className="font-primary text-2xl font-semibold tracking-[-0.02em]">
                Customer Reviews
              </h2>

              <span className="rounded-full bg-secondary/10 px-3 py-1 text-sm font-semibold text-secondary">
                {reviews.length}
              </span>
            </div>

            {/* Review Filters */}
            <div className="flex max-w-full gap-2 overflow-x-auto pb-1 scrollbar-none">
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

          {filteredReviews.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-5 py-12 text-center">
              <p className="text-sm text-placeholder_3">
                No reviews found for this rating.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredReviews.map((review) => (
                <ReviewCard key={review._id} r={review} />
              ))}
            </div>
          )}
        </section>

        {/* =========================================================
          RELATED PRODUCTS
      ========================================================== */}
        {relatedProducts?.length > 0 && (
          <section className="mt-12">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="font-primary text-2xl font-semibold tracking-[-0.02em]">
                  Related Products
                </h2>

                <p className="mt-1 text-sm text-placeholder_3">
                  You may also like these products
                </p>
              </div>

              <button
                type="button"
                className="group hidden items-center gap-1.5 text-sm font-medium text-placeholder_3 transition-colors hover:text-foreground sm:flex"
              >
                <span>View More</span>

                <i className="fi fi-rr-arrow-small-right transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p._id}
                  variant="primary"
                  data={toCardData(p)}
                />
              ))}
            </div>
          </section>
        )}
      </main>
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
