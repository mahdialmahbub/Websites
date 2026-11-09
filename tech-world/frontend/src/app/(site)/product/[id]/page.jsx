// app/product/[id]/page.jsx
"use client";

import { use } from "react";
import ProductDetails from "../ProductDetails";

export default function Page({ params }) {
  const { id } = use(params); // Next.js 15: params is now a Promise, must be unwrapped
  return <ProductDetails productId={id} />;
}
