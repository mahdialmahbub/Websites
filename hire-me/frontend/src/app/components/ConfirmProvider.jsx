"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import ConfirmModal from "./ConfirmModal";

const ConfirmContext = createContext(null);

/**
 * Mount ONCE near the root (app/layout.js, wrapping {children}).
 * Then anywhere in a client component:
 *
 *   const confirm = useConfirm();
 *   const ok = await confirm({ title, message, description, confirmText, cancelText, danger });
 *   // true  -> confirm button
 *   // false -> Cancel / X / Esc / backdrop
 *
 * A plain string also works:  await confirm("Delete this item?")
 */
export function ConfirmProvider({ children }) {
  const [options, setOptions] = useState(null);
  const [open, setOpen] = useState(false);
  const resolverRef = useRef(null);

  const settle = useCallback((result) => {
    resolverRef.current?.(result);
    resolverRef.current = null;
    // keep `options` so Modal's close animation still has its content
    setOpen(false);
  }, []);

  const confirm = useCallback((opts = {}) => {
    return new Promise((resolve) => {
      // if one is already open, cancel it before showing the new one
      resolverRef.current?.(false);
      resolverRef.current = resolve;
      setOptions(typeof opts === "string" ? { message: opts } : opts);
      setOpen(true);
    });
  }, []);

  // provider unmounted while a dialog is open -> resolve as cancelled
  useEffect(() => () => resolverRef.current?.(false), []);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {options && (
        <ConfirmModal
          {...options}
          open={open}
          onConfirm={() => settle(true)}
          onClose={() => settle(false)}
        />
      )}
    </ConfirmContext.Provider>
  );
}

export default function useConfirm() {
  const confirm = useContext(ConfirmContext);
  if (!confirm) {
    throw new Error("useConfirm must be used inside <ConfirmProvider>");
  }
  return confirm;
}
