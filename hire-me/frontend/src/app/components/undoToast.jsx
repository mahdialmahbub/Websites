"use client";

import toast from "@/lib/toast";


/**
 * Toast with an "Undo" button.
 * Returns the toast id (so you can toast.dismiss(id) later).
 *
 *   showUndoToast({ message: "Resume deleted", onUndo: () => restore() });
 */
export function showUndoToast({ message, onUndo, duration = 5000 }) {
  return toast.custom(
    (t) => (
      <div
        role="status"
        style={{ opacity: t.visible ? 1 : 0 }}
        className="flex items-center gap-4 rounded-lg bg-neutral-900 px-4 py-3 text-sm text-white shadow-lg transition-opacity duration-200"
      >
        <span>{message}</span>
        <button
          type="button"
          onClick={() => {
            toast.dismiss(t.id);
            onUndo?.();
          }}
          className="font-semibold underline underline-offset-2 hover:no-underline"
        >
          Undo
        </button>
      </div>
    ),
    { duration },
  );
}
