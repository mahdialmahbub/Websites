import React, { useState } from "react";
import Select from "../Select";
import SearchBar from "../../SearchBar";
import TableToolbar from "../TableToolbar";
import { useGetOrdersAdminQuery } from "@/redux";
import OrdersTable from "./OrderTable";

const statusOptions = [
  { label: "All Status", value: "" },
  { label: "Pending", value: "Pending" },
  { label: "Placed", value: "Placed" },
  { label: "Processing", value: "Processing" },
  { label: "Packed", value: "Packed" },
  { label: "Shipped", value: "Shipped" },
  { label: "Out for Delivery", value: "Out for Delivery" },
  { label: "Delivered", value: "Delivered" },
  { label: "Canceled", value: "Canceled" },
];

const paymentOptions = [
  { label: "All Payment Methods", value: "" },
  { label: "Credit Card", value: "Credit Card" },
  { label: "Cash on Delivery", value: "Cash on Delivery" },
];

const paymentStatusOptions = [
  { label: "All Payment Status", value: "" },
  { label: "Pending", value: "Pending" },
  { label: "Paid", value: "Paid" },
  { label: "Failed", value: "Failed" },
  { label: "Refunded", value: "Refunded" },
];

const sortOptions = [
  { label: "Sort by Price", value: "" },
  { label: "Price: Low to High", value: "asc" },
  { label: "Price: High to Low", value: "desc" },
];

const OrdersTableSection = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [sortByPrice, setSortByPrice] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError } = useGetOrdersAdminQuery({
    search,
    status,
    paymentMethod,
    paymentStatus,
    sortByPrice,
    page,
    limit: 10,
  });

  const orders = data?.data?.orders || [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.totalPages || 1;

  // Reset to page 1 whenever a filter changes — otherwise you can get
  // stuck on page 4 with a filter that only has 1 page of results.
  const handleStatusChange = (value) => {
    setStatus(value);
    setPage(1);
  };
  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value);
    setPage(1);
  };
  const handlePaymentStatusChange = (value) => {
    setPaymentStatus(value);
    setPage(1);
  };
  const handleSortChange = (value) => {
    setSortByPrice(value);
    setPage(1);
  };
  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="space-y-space-5">
      <TableToolbar title="Pending Orders">
        <Select
          label="Status"
          options={statusOptions}
          value={status}
          onChange={handleStatusChange}
        />
        <Select
          label="Payment Options"
          options={paymentOptions}
          value={paymentMethod}
          onChange={handlePaymentMethodChange}
        />
        <Select
          label="Payment Status"
          options={paymentStatusOptions}
          value={paymentStatus}
          onChange={handlePaymentStatusChange}
        />
        <Select
          label="Sort"
          options={sortOptions}
          value={sortByPrice}
          onChange={handleSortChange}
        />
        <SearchBar
          placeholder="Search orders..."
          onSearch={handleSearch}
          isLoading={isFetching}
        />
      </TableToolbar>

      {isLoading ? (
        <p className="text-center py-space-9 text-placeholder_3">
          Loading orders...
        </p>
      ) : isError ? (
        <p className="text-center py-space-9 text-red-400">
          Failed to load orders. Please try again.
        </p>
      ) : orders.length === 0 ? (
        <p className="text-center py-space-9 text-placeholder_3">
          No orders found.
        </p>
      ) : (
        <OrdersTable orders={orders} />
      )}

      {!isLoading && !isError && orders.length > 0 && totalPages > 1 && (
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
    </div>
  );
};

export default OrdersTableSection;
