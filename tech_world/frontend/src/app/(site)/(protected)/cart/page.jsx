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
        router.push("/my-orders");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Could not place order.");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await verifyPaymentOtp(otp).unwrap();
      toast.success("Payment verified. Order placed!");
      router.push("/my-orders");
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
        <div className="flex gap-space-7">
          {/* products */}
          <div className="space-y-space-6 w-187.5 *:w-full">
            {cartLoading ? (
              <p className="text-slate-500">Loading your cart...</p>
            ) : items.length === 0 ? (
              <div className="text-center py-space-10">
                <p className="text-slate-500 mb-space-4">Your cart is empty.</p>
                <Button onClick={() => router.push("/")}>
                  Continue Shopping
                </Button>
              </div>
            ) : (
              items.map((item) => (
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
              ))
            )}
          </div>

          {/* checkout */}
          <div className="rounded-xl p-space-6 space-y-[20px] border-3 border-secondary/20 max-w-[40%]">
            <h2 className="font-medium text-size-h5 text-placeholder_3">
              Payment Summary
            </h2>

            {/* payment method */}
            <div className="p-space-2">
              <h5 className="mb-space-5 font-semibold text-size-h6">
                Payment Method
              </h5>
              <div className="space-y-space-5">
                <div className="flex items-center gap-space-5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Cash on Delivery")}
                    className={`flex items-center gap-space-2 px-[20px] py-space-4 rounded-lg font-semibold text-size-h6 border-[1.5px] transition-colors ${
                      paymentMethod === "Cash on Delivery"
                        ? "border-secondary text-secondary bg-secondary/5"
                        : "border-white/10 text-placeholder_2"
                    }`}
                  >
                    <i className="fi fi-rr-money-bill-wave text-[24px]"></i>
                    Cash on Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Credit Card")}
                    className={`flex items-center gap-space-2 px-[20px] py-space-4 rounded-lg font-semibold text-size-h6 border-[1.5px] transition-colors ${
                      paymentMethod === "Credit Card"
                        ? "border-secondary text-secondary bg-secondary/5"
                        : "border-white/10 text-placeholder_2"
                    }`}
                  >
                    <i className="fi fi-rr-credit-card text-[24px]"></i>
                    Credit Card
                  </button>
                </div>

                {paymentMethod === "Credit Card" && (
                  <div>
                    {/* cards */}
                    <div className="space-y-space-3 mb-space-5">
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
                    </div>

                    <button
                      type="button"
                      onClick={openAddCard}
                      className="px-space-4 py-space-3 flex items-center justify-center gap-space-2 rounded-lg bg-secondary/5 text-secondary border-[1.5px] border-dashed w-full border-secondary font-primary text-size-h6 font-medium hover:bg-secondary/15"
                    >
                      <i className="fi fi-br-plus text-size-large"></i>
                      Add Card
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="h-px bg-linear-to-r from-placeholder_2/0 via-placeholder_2 to-placeholder_2/0 opacity-60"></div>

            {/* Address */}
            <div className="p-space-2">
              <h5 className="mb-space-5 font-semibold text-size-h6">Address</h5>
              <div className="space-y-space-3 mb-space-5">
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
                className="px-space-4 py-space-3 flex items-center justify-center gap-space-2 rounded-lg bg-secondary/5 text-secondary border-[1.5px] border-dashed w-full border-secondary font-primary text-size-h6 font-medium hover:bg-secondary/15"
              >
                <i className="fi fi-br-plus text-size-large"></i>
                Add Address
              </button>
            </div>

            <div className="h-px bg-linear-to-r from-placeholder_2/0 via-placeholder_2 to-placeholder_2/0 opacity-60"></div>

            {/* price */}
            <div className="space-y-space-5 p-space-2 rounded-[10px]">
              <div className="flex items-center justify-between text-[#CBD5F5]">
                <p className="font-medium text-size-h4">Subtotal</p>
                <h4 className="font-primary font-semibold text-size-h4">
                  {money(pricing.subtotal)}
                </h4>
              </div>
              <div className="flex items-center justify-between text-[#CBD5F5]">
                <p className="font-medium text-size-h4">Discount</p>
                <h4 className="font-primary font-semibold text-size-h4">
                  -{money(pricing.discount)}
                </h4>
              </div>
              <div className="flex items-center justify-between text-[#CBD5F5]">
                <p className="font-medium text-size-h4">Shipping Charge</p>
                <h4 className="font-primary font-semibold text-size-h4">
                  {money(pricing.shippingCharge)}
                </h4>
              </div>
              <div className="flex items-center justify-between text-[#CBD5F5]">
                <p className="font-medium text-size-h4">VAT</p>
                <h4 className="font-primary font-semibold text-size-h4">
                  {money(pricing.vat)}
                </h4>
              </div>
              <div className="flex items-center justify-between py-space-2 border-t-2 border-placeholder_3/30">
                <p className="font-medium text-size-h3 text-[#CBD5F5]">Total</p>
                <h4 className="font-primary font-semibold text-size-h3 text-secondary">
                  {money(pricing.total)}
                </h4>
              </div>
            </div>

            {/* button / OTP step */}
            <div className="space-y-space-7">
              {awaitingCardOtp ? (
                <div className="space-y-space-3">
                  <p className="text-sm text-placeholder_2">
                    Enter the OTP sent to your phone to confirm payment.
                  </p>
                  <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="w-full rounded-lg border border-white/10 bg-[#0d0f16] px-3 py-2 text-sm"
                  />
                  <Button
                    className="w-full"
                    onClick={handleVerifyOtp}
                    disabled={verifyingOtp}
                  >
                    {verifyingOtp ? "Verifying..." : "Verify & Confirm Order"}
                  </Button>
                </div>
              ) : (
                <Button
                  className="w-full"
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                >
                  {placingOrder ? "Placing Order..." : "Buy Now"}
                </Button>
              )}

              <div className="flex gap-space-2 *:flex *:flex-col *:items-center *:gap-2.5 *:flex-1">
                <div>
                  <div className="size-12.5 bg-secondary/10 rounded-full flex items-center justify-center">
                    <i className="fi fi-rr-shield-check text-secondary text-[24px]"></i>
                  </div>
                  <div>
                    <h5 className="font-semibold text-size-h6 mb-0.5">
                      Secure Payment
                    </h5>
                    <p className="text-size-large text-placeholder">
                      for heavy materials
                    </p>
                  </div>
                </div>
                <div>
                  <div className="size-12.5 bg-secondary/10 rounded-full flex items-center justify-center">
                    <i className="fi fi-rr-wrench-alt text-secondary text-[24px]"></i>
                  </div>
                  <div>
                    <h5 className="font-semibold text-size-h6 mb-0.5">
                      Reliable Support
                    </h5>
                    <p className="text-size-large text-placeholder">
                      for heavy materials
                    </p>
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
