"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { Star, X, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { useAddReviewMutation } from "@/redux";
import Button from "./Button";

const MAX_IMAGE_SIZE_MB = 5;
const MAX_MESSAGE_LENGTH = 500;

/**
 * Props:
 *   productId — the product being reviewed
 *   orderId   — the delivered order that contains this product. Required —
 *               the backend uses it to verify an actual purchase happened
 *               before accepting the review, and to flag that specific
 *               order item as reviewed.
 *   onClose   — closes the modal
 */
export default function ReviewModal({ productId, orderId, onClose }) {
  const [step, setStep] = useState("reviewForm"); // "reviewForm" | "thankYou"
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [addReview, { isLoading: submitting }] = useAddReviewMutation();
  const dialogRef = useRef(null);

  const handleClose = useCallback(() => {
    if (submitting) return;
    onClose();
  }, [submitting, onClose]);

  const handleImagePick = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
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

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSendReview = async () => {
    if (!message.trim()) {
      toast.error("Please write a short review message.");
      return;
    }
    if (!productId || !orderId) {
      toast.error("Something went wrong. Please try again later.");
      return;
    }
    try {
      await addReview({
        productId,
        orderId,
        rating,
        text: message.trim(),
        images: imageFile ? [imageFile] : undefined,
      }).unwrap();
      setStep("thankYou");
    } catch (err) {
      toast.error(err?.data?.message || "Could not submit your review.");
    }
  };

  useEffect(() => {
    if (!imagePreview) return;
    return () => URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  useEffect(() => {
    dialogRef.current?.focus();
    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  // Both are required — without an orderId the backend can't verify the
  // purchase, so there's nothing safe to render.
  if (!productId || !orderId) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      {step === "reviewForm" && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="review-title"
          tabIndex={-1}
          className="relative w-full max-w-105 space-y-space-6 rounded-2xl border-2 border-secondary/10 bg-background p-space-7 outline-none"
        >
          {/* Header — matches OTP modal's icon + title + close button row */}
          <div className="flex items-center justify-between gap-space-4">
            <div className="flex min-w-0 items-center gap-space-3">
              <i className="fi fi-sr-star shrink-0 text-[24px] text-secondary" />
              <h2
                id="review-title"
                className="truncate font-semibold text-size-h4 text-placeholder_3"
              >
                Product Review
              </h2>
            </div>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close modal"
              className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary transition-colors hover:bg-secondary/20"
            >
              <i className="fi fi-rr-cross-small" />
            </button>
          </div>

          <div>
            <p className="font-semibold mb-space-3 text-foreground">Rating</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  disabled={submitting}
                  aria-pressed={rating === n}
                  aria-label={`Rate ${n} out of 5`}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                    rating === n
                      ? "bg-secondary text-background border-secondary"
                      : "border-secondary/20 text-placeholder_3 hover:bg-secondary/5"
                  }`}
                >
                  <i
                    className={
                      rating === n
                        ? "fi fi-sr-star text-[12px]"
                        : "fi fi-rr-star text-[12px]"
                    }
                  />
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-semibold mb-space-3 text-foreground">Message</p>
            <textarea
              value={message}
              onChange={(e) =>
                setMessage(e.target.value.slice(0, MAX_MESSAGE_LENGTH))
              }
              placeholder="Write your review..."
              rows={3}
              maxLength={MAX_MESSAGE_LENGTH}
              disabled={submitting}
              aria-label="Review message"
              className="w-full rounded-xl border border-secondary/20 bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-slate-600 outline-none transition-colors hover:border-secondary/50 focus-within:border-secondary/80 resize-none disabled:opacity-60"
            />
            <div className="flex items-center justify-between gap-2 mt-2">
              <p className="flex items-center gap-1.5 text-xs text-secondary">
                <i className="fi fi-rr-info" />
                Your valuable feedback helps us do better
              </p>
              <span className="text-size-small text-slate-500 shrink-0">
                {message.length}/{MAX_MESSAGE_LENGTH}
              </span>
            </div>
          </div>

          <div className="flex gap-space-3">
            <label className="w-24 h-24 shrink-0 flex flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-secondary/50 bg-secondary/5 text-secondary cursor-pointer text-center">
              <input
                type="file"
                accept="image/png,image/jpeg"
                hidden
                onChange={handleImagePick}
              />
              <i className="fi fi-rr-plus-small text-lg" />
              <span className="text-[9px] leading-tight px-1">
                Upload Image
                <br />
                PNG, JPG up to {MAX_IMAGE_SIZE_MB}MB
              </span>
            </label>
            {imagePreview && (
              <div className="relative w-24 h-24 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Review upload preview"
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  aria-label="Remove selected image"
                  className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full border border-secondary/20 bg-secondary/10 text-secondary hover:bg-secondary/20"
                >
                  <i className="fi fi-rr-cross-small text-[10px]" />
                </button>
              </div>
            )}
          </div>

          {/* Footer — border-t divider + shared Button component, like the OTP modal */}
          <div className="space-y-space-4 border-t border-white/5 pt-space-6">
            <Button
              type="button"
              onClick={handleSendReview}
              disabled={submitting}
              className="w-full"
            >
              {submitting ? "Sending..." : "Send Review"}
            </Button>
          </div>
        </div>
      )}

      {step === "thankYou" && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="thankyou-title"
          tabIndex={-1}
          className="relative w-full max-w-sm space-y-space-4 rounded-2xl border-2 border-secondary/10 bg-background p-space-7 text-center outline-none"
        >
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-lg bg-secondary/10 text-secondary transition-colors hover:bg-secondary/20"
          >
            <i className="fi fi-rr-cross-small" />
          </button>

          <h2
            id="thankyou-title"
            className="font-semibold text-size-h4 text-placeholder_3"
          >
            Thank you for your review
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-secondary text-sm font-medium inline-flex items-center gap-1.5 hover:underline"
          >
            Continue shopping <i className="fi fi-rr-arrow-right text-[12px]" />
          </button>
        </div>
      )}
    </div>
  );
}
