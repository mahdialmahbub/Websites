"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useGetMyCartQuery,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useGetCheckoutPreviewQuery,
  usePlaceOrderMutation,
  useVerifyPaymentOtpMutation,
  useGetMyCardsQuery,
  useDeleteCardMutation,
  useGetMyAddressesQuery,
  useDeleteAddressMutation,
} from "@/redux";
import toast from "react-hot-toast";
import AddCardModal from "@/app/components/AddCardModal";
import EditCartItemModal from "@/app/components/EditCartItemModal";
import AddressModal from "@/app/components/AddressModal";
import Button from "@/app/components/Button";
import Chips from "@/app/components/Chips";
import { ProductCard } from "@/app/components/ProductCard";
import SavedCard from "@/app/components/cart/SavedCard";
import SavedAddress from "@/app/components/cart/SavedAddress";

const money = (n) => `$ ${Number(n || 0).toFixed(2)}`;

// Cart item -> the flat shape ProductCard's "cart" variant expects
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

const Page = () => {
  const router = useRouter();

  // ---------- Cart items ----------
  const { data: cartData, isLoading: cartLoading } = useGetMyCartQuery();
  const items = cartData?.data?.items || [];
  console.log("Cart items:", items); // Debugging line to check the fetched cart items

  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();

  const handleQuantityChange = async (cartItemId, quantity) => {
    try {
      await updateCartItem({ cartItemId, quantity }).unwrap();
    } catch (err) {
      toast.error(err?.data?.message || "Could not update quantity.");
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      await removeCartItem(cartItemId).unwrap();
    } catch (err) {
      toast.error(err?.data?.message || "Could not remove item.");
    }
  };

  // ---------- Price summary ----------
  const { data: previewData } = useGetCheckoutPreviewQuery(undefined, {
    skip: items.length === 0,
  });
  const pricing = previewData?.data || {
    subtotal: 0,
    discount: 0,
    shippingCharge: 0,
    vat: 0,
    total: 0,
  };

  // ---------- Saved cards ----------
  const { data: cardsData } = useGetMyCardsQuery();
  const cards = cardsData?.data || [];
  const [deleteCard] = useDeleteCardMutation();
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null); // null = adding new
  const [editingCartItem, setEditingCartItem] = useState(null); // the cart item currently being edited, or null

  const handleDeleteCard = async (cardId) => {
    try {
      await deleteCard(cardId).unwrap();
      if (selectedCardId === cardId) setSelectedCardId(null);
    } catch (err) {
      toast.error(err?.data?.message || "Could not remove card.");
    }
  };

  const openAddCard = () => {
    setEditingCard(null);
    setShowCardModal(true);
  };
  const openEditCard = (card) => {
    setEditingCard(card);
    setShowCardModal(true);
  };

  // ---------- Saved addresses ----------
  const { data: addressesData } = useGetMyAddressesQuery();
  const addresses = addressesData?.data || [];
  const [deleteAddress] = useDeleteAddressMutation();
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null); // null = adding new

  const handleDeleteAddress = async (addressId) => {
    try {
      await deleteAddress(addressId).unwrap();
      if (selectedAddressId === addressId) setSelectedAddressId(null);
    } catch (err) {
      toast.error(err?.data?.message || "Could not remove address.");
    }
  };

  const openAddAddress = () => {
    setEditingAddress(null);
    setShowAddressModal(true);
  };
  const openEditAddress = (address) => {
    setEditingAddress(address);
    setShowAddressModal(true);
  };

  // ---------- Checkout ----------
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [placeOrder, { isLoading: placingOrder }] = usePlaceOrderMutation();
  const [verifyPaymentOtp, { isLoading: verifyingOtp }] =
    useVerifyPaymentOtpMutation();
  const [awaitingCardOtp, setAwaitingCardOtp] = useState(false);
  const [otp, setOtp] = useState("");

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    if (!selectedAddressId) {
      toast.error("Please select a delivery address.");
      return;
    }
    if (paymentMethod === "Credit Card" && !selectedCardId) {
      toast.error("Please select a saved card, or add one first.");
      return;
    }

    try {
      const res = await placeOrder({
        paymentMethod,
        addressId: selectedAddressId,
        savedCardId:
          paymentMethod === "Credit Card" ? selectedCardId : undefined,
      }).unwrap();

      if (res.data.paymentVerificationRequired) {
        setAwaitingCardOtp(true);
      } else {
        toast.success("Order placed successfully!");
        router.push("/my_orders");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Could not place order.");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await verifyPaymentOtp(otp).unwrap();
      toast.success("Payment verified. Order placed!");
      router.push("/my_orders");
    } catch (err) {
      toast.error(err?.data?.message || "Invalid OTP.");
    }
  };

  return (
    <div>
      <div className="px-space-11 py-space-7">
        <Button
          variant="text"
          showLeftIcon
          leftIcon="fi fi-rr-arrow-small-left"
          onClick={() => router.back()}
        >
          Back
        </Button>
      </div>
      <div className="px-space-11">
        {/* header */}
        <div className="flex mb-space-8 items-center justify-between">
          <div className="flex items-center gap-space-5">
            <div className="flex items-center gap-space-4">
              <i className="fi fi-rr-cart-shopping-fast text-[30px] text-secondary"></i>
              <h1 className="font-primary font-semibold text-size-h4">
                Your Cart Items
              </h1>
            </div>
            <Chips text={String(items.length).padStart(2, "0")} />
          </div>
          <p className="font-primary font-semibold text-size-large text-placeholder_2">
            Good gadget, better tomorrow.
          </p>
        </div>

        {/* cart items and checkout */}
        <div className="grid grid-cols-1 gap-space-7 lg:grid-cols-[1fr_420px]">
          {/* ============================= Products ============================= */}
          <div>
            <div className="mb-space-5 flex items-center justify-between">
              <h2 className="font-primary text-size-h5 font-semibold text-foreground md:text-size-h4">
                Your Cart
              </h2>
              {!cartLoading && items.length > 0 && (
                <span className="text-sm text-placeholder_3">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </span>
              )}
            </div>

            {cartLoading ? (
              <div className="animate-pulse space-y-space-5">
                <div className="h-36 rounded-2xl bg-white/5" />
                <div className="h-36 rounded-2xl bg-white/5" />
                <div className="h-36 rounded-2xl bg-white/5" />
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center gap-space-4 rounded-2xl border border-white/5 bg-[#1A1E3D]/30 py-space-11 text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                  <i className="fi fi-rr-shopping-cart text-2xl" />
                </div>
                <div>
                  <h3 className="font-primary text-size-h5 font-semibold text-foreground">
                    Your cart is empty
                  </h3>
                  <p className="mt-1 text-sm text-placeholder_3">
                    Browse our products and add something you like.
                  </p>
                </div>
                <Button onClick={() => router.push("/")}>
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-space-6 *:w-full">
                {items.map((item) => (
                  <ProductCard
                    key={item.cartItemId}
                    variant="cart"
                    data={toCartCardData(item)}
                    actions={{
                      onQuantityChange: (qty) =>
                        handleQuantityChange(item.cartItemId, qty),
                      onDelete: () => handleRemoveItem(item.cartItemId),
                      onEdit: () => setEditingCartItem(item),
                      onView: () => router.push(`/product/${item.product._id}`),
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ========================= Checkout summary ========================== */}
          <div className="lg:sticky lg:top-space-7 lg:self-start">
            <div className="space-y-space-6 rounded-2xl border-2 border-secondary/10 bg-background p-space-6">
              <div>
                <div className="flex items-center gap-space-3">
                  <i className="fi fi-rr-receipt text-[22px] text-secondary" />
                  <h2 className="font-medium text-size-h5 text-placeholder_3">
                    Payment Summary
                  </h2>
                </div>
                {items.length > 0 && (
                  <p className="mt-1 pl-[34px] text-sm text-placeholder_3">
                    {items.length} {items.length === 1 ? "item" : "items"} in
                    your order
                  </p>
                )}
              </div>

              {awaitingCardOtp && (
                <div className="flex items-center gap-space-2 rounded-lg bg-amber-400/10 px-space-4 py-space-3 text-xs font-medium text-amber-400">
                  <i className="fi fi-rr-lock" />
                  Payment method and address are locked while you confirm your
                  OTP.
                </div>
              )}

              {/* Payment method */}
              <div
                className={`transition-opacity ${awaitingCardOtp ? "pointer-events-none opacity-50" : ""}`}
              >
                <h5 className="mb-space-4 flex items-center gap-space-2 font-semibold text-size-h6">
                  <i className="fi fi-rr-credit-card text-secondary" />
                  Payment Method
                </h5>

                <div className="grid grid-cols-2 gap-space-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Cash on Delivery")}
                    aria-pressed={paymentMethod === "Cash on Delivery"}
                    disabled={awaitingCardOtp}
                    className={`flex flex-col items-center justify-center gap-space-2 rounded-xl border-2 px-space-3 py-space-4 text-center font-semibold text-size-h6 transition-colors ${
                      paymentMethod === "Cash on Delivery"
                        ? "border-secondary bg-secondary/5 text-secondary"
                        : "border-white/10 text-placeholder_2 hover:border-white/20"
                    }`}
                  >
                    <i className="fi fi-rr-money-bill-wave text-[22px]" />
                    Cash on Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Credit Card")}
                    aria-pressed={paymentMethod === "Credit Card"}
                    disabled={awaitingCardOtp}
                    className={`flex flex-col items-center justify-center gap-space-2 rounded-xl border-2 px-space-3 py-space-4 text-center font-semibold text-size-h6 transition-colors ${
                      paymentMethod === "Credit Card"
                        ? "border-secondary bg-secondary/5 text-secondary"
                        : "border-white/10 text-placeholder_2 hover:border-white/20"
                    }`}
                  >
                    <i className="fi fi-rr-credit-card text-[22px]" />
                    Credit Card
                  </button>
                </div>

                {paymentMethod === "Credit Card" && (
                  <div className="mt-space-5 space-y-space-3">
                    {cards.map((card) => (
                      <SavedCard
                        key={card._id}
                        card={card}
                        selected={selectedCardId === card._id}
                        onSelect={() => setSelectedCardId(card._id)}
                        onDelete={() => handleDeleteCard(card._id)}
                        onEdit={() => openEditCard(card)}
                      />
                    ))}

                    <button
                      type="button"
                      onClick={openAddCard}
                      disabled={awaitingCardOtp}
                      className="flex w-full items-center justify-center gap-space-2 rounded-lg border-2 border-dashed border-secondary bg-secondary/5 px-space-4 py-space-3 font-primary text-size-h6 font-medium text-secondary hover:bg-secondary/15"
                    >
                      <i className="fi fi-br-plus text-size-large" />
                      Add Card
                    </button>
                  </div>
                )}
              </div>

              <div className="h-px bg-linear-to-r from-placeholder_2/0 via-placeholder_2 to-placeholder_2/0 opacity-60" />

              {/* Address */}
              <div
                className={`transition-opacity ${awaitingCardOtp ? "pointer-events-none opacity-50" : ""}`}
              >
                <h5 className="mb-space-4 flex items-center gap-space-2 font-semibold text-size-h6">
                  <i className="fi fi-rr-marker text-secondary" />
                  Delivery Address
                </h5>
                <div className="mb-space-4 space-y-space-3">
                  {addresses.map((address) => (
                    <SavedAddress
                      key={address._id}
                      address={address}
                      selected={selectedAddressId === address._id}
                      onSelect={() => setSelectedAddressId(address._id)}
                      onDelete={() => handleDeleteAddress(address._id)}
                      onEdit={() => openEditAddress(address)}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={openAddAddress}
                  disabled={awaitingCardOtp}
                  className="flex w-full items-center justify-center gap-space-2 rounded-lg border-2 border-dashed border-secondary bg-secondary/5 px-space-4 py-space-3 font-primary text-size-h6 font-medium text-secondary hover:bg-secondary/15"
                >
                  <i className="fi fi-br-plus text-size-large" />
                  Add Address
                </button>
              </div>

              <div className="h-px bg-linear-to-r from-placeholder_2/0 via-placeholder_2 to-placeholder_2/0 opacity-60" />

              {/* Price */}
              <div className="space-y-space-4">
                <div className="flex items-center justify-between text-[#CBD5F5]">
                  <p className="text-sm font-medium">Subtotal</p>
                  <p className="font-primary text-sm font-semibold">
                    {money(pricing.subtotal)}
                  </p>
                </div>
                <div className="flex items-center justify-between text-[#CBD5F5]">
                  <p className="text-sm font-medium">Discount</p>
                  <p className="font-primary text-sm font-semibold">
                    -{money(pricing.discount)}
                  </p>
                </div>
                <div className="flex items-center justify-between text-[#CBD5F5]">
                  <p className="text-sm font-medium">Shipping Charge</p>
                  <p className="font-primary text-sm font-semibold">
                    {money(pricing.shippingCharge)}
                  </p>
                </div>
                <div className="flex items-center justify-between text-[#CBD5F5]">
                  <p className="text-sm font-medium">VAT</p>
                  <p className="font-primary text-sm font-semibold">
                    {money(pricing.vat)}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t-2 border-placeholder_3/30 pt-space-4">
                  <p className="text-size-h5 font-medium text-[#CBD5F5]">
                    Total
                  </p>
                  <p className="font-primary text-size-h5 font-semibold text-secondary">
                    {money(pricing.total)}
                  </p>
                </div>
              </div>

              {/* Buy button / OTP step */}
              <div className="space-y-space-6">
                {awaitingCardOtp ? (
                  <div className="space-y-space-3 rounded-xl border border-secondary/20 bg-secondary/5 p-space-4">
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                      <i className="fi fi-rr-shield-check text-secondary" />
                      Confirm your payment
                    </p>
                    <p className="text-sm text-placeholder_2">
                      Enter the OTP sent to your phone to confirm payment.
                    </p>
                    <input
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      placeholder="••••••"
                      inputMode="numeric"
                      maxLength={6}
                      className="w-full rounded-xl border border-secondary/20 bg-background px-4 py-3 text-center text-size-large font-semibold tracking-[0.5em] text-foreground outline-none transition-colors focus:border-secondary/80"
                    />
                    <Button
                      className="w-full"
                      onClick={handleVerifyOtp}
                      disabled={verifyingOtp || otp.length < 6}
                    >
                      {verifyingOtp ? "Verifying..." : "Verify & Confirm Order"}
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    onClick={handlePlaceOrder}
                    disabled={placingOrder || items.length === 0}
                  >
                    {placingOrder ? "Placing Order..." : "Buy Now"}
                  </Button>
                )}

                <div className="grid grid-cols-2 gap-space-4">
                  <div className="flex flex-col items-center gap-2.5 text-center">
                    <div className="flex size-12.5 items-center justify-center rounded-full bg-secondary/10">
                      <i className="fi fi-rr-shield-check text-[22px] text-secondary" />
                    </div>
                    <div>
                      <h5 className="mb-0.5 font-semibold text-size-h6">
                        Secure Payment
                      </h5>
                      <p className="text-xs text-placeholder_3">
                        256-bit encrypted checkout
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2.5 text-center">
                    <div className="flex size-12.5 items-center justify-center rounded-full bg-secondary/10">
                      <i className="fi fi-rr-headset text-[22px] text-secondary" />
                    </div>
                    <div>
                      <h5 className="mb-0.5 font-semibold text-size-h6">
                        Reliable Support
                      </h5>
                      <p className="text-xs text-placeholder_3">
                        Here if anything goes wrong
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCardModal && (
        <AddCardModal
          editingCard={editingCard}
          onClose={() => setShowCardModal(false)}
        />
      )}
      {showAddressModal && (
        <AddressModal
          editingAddress={editingAddress}
          onClose={() => setShowAddressModal(false)}
        />
      )}
      {editingCartItem && (
        <EditCartItemModal
          item={editingCartItem}
          onClose={() => setEditingCartItem(null)}
        />
      )}
    </div>
  );
};

export default Page;
