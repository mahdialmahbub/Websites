"use client";

import React, { useState } from "react";
import Button from "@/app/components/Button";
import InputField from "@/app/components/Input";

const BadgeModal = ({
  badges = [],
  selectedBadges = [],
  onToggle,
  onAdd,
  onRemove,
  onClose,
  creating = false,
}) => {
  const [name, setName] = useState("");

  const handleAdd = async () => {
    const badgeName = name.trim();

    if (!badgeName) return;

    await onAdd(badgeName);
    setName("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-space-5">
      <div className="w-full max-w-162.5 rounded-2xl border-2 border-secondary bg-background p-space-7">
        {/* Header */}
        <div className="flex items-center justify-between mb-space-7">
          <div className="flex items-center gap-space-3">
            <i className="fi fi-sr-trophy-star text-[30px] text-secondary" />

            <h2 className="font-semibold text-size-h3">
              Manage Badges
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:bg-red-500/10 hover:text-red-400"
          >
            <i className="fi fi-rr-cross text-sm" />
          </button>
        </div>

        {/* Add Badge */}
        <div className="flex items-end gap-space-4 mb-space-7">
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
          <p className="font-semibold text-size-h6">
            Available Badges
          </p>

          <div className="flex max-h-75 flex-wrap gap-space-3 overflow-y-auto">
            {badges.length > 0 ? (
              badges.map((badge) => {
                const selected = selectedBadges.includes(badge._id);

                return (
                  <div
                    key={badge._id}
                    className={`flex items-center gap-space-3 rounded-lg border px-space-4 py-space-3 transition ${
                      selected
                        ? "border-secondary bg-secondary/10"
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onToggle(badge._id)}
                      className="flex items-center gap-space-2"
                    >
                      <i className="fi fi-sr-trophy-star text-secondary" />

                      <span className="font-semibold">
                        {badge.name}
                      </span>
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
              <p className="text-sm text-placeholder_2">
                No badges added yet.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-space-7">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BadgeModal;