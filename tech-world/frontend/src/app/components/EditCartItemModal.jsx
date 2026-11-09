"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "./Button";
import useLockBodyScroll from "@/app/hooks/useLockBodyScroll";
import { useUpdateCartItemMutation } from "@/redux";

/**
 * Props:
 *   item     — one item from useGetMyCartQuery()'s response, i.e.
 *              { cartItemId, product: { title, stock, variants, colors, ... },
 *                selectedVariantIds, selectedColor, quantity, ... }
 *   onClose()
 */
export default function EditCartItemModal({ item, onClose }) {
  useLockBodyScroll();

  const [selectedVariantIds, setSelectedVariantIds] = useState(
    item.selectedVariantIds || [],
  );
  const [selectedColor, setSelectedColor] = useState(
    item.selectedColor || null,
  );
  const [quantity, setQuantity] = useState(item.quantity || 1);

  const [updateCartItem, { isLoading }] = useUpdateCartItemMutation();

  // Close on Escape, matching every other modal in the app.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const variants = item.product?.variants || [];
  const colors = item.product?.colors || [];
  const stock = item.product?.stock ?? 99;

  // Group variants by their `group` label (RAM / Storage / Processor / ...)
  const variantGroups = variants.reduce((acc, v) => {
    const key = v.group || "Options";
    acc[key] = acc[key] || [];
    acc[key].push(v);
    return acc;
  }, {});

  const toggleVariant = (variantId, group) => {
    setSelectedVariantIds((prev) => {
      // one selection per group: drop any other variant from the same group first
      const withoutGroup = prev.filter(
        (id) => !variants.find((v) => v._id === id && v.group === group),
      );
      return [...withoutGroup, variantId];
    });
  };

  const handleSave = async () => {
    try {
      await updateCartItem({
        cartItemId: item.cartItemId,
        selectedVariantIds,
        selectedColor,
        quantity,
      }).unwrap();
      toast.success("Cart item updated");
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Could not update this item.");
    }
  };

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
        <div className="flex items-center justify-between gap-space-4">
          <div className="flex min-w-0 items-center gap-space-3">
            <i className="fi fi-rr-edit shrink-0 text-[24px] text-secondary" />
            <h2 className="truncate font-semibold text-size-h4 text-placeholder_3">
              Edit Cart Item
            </h2>
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

        <div className="-mr-1 max-h-[65vh] space-y-space-7 overflow-y-auto pr-1 custom-scrollbar">
          <p className="font-medium text-size-h6 text-foreground">{item.product?.title}</p>

          {/* Colors */}
          {colors.length > 0 && (
            <div>
              <p className="mb-3 text-sm font-medium text-foreground">Color</p>
              <div className="flex gap-3">
                {colors.map((c) => (
                  <button
                    key={c._id}
                    type="button"
                    aria-label={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    style={{ backgroundColor: c.hexCode }}
                    className={`h-9 w-8 rounded-xs outline-2 outline-offset-2 transition-transform ${
                      selectedColor === c.name
                        ? "outline-secondary scale-110"
                        : "outline-transparent hover:scale-105"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Variants, grouped */}
          {Object.entries(variantGroups).map(([group, groupVariants]) => (
            <div key={group}>
              <p className="mb-3 text-sm font-medium text-foreground">{group}</p>
              <div className="flex flex-wrap gap-2">
                {groupVariants.map((v) => (
                  <button
                    key={v._id}
                    type="button"
                    onClick={() => toggleVariant(v._id, group)}
                    className={`min-w-25 h-16.25 rounded-sm border p-space-3 text-center font-primary text-size-h6 font-semibold transition-colors ${
                      selectedVariantIds.includes(v._id)
                        ? "border-secondary bg-secondary/5 text-secondary"
                        : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/5"
                    }`}
                  >
                    <p className="font-semibold">{v.name}</p>

                    {v.priceAdjustment !== 0 && (
                      <p className="text-size-medium text-placeholder_2/80">
                        {`(${v.priceAdjustment > 0 ? "+" : ""}$${v.priceAdjustment})`}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div>
            <p className="mb-3 text-sm font-medium text-foreground">Quantity</p>
            <div className="flex items-center justify-between gap-3">
              <div className="mb-space-3 flex h-12.5 min-w-42.5 items-center justify-between gap-3 rounded-lg bg-background outline-2 outline-offset-2 outline-secondary/20">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="rounded-full text-[43px] text-secondary hover:bg-secondary/10"
                >
                  <i className="fi fi-rr-minus-small" />
                </button>

                <span className="font-primary text-size-h6 font-bold">{quantity}</span>

                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                  aria-label="Increase quantity"
                  className="rounded-full text-[43px] text-secondary hover:bg-secondary/10"
                >
                  <i className="fi fi-rr-plus-small" />
                </button>
              </div>

              <span className="text-size-h6 text-secondary/70">
                <span className="font-bold">{stock}</span> in stock
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-space-4 border-t border-white/5 pt-space-6 *:w-full">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
