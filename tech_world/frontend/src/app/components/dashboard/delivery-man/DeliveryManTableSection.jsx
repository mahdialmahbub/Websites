// components/dashboard/delivery-man/DeliveryManTableSection.jsx

import React, { useState } from "react";
import { createPortal } from "react-dom";
import Select from "../Select";
import SearchBar from "../../SearchBar";
import TableToolbar from "../TableToolbar";
import { useGetDeliveryMenQuery } from "@/redux";
import DeliveryManTable from "./DeliveryManTable";
import DeliveryManFormModal from "./DeliveryManFormModal";
import Button from "../../Button";

const statusOptions = [
  { label: "All Status", value: "" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const DeliveryManTableSection = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

  const { data, isLoading, isFetching, isError } = useGetDeliveryMenQuery({
    search,
    status,
    page,
    limit: 10,
  });

  const deliveryMen = data?.data?.deliveryMen || [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.pages || 1;

  console.log(deliveryMen);
  // Reset to page 1 whenever a filter changes — otherwise you can get
  // stuck on page 4 with a filter that only has 1 page of results.
  const handleStatusChange = (value) => {
    setStatus(value);
    setPage(1);
  };
  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="space-y-space-5">
      <TableToolbar title="Delivery Men">
        <Select
          label="Status"
          options={statusOptions}
          value={status}
          onChange={handleStatusChange}
        />
        <SearchBar
          placeholder="Search delivery men..."
          onSearch={handleSearch}
          isLoading={isFetching}
        />
        <Button type="button" onClick={() => setShowAddModal(true)}>
          +
        </Button>
      </TableToolbar>

      {isLoading ? (
        <p className="text-center py-space-9 text-placeholder_3">
          Loading delivery men...
        </p>
      ) : isError ? (
        <p className="text-center py-space-9 text-red-400">
          Failed to load delivery men. Please try again.
        </p>
      ) : deliveryMen.length === 0 ? (
        <p className="text-center py-space-9 text-placeholder_3">
          No delivery men found.
        </p>
      ) : (
        <DeliveryManTable deliveryMen={deliveryMen} />
      )}

      {!isLoading && !isError && deliveryMen.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-center gap-space-3">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-space-4 py-space-2 rounded-lg border border-secondary/20 text-sm disabled:opacity-40 hover:border-secondary/50 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-placeholder_3">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-space-4 py-space-2 rounded-lg border border-secondary/20 text-sm disabled:opacity-40 hover:border-secondary/50 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* =================================================
          ADD MODAL
      ================================================= */}

      {showAddModal &&
        typeof document !== "undefined" &&
        createPortal(
          <DeliveryManFormModal
            onClose={() => setShowAddModal(false)}
            onSaved={() => setPage(1)}
          />,
          document.body,
        )}
    </div>
  );
};

export default DeliveryManTableSection;
