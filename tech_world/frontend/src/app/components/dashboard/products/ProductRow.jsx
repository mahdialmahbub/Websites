// components/dashboard/products/ProductRow.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useUpdateProductMutation } from "@/redux/api/adminProductApi"; // apnar actual path diye bodle nin
import ProductStatusToggle from "./ProductStatusToggle";

const ProductRow = ({ product, isDashboard = true }) => {
  const [status, setStatus] = useState(product.status);
  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  const handleStatusChange = async (newStatus) => {
    const prevStatus = status;
    setStatus(newStatus); // optimistic update — toggle instant e flip hobe

    try {
      await updateProduct({ id: product._id, status: newStatus }).unwrap();
    } catch (err) {
      setStatus(prevStatus); // fail hole revert
      console.error(
        "Failed to update status:",
        err?.data || err?.message || err,
      );
    }
  };

  return (
    <tr className="bg-secondary/3 hover:bg-secondary/10 transition-colors *:p-space-3 *:first:rounded-l-xl *:last:rounded-r-xl">
      <td className="text-placeholder_3">{product._id}</td>
      <td>
        <div className="flex items-center gap-space-3">
          {product?.images?.[0] && (
            <Image
              src={product.images[0].url}
              alt={product.title}
              width={40}
              height={40}
              className="rounded-md object-cover"
            />
          )}
          <span>{product.title}</span>
        </div>
      </td>
      <td>${product.startingPrice}</td>
      <td>
        <ProductStatusToggle
          status={status}
          onChange={handleStatusChange}
          disabled={isLoading}
        />
      </td>
      <td>{product.category?.name}</td>
      <td>{product.stock}</td>
      {!isDashboard && (
        <td>
          {new Date(product.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </td>
      )}
      <td>
        <div className="flex items-center justify-end">
          <button className="p-space-2 rounded-md bg-secondary/10 text-secondary">
            <i className="fi fi-rr-arrow-small-right"></i>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductRow;
