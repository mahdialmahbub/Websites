"use client";

/**
 * Generic confirm dialog — reuse this anywhere you need a
 * "are you sure?" step before a destructive or important action.
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
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-105 bg-background border-2 border-secondary/10 rounded-2xl p-space-7 space-y-space-6">
        <div className="flex items-center gap-space-3">
          <i className={`fi fi-rr-triangle-warning text-size-h3 ${danger ? "text-red" : "text-secondary"}`}></i>
          <h2 className="font-semibold text-size-h4">{title}</h2>
        </div>
        <p className="text-sm text-placeholder_2 font-medium">{message}</p>
        <div className="flex gap-space-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm font-medium"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium text-white disabled:opacity-50 ${
              danger ? "bg-red" : "bg-secondary text-background"
            }`}
          >
            {isLoading ? "..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
