// components/dashboard/products/ProductRow.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import {
  useDeleteProductMutation,
  useUpdateProductMutation,
} from "@/redux/api/adminProductApi"; // apnar actual path diye bodle nin
import ProductStatusToggle from "./ProductStatusToggle";
import { useRouter } from "next/navigation";
import ConfirmModal from "../../ConfiremationModal";

const ProductRow = ({ product, isDashboard = true }) => {
  const router = useRouter();
  const [status, setStatus] = useState(product.status);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();

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

  const handleConfirmDelete = async () => {
    if (!product?._id) return;

    try {
      await deleteProduct(product._id).unwrap();

      toast.success("Product deleted");

      setShowDeleteConfirm(false);
    } catch (err) {
      toast.error(err?.data?.message || "Could not delete this product.");

      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
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
          <div className="flex items-center justify-end gap-space-2">
            {/* Delete */}

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              aria-label="Delete order"
              className="
                p-space-2
                rounded-md
                bg-red-500/10
                text-red-500
              "
            >
              <i className="fi fi-rr-trash" />
            </button>

            {/* Edit */}

            <button
              type="button"
              onClick={() => router.push(`/dashboard/products/edit/${product._id}`)}
              aria-label="Edit order"
              className="
                p-space-2
                rounded-md
                bg-green-500/10
                text-green-500
              "
            >
              <i className="fi fi-rr-edit" />
            </button>

            {/* Details */}

            <button
              type="button"
              onClick={() => router.push(`/dashboard/products/${product._id}`)}
              aria-label="View order details"
              className="
                p-space-2
                rounded-md
                bg-secondary/10
                text-secondary
              "
            >
              <i className="fi fi-rr-arrow-small-right" />
            </button>
          </div>
        </td>
      </tr>

      {showDeleteConfirm &&
        typeof document !== "undefined" &&
        createPortal(
          <ConfirmModal
            title="Delete this order?"
            message={`This will permanently delete order ${
              order.orderId
            }. This can't be undone.`}
            confirmText="Delete"
            isLoading={deleting}
            onConfirm={handleConfirmDelete}
            onClose={() => setShowDeleteConfirm(false)}
          />,
          document.body,
        )}
    </>
  );
};

export default ProductRow;
