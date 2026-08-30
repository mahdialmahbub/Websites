/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Star } from "lucide-react";
import toast from "react-hot-toast";
import { useAppSelector } from "@/lib/hooks";
import { selectIsAuthenticated, useGetMyDeliveredOrdersQuery, useAddReviewMutation } from "@/redux";
import { ProductCard } from "./ProductCard";

// Tracks which delivered orders have already shown their "Congratulations"
// modal, so it only ever appears once per order (on the next login/visit
// after it first becomes Delivered) — not the backend's job, this is purely
// a "have I shown this to the user yet" UI flag.
const SEEN_KEY = "techworld_seen_delivery_congrats";

const getSeenOrderIds = () => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(SEEN_KEY) || "[]");
  } catch {
    return [];
  }
};

const markOrderSeen = (orderId) => {
  const seen = getSeenOrderIds();
  if (!seen.includes(orderId)) {
    localStorage.setItem(SEEN_KEY, JSON.stringify([...seen, orderId]));
  }
};

const MAX_IMAGE_SIZE_MB = 5;

/**
 * Drop this once near the top of your app (e.g. in app/layout.jsx, right
 * next to <Toaster />) — it watches for newly-delivered orders and runs
 * the Congratulations -> Review -> Thank You flow automatically.
 */
export default function DeliveryReviewFlow() {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const { data } = useGetMyDeliveredOrdersQuery(undefined, { skip: !isAuthenticated });
  const deliveredOrders = data?.data || [];

  const [step, setStep] = useState(null); // null | "congrats" | "reviewForm" | "thankYou"
  const [activeOrder, setActiveOrder] = useState(null);

  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [addReview, { isLoading: submitting }] = useAddReviewMutation();

  // Once the delivered-orders list loads, find the first one we haven't shown yet
  useEffect(() => {
    if (!isAuthenticated || step || deliveredOrders.length === 0) return;
    const seen = getSeenOrderIds();
    const unseen = deliveredOrders.find((o) => !seen.includes(o._id));
    if (unseen) {
      setActiveOrder(unseen);
      setStep("congrats");
    }
  }, [isAuthenticated, deliveredOrders, step]);

  const resetAndClose = () => {
    if (activeOrder) markOrderSeen(activeOrder._id);
    setStep(null);
    setActiveOrder(null);
    setRating(5);
    setMessage("");
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImagePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      toast.error("Only PNG or JPG images are allowed.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      toast.error(`Image must be under ${MAX_IMAGE_SIZE_MB}MB.`);
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSendReview = async () => {
    if (!message.trim()) {
      toast.error("Please write a short review message.");
      return;
    }

    const firstItem = activeOrder.items[0];
    try {
      await addReview({
        productId: firstItem.product,
        orderId: activeOrder._id,
        rating,
        text: message,
        images: imageFile ? [imageFile] : undefined,
      }).unwrap();
      markOrderSeen(activeOrder._id); // reviewed -> definitely don't show this one again
      setStep("thankYou");
    } catch (err) {
      toast.error(err?.data?.message || "Could not submit your review.");
    }
  };

  const handleContinueShopping = () => {
    resetAndClose();
    router.push("/");
  };

  if (!step || !activeOrder) return null;

  const firstItem = activeOrder.items[0];
  const reviewCardData = {
    image: firstItem.productImage,
    title: firstItem.productTitle,
    requirement: (firstItem.selectedVariants || []).map((v) => v.name).join(", "),
    quantity: firstItem.quantity,
    total: activeOrder.total,
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
      {/* ---------- 1. Congratulations ---------- */}
      {step === "congrats" && (
        <div className="w-full max-w-sm bg-[#0B1120] border-2 border-secondary rounded-2xl p-space-7 text-center space-y-space-6">
          <h2 className="text-2xl font-bold text-foreground">Congratulations</h2>
          <p className="text-placeholder_2">Your product is successfully delivered</p>

          <ProductCard
            variant="reviewCard"
            data={reviewCardData}
            actions={{ onReviewProduct: () => setStep("reviewForm") }}
          />

          <p className="text-xs text-secondary font-medium">Your Review Inspires Us to Do Better</p>
          <button type="button" onClick={resetAndClose} className="text-xs text-slate-500 underline">
            Maybe later
          </button>
        </div>
      )}

      {/* ---------- 2. Review Form ---------- */}
      {step === "reviewForm" && (
        <div className="w-full max-w-md bg-[#0B1120] border-2 border-secondary rounded-2xl p-space-7 space-y-space-6">
          <div className="flex items-center gap-space-3">
            <i className="fi fi-sr-star text-secondary text-[24px]"></i>
            <h2 className="text-xl font-semibold text-foreground">Product Review</h2>
          </div>

          <div>
            <p className="font-semibold mb-space-3 text-foreground">Rating</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    rating === n
                      ? "bg-secondary text-background border-secondary"
                      : "border-white/10 text-slate-400 hover:bg-white/5"
                  }`}
                >
                  <Star size={12} className={rating === n ? "fill-background" : ""} />
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-semibold mb-space-3 text-foreground">Message</p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your review..."
              rows={3}
              className="w-full rounded-lg border border-white/10 bg-[#0d0f16] px-3 py-2.5 text-sm text-foreground placeholder:text-slate-600 outline-none focus:border-secondary/60 resize-none"
            />
            <p className="flex items-center gap-1.5 mt-2 text-xs text-secondary">
              <i className="fi fi-rr-info"></i>
              Your valuable feedback helps us do better
            </p>
          </div>

          <div className="flex gap-space-3">
            <label className="w-24 h-24 shrink-0 flex flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-secondary/50 bg-secondary/5 text-secondary cursor-pointer text-center">
              <input type="file" accept="image/png,image/jpeg" hidden onChange={handleImagePick} />
              <i className="fi fi-rr-plus-small text-lg"></i>
              <span className="text-[9px] leading-tight px-1">
                Upload Image
                <br />
                PNG, JPG up to {MAX_IMAGE_SIZE_MB}MB
              </span>
            </label>
            {imagePreview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imagePreview} alt="Review upload preview" className="w-24 h-24 rounded-lg object-cover" />
            )}
          </div>

          <button
            type="button"
            onClick={handleSendReview}
            disabled={submitting}
            className="w-full rounded-lg bg-emerald-500 py-3 font-semibold text-background disabled:opacity-50 hover:bg-emerald-400 transition-colors"
          >
            {submitting ? "Sending..." : "Send Review"}
          </button>
          <p className="flex items-center justify-center gap-1.5 text-xs text-secondary">
            <i className="fi fi-rr-shield-check"></i>
            Your information is secure
          </p>
        </div>
      )}

      {/* ---------- 3. Thank You ---------- */}
      {step === "thankYou" && (
        <div className="w-full max-w-sm bg-[#0B1120] border-2 border-secondary rounded-2xl p-space-7 text-center space-y-space-4">
          <h2 className="text-xl font-bold text-foreground">Thank you for your review</h2>
          <button
            type="button"
            onClick={handleContinueShopping}
            className="text-secondary text-sm font-medium inline-flex items-center gap-1.5 hover:underline"
          >
            Continue shopping <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
