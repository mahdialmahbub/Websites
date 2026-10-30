"use client";

import { Button } from "../Button";
import Modal from "../Modal";

/** "Delete this resume?" - a real confirmation, because it cannot be undone. `resume` is the list item to delete, or null. */
export default function ConfirmDeleteModal({ resume, deleting, error, onCancel, onConfirm }) {
  return (
    <Modal open={Boolean(resume)} onClose={deleting ? () => {} : onCancel} title="Delete this resume?" className="max-w-[32rem]">
      <p className="mb-2 text-neutral-500">
        <strong className="text-neutral-950">{resume?.title}</strong> will be deleted for good.
      </p>
      <p className="mb-5 text-small text-neutral-500">
        {resume?.shared ? "Its share link stops working right away. " : ""}This cannot be undone.
      </p>
      {error && (
        <p role="alert" className="mb-4 rounded-md bg-red-500/5 p-3 text-small text-red-600">
          {error}
        </p>
      )}
      <div className="flex items-center gap-space-4 *:flex-1">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={deleting}>
          Cancel
        </Button>
        <Button type="button" onClick={onConfirm} loading={deleting} disabled={deleting} className="bg-red-500 hover:bg-red-600">
          Delete
        </Button>
      </div>
    </Modal>
  );
}
