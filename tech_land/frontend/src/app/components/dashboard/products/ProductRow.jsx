// components/dashboard/products/ProductRow.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import ProductStatusDropdown from "./ProductStatusDropdown";

const ProductRow = ({ product, isDashboard = true }) => {
  const [status, setStatus] = useState(product.status);

  const handleStatusChange = async (newStatus) => {
    const prevStatus = status;
    setStatus(newStatus); // optimistic update

    try {
      // 👉 backend connect korার hook point
      await fetch(`/api/products/${product.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      setStatus(prevStatus); // fail hole revert
      console.error("Failed to update status:", err);
    }
  };

  return (
    <tr className="bg-secondary/3 hover:bg-secondary/10 transition-colors *:p-space-3 *:first:rounded-l-xl *:last:rounded-r-xl">
      <td className="text-placeholder_3">{product.id}</td>
      <td>
        <div className="flex items-center gap-space-3">
          {product.image && (
            <Image
              src={product.image}
              alt={product.name}
              width={40}
              height={40}
              className="rounded-md object-cover"
            />
          )}
          <span>{product.name}</span>
        </div>
      </td>
      <td>${product.price}</td>
      <td>
        <ProductStatusDropdown status={status} onChange={handleStatusChange} />
      </td>
      <td>{product.category}</td>
      <td>{product.stock}</td>
      {!isDashboard && (
        <td>
          {new Date(product.addedOn).toLocaleDateString("en-GB", {
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
