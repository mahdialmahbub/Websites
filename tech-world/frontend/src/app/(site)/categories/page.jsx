"use client";

import React from "react";
import { Breadcrumb } from "../../components/Breadcrumb";
import { CategoryCard } from "../../components/CategoryCard";
import { useGetProductsQuery, useGetPublicCategoriesQuery } from "@/redux";

const slugify = (name = "") => name.toLowerCase().trim().replace(/\s+/g, "-");

const Page = () => {
  // Get categories
  const {
    data: categoryResponse,
    isLoading: categoryLoading,
    isError: categoryError,
  } = useGetPublicCategoriesQuery();

  // Get products
  const {
    data: productResponse,
    isLoading: productLoading,
    isError: productError,
  } = useGetProductsQuery();

  // Your API response structure
  const categories = categoryResponse?.data ?? [];
  const products = productResponse?.data?.products ?? [];

  console.log("Categories:", categories);
  console.log("Products:", products);

  // Find first product image for each category
  const getCategoryImage = (category) => {
    const matchedProduct = products.find((product) => {
      if (typeof product.category === "string") {
        return product.category === category._id;
      }

      if (product.category?._id) {
        return product.category._id === category._id;
      }

      return false;
    });

    console.log("Category:", category.name);
    console.log("Matched Product:", matchedProduct);

    if (!matchedProduct) {
      return "/images/category-placeholder.png";
    }

    if (Array.isArray(matchedProduct.images)) {
      return (
        matchedProduct.images[0]?.url || "/images/category-placeholder.png"
      );
    }

    return "/images/category-placeholder.png";
  };

  const isLoading = categoryLoading || productLoading;
  const isError = categoryError || productError;

  return (
    <section>
      {/* Breadcrumb */}
      <div className="px-space-11 py-space-7">
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Categories" }]}
        />
      </div>

      {/* Loading */}
      {isLoading && (
        <p className="px-space-11 text-slate-400">Loading categories...</p>
      )}

      {/* Error */}
      {isError && (
        <p className="px-space-11 text-red-400">
          Failed to load categories. Try again later.
        </p>
      )}

      {/* Categories */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-4 gap-space-8 px-space-11">
          {categories.map((category) => (
            <CategoryCard
              key={category._id}
              name={category.name}
              slug={slugify(category.name)}
              image={getCategoryImage(category)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Page;
