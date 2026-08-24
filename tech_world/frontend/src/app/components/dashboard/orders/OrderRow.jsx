"use client";

import Image from "next/image";
import Tag from "../../Tag";
import OrderStatusDropdown from "./OrderStatusDropdown";
import { useState } from "react";

// deliveryAddress snapshot → readable string
const formatAddress = (addr) => {
  if (!addr) return "—";
  const parts = [
    addr.roadNumber  && `Road ${addr.roadNumber}`,
    addr.area,
    addr.city,
    addr.postCode,
    addr.country,
  ].filter(Boolean);
  return parts.join(", ") || "—";
};

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// components/dashboard/orders/OrderRow.jsx
const OrderRow = ({ order, isDashboard = true }) => {
  const [status, setStatus] = useState(order.status);

  const handleStatusChange = async (newStatus) => {
    const prevStatus = status;
    setStatus(newStatus); // optimistic update

    try {
      // ✅ Fixed: order.orderId use করা হচ্ছে, আগে product.id ছিল (undefined)
      await fetch(`/api/orders/${order.orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      setStatus(prevStatus); // fail হলে revert
      console.error("Failed to update status:", err);
    }
  };

  // ✅ items একটা array — প্রথম item নিয়ে বাকিগুলো "+N more" দিয়ে দেখাচ্ছি
  const firstItem = order.items?.[0];
  const extraCount = (order.items?.length ?? 1) - 1;
  const itemLabel = firstItem
    ? extraCount > 0
      ? `${firstItem.productTitle} +${extraCount} more`
      : firstItem.productTitle
    : "—";

  // ✅ সব items এর quantity যোগ করে মোট দেখাচ্ছি
  const totalQty = order.items?.reduce((sum, item) => sum + (item.quantity ?? 0), 0) ?? 0;

  return (
    <tr className="border-b border-secondary/5 last:border-0 odd:bg-primary/5 even:bg-secondary/5 transition-colors hover:odd:bg-primary/10 hover:even:bg-secondary/10 *:first:rounded-l-xl *:last:rounded-r-xl overflow-hidden text-size-h6 *:p-space-3">

      {/* ✅ order._id → order.orderId (schema এ unique orderId আছে) */}
      <td className="text-placeholder_3">{order.orderId}</td>

      {/* Customer */}
      <td>
        <div className="flex items-center gap-space-3">
          {order.customer?.image?.url && (
            <Image
              alt={order.customer.name}
              src={order.customer.image.url}
              height={42}
              width={42}
              className="rounded-full size-[42px] object-cover"
            />
          )}
          <div className="space-y-0.5">
            <p className="font-medium text-size-large">{order.customer?.name ?? "—"}</p>
            <h6 className="font-medium text-size-h6">{order.customer?.phone ?? "—"}</h6>
          </div>
        </div>
      </td>

      {/* ✅ items array থেকে productTitle নেওয়া হচ্ছে */}
      <td>{itemLabel}</td>

      {/* Status Dropdown */}
      <td>
        <OrderStatusDropdown status={status} onChange={handleStatusChange} />
      </td>

      {/* ✅ items array reduce করে total quantity */}
      <td>
        <Tag property="filter" text={totalQty} />
      </td>

      {/* ✅ order.price নেই schema তে → order.total */}
      <td>${order.total?.toFixed(2) ?? "0.00"}</td>

      {/* ✅ order.address নেই → deliveryAddress snapshot format করা হচ্ছে */}
      <td>{formatAddress(order.deliveryAddress)}</td>

      {/* ✅ order.purcheseOn নেই → timestamps এর createdAt */}
      <td>{formatDate(order.createdAt)}</td>

      <td>{order.paymentMethod ?? "—"}</td>

      {/* Actions */}
      <td>
        <div className="flex items-center justify-end gap-space-2">
          <button className="p-space-2 rounded-md bg-red-500/10 text-red-500">
            <i className="fi fi-rr-trash"></i>
          </button>
          <button className="p-space-2 rounded-md bg-green-500/10 text-green-500">
            <i className="fi fi-rr-edit"></i>
          </button>
          <button className="p-space-2 rounded-md bg-secondary/10 text-secondary">
            <i className="fi fi-rr-arrow-small-right"></i>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default OrderRow;
