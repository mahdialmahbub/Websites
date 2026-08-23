/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useGetMyWishlistQuery, useRemoveFromWishlistMutation, useAddToCartMutation } from "@/redux";
import { Breadcrumb } from "@/app/components/Breadcrumb";
import { FilterBar } from "@/app/components/FilterBar";
import { ProductCard } from "@/app/components/ProductCard";
import SectionHeader from "@/app/components/homePage/SectionHeader";

// FilterBar derives its category/brand/tag option lists by comparing plain
// strings (p.category === selected) — backend data has those as populated
// objects ({_id, name}), so we flatten them here before handing off.
function toFilterableProduct(product) {
  return {
    ...product,
    category: product.category?.name,
    brand: product.brand?.name,
    tags: (product.badges || []).map((b) => b.name),
  };
}

function toCardData(product) {
  const original = product.startingPrice;
  const hasDiscount = product.discountPercentage > 0;
  const discounted = hasDiscount
    ? Math.round(original * (1 - product.discountPercentage / 100) * 100) / 100
    : original;

  return {
    id: product._id,
    image: product.images?.[0]?.url,
    badge: product.badges?.[0]?.name,
    title: product.title,
    rating: product.rating?.average ?? 0,
    reviewCount: product.rating?.count ?? 0,
    price: discounted,
    originalPrice: hasDiscount ? original : undefined,
    buttonText: "Add to cart",
    isFavorite: true, // everything on this page is, by definition, already wishlisted
    status: product.status !== "Active" ? "out of stock" : undefined,
  };
}

const Page = () => {

  const { data, isLoading } = useGetMyWishlistQuery();
  const wishlistProducts = data?.data || [];

  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [addToCart] = useAddToCartMutation();

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ category: "All", brand: "All", sortBy: "All" });

  const filterableProducts = useMemo(() => wishlistProducts.map(toFilterableProduct), [wishlistProducts]);

  // Mirrors FilterBar's own demo filtering logic exactly — FilterBar only
  // reports the selected filter state via onChange, the parent applies it.
  const filteredProducts = useMemo(() => {
    let result = filterableProducts;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q));
    }

    if (filters.category !== "All") {
      result = result.filter((p) => p.category === filters.category);
    }
    if (filters.brand !== "All") {
      result = result.filter((p) => p.brand === filters.brand);
    }

    if (filters.sortBy === "Low To High") {
      result = [...result].sort((a, b) => a.startingPrice - b.startingPrice);
    } else if (filters.sortBy === "High To Low") {
      result = [...result].sort((a, b) => b.startingPrice - a.startingPrice);
    } else if (filters.sortBy !== "All") {
      // a badge/tag name was picked instead of a price sort -> filter by it
      result = result.filter((p) => p.tags?.includes(filters.sortBy));
    }

    return result;
  }, [filterableProducts, search, filters]);

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId).unwrap();
      toast.success("Removed from wishlist");
    } catch (err) {
      toast.error(err?.data?.message || "Could not remove from wishlist.");
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart({ productId, selectedVariantIds: [], quantity: 1 }).unwrap();
      toast.success("Added to cart");
    } catch (err) {
      toast.error(err?.data?.message || "Could not add to cart.");
    }
  };

  return (
    <section className="">
      <div className="px-space-11 py-space-7 flex flex-col gap-space-7">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
        <SectionHeader type="product" title={"Wishlist"} searchValue={search} onSearchChange={setSearch} />
      </div>
      <div className="flex gap-space-7 px-space-11">
        <FilterBar products={filterableProducts} onChange={setFilters} />

        {isLoading ? (
          <p className="text-slate-500">Loading your wishlist...</p>
        ) : filteredProducts.length === 0 ? (
          <p>No Product Found</p>
        ) : (
          <div className="flex flex-wrap gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                variant="primary"
                data={toCardData(product)}
                actions={{
                  onFavorite: () => handleRemove(product._id),
                  onPrimary: () => handleAddToCart(product._id),
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Page;
