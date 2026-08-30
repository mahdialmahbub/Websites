"use client";

import { useEffect } from "react";
import Button from "./Button";
import useLockBodyScroll from "@/app/hooks/useLockBodyScroll";

/**
 * Generic confirm dialog — reuse this anywhere you need an "are you sure?"
 * step before a destructive or important action. This is the single
 * source of truth for confirm dialogs across the app — prefer this over
 * hand-rolling a one-off "Cancel this order?" / "Delete this X?" modal.
 *
 * <ConfirmModal
 *   title="Log out?"
 *   message="You'll need to log in again."
 *   confirmText="Logout"
 *   isLoading={loggingOut}
 *   onConfirm={handleLogout}
 *   onClose={() => setShow(false)}
 * />
 */
export default function ConfirmModal({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = true,
  isLoading = false,
  onConfirm,
  onClose,
}) {
  useLockBodyScroll();

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
        className="my-8 w-full max-w-105 space-y-space-6 rounded-2xl border-2 border-secondary/10 bg-background p-space-7"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-space-4">
          <div className="flex min-w-0 items-center gap-space-3">
            <i
              className={`fi fi-rr-triangle-warning shrink-0 text-[24px] ${
                danger ? "text-red" : "text-secondary"
              }`}
            />
            <h2 className="truncate font-semibold text-size-h4 text-placeholder_3">{title}</h2>
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

        <p className="text-sm font-medium text-placeholder_2">{message}</p>

        {/* Footer */}
        <div className="flex gap-space-4 border-t border-white/5 pt-space-6 *:w-full">
          <Button type="button" variant="secondary" onClick={onClose}>
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            color={danger ? "#D10000" : undefined}
          >
            {isLoading ? "Please wait..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
