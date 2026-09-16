"use client";

import React from "react";
import {
  Heart,
  Star,
  Trash2,
  Pencil,
  ArrowRight,
  MessageCircle,
  Truck,
  Minus,
  Plus,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "./Button";
import ClickableWrap from "./ClickableWrap";
import Tag from "./Tag";
import {
  useAddToWishlistMutation,
  useGetMyWishlistQuery,
  useRemoveFromWishlistMutation,
} from "@/redux";

/**
 * ProductCard
 * -------------------------------------------------------------
 * Ekta reusable card component, 5 ta variant support kore:
 *
 *   "primary"       → catalog / product grid card
 *   "cart"          → cart list item (wide row)
 *   "delivered"     → order history / delivered item
 *   "smallCart"     → compact mini-cart item
 *   "pendingOrder"  → pending / shipping order card
 *
 * Design principle: Component nijer kono content/data rakhe na —
 * shob kichu (image, title, price, status ...) `data` prop diye
 * parent component theke ashbe. Button/icon click handle korar jonno
 * `actions` prop diye callback function gulo pathabe.
 *
 * Ei jonne ekई component shob jaygay (product grid, cart page,
 * order history page) reuse kora jabe, just variant + data change korle e hobe.
 */

const money = (n) => (typeof n === "number" ? `$ ${n.toFixed(2)}` : n);

/* ---- Chotto shared icon-button, shob variant e use hoy ---- */
function IconButton({ tone = "default", onClick, label, children }) {
  const toneClasses = {
    danger: "border-red-500/40 text-red-400 hover:bg-red-500/10",
    success: "border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10",
    info: "border-cyan-400/40 text-cyan-300 hover:bg-cyan-400/10",
    default: "border-white/10 text-slate-300 hover:bg-white/5",
  };
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border transition-colors ${toneClasses[tone]}`}
    >
      {children}
    </button>
  );
}

/* =====================  MAIN EXPORT  ===================== */
export function ProductCard({
  variant = "primary",
  data = {},
  actions = {},
  link,
}) {
  switch (variant) {
    case "cart":
      return <CartCard data={data} actions={actions} />;
    case "delivered":
      return <DeliveredCard data={data} actions={actions} />;
    case "smallCart":
      return <SmallCartCard data={data} actions={actions} />;
    case "pendingOrder":
      return <PendingOrderCard data={data} actions={actions} />;
    case "primary":
    default:
      return <PrimaryCard data={data} actions={actions} link={link} />;
  }
}

/* =====================  1. PRIMARY  ===================== */
function PrimaryCard({ data, actions, link }) {
  const {
    id,
    image,
    badge,
    title,
    rating,
    reviewCount,
    price,
    originalPrice,
    buttonText = "Add to cart",
    status,
  } = data;

  const router = useRouter();
  const isOutOfStock = status == "out of stock";

  // Cart-in-progress state for this card: false = show "Add to cart",
  // true = show the quantity counter row instead.
  const [isInCart, setIsInCart] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);

  // "/product" (singular) matches the actual route folder: app/product/[id]/page.jsx
  const productLink = link || `/product/${id}`;

  const { data: wishlistData } = useGetMyWishlistQuery();

  const isInWishlist = wishlistData?.data?.some((item) => item._id === id);

  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const handleAddToCart = () => {
    setQuantity(1);
    setIsInCart(true);
    actions.onPrimary?.(1);
  };

  const handleIncrement = () => {
    setQuantity((prev) => {
      const next = prev + 1;
      actions.onQuantityChange?.(next);
      return next;
    });
  };

  const handleDecrement = () => {
    setQuantity((prev) => {
      const next = prev - 1;
      if (next <= 0) {
        // Count hit 0 → fall back to the "Add to cart" button.
        setIsInCart(false);
        actions.onRemove?.();
        return 1;
      }
      actions.onQuantityChange?.(next);
      return next;
    });
  };

  const handleDelete = () => {
    setIsInCart(false);
    setQuantity(1);
    actions.onRemove?.();
  };

  const handleGoToCart = () => {
    if (actions.onGoToCart) {
      actions.onGoToCart();
    } else {
      router.push("/cart");
    }
  };

  const handleToggle = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      if (isInWishlist) {
        await removeFromWishlist(id).unwrap();
      } else {
        await addToWishlist(id).unwrap();
      }
    } catch (err) {
      console.error("Wishlist update failed:", err);
    }
  };
  return (
    <div className="min-w-84.5 max-h-max overflow-hidden rounded-2xl border border-secondary/20 bg-[#12141c] shadow-lg shadow-black/30 p-space-4 w-85">
      <div className="relative h-50 w-full rounded-xl overflow-hidden">
        <ClickableWrap href={productLink}>
          <Image
            width={100}
            height={100}
            src={image}
            alt={title}
            className="h-full w-full object-cover"
          />
        </ClickableWrap>
        {badge && <Tag text={badge} className=" absolute top-2 left-2" />}
        <button
          type="button"
          aria-label="Wishlist"
          onClick={handleToggle}
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 backdrop-blur"
        >
          <Heart
            size={15}
            className={
              isInWishlist ? "fill-red-500 text-red-500" : "text-white"
            }
          />
        </button>
      </div>

      <div className="space-y-2 px-2 mt-space-4">
        <ClickableWrap href={productLink}>
          <h3 className="line-clamp-2 hover:underline text-size-h5 font-semibold ">
            {title}
          </h3>
        </ClickableWrap>
        <div className="flex items-center justify-between mt-space-3">
          <div className="flex items-center gap-2">
            <Star size={14} className="fill-secondary text-secondary" />
            <span className="text-placeholder text-size-h6 font-semibold">
              {rating}
            </span>
            <span className="text-placeholder text-size-large font-semibold">
              ({reviewCount})
            </span>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[24px] font-primary font-semibold ">
              {money(price)}
            </span>
            {originalPrice && (
              <span className="text-size-medium font-primary font-semibold text-placeholder_3 line-through">
                {money(originalPrice)}
              </span>
            )}
          </div>
        </div>

        {isOutOfStock ? (
          <div
            className="mt-[12px] w-full rounded-xl border border-red-500/20 bg-red-500/5 py-3 text-center text-size-h6 font-bold tracking-wide text-red-500"
            aria-disabled="true"
          >
            Out of Stock
          </div>
        ) : !isInCart ? (
          <Button
            type="text"
            onClick={handleAddToCart}
            className="mt-[12px] h-9.5 w-full hover:opacity-90 text-size-h6 font-bold text-secondary"
            variant="text"
          >
            {buttonText}
          </Button>
        ) : (
          <div className="mt-[12px] flex items-center gap-2">
            <div className="flex flex-1 items-center justify-between rounded-xl border border-white/10 bg-[#0d0f16] px-3 py-2">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={handleDecrement}
                className="flex h-6 w-6 items-center justify-center text-emerald-400 hover:text-emerald-300"
              >
                <Minus size={16} strokeWidth={3} />
              </button>
              <span className="text-size-h6 font-bold text-white tabular-nums">
                {String(quantity).padStart(2, "0")}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={handleIncrement}
                className="flex h-6 w-6 items-center justify-center text-emerald-400 hover:text-emerald-300"
              >
                <Plus size={16} strokeWidth={3} />
              </button>
            </div>
            <button
              className="h-9.5 w-9.5 bg-red/10 flex items-center justify-center rounded-lg"
              onClick={handleDelete}
            >
              <i className="fi fi-rr-trash text-red text-size-h5"></i>
            </button>
            <button
              className="h-9.5 w-9.5 bg-secondary/10 flex items-center justify-center rounded-lg"
              onClick={handleGoToCart}
            >
              <i className="fi fi-rr-cart-shopping-fast text-secondary text-size-h5"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* =====================  2. CART  ===================== */
function CartCard({ data, actions }) {
  const { image, title, requirement, price, quantity } = data;

  const handleDecrement = () => {
    if (quantity <= 1) return;
    actions.onQuantityChange?.(quantity - 1);
  };
  const handleIncrement = () => actions.onQuantityChange?.(quantity + 1);

  return (
    <div className="flex w-105 items-center gap-3 rounded-xl border border-white/10 bg-[#12141c] p-3">
      <Image
        width={100}
        height={100}
        src={image}
        alt={title}
        className="h-14 w-14 shrink-0 rounded-lg object-cover"
      />

      <div className="min-w-0 flex-1">
        <h4 className="truncate text-sm font-medium text-slate-100">{title}</h4>
        {requirement && (
          <p className="mt-0.5 truncate text-xs text-slate-500">
            {requirement}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#0d0f16] px-2 py-1">
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={handleDecrement}
          className="flex h-6 w-6 items-center justify-center text-emerald-400 hover:text-emerald-300"
        >
          <Minus size={14} strokeWidth={3} />
        </button>
        <span className="text-sm font-semibold text-white tabular-nums w-5 text-center">
          {quantity}
        </span>
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={handleIncrement}
          className="flex h-6 w-6 items-center justify-center text-emerald-400 hover:text-emerald-300"
        >
          <Plus size={14} strokeWidth={3} />
        </button>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-sm font-semibold text-white">{money(price)}</p>
      </div>

      <div className="flex items-center gap-1.5">
        <IconButton tone="danger" label="Remove" onClick={actions.onDelete}>
          <Trash2 size={14} />
        </IconButton>
        <IconButton tone="success" label="Edit" onClick={actions.onEdit}>
          <Pencil size={14} />
        </IconButton>
        <IconButton tone="info" label="View" onClick={actions.onView}>
          <ArrowRight size={14} />
        </IconButton>
      </div>
    </div>
  );
}

/* =====================  3. DELIVERED  ===================== */
function DeliveredCard({ data, actions }) {
  // FIX: `isReviewed` now comes from `data` (where the page already puts
  // it via toDeliveredCardData). Previously this destructured a top-level
  // `isReviewed` prop that ProductCard never actually passed down, so it
  // was always `undefined` and the Review button showed unconditionally —
  // even for products the customer had already reviewed.
  const { image, title, requirement, quantity, deliveredDate, total, isReviewed } = data;

  return (
    <div className="flex w-115 items-center gap-3 rounded-xl border border-white/10 bg-[#12141c] p-3">
      <Image
        width={100}
        height={100}
        src={image}
        alt={title}
        className="h-16 w-16 shrink-0 rounded-lg object-cover"
      />

      <div className="min-w-0 flex-1 space-y-0.5">
        <h4 className="truncate text-sm font-medium text-slate-100">{title}</h4>
        {requirement && (
          <p className="truncate text-xs text-slate-500">{requirement}</p>
        )}
        <p className="text-xs text-slate-500">
          Quantity: <span className="text-slate-300">{quantity}</span>
        </p>
        <p className="text-xs text-slate-500">
          Delivered: <span className="text-cyan-400">{deliveredDate}</span>
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-[11px] text-slate-500">Total</p>
        <p className="text-sm font-semibold text-white">{money(total)}</p>
      </div>

      {!isReviewed && (
        <button
          onClick={actions.onReview}
          className="relative shrink-0 rounded-lg bg-linear-to-r from-amber-400 to-yellow-300 px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-[0_0_12px_3px_rgba(250,204,21,0.5)] animate-pulse hover:shadow-[0_0_18px_6px_rgba(250,204,21,0.7)] transition-shadow"
        >
          Review
        </button>
      )}

      <div className="flex items-center gap-1.5">
        <IconButton tone="danger" label="Remove" onClick={actions.onDelete}>
          <Trash2 size={14} />
        </IconButton>
        <IconButton tone="info" label="View" onClick={actions.onView}>
          <ArrowRight size={14} />
        </IconButton>
      </div>
    </div>
  );
}

/* =====================  4. SMALL CART  ===================== */
function SmallCartCard({ data, actions }) {
  const { image, title, price, quantity } = data;

  return (
    <div className="flex w-64 items-center gap-2.5 rounded-xl border border-white/10 bg-[#12141c] p-2.5">
      <Image
        width={100}
        height={100}
        src={image}
        alt={title}
        className="h-9 w-9 shrink-0 rounded-md object-cover"
      />

      <div className="min-w-0 flex-1">
        <h4 className="truncate text-xs font-medium text-slate-100">{title}</h4>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-xs font-semibold text-white">{money(price)}</p>
        <p className="text-size-small text-slate-500">Qty: {quantity}</p>
      </div>

      <div className="flex items-center gap-1">
        <IconButton tone="danger" label="Remove" onClick={actions.onDelete}>
          <Trash2 size={14} />
        </IconButton>
        <IconButton tone="success" label="Edit" onClick={actions.onEdit}>
          <Pencil size={14} />
        </IconButton>
      </div>
    </div>
  );
}

/* =====================  5. PENDING ORDER  ===================== */
function PendingOrderCard({ data, actions }) {
  const {
    image,
    title,
    total,
    requirement,
    quantity,
    status = "Shipping",
    estimatedDelivery,
  } = data;

  return (
    <div className="w-72 overflow-hidden rounded-2xl border border-white/10 bg-[#12141c] p-3">
      <Image
        width={100}
        height={100}
        src={image}
        alt={title}
        className="h-32 w-full rounded-xl object-cover"
      />

      <div className="mt-3 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium text-slate-100">{title}</h3>
          <div className="shrink-0 text-right">
            <p className="text-[11px] text-slate-500">Total</p>
            <p className="text-sm font-semibold text-white">{money(total)}</p>
          </div>
        </div>

        {requirement && <p className="text-xs text-slate-500">{requirement}</p>}

        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-slate-500">
            Quantity: <span className="text-slate-300">{quantity}</span>
          </p>
          <span className="flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
            <Truck size={12} />
            {status}
          </span>
        </div>

        {estimatedDelivery && (
          <p className="text-xs text-slate-500">
            Estimated Delivery:{" "}
            <span className="text-cyan-400">{estimatedDelivery}</span>
          </p>
        )}

        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={actions.onCancel}
            className="flex-1 rounded-lg border border-red-500/40 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/10"
          >
            Cancel Order
          </button>
          <button
            type="button"
            onClick={actions.onDetails}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-cyan-400/40 py-1.5 text-xs font-medium text-cyan-300 hover:bg-cyan-400/10"
          >
            Details <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
