"use client";

import Button from "@/app/components/Button";
import OrderItemsTable from "@/app/components/dashboard/orders/OrderItemsTable";
import OrdersTable from "@/app/components/dashboard/orders/OrderTable";
import StatusBadge from "@/app/components/dashboard/StatusBadge";
import { useGetOrderDetailsAdminQuery } from "@/redux";
import { notFound, useParams, useRouter } from "next/navigation";

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatAddress = (addr) => {
  if (!addr) return "—";
  return [
    addr.apartmentNumber && `Apt ${addr.apartmentNumber}`,
    addr.buildingNumber && `Building ${addr.buildingNumber}`,
    addr.roadNumber && `Road ${addr.roadNumber}`,
    addr.locality,
    addr.area,
    addr.city,
    addr.postCode,
    addr.country,
  ]
    .filter(Boolean)
    .join(", ");
};

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// ─── Sub-components ──────────────────────────────────────────────────────────

// Section header with optional slot on the right
const SectionHeader = ({ title, right }) => (
  <div className="flex items-center justify-between mb-space-5">
    <h3 className="font-semibold text-size-h6 text-placeholder_3">{title}</h3>
    {right}
  </div>
);

// One contact row: icon + text
const ContactRow = ({ flaticon, text }) => (
  <div className="flex items-center gap-space-3">
    <span className="size-9 bg-secondary/10 text-secondary flex items-center justify-center rounded-full shrink-0">
      <i className={`fi ${flaticon} text-size-h6`} />
    </span>
    <p className="font-medium text-size-h6 truncate">{text || "—"}</p>
  </div>
);

// One key-value info row
const MetaRow = ({ label, value, accent = false }) => (
  <div className="flex items-center justify-between gap-space-3">
    <p className="text-size-h6 text-placeholder_2 shrink-0">{label}</p>
    <p
      className={`font-semibold text-size-h6 text-right ${accent ? "text-secondary" : ""}`}
    >
      {value || "—"}
    </p>
  </div>
);

// One pricing row
const PricingRow = ({ label, value, isTotal = false }) => (
  <div
    className={`flex items-center justify-between ${
      isTotal ? "pt-space-4 mt-space-2 border-t border-placeholder_3/20" : ""
    }`}
  >
    <p
      className={`font-medium ${
        isTotal ? "text-size-h4 text-white" : "text-size-h6 text-placeholder_2"
      }`}
    >
      {label}
    </p>
    <p
      className={`font-semibold ${
        isTotal ? "text-size-h4 text-secondary" : "text-size-h6 text-[#CBD5F5]"
      }`}
    >
      ${(value ?? 0).toFixed(2)}
    </p>
  </div>
);

// Skeleton loader pulse block
const Skeleton = ({ className }) => (
  <div className={`animate-pulse rounded-lg bg-white/5 ${className}`} />
);

// ─── Loading state ───────────────────────────────────────────────────────────

const LoadingSkeleton = () => (
  <div className="px-space-6 pb-space-6 mt-space-3 flex gap-space-6">
    <div className="flex-1 p-space-5 rounded-2xl bg-[#1A1E3D]/50 space-y-space-6">
      <Skeleton className="h-8 w-24" />
      <div className="flex gap-space-7">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-space-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-24" />
          </div>
        ))}
      </div>
      <Skeleton className="h-48 w-full" />
    </div>
    <div className="flex-1 p-space-5 rounded-2xl bg-[#1A1E3D]/50 space-y-space-6">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  </div>
);

// ─── Main Page ───────────────────────────────────────────────────────────────

// ✅ Fix: Component name uppercase so React hooks rules apply correctly
// ✅ Fix: Removed eslint-disable comment — no longer needed
const Page = () => {
  const { id } = useParams();
  const router = useRouter();

  const {
    data,
    isLoading,
    isError,
    isUninitialized, // ← এটা add করো
  } = useGetOrderDetailsAdminQuery(
    { orderId: id },
    { skip: !id }, // ← এটা add করো
  );
  const order = data?.data;
  // ✅ Fix: Check isLoading FIRST, before accessing data
  //         The old code called notFound() immediately when data was undefined
  //         during the initial fetch, which caused a false 404.
  if (!id || isUninitialized || isLoading) return <LoadingSkeleton />;
  if (isError || !order) return notFound();

  return (
    <div className="px-space-6 pb-space-6 mt-space-3 flex gap-space-6 items-start">
      {/* ══════════════════════════════════════════
          LEFT PANEL — Order items & delivery info
          ══════════════════════════════════════════ */}
      <div className="p-space-5 space-y-space-7 rounded-2xl bg-[#1A1E3D]/50 flex-2/3">
        <div className="flex justify-between">
          {/* Back */}
          <Button
            variant="text"
            showLeftIcon
            leftIcon="fi fi-rr-arrow-small-left"
            onClick={() => router.back()}
          />
          {/* edit */}
          <Button>Edit Order</Button>
        </div>
        {/* Order meta strip */}
        <div className="flex flex-wrap items-start justify-between gap-space-5">
          <div>
            <p className="text-size-medium font-semibold text-placeholder_2 mb-space-1">
              Order ID
            </p>
            <p className="font-semibold text-size-h6 text-white">
              #{order.orderId}
            </p>
          </div>
          <div>
            <p className="text-size-medium font-semibold text-placeholder_2 mb-space-1">
              Placed On
            </p>
            {/* ✅ Fix: was hardcoded "April 24, 2024" — now uses order.createdAt from timestamps */}
            <p className="font-semibold text-size-h6">
              {formatDate(order.createdAt)}
            </p>
          </div>
          <div>
            <p className="text-size-medium font-semibold text-placeholder_2 mb-space-1">
              Order Status
            </p>
            {/* ✅ Fix: was hardcoded "pending" — now uses order.status */}
            <StatusBadge status={order.status} />
          </div>
          <div>
            <p className="text-size-medium font-semibold text-placeholder_2 mb-space-1">
              Payment Status
            </p>
            {/* ✅ New: paymentStatus shown from schema */}
            <StatusBadge status={order.paymentStatus} />
          </div>
        </div>

        {/* Items table */}
        {/* ✅ Fix: was passing dummy `orders` from assets — now passes order.items (array) */}
        <OrderItemsTable items={order.items} />

        {/* Delivery tracking — shown only if data exists */}
        {(order.trackingId ||
          order.courierName ||
          order.estimatedDeliveryDate) && (
          <div className="space-y-space-4">
            <SectionHeader title="Delivery Tracking" />
            <div className="px-space-2 space-y-space-4">
              {order.courierName && (
                <MetaRow label="Courier" value={order.courierName} />
              )}
              {order.trackingId && (
                <MetaRow label="Tracking ID" value={order.trackingId} accent />
              )}
              {order.estimatedDeliveryDate && (
                <MetaRow
                  label="Estimated Delivery"
                  value={formatDate(order.estimatedDeliveryDate)}
                />
              )}
              {order.estimatedDeliveryDurationDays && (
                <MetaRow
                  label="Est. Duration"
                  value={`${order.estimatedDeliveryDurationDays} days`}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════
          RIGHT PANEL — Customer, Payment, Pricing
          ══════════════════════════════════════════ */}
      <div className="p-space-5 space-y-space-7 rounded-2xl bg-[#1A1E3D]/50 flex-1/3">
        {/* Panel header */}
        <h2 className="font-semibold text-[20px] text-placeholder_3">
          Ship To
        </h2>

        {/* ── Customer ── */}
        <div>
          <SectionHeader title="Customer" />
          <div className="px-space-2">
            {/* ✅ Fix: was hardcoded "Mahdi Hasan" */}
            <h4 className="font-semibold text-[20px] mb-space-2">
              {order.customer?.name ?? "—"}
            </h4>
            {/* ✅ Fix: was hardcoded address — now formatted from deliveryAddress snapshot */}
            <p className="font-medium text-size-h6 text-placeholder_2 leading-relaxed">
              {formatAddress(order.deliveryAddress)}
            </p>
          </div>
        </div>

        <div className="border-t border-white/5" />

        {/* ── Contact ── */}
        <div>
          <SectionHeader title="Contact Information" />
          <div className="px-space-2 space-y-space-3">
            {/* ✅ Fix: was hardcoded email & phone */}
            <ContactRow
              flaticon="fi-rr-envelope"
              text={order.customer?.email}
            />
            <ContactRow
              flaticon="fi-rr-phone-flip"
              text={order.customer?.phone}
            />
          </div>
        </div>

        <div className="border-t border-white/5" />

        {/* ── Payment method ── */}
        <div>
          <SectionHeader title="Payment Method" />
          <div className="px-space-2 flex items-center gap-space-3">
            <span className="size-9 bg-secondary/10 text-secondary flex items-center justify-center rounded-full shrink-0">
              <i className="fi fi-rr-credit-card text-size-h6" />
            </span>
            <div>
              {/* ✅ New: paymentMethod from schema */}
              <p className="font-semibold text-size-h6">
                {order.paymentMethod ?? "—"}
              </p>
              {/* ✅ New: cardSnapshot shown only for card payments */}
              {order.cardSnapshot?.maskedNumber && (
                <p className="text-size-small text-placeholder_2">
                  {order.cardSnapshot.network} ····{" "}
                  {order.cardSnapshot.maskedNumber.slice(-4)}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/5" />

        {/* ── Pricing ── */}
        <div>
          <SectionHeader title="Pricing" />
          <div className="px-space-2">
            <div className="space-y-space-4">
              {/* ✅ Fix: all values were hardcoded $9.00 — now use schema fields */}
              <PricingRow label="Subtotal" value={order.subtotal} />
              <PricingRow label="Discount" value={order.discount} />
              <PricingRow
                label="Shipping Charge"
                value={order.shippingCharge}
              />
              <PricingRow label="VAT" value={order.vat} />
              <PricingRow label="Total" value={order.total} isTotal />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
