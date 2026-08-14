"use client";

import React from "react";
import { useParams, notFound } from "next/navigation";
import Button from "@/app/components/Button";
import { products } from "@/app/assets/assets";
import ProductDetails from "@/app/products/ProductDetails";

const Page = () => {
  const { id } = useParams();

  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="px-space-6 pb-space-6 pt-space-3">
      {/* products */}
      <div className="p-space-5 rounded-2xl bg-[#1A1E3D]/50">
        <div className="flex items-center justify-between w-full">
          <Button
            variant="text"
            showLeftIcon
            leftIcon="fi fi-rr-arrow-small-left"
          >
            Back
          </Button>

          <Button variant="secondary" color={"#00D100"}></Button>
        </div>

        {/* product details */}
        <ProductDetails product={product} isAdmin={true} />
      </div>
    </div>
  );
};

export default Page;