"use client";

import { Button } from "./Button";
import Modal from "./Modal";

/**
 * Generic confirm dialog — single source of truth for every "are you sure?"
 * step in the app. Same look as ConfirmDeleteModal, but reusable.
 *
 * Promise style (replaces window.confirm) — see useConfirm / ConfirmProvider:
 *   const confirm = useConfirm();
 *   if (await confirm({ title: "Delete?", message: "..." })) doIt();
 *
 * Controlled style (async action with spinner / server error):
 *   <ConfirmModal
 *     open={Boolean(resume)}
 *     title="Delete this resume?"
 *     message={<><strong className="text-neutral-950">{resume?.title}</strong> will be deleted for good.</>}
 *     description="This cannot be undone."
 *     error={error}
 *     confirmText="Delete"
 *     isLoading={deleting}
 *     onConfirm={handleDelete}
 *     onClose={() => setResume(null)}
 *   />
 *
 * Props
 *  - open         boolean              (default true)
 *  - title        string
 *  - message      string | ReactNode   main text
 *  - description  string | ReactNode   smaller secondary text under the message
 *  - children     optional extra content
 *  - error        string               shown in a red alert box
 *  - confirmText  string  (default "Confirm")
 *  - cancelText   string  (default "Cancel")
 *  - danger       boolean red confirm button (default true)
 *  - isLoading    boolean spinner on confirm + locks close while true
 *  - onConfirm    () => void
 *  - onClose      () => void   Cancel / X / Esc / backdrop
 */
export default function ConfirmModal({
  open = true,
  title = "Are you sure?",
  message,
  description,
  children,
  error,
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = true,
  isLoading = false,
  onConfirm,
  onClose,
}) {
  return (
    <Modal
      open={open}
      onClose={isLoading ? () => {} : onClose}
      title={title}
      className="max-w-lg"
    >
      {(message || description) && (
        <div className="mb-5 space-y-2">
          {message && <div className="text-neutral-500">{message}</div>}
          {description && (
            <p className="text-small text-neutral-500">{description}</p>
          )}
        </div>
      )}

      {children}

      {error && (
        <p
          role="alert"
          className="mb-4 rounded-md bg-red-500/5 p-3 text-small text-red-600"
        >
          {error}
        </p>
      )}

      <div className="flex items-center gap-space-4 *:flex-1">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={isLoading}
        >
          {cancelText}
        </Button>
        <Button
          type="button"
          onClick={onConfirm}
          loading={isLoading}
          disabled={isLoading}
          className={danger ? "bg-red-500 hover:bg-red-600" : undefined}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
