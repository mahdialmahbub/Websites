"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Breadcrumb } from "../../../components/Breadcrumb";
import Image from "next/image";
import Chips from "../../../components/Chips";
import Button from "../../../components/Button";
import Tag from "../../../components/Tag";
import Boxes from "../../../components/order-details/Boxes";
import OrderStatusCard from "../../../components/order-details/OrderStatusCard";
import OrderInfoBox from "../../../components/order-details/OrderInfoBox";
import {
  useGetOrderByIdQuery,
  useCancelOrderMutation,
  useDownloadInvoiceMutation,
  useLazyGetSellerContactQuery,
} from "@/redux";
import toast from "react-hot-toast";

// Matches the backend's ORDER_STATUS order exactly — used to decide
// whether "Cancel Order" is still allowed (before "Shipped").
const ORDER_STATUS_ORDER = [
  "Pending",
  "Placed",
  "Processing",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Canceled",
];

const STATUS_META = {
  Pending: { color: "#FCE486", label: "Pending", description: "Your order is being confirmed" },
  Placed: { color: "#FCE486", label: "Placed", description: "Your order has been placed" },
  Processing: { color: "#5B9BFF", label: "Processing", description: "Your order is being prepared" },
  Packed: { color: "#5B9BFF", label: "Packed", description: "Your order has been packed" },
  Shipped: { color: "#FFA940", label: "Shipped", description: "Your order is on the way" },
  "Out for Delivery": { color: "#FFA940", label: "Out for Delivery", description: "Arriving today" },
  Delivered: { color: "#1FD8A4", label: "Delivered", description: "Your order has been delivered" },
  Canceled: { color: "#FF5C5C", label: "Canceled", description: "This order was canceled" },
};

// The 6 timeline steps shown as OrderStatusCards. "Pending" doesn't get its
// own card — "Order Placed" (status "Placed") is the first visible step.
const STATUS_STEPS = [
  { status: "Placed", title: "Order Placed", icon: "fi fi-br-check" },
  { status: "Processing", title: "Processing", icon: "fi fi-rr-box-open" },
  { status: "Packed", title: "Packed", icon: "fi fi-rr-box" },
  { status: "Shipped", title: "Shipped", icon: "fi fi-rr-van-fast" },
  { status: "Out for Delivery", title: "Out for Delivery", icon: "fi fi-rr-delivery-man" },
  { status: "Delivered", title: "Delivered", icon: "fi fi-rr-home" },
];

const PAYMENT_STATUS_LABEL = { Pending: "Due", Paid: "Paid", Failed: "Failed", Refunded: "Refunded" };

const money = (n) => `$ ${Number(n || 0).toFixed(2)}`;

const formatDateTime = (d) =>
  new Date(d).toLocaleString("en-US", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });

const formatDate = (d) => new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });

const formatAddress = (a) => {
  if (!a) return "";
  const line1 = [a.apartmentNumber && `Apt ${a.apartmentNumber}`, a.buildingNumber && `House ${a.buildingNumber}`, a.roadNumber && `Road ${a.roadNumber}`]
    .filter(Boolean)
    .join(", ");
  const line2 = [a.locality, a.area].filter(Boolean).join(", ");
  return { line1: line1 || line2, line2: line1 ? line2 : `${a.city || ""} ${a.postCode || ""}`.trim() };
};

// Simple confirm modal for "Cancel Order"
function ConfirmCancelModal({ onConfirm, onClose, isLoading }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-105 bg-background border-2 border-secondary rounded-2xl p-space-7 space-y-space-6">
        <div className="flex items-center gap-space-3">
          <i className="fi fi-rr-triangle-warning text-red text-size-h3"></i>
          <h2 className="font-semibold text-size-h4">Cancel this order?</h2>
        </div>
        <p className="text-sm text-placeholder_2">This can&apos;t be undone. Your order will be marked as canceled.</p>
        <div className="flex gap-space-4">
          <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm font-medium">
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
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const { data, isLoading, isError } = useGetOrderByIdQuery(orderId, { skip: !orderId });
  const order = data?.data;

  const [cancelOrder, { isLoading: canceling }] = useCancelOrderMutation();
  const [downloadInvoice, { isLoading: downloading }] = useDownloadInvoiceMutation();
  const [fetchSellerContact] = useLazyGetSellerContactQuery();

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (!orderId) return <p className="p-space-11 text-slate-500">No order specified.</p>;
  if (isLoading) return <p className="p-space-11 text-slate-500">Loading order...</p>;
  if (isError || !order) return <p className="p-space-11 text-slate-500">Order not found.</p>;

  const isCanceled = order.status === "Canceled";
  const statusMeta = STATUS_META[order.status] || STATUS_META.Pending;
  const timelineMap = Object.fromEntries((order.statusTimeline || []).map((t) => [t.status, t.at]));

  const canCancel =
    !isCanceled &&
    order.status !== "Delivered" &&
    ORDER_STATUS_ORDER.indexOf(order.status) < ORDER_STATUS_ORDER.indexOf("Shipped");

  const address = formatAddress(order.deliveryAddress);
  const firstItemSupport = order.items[0]?.supportInfo;

  const handleConfirmCancel = async () => {
    try {
      await cancelOrder(order._id).unwrap();
      toast.success("Order canceled.");
      setShowCancelConfirm(false);
    } catch (err) {
      toast.error(err?.data?.message || "Could not cancel this order.");
      setShowCancelConfirm(false);
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      const blob = await downloadInvoice(order._id).unwrap();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${order.orderId}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error("Could not download the invoice.");
    }
  };

  const handleContactSeller = async () => {
    try {
      const res = await fetchSellerContact(order._id).unwrap();
      const phones = res.data?.sellerPhones || [];
      if (phones.length === 0) {
        toast("No seller contact available for this order.");
      } else {
        toast.success(`Seller contact: ${phones.join(", ")}`, { duration: 8000 });
      }
    } catch (err) {
      toast.error("Could not fetch seller contact.");
    }
  };

  // Build the 6 timeline cards, swapping the last one for "Canceled" if the order was canceled
  const timelineCards = STATUS_STEPS.map((step, idx) => {
    const isLastSlot = idx === STATUS_STEPS.length - 1;
    if (isCanceled && isLastSlot) {
      return {
        title: "Canceled",
        icon: "fi fi-br-cross",
        date: timelineMap.Canceled ? formatDateTime(timelineMap.Canceled) : null,
        isActive: true,
      };
    }
    return {
      title: step.title,
      icon: step.icon,
      date: timelineMap[step.status] ? formatDateTime(timelineMap[step.status]) : null,
      isActive: Boolean(timelineMap[step.status]),
    };
  });

  return (
    <section>
      <div className="px-space-11 py-space-7 flex flex-col gap-space-7">
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "My orders", href: "/my-orders" }, { label: order.orderId }]}
        />
      </div>

      <div className="px-space-11">
        <div className="flex items-center mb-space-10 justify-between">
          <div className="flex items-center gap-space-5">
            <div className="p-space-4 rounded-xl bg-secondary/10">
              <i className="fi fi-sr-bags-shopping text-[43px] text-secondary"></i>
            </div>

            <div>
              <h2 className="mb-space-1 font-primary font-semibold text-size-h4">Order ID: {order.orderId}</h2>
              <p className="font-primary font-medium text-size-large text-placeholder_2">
                <span className="text-foreground">Placed on:</span> {formatDateTime(order.createdAt)}
              </p>
            </div>
          </div>

          <div className="p-space-6 rounded-xl" style={{ backgroundColor: `${statusMeta.color}1A` }}>
            <div className="flex items-center gap-space-2 mb-space-4">
              <span className="size-3.5 rounded-full" style={{ backgroundColor: statusMeta.color }}></span>
              <h3 className="font-primary font-semibold text-size-h4" style={{ color: statusMeta.color }}>
                {statusMeta.label}
              </h3>
            </div>
            <p className="text-size-large font-medium font-primary text-placeholder_2">{statusMeta.description}</p>
          </div>
        </div>

        {/* products + actions */}
        <div className="flex gap-space-7 w-full">
          <div className="flex-1 space-y-space-8">
            {order.items.map((item, i) => {
              const variantGroups = (item.selectedVariants || []).reduce((acc, v) => {
                const key = v.group || "Options";
                acc[key] = acc[key] || [];
                acc[key].push(v);
                return acc;
              }, {});

              return (
                <div key={i} className="flex items-center gap-space-7 w-full">
                  <Image
                    alt={item.productTitle}
                    src={item.productImage}
                    width={176}
                    height={176}
                    className="rounded-lg object-cover"
                  />
                  <div className="w-full">
                    <h1 className="font-medium text-size-h2 mb-space-4">{item.productTitle}</h1>
                    {item.brandName && <Tag text={item.brandName} className="max-w-max" />}

                    <div className="mt-space-6 flex items-center gap-space-6 flex-wrap">
                      {item.color && (
                        <div className="flex items-center gap-space-3">
                          <p className="font-medium text-size-h6">Color:</p>
                          <span className="size-[20px] rounded-full border border-white/20" style={{ backgroundColor: item.color }}></span>
                        </div>
                      )}
                      {Object.entries(variantGroups).map(([group, variants]) => (
                        <div key={group} className="flex items-center gap-1.5">
                          <p className="font-medium text-size-h6">{group}:</p>
                          {variants.map((v) => (
                            <Chips key={v.name} text={v.name} />
                          ))}
                        </div>
                      ))}
                      <div className="flex items-center gap-1.5">
                        <p className="font-medium text-size-h6">Qty:</p>
                        <Chips text={String(item.quantity)} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Buttons */}
          <div className="space-y-space-4 *:w-full shrink-0 w-60">
            <Button
              variant="secondary"
              showLeftIcon
              leftIcon="fi fi-rr-file-download"
              onClick={handleDownloadInvoice}
              disabled={downloading}
            >
              {downloading ? "Downloading..." : "Download Invoice"}
            </Button>
            <Button
              variant="secondary"
              showLeftIcon
              color={"#00D100"}
              leftIcon="fi fi-rr-phone-flip"
              onClick={handleContactSeller}
            >
              Contact Seller
            </Button>
            {canCancel && (
              <Button
                variant="secondary"
                showLeftIcon
                color={"#D10000"}
                leftIcon="fi fi-br-cross"
                onClick={() => setShowCancelConfirm(true)}
              >
                Cancel Order
              </Button>
            )}
          </div>
        </div>

        {/* price and informations */}
        <div className="flex gap-space-7 mt-space-10">
          <div className="space-y-4.5">
            <div className="flex items-center gap-space-7">
              <OrderInfoBox
                icon="fi fi-rr-calendar"
                title={order.estimatedDeliveryDate ? formatDate(order.estimatedDeliveryDate) : "TBD"}
                subtitle={
                  order.estimatedDeliveryDurationDays ? `${order.estimatedDeliveryDurationDays} day(s)` : ""
                }
                name="Estimated Delivery"
              />
              <div className="opacity-20 w-0.5 bg-linear-to-b from-placeholder_2/0 via-placeholder_2 to-placeholder_2/0 h-full"></div>
              <OrderInfoBox
                icon="fi fi-sr-marker"
                title={address.line1}
                subtitle={address.line2}
                name="Delivery Address"
              />
            </div>
            <div className="opacity-20 h-0.5 bg-linear-to-r from-placeholder_2/0 via-placeholder_2 to-placeholder_2/0 w-full"></div>
            <div className="flex items-center gap-space-7">
              <OrderInfoBox
                icon="fi fi-rr-van-fast"
                title={order.trackingId ? `Tracking ID: ${order.trackingId}` : "Not assigned yet"}
                subtitle={order.courierName || ""}
                name="Courier"
              />
              <div className="shrink-0 opacity-20 bg-linear-to-b from-placeholder_2/0 via-placeholder_2 to-placeholder_2/0 w-1.5 h-full"></div>
              <OrderInfoBox
                icon="fi fi-rr-money-bill-wave"
                title={PAYMENT_STATUS_LABEL[order.paymentStatus] || order.paymentStatus}
                subtitle={order.paymentMethod}
                name="Payment Status"
              />
            </div>
          </div>

          {/* price */}
          <div className="space-y-space-5 p-space-2 rounded-[10px] w-full">
            <div className="flex items-center justify-between text-[#CBD5F5]">
              <p className="font-medium text-size-h4">Subtotal</p>
              <h4 className="font-primary font-semibold text-size-h4">{money(order.subtotal)}</h4>
            </div>
            <div className="flex items-center justify-between text-[#CBD5F5]">
              <p className="font-medium text-size-h4">Discount</p>
              <h4 className="font-primary font-semibold text-size-h4">-{money(order.discount)}</h4>
            </div>
            <div className="flex items-center justify-between text-[#CBD5F5]">
              <p className="font-medium text-size-h4">Shipping Charge</p>
              <h4 className="font-primary font-semibold text-size-h4">{money(order.shippingCharge)}</h4>
            </div>
            <div className="flex items-center justify-between text-[#CBD5F5]">
              <p className="font-medium text-size-h4">VAT</p>
              <h4 className="font-primary font-semibold text-size-h4">{money(order.vat)}</h4>
            </div>
            <div className="flex items-center justify-between py-space-2 border-t-2 border-placeholder_3/30">
              <p className="font-medium text-size-h3 text-[#CBD5F5]">Total</p>
              <h4 className="font-primary font-semibold text-size-h3 text-secondary">{money(order.total)}</h4>
            </div>
          </div>
        </div>

        {/* order status timeline */}
        <div className="flex justify-between mt-space-10">
          {timelineCards.map((card, i) => (
            <React.Fragment key={card.title}>
              <OrderStatusCard isActive={card.isActive} title={card.title} date={card.date || "—"} icon={card.icon} />
              {i < timelineCards.length - 1 && (
                <span
                  className={`w-[100] h-[3px] rounded-full mt-[25px] ${
                    timelineCards[i + 1].isActive || card.isActive ? "bg-secondary" : "bg-white/10"
                  }`}
                ></span>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="w-full h-0.5 bg-linear-to-r from-placeholder_2/0 via-placeholder_2/20 to-placeholder_2/0 my-space-7"></div>

        {/* boxes */}
        {firstItemSupport && (
          <div className="flex *:flex-1 gap-space-6">
            <Boxes
              icon={firstItemSupport.tested?.icon || "fi fi-rr-shield-check"}
              title={firstItemSupport.tested?.title || "Quality Tested"}
              subtitle={firstItemSupport.tested?.subtitle || ""}
            />
            <Boxes
              icon={firstItemSupport.guarantee?.icon || "fi fi-rr-wrench-alt"}
              title={firstItemSupport.guarantee?.title || "Guarantee"}
              subtitle={firstItemSupport.guarantee?.subtitle || ""}
            />
            <Boxes
              icon={firstItemSupport.replacement?.icon || "fi fi-rr-replace"}
              title={firstItemSupport.replacement?.title || "Replacement"}
              subtitle={firstItemSupport.replacement?.subtitle || ""}
            />
          </div>
        )}
      </div>

      {showCancelConfirm && (
        <ConfirmCancelModal
          isLoading={canceling}
          onConfirm={handleConfirmCancel}
          onClose={() => setShowCancelConfirm(false)}
        />
      )}
    </section>
  );
};

export default Page;
