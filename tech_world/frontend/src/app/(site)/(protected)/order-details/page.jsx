"use client";

import React, { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";

import { Breadcrumb } from "../../../components/Breadcrumb";
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
import ConfirmModal from "@/app/components/ConfiremationModal";

/* ============================================================================
 * CONSTANTS
 * ==========================================================================*/

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
  Pending: {
    color: "#FCE486",
    label: "Pending",
    description: "Your order is being confirmed",
  },
  Placed: {
    color: "#FCE486",
    label: "Placed",
    description: "Your order has been placed",
  },
  Processing: {
    color: "#5B9BFF",
    label: "Processing",
    description: "Your order is being prepared",
  },
  Packed: {
    color: "#5B9BFF",
    label: "Packed",
    description: "Your order has been packed",
  },
  Shipped: {
    color: "#FFA940",
    label: "Shipped",
    description: "Your order is on the way",
  },
  "Out for Delivery": {
    color: "#FFA940",
    label: "Out for Delivery",
    description: "Arriving today",
  },
  Delivered: {
    color: "#1FD8A4",
    label: "Delivered",
    description: "Your order has been delivered",
  },
  Canceled: {
    color: "#FF5C5C",
    label: "Canceled",
    description: "This order was canceled",
  },
};

const STATUS_STEPS = [
  { status: "Placed", title: "Order Placed", icon: "fi fi-br-check" },
  { status: "Processing", title: "Processing", icon: "fi fi-rr-box-open" },
  { status: "Packed", title: "Packed", icon: "fi fi-rr-box" },
  { status: "Shipped", title: "Shipped", icon: "fi fi-rr-van-fast" },
  {
    status: "Out for Delivery",
    title: "Out for Delivery",
    icon: "fi fi-rr-delivery-man",
  },
  { status: "Delivered", title: "Delivered", icon: "fi fi-rr-home" },
];

const PAYMENT_STATUS_LABEL = {
  Pending: "Due",
  Paid: "Paid",
  Failed: "Failed",
  Refunded: "Refunded",
};

/* ============================================================================
 * HELPERS
 * ==========================================================================*/

const money = (value) => `$${Number(value || 0).toFixed(2)}`;

const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatAddress = (address) => {
  if (!address) return { line1: "—", line2: "" };

  const line1 = [
    address.apartmentNumber && `Apt ${address.apartmentNumber}`,
    address.buildingNumber && `House ${address.buildingNumber}`,
    address.roadNumber && `Road ${address.roadNumber}`,
  ]
    .filter(Boolean)
    .join(", ");

  const line2 = [
    address.locality,
    address.area,
    address.city,
    address.postCode,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");

  return {
    line1: line1 || line2 || "—",
    line2: line1 ? line2 : "",
  };
};

/* ============================================================================
 * SMALL UI PRIMITIVES
 * ==========================================================================*/

function Card({ className = "", children }) {
  return (
    <div
      className={`rounded-2xl border border-white/5 bg-[#1A1E3D]/50 p-space-6 ${className}`}
    >
      {children}
    </div>
  );
}

function SectionHeading({ title, subtitle }) {
  return (
    <div className="mb-space-5">
      <h2 className="font-primary text-size-h5 font-semibold text-foreground md:text-size-h4">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-1 text-sm text-placeholder_3">{subtitle}</p>
      )}
    </div>
  );
}

function InfoTile({ icon, label, value, className = "" }) {
  return (
    <div
      className={`flex min-w-0 items-start gap-space-3 rounded-xl border border-secondary/10 bg-[#0B1120]/40 p-space-4 ${className}`}
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
        <i className={`${icon} text-sm`} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-placeholder_3">{label}</p>
        <p
          className="mt-1 truncate text-sm font-semibold text-foreground"
          title={value}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function PriceRow({ label, value, emphasis = false }) {
  if (emphasis) {
    return (
      <div className="flex items-center justify-between border-t border-white/10 pt-space-4">
        <p className="font-primary text-size-h5 font-semibold text-foreground">
          {label}
        </p>
        <p className="font-primary text-size-h5 font-semibold text-secondary">
          {value}
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-placeholder_2">{label}</p>
      <p className="font-primary text-sm font-semibold text-[#CBD5F5]">
        {value}
      </p>
    </div>
  );
}

/* ============================================================================
 * ORDER ITEM CARD
 * ==========================================================================*/

function OrderItemCard({ item }) {
  const variantGroups = useMemo(() => {
    return (item.selectedVariants || []).reduce((accumulator, variant) => {
      const key = variant.group || "Options";
      accumulator[key] = accumulator[key] || [];
      accumulator[key].push(variant);
      return accumulator;
    }, {});
  }, [item.selectedVariants]);

  return (
    <div className="flex flex-col gap-space-5 rounded-2xl border border-white/5 bg-[#1A1E3D]/30 p-space-5 sm:flex-row sm:items-center sm:gap-space-7 sm:p-space-6">
      <div className="size-28 shrink-0 self-center overflow-hidden rounded-xl bg-[#0B1120]/40 sm:size-36 sm:self-auto md:size-44">
        {item.productImage ? (
          <Image
            alt={item.productTitle || "Product"}
            src={item.productImage}
            width={176}
            height={176}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-placeholder_3">
            <i className="fi fi-rr-image text-2xl" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="mb-space-3 font-primary text-size-h5 font-medium text-foreground md:text-size-h4">
          {item.productTitle}
        </h3>

        {item.brandName && <Tag text={item.brandName} className="max-w-max" />}

        <div className="mt-space-4 flex flex-wrap items-center gap-space-4 md:gap-space-6">
          {item.color && (
            <div className="flex items-center gap-space-2">
              <p className="text-sm font-medium text-placeholder_2">Color:</p>
              <span
                className="size-5 rounded-full border border-white/20"
                style={{ backgroundColor: item.color }}
              />
            </div>
          )}

          {Object.entries(variantGroups).map(([group, variants]) => (
            <div key={group} className="flex items-center gap-1.5">
              <p className="text-sm font-medium text-placeholder_2">{group}:</p>
              {variants.map((variant) => (
                <Chips key={`${group}-${variant.name}`} text={variant.name} />
              ))}
            </div>
          ))}

          <div className="flex items-center gap-1.5">
            <p className="text-sm font-medium text-placeholder_2">Qty:</p>
            <Chips text={String(item.quantity || 0)} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * DELIVERY MAN CARD
 * ==========================================================================*/

function DeliveryManCard({ deliveryMan }) {
  if (!deliveryMan) {
    return (
      <Card className="flex flex-col items-center justify-center py-space-10 text-center">
        <div className="mb-space-4 flex size-14 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
          <i className="fi fi-rr-delivery-man text-2xl" />
        </div>
        <h3 className="font-semibold text-size-h5">
          Delivery Man Not Assigned
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-6 text-placeholder_3">
          A delivery man has not been assigned to this order yet.
        </p>
      </Card>
    );
  }

  return (
    <Card className="space-y-space-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-space-4">
        <div className="flex min-w-0 items-center gap-space-4">
          <div className="size-16 shrink-0 overflow-hidden rounded-full border-2 border-secondary/20 bg-[#0B1120]">
            {deliveryMan.image?.url ? (
              <Image
                src={deliveryMan.image.url}
                alt={deliveryMan.name || "Delivery Man"}
                width={64}
                height={64}
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-placeholder_3">
                <i className="fi fi-rr-user text-2xl" />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-space-2">
              <h3 className="truncate text-size-large font-semibold">
                {deliveryMan.name || "—"}
              </h3>
              <span
                className={`rounded-full px-space-2 py-1 text-xs font-medium ${
                  deliveryMan.status === "active"
                    ? "bg-green-500/10 text-green-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                {deliveryMan.status === "active" ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="mt-1 text-sm text-placeholder_3">
              {deliveryMan.courierServiceName || "Courier service"}
            </p>
          </div>
        </div>

        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
          <i className="fi fi-rr-truck-side text-lg" />
        </div>
      </div>

      <div className="h-px bg-secondary/10" />

      {/* Basic info */}
      <div className="grid grid-cols-1 gap-space-4 sm:grid-cols-2">
        <InfoTile
          icon="fi fi-rr-phone-call"
          label="Contact"
          value={deliveryMan.contact || "—"}
        />
        <InfoTile
          icon="fi fi-rr-envelope"
          label="Email"
          value={deliveryMan.email || "—"}
        />
        <InfoTile
          icon="fi fi-rr-marker"
          label="Address"
          value={deliveryMan.address || "—"}
          className="sm:col-span-2"
        />
      </div>

      {/* Vehicle */}
      <div>
        <p className="mb-space-3 text-xs font-medium uppercase tracking-wider text-placeholder_3">
          Vehicle Information
        </p>
        <div className="grid grid-cols-1 gap-space-3 sm:grid-cols-2">
          <InfoTile
            icon="fi fi-rr-bike"
            label="Vehicle Type"
            value={deliveryMan.vehicleType || "—"}
          />
          <InfoTile
            icon="fi fi-rr-id-badge"
            label="Vehicle Number"
            value={deliveryMan.vehicleNumber || "—"}
          />
        </div>
      </div>

      {/* Courier */}
      <div className="flex items-center justify-between rounded-xl border border-secondary/10 bg-[#0B1120]/40 px-space-4 py-space-3">
        <div className="flex items-center gap-space-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
            <i className="fi fi-rr-truck-side text-sm" />
          </div>
          <div>
            <p className="text-xs text-placeholder_3">Courier Service</p>
            <p className="mt-1 text-sm font-semibold">
              {deliveryMan.courierServiceName || "—"}
            </p>
          </div>
        </div>
        <span className="text-xs font-medium text-secondary">Assigned</span>
      </div>
    </Card>
  );
}

/* ============================================================================
 * LOADING SKELETON
 * ==========================================================================*/

function OrderDetailsSkeleton() {
  return (
    <section className="animate-pulse px-space-6 py-space-7 md:px-space-11">
      <div className="mb-space-8 h-4 w-48 rounded bg-white/5" />

      <div className="mb-space-10 flex flex-col gap-space-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-space-5">
          <div className="size-16 rounded-xl bg-white/5" />
          <div className="space-y-space-3">
            <div className="h-5 w-40 rounded bg-white/5" />
            <div className="h-4 w-56 rounded bg-white/5" />
          </div>
        </div>
        <div className="h-24 w-full max-w-sm rounded-2xl bg-white/5 lg:w-80" />
      </div>

      <div className="grid grid-cols-1 gap-space-7 lg:grid-cols-[1fr_280px]">
        <div className="space-y-space-5">
          <div className="h-40 rounded-2xl bg-white/5" />
          <div className="h-40 rounded-2xl bg-white/5" />
        </div>
        <div className="h-48 rounded-2xl bg-white/5" />
      </div>
    </section>
  );
}

/* ============================================================================
 * PAGE
 * ==========================================================================*/

const Page = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  // ---------------------------------------------------------------------------
  // Data
  // ---------------------------------------------------------------------------

  const { data, isLoading, isFetching, isError } = useGetOrderByIdQuery(
    orderId,
    {
      skip: !orderId,
    },
  );

  const order = data?.data;

  const [cancelOrder, { isLoading: canceling }] = useCancelOrderMutation();
  const [downloadInvoice, { isLoading: downloading }] =
    useDownloadInvoiceMutation();
  const [fetchSellerContact] = useLazyGetSellerContactQuery();

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // ---------------------------------------------------------------------------
  // Derived status data
  // ---------------------------------------------------------------------------

  const currentStatus = order?.status || "Pending";
  const isCanceled = currentStatus === "Canceled";
  const isTerminalStatus = currentStatus === "Delivered" || isCanceled;
  const statusMeta = STATUS_META[currentStatus] || STATUS_META.Pending;

  const timelineMap = useMemo(() => {
    return Object.fromEntries(
      (order?.statusTimeline || []).map((timelineItem) => [
        timelineItem.status,
        timelineItem.at,
      ]),
    );
  }, [order?.statusTimeline]);

  const currentStatusIndex = ORDER_STATUS_ORDER.indexOf(currentStatus);

  const canCancel =
    !isCanceled &&
    currentStatus !== "Delivered" &&
    currentStatusIndex >= 0 &&
    currentStatusIndex < ORDER_STATUS_ORDER.indexOf("Shipped");

  const address = formatAddress(order?.deliveryAddress);
  const firstItemSupport = order?.items?.[0]?.supportInfo;
  const items = order?.items || [];

  const timelineCards = useMemo(() => {
    if (!order) return [];

    return STATUS_STEPS.map((step, index) => {
      const isLastSlot = index === STATUS_STEPS.length - 1;

      if (isCanceled && isLastSlot) {
        return {
          title: "Canceled",
          icon: "fi fi-br-cross",
          date: timelineMap.Canceled
            ? formatDateTime(timelineMap.Canceled)
            : "—",
          isActive: true,
        };
      }

      const stepIndex = ORDER_STATUS_ORDER.indexOf(step.status);
      const isActive = currentStatusIndex >= stepIndex;
      const statusDate = timelineMap[step.status];

      return {
        title: step.title,
        icon: step.icon,
        date: statusDate
          ? formatDateTime(statusDate)
          : isActive
            ? formatDateTime(order.updatedAt)
            : null,
        isActive,
      };
    });
  }, [order, currentStatusIndex, isCanceled, timelineMap]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleConfirmCancel = async () => {
    if (!order?._id) return;

    try {
      await cancelOrder(order._id).unwrap();
      toast.success("Order canceled.");
      setShowCancelConfirm(false);
    } catch (err) {
      toast.error(err?.data?.message || "Could not cancel the order.");
      setShowCancelConfirm(false);
    }
  };

  const handleDownloadInvoice = async () => {
    if (!order?._id) return;

    try {
      const blob = await downloadInvoice(order._id).unwrap();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${order.orderId}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error("Could not download the invoice.");
    }
  };

  const handleContactSeller = async () => {
    if (!order?._id) return;

    try {
      const res = await fetchSellerContact(order._id).unwrap();
      const phones = res.data?.sellerPhones || [];

      if (!phones.length) {
        toast("No seller contact available for this order.");
        return;
      }

      toast.success(`Seller contact: ${phones.join(", ")}`, { duration: 8000 });
    } catch (err) {
      toast.error("Could not fetch seller contact.");
    }
  };

  // ---------------------------------------------------------------------------
  // Guard states
  // ---------------------------------------------------------------------------

  if (!orderId) {
    return (
      <section className="flex flex-col items-center gap-space-3 px-space-11 py-space-16 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
          <i className="fi fi-rr-receipt text-2xl" />
        </div>
        <p className="text-sm text-placeholder_3">No order specified.</p>
      </section>
    );
  }

  if (isLoading || !order) {
    return <OrderDetailsSkeleton />;
  }

  if (isError) {
    return (
      <section className="flex flex-col items-center gap-space-3 px-space-11 py-space-16 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-red/10 text-red">
          <i className="fi fi-rr-triangle-warning text-2xl" />
        </div>
        <div>
          <h2 className="font-primary text-size-h5 font-semibold text-foreground">
            Couldn&apos;t load this order
          </h2>
          <p className="mt-1 text-sm text-placeholder_3">
            Please refresh the page or try again in a moment.
          </p>
        </div>
      </section>
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <section className="pb-space-16">
      {isFetching && (
        <div className="sticky top-0 z-40 h-0.5 w-full overflow-hidden bg-secondary/10">
          <div className="h-full w-full animate-pulse bg-secondary" />
        </div>
      )}

      {/* Breadcrumb */}
      <div className="px-space-6 py-space-6 md:px-space-11 md:py-space-7">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "My orders", href: "/my_orders" },
            { label: order.orderId },
          ]}
        />
      </div>

      <div className="mx-auto w-full max-w-350 px-space-6 md:px-space-11">
        {/* ================= Header ================= */}
        <div className="mb-space-8 flex flex-col gap-space-6 lg:mb-space-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-space-4 md:gap-space-5">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-secondary/10 md:size-16">
              <i className="fi fi-sr-bags-shopping text-2xl text-secondary md:text-[32px]" />
            </div>

            <div>
              <h2 className="mb-space-1 font-primary text-size-h5 font-semibold md:text-size-h4">
                Order ID: {order.orderId}
              </h2>
              <p className="font-primary text-sm font-medium text-placeholder_2 md:text-size-large">
                <span className="text-foreground">Placed on:</span>{" "}
                {formatDateTime(order.createdAt)}
              </p>
            </div>
          </div>

          <div
            className="rounded-2xl border border-white/5 p-space-5 md:p-space-6"
            style={{ backgroundColor: `${statusMeta.color}1A` }}
          >
            <div className="mb-space-3 flex items-center gap-space-2">
              <span
                className={`size-3 rounded-full ${!isTerminalStatus ? "animate-pulse" : ""}`}
                style={{ backgroundColor: statusMeta.color }}
              />
              <h3
                className="font-primary text-size-h5 font-semibold md:text-size-h4"
                style={{ color: statusMeta.color }}
              >
                {statusMeta.label}
              </h3>
            </div>
            <p className="font-primary text-sm font-medium text-placeholder_2 md:text-size-large">
              {statusMeta.description}
            </p>
          </div>
        </div>

        {/* ================= Items + Actions ================= */}
        <div className="grid grid-cols-1 gap-space-7 lg:grid-cols-[1fr_280px]">
          <div>
            <SectionHeading title={`Items in this order (${items.length})`} />
            <div className="space-y-space-5">
              {items.map((item, index) => (
                <OrderItemCard key={index} item={item} />
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-space-7 lg:self-start">
            <Card className="space-y-space-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-placeholder_3">
                Order Actions
              </p>

              <div className="space-y-space-3 *:w-full">
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
                  color="#00D100"
                  leftIcon="fi fi-rr-phone-flip"
                  onClick={handleContactSeller}
                >
                  Contact Seller
                </Button>

                {canCancel && (
                  <Button
                    variant="secondary"
                    showLeftIcon
                    color="#D10000"
                    leftIcon="fi fi-br-cross"
                    onClick={() => setShowCancelConfirm(true)}
                  >
                    Cancel Order
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* ================= Order Info + Price ================= */}
        <div className="mt-space-10 ">
          <Card>
            <SectionHeading title="Order Information" />
            <div className="grid grid-cols-1 gap-space-6 sm:grid-cols-2">
              <OrderInfoBox
                icon="fi fi-rr-calendar"
                title={
                  order.estimatedDeliveryDate
                    ? formatDate(order.estimatedDeliveryDate)
                    : "TBD"
                }
                subtitle={
                  order.estimatedDeliveryDurationDays
                    ? `${order.estimatedDeliveryDurationDays} day(s)`
                    : ""
                }
                name="Estimated Delivery"
              />

              <OrderInfoBox
                icon="fi fi-sr-marker"
                title={address.line1}
                subtitle={address.line2}
                name="Delivery Address"
              />

              <OrderInfoBox
                icon="fi fi-rr-van-fast"
                title={
                  order.trackingId
                    ? `Tracking ID: ${order.trackingId}`
                    : "Not assigned yet"
                }
                subtitle={
                  order.deliveryMan?.courierServiceName ||
                  order.deliveryManDetails?.courierServiceName ||
                  ""
                }
                name="Courier"
              />

              <OrderInfoBox
                icon="fi fi-rr-money-bill-wave"
                title={
                  PAYMENT_STATUS_LABEL[order.paymentStatus] ||
                  order.paymentStatus ||
                  "—"
                }
                subtitle={order.paymentMethod || ""}
                name="Payment Status"
              />
            </div>
          </Card>

          <Card className="space-y-space-4 mt-space-6">
            <SectionHeading title="Price Details" />
            <PriceRow label="Subtotal" value={money(order.subtotal)} />
            <PriceRow label="Discount" value={`-${money(order.discount)}`} />
            <PriceRow
              label="Shipping Charge"
              value={money(order.shippingCharge)}
            />
            <PriceRow label="VAT" value={money(order.vat)} />
            <PriceRow label="Total" value={money(order.total)} emphasis />
          </Card>
        </div>

        {/* ================= Delivery Man ================= */}
        <div className="mt-space-10">
          <SectionHeading
            title="Delivery Man"
            subtitle="Person assigned to deliver this order"
          />
          <DeliveryManCard deliveryMan={order.deliveryManDetails || null} />
        </div>

        {/* ================= Order Status Timeline ================= */}
        <div className="mt-space-10">
          <SectionHeading
            title="Order Status"
            subtitle="Track the progress of your order"
          />

          <div className="-mx-space-1 overflow-x-auto px-space-1 pb-space-2">
            <div className="flex min-w-160ms-start justify-between gap-space-2">
              {timelineCards.map((card, index) => (
                <React.Fragment key={`${card.title}-${index}`}>
                  <OrderStatusCard
                    isActive={card.isActive}
                    title={card.title}
                    date={card.date || "—"}
                    icon={card.icon}
                  />

                  {index < timelineCards.length - 1 && (
                    <span
                      className={`mt-6.25 h-0.75 flex-1 rounded-full ${
                        card.isActive && timelineCards[index + 1].isActive
                          ? "bg-secondary"
                          : "bg-white/10"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* ================= Support Boxes ================= */}
        {firstItemSupport && (
          <div className="mt-space-10">
            <div className="mb-space-7 h-px w-full bg-white/10" />

            <div className="grid grid-cols-1 gap-space-5 sm:grid-cols-3">
              <Boxes
                icon={"fi fi-rr-shield-check"}
                title={firstItemSupport.tested?.title || "Quality Tested"}
                subtitle={firstItemSupport.tested?.subtitle || ""}
              />
              <Boxes
                icon={"fi fi-rr-wrench-alt"}
                title={firstItemSupport.guarantee?.title || "Guarantee"}
                subtitle={firstItemSupport.guarantee?.subtitle || ""}
              />
              <Boxes
                icon={"fi fi-rr-replace"}
                title={firstItemSupport.replacement?.title || "Replacement"}
                subtitle={firstItemSupport.replacement?.subtitle || ""}
              />
            </div>
          </div>
        )}
      </div>

      {/* ================= Cancel Modal ================= */}
      {showCancelConfirm && (
        <ConfirmModal
          isLoading={canceling}
          onConfirm={handleConfirmCancel}
          onClose={() => setShowCancelConfirm(false)}
        />
      )}
    </section>
  );
};

export default Page;
