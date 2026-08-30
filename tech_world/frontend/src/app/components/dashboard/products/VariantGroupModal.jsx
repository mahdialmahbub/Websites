"use client";

import { useEffect, useState } from "react";
import Button from "../../Button";
import useLockBodyScroll from "@/app/hooks/useLockBodyScroll";

const GROUP_ICON = {
  RAM: "fi fi-rr-memory-card",
  Storage: "fi fi-rr-hard-drive",
  Processor: "fi fi-rr-microchip",
};

// How much each +/- click adjusts the price by. Change this if you want
// finer/coarser price steps.
const PRICE_STEP = 50;

/**
 * Props:
 *   groupName        — "RAM" | "Storage" | "Processor" (used for icon + header)
 *   initialOptions    — current list for this group: [{ id, name, priceAdjustment }]
 *   onSave(options)   — called with the full updated list when "Save" is clicked
 *   onClose()
 */
export default function VariantGroupModal({ groupName, initialOptions, onSave, onClose }) {
  useLockBodyScroll();
  const [options, setOptions] = useState(initialOptions);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);

  // Close on Escape, matching every other modal in the app.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleAddOption = () => {
    if (!title.trim()) return;
    setOptions((prev) => [
      ...prev,
      { id: `${groupName}-${Date.now()}`, name: title.trim(), priceAdjustment: price },
    ]);
    setTitle("");
    setPrice(0);
  };

  const handleRemoveOption = (id) => {
    setOptions((prev) => prev.filter((o) => o.id !== id));
  };

  const handleSave = () => {
    onSave(options);
    onClose();
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
            <i
              className={`${GROUP_ICON[groupName] || "fi fi-rr-settings-sliders"} shrink-0 text-[24px] text-secondary`}
            />
            <h2 className="truncate font-semibold text-size-h4 text-placeholder_3">
              Manage {groupName} Options
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

        {/* add-new-option row */}
        <div className="flex flex-wrap items-end gap-space-4">
          <div className="min-w-50 flex-1">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Title</label>
              <span className="text-xs font-semibold text-green">Required</span>
            </div>
            <div className="relative">
              <i
                className={`${GROUP_ICON[groupName] || "fi fi-rr-tag"} absolute left-3.5 top-1/2 -translate-y-1/2 text-size-h6 text-[#2BE7C4]/70`}
              />
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddOption();
                  }
                }}
                placeholder="e.g. 32GB"
                className="w-full rounded-xl border border-secondary/20 bg-background py-3 pl-10 pr-4 text-sm text-foreground outline-none transition-colors hover:border-secondary/50 focus-within:border-secondary/80"
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Price</label>
              <span className="text-xs font-semibold text-green">Required</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-secondary/20 bg-background px-3 py-3">
              <button
                type="button"
                onClick={() => setPrice((p) => Math.max(0, p - PRICE_STEP))}
                className="text-secondary"
                aria-label="Decrease price"
              >
                <i className="fi fi-rr-minus" />
              </button>
              <span className="w-16 text-center font-semibold tabular-nums">${price}</span>
              <button
                type="button"
                onClick={() => setPrice((p) => p + PRICE_STEP)}
                className="text-secondary"
                aria-label="Increase price"
              >
                <i className="fi fi-rr-plus" />
              </button>
            </div>
          </div>

          <Button type="button" onClick={handleAddOption} className="h-11.5" showRightIcon rightIcon="fi fi-rr-plus-small">
            Add
          </Button>
        </div>

        {/* existing options, removable */}
        <div className="flex min-h-16.25 flex-wrap gap-3">
          {options.length === 0 ? (
            <p className="text-sm text-placeholder_2">No options yet — add one above.</p>
          ) : (
            options.map((opt) => (
              <div
                key={opt.id}
                className="min-w-25 h-16.25 relative flex flex-col items-center justify-center rounded-sm border border-secondary/20 bg-secondary/5 px-space-3"
              >
                <button
                  type="button"
                  onClick={() => handleRemoveOption(opt.id)}
                  aria-label={`Remove ${opt.name}`}
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-size-small text-white"
                >
                  ×
                </button>
                <p className="font-semibold text-secondary text-size-h6">{opt.name}</p>
                {opt.priceAdjustment > 0 && (
                  <p className="text-size-medium text-placeholder_2/80">+ ${opt.priceAdjustment}</p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-space-4 border-t border-white/5 pt-space-6 *:w-full">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
