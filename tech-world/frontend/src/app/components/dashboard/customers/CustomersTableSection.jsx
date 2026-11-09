// components/dashboard/customers/CustomersTableSection.jsx
import React, { useState } from "react";
import Select from "../Select";
import SearchBar from "../../SearchBar";
import TableToolbar from "../TableToolbar";
import { useGetCustomersAdminQuery } from "@/redux";
import CustomersTable from "./CustomersTable";

const sortOptions = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

const methodOptions = [
  { label: "All Methods", value: "" },
  { label: "Cash on Delivery", value: "cod" },
  { label: "Card", value: "card" },
];

const CustomersTableSection = () => {
  const [search, setSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);

  const handleMethodChange = (value) => {
    setPaymentMethod(value);
    setPage(1);
  };
  const handleSortChange = (value) => {
    setSortBy(value);
    setPage(1);
  };
  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const { data, isLoading, isFetching, isError } = useGetCustomersAdminQuery({
    search,
    sortBy,
    paymentMethod,
    page,
    limit: 10,
  });

  const customers = data?.data?.customers || [];
  const pagination = data?.data?.pagination;

  return (
    <div className="space-y-space-5">
      <TableToolbar title="Customers">
        <Select
          label="Sort By"
          options={sortOptions}
          value={sortBy}
          onChange={handleSortChange}
        />
        <Select
          label="Payment Method"
          options={methodOptions}
          value={paymentMethod}
          onChange={handleMethodChange}
        />
        <SearchBar
          placeholder="Search customers..."
          onSearch={handleSearch}
          isLoading={isFetching}
        />
      </TableToolbar>

      {isLoading ? (
        <p className="text-center py-space-9 text-placeholder_3">
          Loading customers...
        </p>
      ) : isError ? (
        <p className="text-center py-space-9 text-red-400">
          Failed to load customers. Please try again.
        </p>
      ) : customers.length === 0 ? (
        <p className="text-center py-space-9 text-placeholder_3">
          No customers found.
        </p>
      ) : (
        <CustomersTable customers={customers} />
      )}

      {!isLoading && !isError && pagination?.pages > 1 && (
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
            Page {page} of {pagination.pages}
          </span>
          <button
            type="button"
            disabled={page === pagination.pages}
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

export default CustomersTableSection;