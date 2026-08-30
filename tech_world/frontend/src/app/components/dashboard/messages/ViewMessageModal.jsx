"use client";

import { useEffect } from "react";
import { useGetMessageDetailsAdminQuery } from "@/redux";
import useLockBodyScroll from "@/app/hooks/useLockBodyScroll";

const ViewMessageModal = ({ messageId, onClose }) => {
  useLockBodyScroll();

  const { data, isLoading, isFetching, isError, error } =
    useGetMessageDetailsAdminQuery(messageId, {
      skip: !messageId,
    });

  const message = data?.data;

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
        className="my-8 w-full max-w-175 space-y-space-7 rounded-2xl border-2 border-secondary/10 bg-background p-space-7"
      >
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-space-4">
            <div className="flex min-w-0 items-center gap-space-3">
              <i className="fi fi-rr-envelope shrink-0 text-[24px] text-secondary" />
              <h2 className="truncate font-semibold text-size-h4 text-placeholder_3">
                Message Details
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
          <p className="text-sm text-placeholder_3">View customer message details</p>
        </div>

        {/* Loading */}
        {(isLoading || isFetching) && (
          <div className="flex items-center justify-center py-space-10">
            <div className="size-7 animate-spin rounded-full border-2 border-secondary/20 border-t-secondary" />
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-space-5 text-red-400">
            <p className="font-semibold">Failed to load message</p>
            <p className="mt-1 text-sm opacity-80">
              {error?.data?.message || "Something went wrong."}
            </p>
          </div>
        )}

        {/* Message */}
        {!isLoading && !isFetching && !isError && message && (
          <div className="max-h-[65vh] space-y-space-5 overflow-y-auto custom-scrollbar">
            <div>
              <p className="mb-1 text-sm text-secondary">Name</p>
              <p className="font-semibold text-foreground">{message.name}</p>
            </div>

            <div>
              <p className="mb-1 text-sm text-secondary">Email</p>
              <p className="font-semibold text-secondary">{message.email}</p>
            </div>

            <div>
              <p className="mb-1 text-sm text-secondary">Received</p>
              <p className="text-foreground">
                {new Date(message.createdAt).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm text-secondary">Message</p>
              <div className="rounded-xl border border-secondary/10 bg-secondary/5 p-space-4">
                <p className="whitespace-pre-wrap leading-7 text-foreground">{message.message}</p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm text-secondary">Status</p>
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${
                  message.isViewed ? "bg-secondary/10 text-secondary" : "bg-green-500/10 text-green-400"
                }`}
              >
                <span
                  className={`size-2 rounded-full ${message.isViewed ? "bg-secondary" : "bg-green-500"}`}
                />
                {message.isViewed ? "Read" : "Unread"}
              </span>
            </div>
          </div>
        )}

        {/* No message */}
        {!isLoading && !isFetching && !isError && !message && (
          <div className="py-space-10 text-center text-secondary">Message not found.</div>
        )}
      </div>
    </div>
  );
};

export default ViewMessageModal;
