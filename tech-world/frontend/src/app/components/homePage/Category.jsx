"use client"

import React from "react";
import SectionHeader from "./SectionHeader";
import Image from "next/image";
import { CategoryCard } from "../CategoryCard";
import { categories } from "../GetCategory";
import { useGetProductsQuery, useGetPublicCategoriesQuery } from "@/redux";

const slugify = (name = "") => name.toLowerCase().trim().replace(/\s+/g, "-");

const Category = () => {
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
    <section className="section">
      <SectionHeader title={"Category"} />
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

      {!isLoading && !isError && (
        <div className="flex gap-space-7 overflow-x-auto scrollbar-hide">
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

export default Category;
