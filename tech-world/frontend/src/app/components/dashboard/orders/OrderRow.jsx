/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";

import Tag from "../../Tag";
import OrderStatusDropdown from "./OrderStatusDropdown";
import EditOrderModal from "./EditOrderModal";
import ConfirmModal from "../../ConfiremationModal";

import {
  useGetOrderDetailsAdminQuery,
  useUpdateOrderStatusAdminMutation,
  useDeleteOrderAdminMutation,
} from "@/redux";

// --------------------------------------------------
// Helpers
// --------------------------------------------------

const formatAddress = (addr) => {
  if (!addr) return "—";

  const parts = [
    addr.roadNumber && `Road ${addr.roadNumber}`,
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

// --------------------------------------------------
// Component
// --------------------------------------------------

const OrderRow = ({ orderId }) => {
  const router = useRouter();

  // ------------------------------------------------
  // Modal states
  // ------------------------------------------------

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Set only when the edit modal is opened via the "Out for Delivery"
  // status pick — tells the modal which status to open on instead of
  // whatever the order's current status is. Cleared whenever the modal
  // closes (cancel or save) so a normal Edit click isn't affected.
  const [pendingStatus, setPendingStatus] = useState(null);

  // ------------------------------------------------
  // Local status state
  // ------------------------------------------------

  const [status, setStatus] = useState("");

  // ------------------------------------------------
  // Fetch single/full order details
  //
  // API only runs when orderId exists.
  // ------------------------------------------------

  const {
    data: orderResponse,
    isLoading: isOrderLoading,
    isFetching: isOrderFetching,
    isError: isOrderError,
  } = useGetOrderDetailsAdminQuery(
    { orderId },
    {
      skip: !orderId,
    },
  );

  // ------------------------------------------------
  // Normalize API response
  //
  // Depending on your backend response:
  //
  // data.data
  // OR
  // data.data.order
  //
  // this supports both.
  // ------------------------------------------------

  const order = orderResponse?.data?.order ?? orderResponse?.data ?? null;

  // ------------------------------------------------
  // Update order mutation
  // ------------------------------------------------

  const [updateOrderStatus] = useUpdateOrderStatusAdminMutation();

  // ------------------------------------------------
  // Delete order mutation
  // ------------------------------------------------

  const [deleteOrder, { isLoading: deleting }] = useDeleteOrderAdminMutation();

  // ------------------------------------------------
  // When API order arrives, update local status
  // ------------------------------------------------

  useEffect(() => {
    if (order?.status) {
      setStatus(order.status);
    }
  }, [order?.status]);

  // ------------------------------------------------
  // Status change
  // ------------------------------------------------

  const handleStatusChange = async (newStatus) => {
    if (!order?._id) return;

    // "Out for Delivery" needs a delivery man attached — route through the
    // edit modal instead of firing an instant status-only update, so the
    // admin is prompted to pick one before it's saved.
    if (newStatus === "Out for Delivery") {
      setPendingStatus(newStatus);
      setShowEditModal(true);
      return;
    }

    const previousStatus = status;

    // Optimistic UI
    setStatus(newStatus);

    try {
      await updateOrderStatus({
        orderId: order._id,
        status: newStatus,
      }).unwrap();
    } catch (err) {
      // Revert if API fails
      setStatus(previousStatus);

      toast.error(err?.data?.message || "Could not update status.");
    }
  };

  // ------------------------------------------------
  // Delete order
  // ------------------------------------------------

  const handleConfirmDelete = async () => {
    if (!order?._id) return;

    try {
      await deleteOrder(order._id).unwrap();

      toast.success("Order deleted");

      setShowDeleteConfirm(false);
    } catch (err) {
      toast.error(err?.data?.message || "Could not delete this order.");

      setShowDeleteConfirm(false);
    }
  };

  // ------------------------------------------------
  // Loading
  // ------------------------------------------------

  if (isOrderLoading || !order) {
    return (
      <tr className="border-b border-secondary/5">
        <td colSpan={10} className="p-space-4 text-center text-placeholder_3">
          Loading order...
        </td>
      </tr>
    );
  }

  // ------------------------------------------------
  // Error
  // ------------------------------------------------

  if (isOrderError) {
    return (
      <tr className="border-b border-secondary/5">
        <td colSpan={10} className="p-space-4 text-center text-red-400">
          Failed to load order.
        </td>
      </tr>
    );
  }

  // ------------------------------------------------
  // Items
  // ------------------------------------------------

  const firstItem = order.items?.[0];

  const extraCount = Math.max((order.items?.length ?? 0) - 1, 0);

  const itemLabel = firstItem
    ? extraCount > 0
      ? `${firstItem.productTitle} +${extraCount} more`
      : firstItem.productTitle
    : "—";

  // ------------------------------------------------
  // Total quantity
  // ------------------------------------------------

  const totalQty =
    order.items?.reduce((sum, item) => sum + (item.quantity ?? 0), 0) ?? 0;

  // ------------------------------------------------
  // Render
  // ------------------------------------------------

  return (
    <>
      <tr
        className="
          border-b border-secondary/5
          last:border-0
          odd:bg-primary/5
          even:bg-secondary/5
          transition-colors
          hover:odd:bg-primary/10
          hover:even:bg-secondary/10
          *:first:rounded-l-xl
          *:last:rounded-r-xl
          overflow-hidden
          text-size-h6
          *:p-space-3
        "
      >
        {/* ------------------------------------------
            Order ID
        ------------------------------------------ */}

        <td className="text-placeholder_3">{order.orderId ?? "—"}</td>

        {/* Customer */}
        <td className="w-[220px]">
          <div className="flex items-center gap-space-3">
            {order.customer?.image?.url && (
              <Image
                alt={order.customer?.name ?? "Customer"}
                src={order.customer.image.url}
                height={42}
                width={42}
                className="rounded-full size-10.5 object-cover shrink-0"
              />
            )}

            <div className="space-y-0.5 min-w-0">
              <p className="font-medium text-size-large truncate">
                {order.customer?.name ?? "—"}
              </p>
              <h6 className="font-medium text-size-h6 truncate">
                {order.customer?.phone ?? "—"}
              </h6>
            </div>
          </div>
        </td>

        {/* Items */}
        <td className="w-[180px] truncate">{itemLabel}</td>

        {/* ------------------------------------------
            Status
        ------------------------------------------ */}

        <td>
          <OrderStatusDropdown
            status={status || order.status}
            onChange={handleStatusChange}
          />
        </td>

        {/* ------------------------------------------
            Quantity
        ------------------------------------------ */}

        <td>
          <Tag property="filter" text={totalQty} />
        </td>

        {/* ------------------------------------------
            Total
        ------------------------------------------ */}

        <td>
          ${typeof order.total === "number" ? order.total.toFixed(2) : "0.00"}
        </td>

        {/* Delivery Address */}
        <td
          className="w-[240px] truncate"
          title={formatAddress(order.deliveryAddress)}
        >
          {formatAddress(order.deliveryAddress)}
        </td>

        {/* Created Date */}
        <td className="w-[130px] whitespace-nowrap">
          {formatDate(order.createdAt)}
        </td>

        {/* Payment Method */}
        <td className="w-[130px] whitespace-nowrap">
          {order.paymentMethod ?? "—"}
        </td>

        {/* ------------------------------------------
            Actions
        ------------------------------------------ */}

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
              onClick={() => setShowEditModal(true)}
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
              onClick={() => router.push(`/dashboard/orders/${order._id}`)}
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

      {/* =================================================
          EDIT MODAL
      ================================================= */}

      {showEditModal &&
        typeof document !== "undefined" &&
        createPortal(
          <EditOrderModal
            order={{
              ...order,
              // pendingStatus wins when the modal was opened by picking
              // "Out for Delivery" from the dropdown — otherwise fall back
              // to whatever the row is already showing.
              status: pendingStatus || status || order.status,
            }}
            onClose={() => {
              setShowEditModal(false);
              setPendingStatus(null);
            }}
            onUpdated={(newStatus) => {
              setStatus(newStatus);
              setPendingStatus(null);
            }}
          />,
          document.body,
        )}

      {/* =================================================
          DELETE CONFIRMATION
      ================================================= */}

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

export default OrderRow;
