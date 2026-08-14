"use client";

import React, { useMemo, useState } from "react";
import { Filter, ChevronDown } from "lucide-react";

/**
 * FilterBar
 * -------------------------------------------------------------
 * Ei component nijer kono hardcoded category/brand/tag rakhe na —
 * shob kichu `products` array theke automatically derive hoy:
 *
 *   - Category  → products[].category theke unique value gulo
 *   - Brand     → products[].brand theke unique value gulo
 *   - Sort By   → "Low To High" / "High To Low" (price diye) +
 *                 products[].tags theke unique tag gulo
 *
 * Notun product data add korle, notun category/brand/tag thakle
 * seta automatically filter bar e chole ashbe — kono manual change
 * lagbe na.
 *
 * Prottek section e prothome 5 ta option dekhabe, baki gulo
 * "See More" click korle dekhabe (abar "See Less" diye lukiye
 * felbe). Active option colored (cyan), deselected gray.
 */

const VISIBLE_COUNT = 5;

/* ---------- helper: products theke unique value ber kora ---------- */
function getUniqueValues(products, key) {
  const values = products
    .map((p) => p[key])
    .filter(Boolean);
  return Array.from(new Set(values));
}

function getUniqueTags(products) {
  const allTags = products.flatMap((p) => p.tags || []);
  // Percentage discount tags ("25% Discount") sort-by te dorkar nai,
  // shudhu descriptive tags gulo rakhbo (jemon "Best Seller", "New Arrival")
  const filtered = allTags.filter((tag) => !/%/.test(tag));
  return Array.from(new Set(filtered));
}

/* ---------- reusable pill button ---------- */
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

/* ---------- reusable section: title + pills + see more/less ---------- */
function FilterSection({ title, options, selected, onSelect }) {
  const [expanded, setExpanded] = useState(false);

  const withAll = ["All", ...options];
  const visibleOptions = expanded ? withAll : withAll.slice(0, VISIBLE_COUNT);
  const hasMore = withAll.length > VISIBLE_COUNT;

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {title}
      </p>

      <div className="flex flex-wrap gap-2">
        {visibleOptions.map((option) => (
          <FilterPill
            key={option}
            label={option}
            active={selected === option}
            onClick={() => onSelect(option)}
          />
        ))}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
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

/* ============================== MAIN ============================== */
export function FilterBar({ products = [], onChange }) {
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [sortBy, setSortBy] = useState("All");

  const categories = useMemo(() => getUniqueValues(products, "category"), [products]);
  const brands = useMemo(() => getUniqueValues(products, "brand"), [products]);
  const sortTags = useMemo(() => getUniqueTags(products), [products]);
  const sortOptions = useMemo(
    () => ["Low To High", "High To Low", ...sortTags],
    [sortTags]
  );

  const updateFilter = (nextCategory, nextBrand, nextSortBy) => {
    onChange?.({
      category: nextCategory,
      brand: nextBrand,
      sortBy: nextSortBy,
    });
  };

  const handleCategory = (value) => {
    setCategory(value);
    updateFilter(value, brand, sortBy);
  };

  const handleBrand = (value) => {
    setBrand(value);
    updateFilter(category, value, sortBy);
  };

  const handleSortBy = (value) => {
    setSortBy(value);
    updateFilter(category, brand, value);
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
        selected={category}
        onSelect={handleCategory}
      />

      <div className="h-px bg-white/10" />

      <FilterSection
        title="Brand"
        options={brands}
        selected={brand}
        onSelect={handleBrand}
      />

      <div className="h-px bg-white/10" />

      <FilterSection
        title="Sort By"
        options={sortOptions}
        selected={sortBy}
        onSelect={handleSortBy}
      />
    </aside>
  );
}

/* =====================================================================
 * DEMO — parent component ei rokom kore FilterBar ke products pass
 * korbe, ar onChange theke selected filter niye product list filter/
 * sort korbe.
 *
 * NOTE: Ei demo self-contained rakhar jonno chotto sample data use
 * kora hoyeche. Real project e apni ei jaygay nijer products.js file
 * theke import korben:
 *   import { products } from "@/data/products";
 * ===================================================================== */
const sampleProducts = [
  { id: 1, title: "NovaTech X15 Pro Gaming Laptop", category: "Laptop", brand: "Dell", price: 1299, tags: ["International Best Seller", "25% Discount"] },
  { id: 2, title: "Zenith S24 Ultra Smartphone", category: "Smartphone", brand: "Samsung", price: 899, tags: ["New Arrival", "10% Discount"] },
  { id: 3, title: "AeroTab 11 Pro Tablet", category: "Tablet", brand: "Apple", price: 549, tags: ["Best Seller", "15% Discount"] },
  { id: 4, title: "LumaShot X Mirrorless Camera", category: "Camera", brand: "Canon", price: 1499, tags: ["Editor's Choice", "20% Discount"] },
  { id: 5, title: "SonicWave Pro Headphones", category: "Headphone", brand: "Sony", price: 179, tags: ["Top Rated", "18% Discount"] },
  { id: 6, title: "PulseFit GT Smartwatch", category: "Smartwatch", brand: "Samsung", price: 249, tags: ["Trending", "12% Discount"] },
  { id: 7, title: "AirBeat Pro Wireless Earbuds", category: "Earbuds", brand: "Apple", price: 99, tags: ["Hot Deal", "22% Discount"] },
  { id: 8, title: "ViewMax 32 4K UHD Monitor", category: "Monitor", brand: "LG", price: 399, tags: ["Staff Pick", "16% Discount"] },
  { id: 9, title: "Cascade RGB Mechanical Keyboard", category: "Keyboard", brand: "Logitech", price: 79, tags: ["Popular", "14% Discount"] },
];

export default function FilterBarDemo() {
  const [filters, setFilters] = useState({
    category: "All",
    brand: "All",
    sortBy: "All",
  });

  const filteredProducts = useMemo(() => {
    let result = [...sampleProducts];

    if (filters.category !== "All") {
      result = result.filter((p) => p.category === filters.category);
    }

    if (filters.brand !== "All") {
      result = result.filter((p) => p.brand === filters.brand);
    }

    if (filters.sortBy === "Low To High") {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === "High To Low") {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy !== "All") {
      // tag-based sort by, jemon "Best Seller", "New Arrival"
      result = result.filter((p) => p.tags?.includes(filters.sortBy));
    }

    return result;
  }, [filters]);

  return (
    <div className="flex min-h-screen gap-6 bg-[#0a0b10] p-8">
      <FilterBar products={sampleProducts} onChange={setFilters} />

      <div className="flex-1 space-y-3">
        <p className="text-sm text-slate-400">
          {filteredProducts.length} products found
        </p>
        <div className="grid grid-cols-3 gap-4">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-white/10 bg-[#12141c] p-3 text-sm text-slate-200"
            >
              {p.title} — $ {p.price}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
