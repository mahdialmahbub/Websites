"use client";

import { useEffect, useState } from "react";
import Button from "../../Button";
import useLockBodyScroll from "@/app/hooks/useLockBodyScroll";

/**
 * Props:
 *   onAdd(color)  — color: { id, name, hex }
 *   onClose()
 */
export default function ColorPickerModal({ onAdd, onClose }) {
  useLockBodyScroll();
  const [name, setName] = useState("");
  const [hex, setHex] = useState("#3E6BF0");

  // Close on Escape, matching every other modal in the app.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSave = () => {
    if (!name.trim()) return;
    onAdd({
      id: `${name.trim().toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      name: name.trim(),
      hex,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="my-8 w-full max-w-105 space-y-space-6 rounded-2xl border-2 border-secondary/10 bg-background p-space-7"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-space-4">
          <div className="flex min-w-0 items-center gap-space-3">
            <i className="fi fi-rr-palette shrink-0 text-[24px] text-secondary" />
            <h2 className="truncate font-semibold text-size-h4 text-placeholder_3">Add Color</h2>
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

        {/* Color name */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="px-space-1 font-primary text-size-large font-medium text-foreground">
              Color Name
            </label>
            <span className="text-xs font-primary font-semibold text-green">Required</span>
          </div>
          <div className="relative">
            <i className="fi fi-sr-palette absolute left-3.5 top-1/2 -translate-y-1/2 text-size-h6 text-[#2BE7C4]/70" />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Midnight Blue"
              className="w-full rounded-xl border border-secondary/20 bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder-placeholder_3 outline-none transition-colors hover:border-secondary/50 focus-within:border-secondary/80"
            />
          </div>
        </div>

        {/* Color swatch */}
        <div>
          <label className="mb-2 block px-space-1 font-primary text-size-large font-medium text-foreground">
            Pick Color
          </label>
          <div className="flex items-center gap-space-4">
            <input
              type="color"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              className="h-11 w-16 cursor-pointer rounded-lg border border-secondary/20 bg-transparent"
            />
            <span className="text-sm uppercase text-placeholder_2">{hex}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-space-4 border-t border-white/5 pt-space-6 *:w-full">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Add Color
          </Button>
        </div>
      </div>
    </div>
  );
}
