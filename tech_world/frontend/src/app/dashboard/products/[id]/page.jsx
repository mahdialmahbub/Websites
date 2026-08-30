"use client";

import React from "react";
import { useParams, notFound } from "next/navigation";
import Button from "@/app/components/Button";
import { products } from "@/app/assets/assets";
import ProductDetails from "@/app/(site)/product/ProductDetails";
import Link from "next/link";

const Page = () => {
  const { id } = useParams();

  if (!id) {
    notFound();
  }

  return (
    <div className="px-space-6 pb-space-6 pt-space-3">
      {/* products */}
      <div className="p-space-5 rounded-2xl bg-[#1A1E3D]/50">
        <div className="flex items-center justify-between w-full">
          <Link href={""}>
            <Button
              variant="text"
              showLeftIcon
              leftIcon="fi fi-rr-arrow-small-left"
            >
              Back
            </Button>
          </Link>
          <Link href={`/dashboard/products/edit/${id}`}>
            <Button>Edit Product</Button>
          </Link>
        </div>

        {/* product details */}
        <ProductDetails productId={id} isAdmin={true} />
      </div>
    </div>
  );
};

export default Page;
