"use client"

import Image from "next/image";
import Tag from "../../Tag";
import OrderStatusDropdown from "./OrderStatusDropdown";
import { useState } from "react";

// components/dashboard/orders/OrderRow.jsx
const OrderRow = ({ order, isDashboard = true }) => {

  const [status, setStatus] = useState(order.status);

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
    <tr className="border-b border-secondary/5 last:border-0 odd:bg-primary/5 even:bg-secondary/5 transition-colors hover:odd:bg-primary/10 hover:even:bg-secondary/10 *:first:rounded-l-xl *:last:rounded-r-xl overflow-hidden text-size-h6 *:p-space-3">
      <td className=" text-placeholder_3 ">{order.id}</td>
      <td className="">
        <div className="flex items-center gap-space-3">
          <Image
            alt={order.customer.name}
            src={order.customer.image}
            height={42}
            width={42}
            className="rounded-full size-[42px] object-cover"
          />
          <div className="space-y-0.5">
            <p className="font-medium text-size-large">{order.customer.name}</p>
            <h6 className="font-medium text-size-h6 ">
              {order.customer.number}
            </h6>
          </div>
        </div>
      </td>
      <td className="">{order.productName}</td>

      <td>
        <OrderStatusDropdown status={status} onChange={handleStatusChange} />
      </td>

      <td className=""><Tag property={"filter"} text={order.quantity} /></td>

      <td className="">${order.price}</td>

      <td className="">{order.address}</td>

      <td className="">{order.purcheseOn}</td>

      <td className="">{order.paymentMethod}</td>
      <td className="">
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
