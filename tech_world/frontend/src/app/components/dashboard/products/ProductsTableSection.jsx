import React, { useState } from "react";
import { useGetProductsAdminQuery } from "@/redux";
import Link from "next/link";
import Select from "../Select";
import SearchBar from "../../SearchBar";
import ProductsTable from "./ProductsTable";
import Button from "../../Button";
import TableToolbar from "../TableToolbar";

const statusOptions = [
  { label: "All Status", value: "" },
  { label: "Active", value: "Active" },
  { label: "Draft", value: "draft" },
  { label: "Out of Stock", value: "out_of_stock" },
];

// Placeholder — replace with your real categories (static list or
// useGetCategoriesQuery if categories are managed dynamically).
const categoryOptions = [
  { label: "All Categories", value: "" },
];

const sortOptions = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

const ProductsTableSection = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError } = useGetProductsAdminQuery({
    search,
    status,
    category,
    sortBy,
    page,
    limit: 10,
  });

  const products = data?.data?.products || [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.totalPages || 1;

  const handleStatusChange = (value) => {
    setStatus(value);
    setPage(1);
  };
  const handleCategoryChange = (value) => {
    setCategory(value);
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

  return (
    <div className="space-y-space-5">
      <TableToolbar title="Products">
        <Select
          label="Status"
          options={statusOptions}
          value={status}
          onChange={handleStatusChange}
        />
        <Select
          label="Category"
          options={categoryOptions}
          value={category}
          onChange={handleCategoryChange}
        />
        <Select
          label="Sort By"
          options={sortOptions}
          value={sortBy}
          onChange={handleSortChange}
        />
        <SearchBar
          placeholder="Search products..."
          onSearch={handleSearch}
          isLoading={isFetching}
        />
        <Link href={"/dashboard/products/add"}>
          <Button>Add Product</Button>
        </Link>
      </TableToolbar>

      {isLoading ? (
        <p className="text-center py-space-9 text-placeholder_3">
          Loading products...
        </p>
      ) : isError ? (
        <p className="text-center py-space-9 text-red-400">
          Failed to load products. Please try again.
        </p>
      ) : products.length === 0 ? (
        <p className="text-center py-space-9 text-placeholder_3">
          No products found.
        </p>
      ) : (
        <ProductsTable products={products} />
      )}

      {!isLoading && !isError && products.length > 0 && totalPages > 1 && (
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

export default ProductsTableSection;