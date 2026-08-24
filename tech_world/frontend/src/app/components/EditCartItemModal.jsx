"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Button from "./Button";
import { useUpdateCartItemMutation } from "@/redux";

/**
 * Props:
 *   item     — one item from useGetMyCartQuery()'s response, i.e.
 *              { cartItemId, product: { title, stock, variants, colors, ... },
 *                selectedVariantIds, selectedColor, quantity, ... }
 *   onClose()
 */
export default function EditCartItemModal({ item, onClose }) {
  const [selectedVariantIds, setSelectedVariantIds] = useState(
    item.selectedVariantIds || [],
  );
  const [selectedColor, setSelectedColor] = useState(
    item.selectedColor || null,
  );
  const [quantity, setQuantity] = useState(item.quantity || 1);

  const [updateCartItem, { isLoading }] = useUpdateCartItemMutation();

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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="max-w-150 w-full space-y-space-7 p-space-7 rounded-2xl bg-background border-2 border-secondary/10">
        <div className="flex items-center gap-space-3 ">
          <i className="fi fi-rr-edit text-secondary text-[24px]"></i>
          <h2 className="font-semibold text-size-h4 text-placeholder_3">Edit Cart Item</h2>
        </div>
        <div className="space-y-space-7 overflow-y-auto h-75 custom-scrollbar pl-[5px]">
          <p className="font-medium text-size-h6 text-foreground">
            {item.product?.title}
          </p>

          {/* Colors */}
          {colors.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-3 text-foreground">Color</p>
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
              <p className="text-sm font-medium mb-3 text-foreground">
                {group}
              </p>
              <div className="flex gap-2 flex-wrap">
                {groupVariants.map((v) => (
                  <button
                    key={v._id}
                    type="button"
                    onClick={() => toggleVariant(v._id, group)}
                    className={`rounded-sm border min-w-25 h-16.25 p-space-3 text-size-h6 font-primary font-semibold transition-colors text-center ${
                      selectedVariantIds.includes(v._id)
                        ? "border-secondary bg-secondary/5 text-secondary"
                        : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/5"
                    }`}
                  >
                    <p className="font-semibold">{v.name}</p>

                    {v.priceAdjustment !== 0 && (
                      <p className="text-size-medium text-placeholder_2/80">
                        {v.priceAdjustment !== 0 &&
                          `(${v.priceAdjustment > 0 ? "+" : ""}$${v.priceAdjustment})`}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div>
            <p className="text-sm font-medium mb-3 text-foreground">Quantity</p>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-42.5 rounded-lg bg-background h-12.5 justify-between outline-2 outline-offset-2 outline-secondary/20 mb-space-3">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="text-[43px] text-secondary hover:bg-secondary/10 rounded-full"
                >
                  <i className="fi fi-rr-minus-small"></i>
                </button>

                <span className="font-primary font-bold text-size-h6">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                  aria-label="Increase quantity"
                  className="text-[43px] text-secondary hover:bg-secondary/10 rounded-full"
                >
                  <i className="fi fi-rr-plus-small"></i>
                </button>
              </div>

              <span className="text-size-h6 text-secondary/70">
                <span className="font-bold">{stock}</span> in stock
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-space-4 pt-space-2">
          <Button
            variant="secondary"
            type="button"
            onClick={onClose}
            className="flex-1 text-red"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
