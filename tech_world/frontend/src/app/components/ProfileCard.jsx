"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";

import SavedCard from "./cart/SavedCard";
import SavedAddress from "./cart/SavedAddress";
import AddCardModal from "./AddCardModal";
import AddressModal from "./AddressModal";

import {
  useGetMyProfileQuery,
  useLogoutMutation,
  useGetMyCardsQuery,
  useDeleteCardMutation,
  useGetMyAddressesQuery,
  useDeleteAddressMutation,
} from "@/redux";

/**
 * Self-contained — fetches the logged-in customer's own data, no props
 * needed for that. Pass `onClose` so the parent dropdown can close itself
 * when Logout/Settings is clicked.
 */
const ProfileCard = ({ onClose = () => {} }) => {
  const router = useRouter();

  const { data: profileData } = useGetMyProfileQuery();
  const profile = profileData?.data;

  const [logout] = useLogoutMutation();

  // ---------- Saved cards ----------
  const { data: cardsData, isLoading: cardsLoading } = useGetMyCardsQuery();
  const cards = cardsData?.data || [];
  const [deleteCard] = useDeleteCardMutation();
  const [showCardModal, setShowCardModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null); // null = adding new

  const handleDeleteCard = async (cardId) => {
    try {
      await deleteCard(cardId).unwrap();
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
  const { data: addressesData, isLoading: addressesLoading } = useGetMyAddressesQuery();
  const addresses = addressesData?.data || [];
  const [deleteAddress] = useDeleteAddressMutation();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null); // null = adding new

  const handleDeleteAddress = async (addressId) => {
    try {
      await deleteAddress(addressId).unwrap();
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

  const handleLogout = async () => {
    await logout();
    onClose();
    router.push("/login");
  };

  const handleGoToSettings = () => {
    onClose();
    router.push("/settings/profile");
  };

  if (!profile) return null;

  return (
    <div className="space-y-space-8 p-space-7 rounded-3xl bg-background border border-secondary/30 w-103">
      {/* image, name, and buttons */}
      <div className="relative flex flex-col items-center">
        <div className="absolute top-0 right-0 flex items-center justify-center gap-space-3 *:w-9.5 *:h-9.5 *:flex *:items-center *:justify-center *:rounded-lg">
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Log out"
            className="bg-red/5 border border-red/10 text-red hover:bg-red/10 transition-colors"
          >
            <i className="fi fi-rr-user-logout"></i>
          </button>
          <button
            type="button"
            onClick={handleGoToSettings}
            aria-label="Settings"
            className="bg-green/5 border border-green/10 text-green hover:bg-green/10 transition-colors"
          >
            <i className="fi fi-rr-settings"></i>
          </button>
        </div>
        <Image
          alt="profile"
          src={profile.image?.url || "/placeholder-avatar.png"}
          width={80}
          height={80}
          className="w-[80px] h-[80px] rounded-full mb-space-4 object-cover"
        />
        <h2 className="font-primary font-medium text-size-h5 mb-space-1">{profile.name}</h2>
      </div>

      {/* contact info */}
      <div className="space-y-space-2">
        <div className="flex items-center gap-space-2 text-size-h6">
          <div className="size-9.5 rounded-full bg-secondary/10 text-secondary text-size-h5 flex items-center justify-center">
            <i className="fi fi-sr-envelope"></i>
          </div>
          {profile.email}
        </div>
        <div className="flex items-center gap-space-2 text-size-h6">
          <div className="size-9.5 rounded-full bg-secondary/10 text-secondary text-size-h5 flex items-center justify-center">
            <i className="fi fi-sr-phone-flip"></i>
          </div>
          {profile.phone || "Not set"}
        </div>
      </div>

      {/* Credit Card */}
      <div>
        <h5 className="mb-space-5 font-semibold text-size-h6">Saved Cards</h5>
        <div className="space-y-space-3 mb-space-5">
          {cardsLoading ? (
            <p className="text-sm text-placeholder_2">Loading cards...</p>
          ) : (
            cards.map((card) => (
              <SavedCard
                key={card._id}
                card={card}
                selected={false}
                onSelect={() => {}}
                onDelete={() => handleDeleteCard(card._id)}
                onEdit={() => openEditCard(card)}
              />
            ))
          )}
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

      {/* Address */}
      <div className="p-space-2">
        <h5 className="mb-space-5 font-semibold text-size-h6">Address</h5>
        <div className="space-y-space-3 mb-space-5">
          {addressesLoading ? (
            <p className="text-sm text-placeholder_2">Loading addresses...</p>
          ) : (
            addresses.map((address) => (
              <SavedAddress
                key={address._id}
                address={address}
                selected={false}
                onSelect={() => {}}
                onDelete={() => handleDeleteAddress(address._id)}
                onEdit={() => openEditAddress(address)}
              />
            ))
          )}
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

      {/* Modals */}
      {showCardModal && <AddCardModal editingCard={editingCard} onClose={() => setShowCardModal(false)} />}
      {showAddressModal && (
        <AddressModal editingAddress={editingAddress} onClose={() => setShowAddressModal(false)} />
      )}
    </div>
  );
};

export default ProfileCard;
