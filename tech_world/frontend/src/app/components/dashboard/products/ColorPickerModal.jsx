"use client";

import { useState } from "react";
import Button from "../../Button";

/**
 * Props:
 *   onAdd(color)  — color: { id, name, hex }
 *   onClose()
 */
export default function ColorPickerModal({ onAdd, onClose }) {
  const [name, setName] = useState("");
  const [hex, setHex] = useState("#3E6BF0");

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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md bg-[#0B1120] border-2 border-secondary rounded-2xl p-space-7 space-y-space-6">
        <div className="flex items-center gap-space-3">
          <i className="fi fi-rr-palette text-secondary text-[28px]"></i>
          <h2 className="font-semibold text-size-h4">Add Color</h2>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-foreground">
              Color Name
            </label>
            <span className="text-xs text-secondary font-medium">Required</span>
          </div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Midnight Blue"
            className="w-full rounded-xl border border-secondary/30 bg-[#0B0F1E] px-4 py-3 text-sm outline-none focus:border-secondary/60"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Pick Color
          </label>
          <div className="flex items-center gap-space-4">
            <input
              type="color"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              className="h-11 w-16 rounded-lg cursor-pointer bg-transparent border border-secondary/30"
            />
            <span className="text-sm text-placeholder_2 uppercase">{hex}</span>
          </div>
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
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
