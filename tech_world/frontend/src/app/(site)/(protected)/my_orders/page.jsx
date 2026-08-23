"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "../../../components/Breadcrumb";
import Chips from "../../../components/Chips";
import { ProductCard } from "../../../components/ProductCard";
import SearchBar from "../../../components/SearchBar";
import {
  useGetMyPendingOrdersQuery,
  useGetMyDeliveredOrdersQuery,
  useCancelOrderMutation,
  useDeleteOrderMutation,
} from "@/redux";
import toast from "react-hot-toast";

// ---------- Order -> ProductCard data shape helpers ----------
// One card per ORDER (an order can contain multiple items — the first
// item's image/title is shown, with a "+N more" note if there are others).

const summarizeTitle = (order) => {
  const first = order.items[0];
  const extra = order.items.length - 1;
  return extra > 0
    ? `${first?.productTitle} +${extra} more`
    : first?.productTitle;
};

const summarizeVariants = (order) =>
  (order.items[0]?.selectedVariants || []).map((v) => v.name).join(", ");

const totalQuantity = (order) =>
  order.items.reduce((sum, i) => sum + i.quantity, 0);

const toPendingCardData = (order) => ({
  image: order.items[0]?.productImage,
  title: summarizeTitle(order),
  total: order.total,
  requirement: summarizeVariants(order),
  quantity: totalQuantity(order),
  status: order.status,
  estimatedDelivery: order.estimatedDeliveryDate
    ? new Date(order.estimatedDeliveryDate).toLocaleDateString()
    : undefined,
});

const toDeliveredCardData = (order) => {
  const deliveredEntry = order.statusTimeline?.find(
    (t) => t.status === "Delivered",
  );
  return {
    image: order.items[0]?.productImage,
    title: summarizeTitle(order),
    requirement: summarizeVariants(order),
    quantity: totalQuantity(order),
    deliveredDate: new Date(
      deliveredEntry?.at || order.updatedAt,
    ).toLocaleDateString(),
    total: order.total,
  };
};

// ---------- Small confirm modal for "Cancel Order" ----------
function ConfirmCancelModal({ onConfirm, onClose, isLoading }) {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-105 bg-background border-2 border-secondary rounded-2xl p-space-7 space-y-space-6"
      >
        <div className="flex items-center gap-space-3">
          <i className="fi fi-rr-triangle-warning text-red text-size-h3"></i>
          <h2 className="font-semibold text-size-h4">Cancel this order?</h2>
        </div>
        <p className="text-sm text-placeholder_2">
          This can&apos;t be undone. Your order will be marked as canceled.
        </p>
        <div className="flex gap-space-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm font-medium"
          >
            Keep Order
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 rounded-lg bg-red py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {isLoading ? "Canceling..." : "Yes, Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}

const Page = () => {
  const router = useRouter();

  const { data: pendingData, isLoading: pendingLoading } =
    useGetMyPendingOrdersQuery();
  const pendingOrders = pendingData?.data || [];

  const { data: deliveredData, isLoading: deliveredLoading } =
    useGetMyDeliveredOrdersQuery();
  const deliveredOrders = deliveredData?.data || [];

  const [cancelOrder, { isLoading: canceling }] = useCancelOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  const [cancelTargetId, setCancelTargetId] = useState(null); // order._id being confirmed for cancel
  const [deliveredSearch, setDeliveredSearch] = useState("");

  const goToDetails = (orderId) =>
    router.push(`/order-details?orderId=${orderId}`);

  const handleConfirmCancel = async () => {
    try {
      await cancelOrder(cancelTargetId).unwrap();
      toast.success("Order canceled.");
      setCancelTargetId(null);
    } catch (err) {
      toast.error(err?.data?.message || "Could not cancel this order.");
      setCancelTargetId(null);
    }
  };

  const handleDeleteDelivered = async (orderId) => {
    try {
      await deleteOrder(orderId).unwrap();
    } catch (err) {
      toast.error(err?.data?.message || "Could not delete this order.");
    }
  };

  // Client-side filter for the Delivered Orders search box
  const filteredDeliveredOrders = useMemo(() => {
    const q = deliveredSearch.trim().toLowerCase();
    if (!q) return deliveredOrders;
    return deliveredOrders.filter((order) =>
      order.items.some((item) => item.productTitle?.toLowerCase().includes(q)),
    );
  }, [deliveredOrders, deliveredSearch]);

  return (
    <section>
      <div className="px-space-11 py-space-7 flex flex-col gap-space-7">
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "My orders" }]}
        />
      </div>
      <div className="px-space-11">
        {/* ---------- Pending Orders ---------- */}
        <div className="flex items-center gap-space-5 mb-space-7">
          <div className="flex items-center gap-space-4">
            <i className="fi fi-rr-order-history text-[30px] text-secondary"></i>
            <h1 className="font-primary font-semibold text-size-h4">
              Pending Orders
            </h1>
          </div>
          <Chips text={String(pendingOrders.length).padStart(2, "0")} />
        </div>

        {pendingLoading ? (
          <p className="text-slate-500 mb-space-8">Loading your orders...</p>
        ) : pendingOrders.length === 0 ? (
          <p className="text-slate-500 mb-space-8">
            No pending orders right now.
          </p>
        ) : (
          <div className="flex gap-space-6 mb-space-8 flex-wrap">
            {pendingOrders.map((order) => (
              <ProductCard
                key={order._id}
                variant="pendingOrder"
                data={toPendingCardData(order)}
                actions={{
                  onCancel: () => setCancelTargetId(order._id),
                  onDetails: () => goToDetails(order._id),
                }}
              />
            ))}
          </div>
        )}

        {/* ---------- Delivered Orders ---------- */}
        <div className="flex items-center justify-between mb-space-7">
          <div className="flex items-center gap-space-5">
            <div className="flex items-center gap-space-4">
              <i className="fi fi-rr-shopping-cart-check text-[30px] text-secondary"></i>
              <h1 className="font-primary font-semibold text-size-h4">
                Delivered Orders
              </h1>
            </div>
            <Chips text={String(deliveredOrders.length).padStart(2, "0")} />
          </div>
          <SearchBar
            placeholder="Search your needs ..."
            value={deliveredSearch}
            onChange={setDeliveredSearch}
          />{" "}
        </div>

        {deliveredLoading ? (
          <p className="text-slate-500">Loading delivered orders...</p>
        ) : filteredDeliveredOrders.length === 0 ? (
          <p className="text-slate-500">
            {deliveredSearch
              ? "No delivered orders match your search."
              : "No delivered orders yet."}
          </p>
        ) : (
          <div className="flex gap-space-6 flex-wrap *:w-full">
            {filteredDeliveredOrders.map((order) => (
              <ProductCard
                key={order._id}
                variant="delivered"
                data={toDeliveredCardData(order)}
                actions={{
                  onDelete: () => handleDeleteDelivered(order._id),
                  onView: () => goToDetails(order._id),
                }}
              />
            ))}
          </div>
        )}
      </div>

      {cancelTargetId && (
        <ConfirmCancelModal
          isLoading={canceling}
          onConfirm={handleConfirmCancel}
          onClose={() => setCancelTargetId(null)}
        />
      )}
    </section>
  );
};

export default Page;
