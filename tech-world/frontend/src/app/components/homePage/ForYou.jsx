"use client";

import React from "react";
import SectionHeader from "./SectionHeader";
import { useGetProductsQuery, useAddToCartMutation } from "@/redux";
import { ProductCard } from "../ProductCard";
import toCardData from "../ToCardData";

const ForYou = () => {
  const { data, isLoading, isError } = useGetProductsQuery();
  const products = data?.data?.products || [];
  const [addToCart] = useAddToCartMutation();

  const handleAddToCart = async (product) => {
    // Uses whichever variant is marked as default on the product (if any)
    const defaultVariantIds = (product.variants || [])
      .filter((v) => v.isDefault)
      .map((v) => v._id);

    try {
      await addToCart({
        productId: product._id,
        selectedVariantIds: defaultVariantIds,
        quantity: 1,
      }).unwrap();
    } catch (err) {
      console.error("Add to cart failed:", err);
      // TODO: show a toast/error message to the user
    }
  };

  if (isLoading) {
    return (
      <section className="section">
        <SectionHeader title={"For You"} />
        <p className="mt-space-7 text-slate-500">Loading products…</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="section">
        <SectionHeader title={"For You"} />
        <p className="mt-space-7 text-red-400">Couldn&apos;t load products. Please try again.</p>
      </section>
    );
  }

  return (
    <section className="section">
      <SectionHeader title={"For You"} />
      <div className="flex items-center gap-space-5 mt-space-7 overflow-x-auto">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            variant="primary"
            data={toCardData(product)}
            actions={{
              onFavorite: () => console.log("toggled favorite:", product._id),
              onPrimary: () => handleAddToCart(product),
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default ForYou;