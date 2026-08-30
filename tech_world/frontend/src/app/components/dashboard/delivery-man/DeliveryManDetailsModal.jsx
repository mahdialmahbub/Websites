// components/dashboard/delivery-man/DeliveryManDetailsModal.jsx
"use client";

import { useEffect } from "react";
import Image from "next/image";
import Button from "../../Button"; // adjust path if your Button lives elsewhere
import useLockBodyScroll from "@/app/hooks/useLockBodyScroll";

const inputClass =
  "pl-10 pr-4 border rounded-xl w-full bg-background text-foreground text-sm flex items-center gap-2.5 py-3 border-secondary/20 cursor-default select-text";

const iconClass =
  "text-size-h6 text-[#2BE7C4]/70 absolute left-3.5 top-1/2 -translate-y-1/2";

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const detailFields = [
  { key: "contact", label: "Contact Number", icon: "fi-sr-phone-call" },
  { key: "email", label: "Email", icon: "fi-sr-envelope" },
  { key: "address", label: "Address", icon: "fi-sr-marker" },
  { key: "vehicleNumber", label: "Vehicle Number", icon: "fi-sr-car-side" },
];

// `onEdit` is optional — pass it to show an "Edit" action alongside Close;
// leave it out for a pure read-only view.
const DeliveryManDetailsModal = ({ deliveryMan, onClose, onEdit }) => {
  useLockBodyScroll();
  const isActive = deliveryMan?.status === "active";

  // Close on Escape, matching every other modal in the app.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="my-8 w-full max-w-150 space-y-space-7 rounded-2xl border-2 border-secondary/10 bg-background p-space-7"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-space-4">
          <div className="flex min-w-0 items-center gap-space-3">
            <i className="fi fi-rr-delivery-man shrink-0 text-[24px] text-secondary" />
            <h2 className="truncate font-semibold text-size-h4 text-placeholder_3">
              Delivery Man Details
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary transition-colors hover:bg-secondary/20"
          >
            <i className="fi fi-rr-cross-small" />
          </button>
        </div>

        <div className="-mr-1 max-h-[65vh] space-y-space-7 overflow-y-auto pr-1 custom-scrollbar">
          {/* profile hero */}
          <div className="flex flex-col items-center gap-space-2 text-center">
            <div className="relative size-24 overflow-hidden rounded-full border border-secondary/20 bg-secondary/10">
              {deliveryMan?.image?.url ? (
                <Image
                  src={deliveryMan.image.url}
                  alt={deliveryMan?.name || "Delivery man"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <i className="fi fi-sr-user text-[32px] text-placeholder_3" />
                </div>
              )}
            </div>

            <div>
              <h3 className="text-size-h4 font-semibold text-foreground">
                {deliveryMan?.name || "—"}
              </h3>
              <p className="text-size-large text-placeholder_3">
                {deliveryMan?.courierServiceName || "—"}
              </p>
            </div>

            <span
              className={`inline-flex items-center gap-space-2 rounded-full px-space-3 py-space-1.5 text-size-h6 font-medium ${
                isActive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
              }`}
            >
              <span className={`size-2 rounded-full ${isActive ? "bg-green-500" : "bg-red-500"}`} />
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>

          {/* stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-secondary/10 px-space-3 py-space-3 text-center">
              <p className="text-size-h4 font-semibold text-foreground">
                {deliveryMan?.completedDeliveries ?? 0}
              </p>
              <p className="mt-1 text-xs text-placeholder_3">Deliveries</p>
            </div>
            <div className="rounded-xl border border-secondary/10 px-space-3 py-space-3 text-center">
              <p className="text-size-large font-semibold text-foreground">
                {deliveryMan?.vehicleType || "—"}
              </p>
              <p className="mt-1 text-xs text-placeholder_3">Vehicle</p>
            </div>
            <div className="rounded-xl border border-secondary/10 px-space-3 py-space-3 text-center">
              <p className="text-size-large font-semibold text-foreground">
                {formatDate(deliveryMan?.createdAt)}
              </p>
              <p className="mt-1 text-xs text-placeholder_3">Joined On</p>
            </div>
          </div>

          {/* read-only fields */}
          {detailFields.map((field) => (
            <div key={field.key}>
              <label className="mb-2 block px-space-1 font-primary text-size-large font-medium text-foreground">
                {field.label}
              </label>
              <div className="relative">
                <i className={`${iconClass} fi ${field.icon}`} />
                <div className={inputClass}>{deliveryMan?.[field.key] || "—"}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex gap-space-4 border-t border-white/5 pt-space-6 *:w-full">
          <Button type="button" onClick={onClose} variant="secondary">
            Close
          </Button>

          {onEdit && (
            <Button type="button" onClick={onEdit}>
              Edit Delivery Man
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryManDetailsModal;
