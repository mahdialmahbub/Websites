"use client";

import React from "react";
import { Breadcrumb } from "../components/Breadcrumb";
import SectionHeader from "../components/homePage/SectionHeader";
import { FilterBar } from "../components/FilterBar";
import { products } from "../assets/assets";
import { ProductCard } from "../components/ProductCard";

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
  const bestSellingProducts = products.filter((product) =>
    product.tags?.some((tag) => tag.toLowerCase().includes("best seller")),
  );

  return (
    <section className="">
      <div className="px-space-11 py-space-7 flex flex-col gap-space-7">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Wishlist" }, // last item — no href, highlighted
          ]}
        />
        <SectionHeader type="product" title={"Wishlist"} />
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
