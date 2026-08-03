"use client"

import React from "react";
import SectionHeader from "./SectionHeader";
import { products } from "@/app/assets/assets";
import { ProductCard } from "../ProductCard";
import toCardData from "../ToCardData";

const ForYou = () => {
  return (
    <section className="section">
      <SectionHeader title={"For You"} />
      <div className="flex items-center gap-space-5 mt-space-7 overflow-x-auto">
        {products.map((product) => (
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
    </section>
  );
};

export default ForYou;
