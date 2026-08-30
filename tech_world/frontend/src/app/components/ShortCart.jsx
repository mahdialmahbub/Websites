"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import Tag from "./Tag";

import { useGetMyCartQuery, useRemoveCartItemMutation } from "@/redux";

import { usePathname, useRouter } from "next/navigation";
import Button from "./Button";
import { useSelector } from "react-redux";
import EditCartItemModal from "./EditCartItemModal";
import { ProductCard } from "./ProductCard";

const toCartCardData = (item) => ({
  image: item.product?.image,
  title: item.product?.title,
  requirement: [
    ...(item.selectedVariants || []).map((v) => v.name),
    item.selectedColor,
  ]
    .filter(Boolean)
    .join(", "),
  price: item.totalPrice,
  quantity: item.quantity,
});

const ShortCart = () => {
  const router = useRouter();
  const pathname = usePathname();

  const user = useSelector((state) => state.auth.customer);

  // Cart items — only meaningful once a user is logged in
  const { data: cartData, isLoading: cartLoading } = useGetMyCartQuery(
    undefined,
    { skip: !user },
  );

  const items = cartData?.data?.items || [];

  const [removeCartItem] = useRemoveCartItemMutation();

  // Drawer starts closed — it's a peek tab now, not an always-open box
  const [isOpen, setIsOpen] = useState(false);
  const [isRemovingAll, setIsRemovingAll] = useState(false);

  const [editingCartItem, setEditingCartItem] = useState(null); // the cart item currently being edited, or null

  // Remove single cart item
  const handleRemoveItem = async (cartItemId) => {
    try {
      await removeCartItem(cartItemId).unwrap();

      toast.success("Item removed from cart.");
    } catch (err) {
      console.error("Remove cart item failed:", err);

      toast.error(err?.data?.message || "Could not remove item.");
    }
  };

  // Remove all cart items
  const handleCancelAll = async () => {
    if (!items.length) {
      toast.error("Your cart is already empty.");
      return;
    }

    try {
      setIsRemovingAll(true);

      await Promise.all(
        items.map((item) => removeCartItem(item.cartItemId).unwrap()),
      );

      toast.success("All cart items removed.");
    } catch (err) {
      console.error("Remove all cart items failed:", err);

      toast.error(err?.data?.message || "Could not remove all cart items.");
    } finally {
      setIsRemovingAll(false);
    }
  };

  // Go to cart page
  const handleCheckout = () => {
    router.push("/cart");
  };

  return (
    <div
      className={`fixed left-0 bottom-5 z-50 ${
        pathname.includes("/cart") ? "hidden" : ""
      }`}
    >
      {/* Edge tab — pinned to the left edge, always visible, toggles the drawer */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Collapse cart" : "Expand cart"}
        aria-expanded={isOpen}
        className="relative cursor-pointer z-10 flex flex-col items-center gap-space-2 bg-secondary text-background rounded-r-xl py-space-4 px-space-2"
      >
        <i className="fi fi-sr-shopping-cart text-size-h5" />

        <span className="font-primary font-semibold text-size-small">
          {user ? items.length : 0}
        </span>

        <i
          className={`fi fi-sr-sort-down text-size-largearge transition-transform ${
            isOpen ? "rotate-90" : "-rotate-90"
          }`}
        />
      </button>

      {/* Sliding cart panel — slides out to the right, from behind the tab */}
      <div
        className={`absolute bottom-0 left-full w-125 p-space-4 space-y-space-4 rounded-xl bg-background border-2 border-secondary/60 shadow-lg transition-all duration-300 ease-in-out will-change-transform ${
          isOpen
            ? "translate-x-3 opacity-100 pointer-events-auto"
            : "-translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        {user ? (
          <>
            {/* Header */}
            <div className="flex items-center gap-space-2">
              <h4 className="font-primary font-semibold text-size-large text-placeholder">
                Your Cart Items
              </h4>

              <Tag property={"filter"} text={items.length} />
            </div>

            {/* Cart Items */}
            {cartLoading ? (
              <p className="py-4 text-center text-placeholder">
                Loading cart...
              </p>
            ) : items.length === 0 ? (
              <p className="py-4 text-center text-placeholder">
                Your cart is empty.
              </p>
            ) : (
              <div className="space-y-space-2 gap-2.5 *:w-full max-h-[50vh] overflow-y-auto">
                {items.map((item) => (
                  <ProductCard
                    key={item.cartItemId}
                    variant="smallCart"
                    data={toCartCardData(item)}
                    actions={{
                      onDelete: () => handleRemoveItem(item.cartItemId),
                      onEdit: () => setEditingCartItem(item),
                    }}
                  />
                ))}
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center gap-space-3 *:w-full">
              <Button
                variant="secondary"
                color="#d10000"
                onClick={handleCancelAll}
                disabled={items.length === 0 || isRemovingAll}
              >
                {isRemovingAll ? "Removing..." : "Cancel All"}
              </Button>

              <Button onClick={handleCheckout} disabled={items.length === 0}>
                Checkout
              </Button>
            </div>
          </>
        ) : (
          // ---------- Logged out state ----------
          <div className="flex flex-col items-center gap-space-3 py-space-6 text-center">
            <i className="fi fi-sr-user text-secondary text-size-h3" />

            <h4 className="font-primary font-semibold text-size-large text-placeholder">
              Your Cart is Waiting
            </h4>

            <p className="text-placeholder">
              Log in or create an account to view your cart and continue
              shopping.
            </p>

            <div className="flex items-center gap-space-3 *:w-full pt-space-2 w-full">
              <Button onClick={() => router.push("/login")}>Log In</Button>

              <Button
                variant="secondary"
                onClick={() => router.push("/register")}
              >
                Register
              </Button>
            </div>
          </div>
        )}
      </div>
      {editingCartItem && (
        <EditCartItemModal
          item={editingCartItem}
          onClose={() => setEditingCartItem(null)}
        />
      )}
    </div>
  );
};

export default ShortCart;
