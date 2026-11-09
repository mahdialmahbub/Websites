"use client";

import React, { useEffect, useState } from "react";
import Button from "@/app/components/Button";
import InputField from "@/app/components/Input";
import useLockBodyScroll from "@/app/hooks/useLockBodyScroll";

const BadgeModal = ({
  badges = [],
  selectedBadges = [],
  onToggle,
  onAdd,
  onRemove,
  onClose,
  creating = false,
}) => {
  useLockBodyScroll();
  const [name, setName] = useState("");

  // Close on Escape, matching every other modal in the app.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleAdd = async () => {
    const badgeName = name.trim();
    if (!badgeName) return;
    await onAdd(badgeName);
    setName("");
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
            <i className="fi fi-rr-trophy-star shrink-0 text-[24px] text-secondary" />
            <h2 className="truncate font-semibold text-size-h4 text-placeholder_3">Manage Badges</h2>
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

        {/* Add Badge */}
        <div className="flex items-end gap-space-4">
          <div className="flex-1">
            <InputField
              title="Badge Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Best Seller"
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

        {/* Existing badges */}
        <div className="space-y-space-3">
          <p className="font-semibold text-size-h6">Available Badges</p>

          <div className="flex max-h-75 flex-wrap gap-space-3 overflow-y-auto custom-scrollbar">
            {badges.length > 0 ? (
              badges.map((badge) => {
                const selected = selectedBadges.includes(badge._id);

                return (
                  <div
                    key={badge._id}
                    className={`flex items-center gap-space-3 rounded-lg border px-space-4 py-space-3 transition ${
                      selected ? "border-secondary/60 bg-secondary/10" : "border-white/10 bg-white/5"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onToggle(badge._id)}
                      className="flex items-center gap-space-2"
                    >
                      <i className="fi fi-sr-trophy-star text-secondary" />
                      <span className="font-semibold">{badge.name}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onRemove(badge._id)}
                      className="flex size-6 items-center justify-center rounded-full text-red-400 hover:bg-red-500/10"
                      aria-label={`Remove ${badge.name}`}
                    >
                      <i className="fi fi-rr-trash text-xs" />
                    </button>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-placeholder_2">No badges added yet.</p>
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

export default BadgeModal;
