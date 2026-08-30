// components/dashboard/messages/MessagesTableSection.jsx
import React, { useState } from "react";
import SearchBar from "../../SearchBar";
import TableToolbar from "../TableToolbar";
import { useGetMessagesAdminQuery } from "@/redux";
import MessagesTable from "./MessagesTable";

const MessagesTableSection = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const { data, isLoading, isFetching, isError } = useGetMessagesAdminQuery({
    search,
    page,
    limit: 10,
  });
  const messages = data?.data?.messages || [];
  const pagination = data?.data?.pagination;

  return (
    <div className="space-y-space-5">
      <TableToolbar title="Messages">
        <SearchBar
          placeholder="Search messages..."
          onSearch={handleSearch}
          isLoading={isFetching}
        />
      </TableToolbar>

      {isLoading ? (
        <p className="text-center py-space-9 text-placeholder_3">
          Loading messages...
        </p>
      ) : isError ? (
        <p className="text-center py-space-9 text-red-400">
          Failed to load messages. Please try again.
        </p>
      ) : messages.length === 0 ? (
        <p className="text-center py-space-9 text-placeholder_3">
          No messages found.
        </p>
      ) : (
        <MessagesTable messages={messages} />
      )}

      {!isLoading && !isError && pagination?.total > pagination?.limit && (
        <div className="flex items-center justify-center gap-space-3 pt-space-5">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-space-4 py-space-2 rounded-lg border border-secondary/20 text-sm disabled:opacity-40 hover:border-secondary/50 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-placeholder_3">
            Page {page} of {Math.ceil(pagination.total / pagination.limit)}
          </span>
          <button
            type="button"
            disabled={page >= Math.ceil(pagination.total / pagination.limit)}
            onClick={() => setPage((p) => p + 1)}
            className="px-space-4 py-space-2 rounded-lg border border-secondary/20 text-sm disabled:opacity-40 hover:border-secondary/50 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MessagesTableSection;