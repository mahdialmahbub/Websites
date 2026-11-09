"use client";

import { useState } from "react";

import Email from "./Email";
import ViewMessageModal from "./ViewMessageModal";

const MessageRow = ({ message }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <tr className="bg-secondary/3 hover:bg-secondary/10 transition-colors *:p-space-3 *:first:rounded-l-xl *:last:rounded-r-xl text-size-h6">
        <td>{message.name}</td>

        <td className="text-secondary font-semibold">
          <Email email={message.email} />
        </td>

        <td className="max-w-[320px] truncate">{message.message}</td>

        <td className="whitespace-nowrap">
          {new Date(message.createdAt).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </td>

        <td>
          <div className="flex items-center justify-end gap-space-3">
            {!message.isViewed && (
              <span className="size-[12px] rounded-full bg-green-500 shrink-0" />
            )}

            <button
              type="button"
              aria-label="View message"
              onClick={() => setIsModalOpen(true)}
              className="p-space-2 rounded-md bg-secondary/10 text-secondary"
            >
              <i className="fi fi-rr-arrow-small-right" />
            </button>
          </div>
        </td>
      </tr>

      {isModalOpen && (
        <ViewMessageModal
          messageId={message._id}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default MessageRow;
