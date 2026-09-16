"use client";

import Image from "next/image";
import React from "react";
import StarRating from "./StarRating";

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("") || "?";

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

/**
 * ReviewCard
 * -------------------------------------------------------------
 * Props:
 *   r          — the review: { customer, rating, text, images, createdAt, _id }
 *   isAdmin    — shows the delete control when true
 *   onDelete   — (reviewId) => void — fires when the delete button is clicked.
 *                Mirrors the app's existing pattern (e.g. PendingOrderCard's
 *                onCancel): the card just reports the intent, the PARENT page
 *                owns the actual confirm step (see note below) and API call.
 *   isDeleting — dims/disables the delete button while a delete is in flight
 *   className  — extra classes on the outer card (e.g. width overrides in a grid)
 */
const ReviewCard = ({ r, isAdmin, onDelete, isDeleting = false, className = "" }) => {
  const customerName = r?.customer?.name || "Deleted user";
  const city = r?.customer?.address?.city;
  const avatarUrl = r?.customer?.image?.url;
  const photos = r?.images || [];
  const reviewedOn = formatDate(r?.createdAt);

  return (
    <article
      aria-label={`Review by ${customerName}`}
      className={`w-full max-w-[500px] rounded-2xl border border-secondary/20 bg-[#12141c] px-space-6 py-space-6 ${className}`}
    >
      {/* Reviewer + rating */}
      <div className="mb-space-5 flex items-start justify-between gap-space-4 border-b border-secondary/20 pb-space-5">
        <div className="flex min-w-0 items-center gap-space-3">
          {avatarUrl ? (
            <Image
              alt={`${customerName}'s profile photo`}
              src={avatarUrl}
              width={48}
              height={48}
              className="h-12 w-12 shrink-0 rounded-full object-cover object-top"
            />
          ) : (
            <div
              aria-hidden="true"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-size-medium font-semibold text-secondary"
            >
              {getInitials(customerName)}
            </div>
          )}

          <div className="min-w-0">
            <h4 className="truncate font-primary text-size-h6 font-semibold text-foreground">
              {customerName}
            </h4>
            {city && (
              <p className="truncate text-size-medium font-medium text-placeholder_3">
                {city}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-space-4">
          <StarRating rating={r?.rating || 0} size="16" className="text-secondary" />

          {isAdmin && (
            <button
              type="button"
              onClick={() => onDelete?.(r?._id)}
              disabled={isDeleting || !onDelete}
              aria-label={`Delete ${customerName}'s review`}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-red transition-colors hover:bg-red/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <i className="fi fi-rr-trash text-size-h6" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Review text + date */}
      <p className="font-primary text-size-medium font-medium leading-relaxed text-foreground">
        {r?.text}
      </p>
      {reviewedOn && (
        <p className="mt-space-3 text-size-large font-medium text-placeholder_3">
          {reviewedOn}
        </p>
      )}

      {/* Photos — only rendered when there actually are any */}
      {photos.length > 0 && (
        <div className="mt-space-5">
          <p className="mb-space-3 font-primary text-size-large font-medium text-foreground">
            Photos <span className="text-placeholder_3">({photos.length})</span>
          </p>
          <div className="flex items-center gap-space-3 overflow-x-auto pb-1">
            {photos.map((photo, i) => (
              <a
                key={photo?._id || photo?.url || i}
                href={photo?.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open photo ${i + 1} full size`}
                className="block shrink-0 overflow-hidden rounded-lg border border-white/10 transition-colors hover:border-secondary/50"
              >
                <Image
                  src={photo?.url}
                  alt={`Photo ${i + 1} from ${customerName}'s review`}
                  width={100}
                  height={70}
                  className="h-[70px] w-[100px] object-cover"
                />
              </a>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

export default ReviewCard;