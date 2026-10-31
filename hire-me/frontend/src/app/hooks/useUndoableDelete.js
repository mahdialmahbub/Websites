"use client";

import { useCallback, useEffect, useRef } from "react";
import toast from "@/lib/toast";
import { showUndoToast } from "@/app/components/undoToast";
import { Bounce } from "react-toastify";

/**
 * Optimistic delete with an Undo window.
 *
 *   const undoableDelete = useUndoableDelete({ delay: 5000 });
 *
 *   undoableDelete({
 *     key: item.id,                    // unique per item
 *     message: "Resume deleted",       // toast text
 *     remove:  () => ...,              // remove from UI right now (sync)
 *     restore: () => ...,              // put it back (Undo / server error)
 *     commit:  () => api.delete(id),   // real delete, runs after `delay` (async, throw on failure)
 *   });
 *
 * - Undo within `delay`  -> timer cancelled, restore() runs, nothing hits the server.
 * - No undo              -> commit() runs; if it throws, restore() + error toast.
 * - Unmount / tab close  -> pending deletes are committed immediately, not lost.
 */
export default function useUndoableDelete({ delay = 6000 } = {}) {
  const pending = useRef(new Map());

  const commitNow = useCallback(async (key) => {
    const entry = pending.current.get(key);
    if (!entry) return; // already undone or committed
    pending.current.delete(key);
    clearTimeout(entry.timer);
    toast.dismiss(entry.toastId);
    try {
      await entry.commit();
    } catch (err) {
      entry.restore();
      toast.error(err?.message || "Could not delete. It has been restored.");
    }
  }, []);

  const undoableDelete = useCallback(
    ({ key, message, remove, restore, commit }) => {
      if (pending.current.has(key)) return; // double-click guard

      remove();

      const timer = setTimeout(() => commitNow(key), delay);

      const toastId = toast.undo(message, {
        duration: delay,
        draggable: true,
        pauseOnFocusLoss: false,
        onUndo: () => {
          const entry = pending.current.get(key);
          if (!entry) return; // too late, already committed
          clearTimeout(entry.timer);
          pending.current.delete(key);
          entry.restore();
        },
      });
      pending.current.set(key, { timer, toastId, restore, commit });
    },
    [delay, commitNow],
  );

  // Don't lose pending deletes when the user leaves the page / closes the tab
  useEffect(() => {
    const flush = () => [...pending.current.keys()].forEach(commitNow);
    window.addEventListener("beforeunload", flush);
    return () => {
      window.removeEventListener("beforeunload", flush);
      flush();
    };
  }, [commitNow]);

  return undoableDelete;
}
