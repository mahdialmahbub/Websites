// app/product/[id]/page.jsx
"use client"

import { notFound, useParams } from "next/navigation";
import { products } from "@/app/assets/assets";
import ProductDetails from "../ProductDetails";

export default function page() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { id } = useParams()

  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  // Related products: same category, current product bad diye
  const relatedProducts = products.filter(
    (p) => p.category === product.category && p.id !== product.id
  );

  return <ProductDetails product={product} relatedProducts={relatedProducts} />;
}

/*
 * (Optional) Build somoy shob product page pre-generate korte chaile:
 *
 * export async function generateStaticParams() {
 *   return products.map((p) => ({ id: p.id }));
 * }
 */
