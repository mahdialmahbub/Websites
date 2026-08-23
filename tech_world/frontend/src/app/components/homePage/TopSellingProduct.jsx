"use client"

import React from "react";
import SectionHeader from "./SectionHeader";
import { ProductCard } from "../ProductCard";
import toCardData from "../ToCardData";
import { useGetProductsQuery, useAddToCartMutation } from "@/redux";

const TopSellingProduct = () => {

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

  const bestSellingProducts = products.filter((product) =>
    product.tags?.some((tag) => tag.toLowerCase().includes("best")),
  );

  return (
    <section className="section">
      <SectionHeader title={"Top Selling Product"} />
      {bestSellingProducts.length === 0 ? (
        <p>No Product Found</p>
      ) : (
        <div className="flex items-center gap-space-5 mt-space-7 overflow-x-auto">
          {bestSellingProducts.map((product) => (
            <ProductCard
              key={product.id}
              variant="primary"
              data={toCardData(product)}
              actions={{
                onFavorite: () => console.log("toggled favorite:", product.id),
                onPrimary: () => console.log("added to cart:", product.id),
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default TopSellingProduct;
