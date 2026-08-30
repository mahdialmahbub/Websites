"use client";

import React, { useEffect, useState } from "react";
import Button from "@/app/components/Button";
import InputField from "@/app/components/Input";
import useLockBodyScroll from "@/app/hooks/useLockBodyScroll";

const DiscountModal = ({
  discounts = [],
  selectedDiscount,
  onSelect,
  onAdd,
  onRemove,
  onClose,
  creating = false,
}) => {
  useLockBodyScroll();
  const [value, setValue] = useState("");

  // Close on Escape, matching every other modal in the app.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleAdd = async () => {
    const discount = Number(value);
    if (!discount || discount < 1 || discount > 100) return;
    await onAdd(discount);
    setValue("");
  };

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
            <i className="fi fi-rr-badge-percent shrink-0 text-[24px] text-secondary" />
            <h2 className="truncate font-semibold text-size-h4 text-placeholder_3">
              Manage Discounts
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

        {/* Add Discount */}
        <div className="flex items-end gap-space-4">
          <div className="flex-1">
            <InputField
              title="Discount Percentage"
              type="number"
              min="1"
              max="100"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g. 20"
            />
          </div>

          <Button
            type="button"
            variant="secondary"
            showRightIcon
            rightIcon="fi fi-rr-plus-small"
            onClick={handleAdd}
            disabled={creating}
          >
            Add
          </Button>
        </div>

        {/* Existing discounts */}
        <div className="space-y-space-3">
          <p className="font-semibold text-size-h6">Available Discounts</p>

          <div className="flex max-h-75 flex-wrap gap-space-3 overflow-y-auto custom-scrollbar">
            {discounts.length > 0 ? (
              discounts.map((discount) => (
                <div
                  key={discount._id}
                  className={`flex items-center gap-space-3 rounded-lg border px-space-4 py-space-3 transition ${
                    selectedDiscount === discount.percentage
                      ? "border-secondary/60 bg-secondary/10"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(discount.percentage)}
                    className="flex items-center gap-space-2"
                  >
                    <i className="fi fi-sr-badge-percent text-secondary" />
                    <span className="font-semibold">{discount.percentage}%</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemove(discount._id)}
                    className="flex size-6 items-center justify-center rounded-full text-red-400 hover:bg-red-500/10"
                    aria-label={`Remove ${discount.percentage}% discount`}
                  >
                    <i className="fi fi-rr-trash text-xs" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-placeholder_2">No discounts added yet.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-white/5 pt-space-6">
          <Button type="button" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiscountModal;
