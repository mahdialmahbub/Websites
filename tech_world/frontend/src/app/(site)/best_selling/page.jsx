/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React from "react";
import { Breadcrumb } from "../../components/Breadcrumb";
import SectionHeader from "../../components/homePage/SectionHeader";
import { FilterBar } from "../../components/FilterBar";
import { ProductCard } from "../../components/ProductCard";
import { useAddToCartMutation, useGetProductsQuery } from "@/redux";

function toCardData(product) {
  return {
    image: product.images?.[0],
    badge: product.category,
    title: product.title,
    rating: product.rating,
    reviewCount: product.reviewCount,
    price: product.price,
    originalPrice: product.originalPrice,
    buttonText: "Add to cart",
  };
}

const page = () => {

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
    product.tags?.some((tag) => tag.toLowerCase().includes("best seller")),
  );

    if (isLoading) {
      return (
        <section className="section">
          <SectionHeader title={"Best Selling"} />
          <p className="mt-space-7 text-slate-500">Loading products…</p>
        </section>
      );
    }
  
    if (isError) {
      return (
        <section className="section">
          <SectionHeader title={"Best Selling"} />
          <p className="mt-space-7 text-red-400">Couldn&apos;t load products. Please try again.</p>
        </section>
      );
    }
  
  return (
    <section>
      <div className="px-space-11 py-space-7 flex flex-col gap-space-7">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Best Selling" }, // last item — no href, highlighted
          ]}
        />
        <SectionHeader type="product" title={"Best Selling"} />
      </div>
      <div className="flex gap-space-7 px-space-11">
        <FilterBar products={products} />
        {bestSellingProducts.length === 0 ? (
          <p>No Product Found</p>
        ) : (
          <div className="flex flex-wrap gap-5">
            {bestSellingProducts.map((product) => (
              <ProductCard
                key={product.id}
                variant="primary"
                data={toCardData(product)}
                actions={{
                  onFavorite: () =>
                    console.log("toggled favorite:", product.id),
                  onPrimary: () => console.log("added to cart:", product.id),
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default page;
