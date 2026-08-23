"use client";

import React, { useMemo, useState } from "react";
import { Filter, ChevronDown } from "lucide-react";

const VISIBLE_COUNT = 5;

/* =========================================================
   Helpers
   ========================================================= */

/**
 * Converts populated backend values into plain strings.
 *
 * Supports:
 * "Laptop"
 * { _id: "...", name: "Laptop" }
 * null / undefined
 */
function normalizeValue(value) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (value && typeof value === "object") {
    return value.name?.trim?.() || value.title?.trim?.() || "";
  }

  return "";
}

/**
 * Get unique values from products.
 *
 * Example:
 * products[].category
 * products[].brand
 */
function getUniqueValues(products, key) {
  const values = products
    .map((product) => normalizeValue(product?.[key]))
    .filter(Boolean);

  return [...new Set(values)];
}

/**
 * Get unique tag/badge names.
 *
 * Supports:
 * tags: ["Best Seller", "New Arrival"]
 *
 * or:
 * badges: [
 *   { _id: "...", name: "Best Seller" }
 * ]
 *
 * Percentage discount tags are excluded because
 * they are not useful as tag filters in this UI.
 */
function getUniqueTags(products) {
  const allTags = products.flatMap((product) => {
    const source = product?.tags ?? product?.badges ?? [];

    if (!Array.isArray(source)) {
      return [];
    }

    return source.map((tag) => normalizeValue(tag)).filter(Boolean);
  });

  return [...new Set(allTags.filter((tag) => !/%/.test(tag)))];
}

/**
 * Add "All" once and prevent duplicate values.
 */
function withAll(options = []) {
  return ["All", ...options.filter((option) => option && option !== "All")];
}

/* =========================================================
   Filter Pill
   ========================================================= */

function FilterPill({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400/40"
          : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-300"
      }`}
    >
      {label}
    </button>
  );
}

/* =========================================================
   Filter Section
   ========================================================= */

function FilterSection({ title, options = [], selected, onSelect }) {
  const [expanded, setExpanded] = useState(false);

  const allOptions = useMemo(() => withAll(options), [options]);

  const visibleOptions = expanded
    ? allOptions
    : allOptions.slice(0, VISIBLE_COUNT);

  const hasMore = allOptions.length > VISIBLE_COUNT;

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {title}
      </p>

      <div className="flex flex-wrap gap-2">
        {visibleOptions.map((option) => (
          <FilterPill
            key={`${title}-${option}`}
            label={option}
            active={selected === option}
            onClick={() => onSelect(option)}
          />
        ))}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="flex items-center gap-1 text-sm font-medium text-cyan-400 hover:text-cyan-300"
        >
          <ChevronDown
            size={14}
            className={`transition-transform ${expanded ? "rotate-180" : ""}`}
          />

          {expanded ? "See Less" : "See More"}
        </button>
      )}
    </div>
  );
}

/* =========================================================
   Main FilterBar
   ========================================================= */

export function FilterBar({ products = [], onChange }) {
  const [filters, setFilters] = useState({
    category: "All",
    brand: "All",
    sortBy: "All",
  });

  const categories = useMemo(
    () => getUniqueValues(products, "category"),
    [products],
  );

  const brands = useMemo(() => getUniqueValues(products, "brand"), [products]);

  const sortTags = useMemo(() => getUniqueTags(products), [products]);

  const sortOptions = useMemo(
    () => ["Low To High", "High To Low", ...sortTags],
    [sortTags],
  );

  const updateFilter = (key, value) => {
    const nextFilters = {
      ...filters,
      [key]: value,
    };

    setFilters(nextFilters);
    onChange?.(nextFilters);
  };

  return (
    <aside className="w-[200px] space-y-6 rounded-2xl border border-white/10 bg-[#0d0f17] p-5">
      <div className="flex items-center gap-2 text-cyan-300">
        <Filter size={16} />

        <h2 className="text-sm font-semibold">Filter your need</h2>
      </div>

      <div className="h-px bg-white/10" />

      <FilterSection
        title="Category"
        options={categories}
        selected={filters.category}
        onSelect={(value) => updateFilter("category", value)}
      />

      <div className="h-px bg-white/10" />

      <FilterSection
        title="Brand"
        options={brands}
        selected={filters.brand}
        onSelect={(value) => updateFilter("brand", value)}
      />

      <div className="h-px bg-white/10" />

      <FilterSection
        title="Sort By"
        options={sortOptions}
        selected={filters.sortBy}
        onSelect={(value) => updateFilter("sortBy", value)}
      />
    </aside>
  );
}
