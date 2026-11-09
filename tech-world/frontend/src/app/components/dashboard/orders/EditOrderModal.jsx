/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Button from "../../Button";
import useLockBodyScroll from "@/app/hooks/useLockBodyScroll";

import {
  useGetDeliveryMenQuery,
  useUpdateOrderStatusAdminMutation,
} from "@/redux";

const ORDER_STATUSES = [
  "Pending",
  "Placed",
  "Processing",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Canceled",
];

const selectClass =
  "w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors hover:border-secondary/50 focus:border-secondary/80 disabled:cursor-not-allowed disabled:opacity-60";

export default function EditOrderModal({ order, onClose, onUpdated }) {
  useLockBodyScroll();

  // ==========================================
  // FORM STATES
  // ==========================================
  const [status, setStatus] = useState(order?.status || "");
  const [trackingId, setTrackingId] = useState(order?.trackingId || "");

  // Existing assigned delivery man
  const [deliveryManId, setDeliveryManId] = useState(
    order?.deliveryMan?._id || order?.deliveryMan?._id?.toString() || "",
  );

  // ==========================================
  // GET ACTIVE DELIVERY MEN
  // ==========================================
  const {
    data: deliveryMenResponse,
    isLoading: isDeliveryMenLoading,
    isFetching: isDeliveryMenFetching,
    isError: isDeliveryMenError,
  } = useGetDeliveryMenQuery({
    status: "active",
    page: 1,
    limit: 100,
  });

  const deliveryMen = deliveryMenResponse?.data?.deliveryMen || [];

  // ==========================================
  // UPDATE ORDER
  // ==========================================
  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusAdminMutation();

  // ==========================================
  // SYNC FORM WITH ORDER
  // ==========================================
  useEffect(() => {
    setStatus(order?.status || "");
    setTrackingId(order?.trackingId || "");
    setDeliveryManId(order?.deliveryMan?._id ? order.deliveryMan._id.toString() : "");
  }, [order]);

  // Close on Escape, matching every other modal in the app.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // A delivery man has to be picked before an order can be marked Out for
  // Delivery — this is what makes the modal pop up in the first place when
  // that status is picked from the row dropdown.
  const deliveryManRequired = status === "Out for Delivery";
  const missingDeliveryMan = deliveryManRequired && !deliveryManId;

  // ==========================================
  // SAVE
  // ==========================================
  const handleSave = async () => {
    if (!order?._id) {
      toast.error("Order information is missing.");
      return;
    }

    if (missingDeliveryMan) {
      toast.error("Please select a delivery man before marking this order Out for Delivery.");
      return;
    }

    try {
      await updateOrderStatus({
        orderId: order._id,
        status,
        trackingId: trackingId.trim(),
        // Send null when no delivery man is selected
        deliveryManId: deliveryManId || null,
        // This is ONLY used by RTK Query cache invalidation.
        // It will NOT be sent to backend.
        previousDeliveryManId: order?.deliveryMan?._id?.toString() || null,
      }).unwrap();

      toast.success("Order updated successfully.");
      onUpdated?.(status); // update local status immediately
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Could not update this order.");
    }
  };

  const loadingDeliveryMen = isDeliveryMenLoading || isDeliveryMenFetching;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="my-8 w-full max-w-150 space-y-space-7 rounded-2xl border-2 border-secondary/10 bg-background p-space-7"
      >
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-space-4">
            <div className="flex min-w-0 items-center gap-space-3">
              <i className="fi fi-rr-box-open shrink-0 text-[24px] text-secondary" />
              <h2 className="truncate font-semibold text-size-h4 text-placeholder_3">Edit Order</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary transition-colors hover:bg-secondary/20"
            >
              <i className="fi fi-rr-cross-small" />
            </button>
          </div>
          <p className="text-sm text-placeholder_3">Order ID: {order?.orderId || "—"}</p>
        </div>

        <div className="space-y-space-6">
          {/* Status */}
          <div>
            <div className="mb-2 flex items-center justify-between px-space-1">
              <label htmlFor="order-status" className="font-primary text-size-large font-medium text-foreground">
                Status
              </label>
              <span className="text-xs font-primary font-semibold text-green">Required</span>
            </div>
            <select
              id="order-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={isUpdating}
              className={`${selectClass} border-secondary/20`}
            >
              {ORDER_STATUSES.map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                  {statusOption}
                </option>
              ))}
            </select>
          </div>

          {/* Tracking ID */}
          <div>
            <div className="mb-2 flex items-center justify-between px-space-1">
              <label htmlFor="tracking-id" className="font-primary text-size-large font-medium text-foreground">
                Tracking ID
              </label>
              <span className="text-xs font-primary font-semibold text-placeholder_3">Optional</span>
            </div>
            <div className="relative">
              <i className="fi fi-sr-van-fast absolute left-3.5 top-1/2 -translate-y-1/2 text-size-h6 text-[#2BE7C4]/70" />
              <input
                id="tracking-id"
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                disabled={isUpdating}
                placeholder="e.g. TRK123456"
                className="w-full rounded-xl border border-secondary/20 bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder-placeholder_3 outline-none transition-colors hover:border-secondary/50 focus-within:border-secondary/80 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>

          {/* Delivery Man */}
          <div>
            <div className="mb-2 flex items-center justify-between px-space-1">
              <label htmlFor="delivery-man" className="font-primary text-size-large font-medium text-foreground">
                Delivery Man
              </label>
              <span
                className={`text-xs font-primary font-semibold ${
                  deliveryManRequired ? "text-green" : "text-placeholder_3"
                }`}
              >
                {deliveryManRequired ? "Required" : "Optional"}
              </span>
            </div>

            <select
              id="delivery-man"
              value={deliveryManId}
              onChange={(e) => setDeliveryManId(e.target.value)}
              disabled={isUpdating || loadingDeliveryMen}
              className={`${selectClass} ${missingDeliveryMan ? "border-red-400/60" : "border-secondary/20"}`}
            >
              <option value="">{loadingDeliveryMen ? "Loading delivery men..." : "No delivery man"}</option>

              {deliveryMen.map((deliveryMan) => (
                <option key={deliveryMan._id} value={deliveryMan._id}>
                  {deliveryMan.name} — {deliveryMan.contact}
                  {deliveryMan.vehicleType ? ` — ${deliveryMan.vehicleType}` : ""}
                </option>
              ))}
            </select>

            {isDeliveryMenError && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-red">
                <i className="fi fi-rr-cross-circle" />
                Failed to load delivery men.
              </p>
            )}

            {missingDeliveryMan && !isDeliveryMenError && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-amber-400">
                <i className="fi fi-rr-info" />
                Select a delivery man to assign this order before saving.
              </p>
            )}

            {order?.deliveryMan && (
              <div className="mt-3 rounded-xl border border-secondary/10 bg-secondary/5 px-space-4 py-space-3">
                <p className="text-xs text-placeholder_3">Currently assigned</p>
                <p className="mt-1 text-sm font-medium text-foreground">{order.deliveryMan.name}</p>
                <p className="text-xs text-placeholder_3">
                  {order.deliveryMan.contact}
                  {order.deliveryMan.courierServiceName ? ` • ${order.deliveryMan.courierServiceName}` : ""}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-space-4 border-t border-white/5 pt-space-6 *:w-full">
          <Button variant="secondary" type="button" onClick={onClose} disabled={isUpdating}>
            Cancel
          </Button>

          <Button type="button" onClick={handleSave} disabled={isUpdating || missingDeliveryMan}>
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
