"use client";

import { useGetMessageDetailsAdminQuery } from "@/redux";

const ViewMessageModal = ({ messageId, onClose }) => {
  const { data, isLoading, isFetching, isError, error } =
    useGetMessageDetailsAdminQuery(messageId, {
      skip: !messageId,
    });

  const message = data?.data;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-space-5"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-background p-space-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-space-6">
          <div>
            <h2 className="text-size-h3 font-semibold">Message Details</h2>

            <p className="text-secondary text-sm mt-1">
              View customer message details
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-9 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors"
            aria-label="Close modal"
          >
            <i className="fi fi-rr-cross-small" />
          </button>
        </div>

        {/* Loading */}
        {(isLoading || isFetching) && (
          <div className="flex items-center justify-center py-space-10">
            <div className="size-7 rounded-full border-2 border-secondary/20 border-t-secondary animate-spin" />
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-space-5 text-red-500">
            <p className="font-semibold">Failed to load message</p>

            <p className="text-sm mt-1 opacity-80">
              {error?.data?.message || "Something went wrong."}
            </p>
          </div>
        )}

        {/* Message */}
        {!isLoading && !isFetching && !isError && message && (
          <div className="space-y-space-5">
            {/* Name */}
            <div>
              <p className="text-sm text-secondary mb-1">Name</p>

              <p className="font-semibold">{message.name}</p>
            </div>

            {/* Email */}
            <div>
              <p className="text-sm text-secondary mb-1">Email</p>

              <p className="font-semibold text-secondary">{message.email}</p>
            </div>

            {/* Date */}
            <div>
              <p className="text-sm text-secondary mb-1">Received</p>

              <p>
                {new Date(message.createdAt).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {/* Message */}
            <div>
              <p className="text-sm text-secondary mb-2">Message</p>

              <div className="rounded-xl bg-secondary/5 border border-secondary/10 p-space-4">
                <p className="leading-7 whitespace-pre-wrap">
                  {message.message}
                </p>
              </div>
            </div>

            {/* Status */}
            <div>
              <p className="text-sm text-secondary mb-2">Status</p>

              <span
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                  message.isViewed
                    ? "bg-secondary/10 text-secondary"
                    : "bg-green-500/10 text-green-500"
                }`}
              >
                <span
                  className={`size-2 rounded-full ${
                    message.isViewed ? "bg-secondary" : "bg-green-500"
                  }`}
                />

                {message.isViewed ? "Read" : "Unread"}
              </span>
            </div>
          </div>
        )}

        {/* No message */}
        {!isLoading && !isFetching && !isError && !message && (
          <div className="py-space-10 text-center text-secondary">
            Message not found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewMessageModal;
