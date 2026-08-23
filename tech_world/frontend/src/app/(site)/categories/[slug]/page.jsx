/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

import {
  useGetProductsQuery,
  useAddToCartMutation,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "@/redux";

import { Breadcrumb } from "@/app/components/Breadcrumb";
import { FilterBar } from "@/app/components/FilterBar";
import { ProductCard } from "@/app/components/ProductCard";
import SectionHeader from "@/app/components/homePage/SectionHeader";


// Convert backend populated objects into FilterBar-friendly values
function toFilterableProduct(product) {
  return {
    ...product,
    category: product.category?.name || "",
    brand: product.brand?.name || "",
    tags: (product.badges || []).map((badge) => badge.name),
  };
}


// Convert backend product into ProductCard data
function toCardData(product) {
  const original = product.startingPrice ?? 0;

  const hasDiscount = product.discountPercentage > 0;

  const discounted = hasDiscount
    ? Math.round(
        original *
          (1 - product.discountPercentage / 100) *
          100
      ) / 100
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
    isFavorite: product.isWishlisted ?? false,
    status:
      product.status !== "Active"
        ? "out of stock"
        : undefined,
  };
}


const Page = () => {
  const { slug } = useParams();

  // Get all products
  const {
    data,
    isLoading,
    isError,
  } = useGetProductsQuery();

  const products = data?.data?.products ?? [];


  // Mutations
  const [addToCart] = useAddToCartMutation();
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] =
    useRemoveFromWishlistMutation();


  // Search state
  const [search, setSearch] = useState("");


  // Filter state
  const [filters, setFilters] = useState({
    category: "All",
    brand: "All",
    sortBy: "All",
  });


  // First filter products by current category
  const categoryProducts = useMemo(() => {
    const currentSlug = slug?.toLowerCase();

    return products.filter((product) => {
      const categoryName = product?.category?.name;

      if (!categoryName) return false;

      return (
        categoryName.toLowerCase().trim() ===
        currentSlug
      );
    });
  }, [products, slug]);


  // Convert for FilterBar
  const filterableProducts = useMemo(
    () =>
      categoryProducts.map(toFilterableProduct),
    [categoryProducts]
  );


  // Search + filter + sorting
  const filteredProducts = useMemo(() => {
    let result = [...filterableProducts];


    // Search
    if (search.trim()) {
      const q = search.trim().toLowerCase();

      result = result.filter((product) =>
        product.title?.toLowerCase().includes(q)
      );
    }


    // Category filter
    // We already limited products to current category,
    // but keep this because FilterBar controls it.
    if (filters.category !== "All") {
      result = result.filter(
        (product) =>
          product.category === filters.category
      );
    }


    // Brand filter
    if (filters.brand !== "All") {
      result = result.filter(
        (product) =>
          product.brand === filters.brand
      );
    }


    // Sorting / badge filtering
    if (filters.sortBy === "Low To High") {
      result.sort(
        (a, b) =>
          (a.startingPrice ?? 0) -
          (b.startingPrice ?? 0)
      );
    } else if (filters.sortBy === "High To Low") {
      result.sort(
        (a, b) =>
          (b.startingPrice ?? 0) -
          (a.startingPrice ?? 0)
      );
    } else if (filters.sortBy !== "All") {
      result = result.filter((product) =>
        product.tags?.includes(filters.sortBy)
      );
    }


    return result;
  }, [
    filterableProducts,
    search,
    filters,
  ]);


  // Add to cart
  const handleAddToCart = async (productId) => {
    try {
      await addToCart({
        productId,
        selectedVariantIds: [],
        quantity: 1,
      }).unwrap();

      toast.success("Added to cart");
    } catch (err) {
      toast.error(
        err?.data?.message ||
          "Could not add to cart."
      );
    }
  };


  // Add / remove wishlist
  const handleFavorite = async (product) => {
    try {
      if (product.isWishlisted) {
        await removeFromWishlist(product._id).unwrap();

        toast.success(
          "Removed from wishlist"
        );
      } else {
        await addToWishlist(product._id).unwrap();

        toast.success(
          "Added to wishlist"
        );
      }
    } catch (err) {
      toast.error(
        err?.data?.message ||
          "Wishlist update failed."
      );
    }
  };


  return (
    <section>
      {/* Breadcrumb + heading + search */}
      <div className="px-space-11 py-space-7 flex flex-col gap-space-7">
        <Breadcrumb
          items={[
            {
              label: "Home",
              href: "/",
            },
            {
              label: "Categories",
              href: "/categories",
            },
            {
              label: slug,
            },
          ]}
        />

        <SectionHeader
          type="product"
          title={slug}
          searchValue={search}
          onSearchChange={setSearch}
        />
      </div>


      {/* Filter + products */}
      <div className="flex gap-space-7 px-space-11">
        <FilterBar
          products={filterableProducts}
          onChange={setFilters}
        />


        {isLoading ? (
          <p className="text-slate-500">
            Loading products...
          </p>
        ) : isError ? (
          <p className="text-red-400">
            Couldn&apos;t load products.
            Please try again.
          </p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-slate-400">
            No Product Found
          </p>
        ) : (
          <div className="flex flex-wrap gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                variant="primary"
                data={toCardData(product)}
                actions={{
                  onFavorite: () =>
                    handleFavorite(product),

                  onPrimary: () =>
                    handleAddToCart(product._id),
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