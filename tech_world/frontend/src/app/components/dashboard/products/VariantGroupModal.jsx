"use client";

import { useState } from "react";
import Button from "../../Button";

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
export default function VariantGroupModal({
  groupName,
  initialOptions,
  onSave,
  onClose,
}) {
  const [options, setOptions] = useState(initialOptions);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);

  const handleAddOption = () => {
    if (!title.trim()) return;
    setOptions((prev) => [
      ...prev,
      {
        id: `${groupName}-${Date.now()}`,
        name: title.trim(),
        priceAdjustment: price,
      },
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl bg-[#0B1120] border-2 border-secondary rounded-2xl p-space-7 space-y-space-6">
        <p className="text-xs text-placeholder_2">Add Variant</p>

        <div className="flex items-center gap-space-3">
          <div className="size-11 rounded-lg border-2 border-secondary flex items-center justify-center text-secondary">
            <i
              className={`${GROUP_ICON[groupName] || "fi fi-rr-settings-sliders"} text-[20px]`}
            ></i>
          </div>
          <h2 className="font-semibold text-size-h3">{groupName}</h2>
        </div>

        {/* add-new-option row */}
        <div className="flex items-end gap-space-4 flex-wrap">
          <div className="flex-1 min-w-50">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">
                Title
              </label>
              <span className="text-xs text-secondary font-medium">
                Required
              </span>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl bg-[#0B0F1E] border border-secondary/30 px-4 py-3">
              <i
                className={`${GROUP_ICON[groupName] || "fi fi-rr-tag"} text-secondary`}
              ></i>
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
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">
                Price
              </label>
              <span className="text-xs text-secondary font-medium">
                Required
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-[#0B0F1E] border border-secondary/30 px-3 py-3">
              <button
                type="button"
                onClick={() => setPrice((p) => Math.max(0, p - PRICE_STEP))}
                className="text-secondary"
                aria-label="Decrease price"
              >
                <i className="fi fi-rr-minus"></i>
              </button>
              <span className="w-16 text-center font-semibold tabular-nums">
                ${price}
              </span>
              <button
                type="button"
                onClick={() => setPrice((p) => p + PRICE_STEP)}
                className="text-secondary"
                aria-label="Increase price"
              >
                <i className="fi fi-rr-plus"></i>
              </button>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleAddOption}
            className="h-11.5"
            showRightIcon
            rightIcon="fi fi-rr-plus-small"
          >
            Add
          </Button>
        </div>

        {/* existing options, removable */}
        <div className="flex flex-wrap gap-3 min-h-16.25">
          {options.length === 0 ? (
            <p className="text-sm text-placeholder_2">
              No options yet — add one above.
            </p>
          ) : (
            options.map((opt) => (
              <div
                key={opt.id}
                className="relative rounded-sm border border-secondary/40 bg-secondary/5 min-w-25 h-16.25 flex flex-col items-center justify-center px-space-3"
              >
                <button
                  type="button"
                  onClick={() => handleRemoveOption(opt.id)}
                  aria-label={`Remove ${opt.name}`}
                  className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-size-small"
                >
                  ×
                </button>
                <p className="font-semibold text-secondary text-size-h6">
                  {opt.name}
                </p>
                {opt.priceAdjustment > 0 && (
                  <p className="text-size-medium text-placeholder_2/80">
                    + ${opt.priceAdjustment}
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        <div className="flex gap-space-4">
          <Button
            variant="secondary"
            type="button"
            onClick={onClose}
            className="flex-1 text-red"
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} className="flex-1">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
