"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import SavedAddress from "@/app/components/cart/SavedAddress";
import SavedCard from "@/app/components/cart/SavedCard";
import AddCardModal from "@/app/components/AddCardModal";
import AddressModal from "@/app/components/AddressModal";
import StatusDot from "@/app/components/settings/StatusDot";
import {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useGetMyOrderStatsQuery,
  useDeleteAddressMutation,
  useDeleteCardMutation,
  useGetMyAddressesQuery,
  useGetMyCardsQuery,
} from "@/redux";
import toast from "react-hot-toast";
import OverallDataCard from "@/app/components/dashboard/home/OverallDataCard";

const money = (n) => `$ ${Number(n || 0).toFixed(2)}`;

const formatDob = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

const Page = () => {
  // ---------- Profile ----------
  const { data: profileData } = useGetMyProfileQuery();
  const profile = profileData?.data;
  const [updateProfile, { isLoading: uploadingImage }] =
    useUpdateMyProfileMutation();
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await updateProfile({ image: file }).unwrap();
      toast.success("Profile photo updated");
    } catch (err) {
      toast.error(err?.data?.message || "Could not update photo.");
    }
  };

  // ---------- Overview stats ----------
  const { data: statsData } = useGetMyOrderStatsQuery();
  const stats = statsData?.data || {
    pendingOrdersCount: 0,
    totalSpending: 0,
    totalOrdersCount: 0,
  };

  // ---------- Notification channel ----------
  const [updateNotification] = useUpdateMyProfileMutation();
  const handleSetNotificationChannel = async (channel) => {
    try {
      await updateNotification({ notificationChannel: channel }).unwrap();
    } catch (err) {
      toast.error(
        err?.data?.message || "Could not update notification preference.",
      );
    }
  };

  // ---------- Saved cards ----------
  const { data: cardsData } = useGetMyCardsQuery();
  const cards = cardsData?.data || [];
  const [deleteCard] = useDeleteCardMutation();
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null); // null = adding new

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

  if (!profile) return <p className="text-slate-500">Loading profile...</p>;

  const personalInformations = [
    { label: "Email Address", value: profile.email },
    { label: "Phone Number", value: profile.phone || "—" },
    { label: "Date of Birth", value: formatDob(profile.dateOfBirth) },
    { label: "Gender", value: profile.gender || "—" },
  ];

  const overallReport = [
    {
      title: "Pending Orders",
      icon: "fi fi-rr-order-history",
      value: stats.pendingOrdersCount,
    },
    {
      title: "Total Spend",
      icon: "fi fi-rr-coins",
      value: money(stats.totalSpending),
    },
    {
      title: "Total Orders",
      icon: "fi fi-rr-boxes",
      value: stats.totalOrdersCount,
    },
  ];

  return (
    <div className="space-y-space-9">
      {/* name */}
      <div className="flex items-center justify-between gap-space-7">
        <div className="flex items-center gap-space-3">
          {/* avatar + hover-to-edit */}
          <div
            className="relative group cursor-pointer"
            onClick={handleAvatarClick}
          >
            <Image
              alt="customer"
              src={profile.image?.url || "/placeholder-avatar.png"}
              height={62}
              width={62}
              className="size-15.5 rounded-full object-cover"
            />
            <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <i className="fi fi-rr-camera text-white text-sm"></i>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              hidden
              onChange={handleAvatarChange}
              disabled={uploadingImage}
            />
          </div>
          <div className="space-y-[6px]">
            <h1 className="font-semibold text-[24px]">{profile.name}</h1>
            <p className="font-medium text-placeholder_3 text-size-large">
              Customer since:{" "}
              {new Date(profile.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              .
            </p>
          </div>
        </div>

        {/* overall report */}
        <div className="flex items-center gap-space-6">
          {overallReport.map((item, i) => (
            <OverallDataCard
              key={i}
              title={item.title}
              icon={item.icon}
              value={item.value}
            />
          ))}
        </div>
      </div>

      {/* Informations */}
      <div className="flex gap-space-6 *:flex-1">
        {/* personal information and notification methods */}
        <div>
          {/* personal information */}
          <div className="">
            <div className="flex items-center gap-space-3 mb-space-4">
              <StatusDot />
              <h2 className="font-primary font-semibold text-size-h6 text-placeholder_3 uppercase">
                Personal Informations
              </h2>
            </div>
            <div className="space-y-space-3 p-space-3 bg-[#1A1E3D]/50">
              {personalInformations.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center p-space-3 justify-between rounded-lg odd:bg-secondary/5 even:bg-primary/5 font-medium text-size-h6"
                >
                  <h4>{item.label}</h4>
                  <h4>{item.value}</h4>
                </div>
              ))}
            </div>
          </div>

          {/* notification method */}
          <div className="mt-space-7">
            <div className="flex items-center gap-space-3 mb-space-4">
              <StatusDot />
              <h2 className="font-primary font-semibold text-size-h6 text-placeholder_3 uppercase">
                Notification Method
              </h2>
            </div>
            <div className="flex items-center gap-space-1 bg-[#0C1221] border border-secondary/10 rounded-lg p-space-2 *:flex-1">
              <button
                type="button"
                aria-pressed={profile.notificationChannel === "email"}
                onClick={() => handleSetNotificationChannel("email")}
                className={`flex items-center justify-center px-space-4 py-space-2 rounded-sm text-size-large font-medium transition-colors ${
                  profile.notificationChannel === "email"
                    ? "bg-secondary text-foreground"
                    : "text-secondary"
                }`}
              >
                Email
              </button>
              <button
                type="button"
                aria-pressed={profile.notificationChannel === "number"}
                onClick={() => handleSetNotificationChannel("number")}
                className={`flex items-center justify-center px-space-4 py-space-2 rounded-sm text-size-large font-medium transition-colors ${
                  profile.notificationChannel === "number"
                    ? "bg-secondary text-foreground"
                    : "text-secondary"
                }`}
              >
                Number
              </button>
            </div>
          </div>
        </div>

        {/* delivery address and credit card */}
        <div>
          {/* credit card */}
          <div>
            <div className="flex items-center gap-space-3 mb-space-4">
              <StatusDot />
              <h2 className="font-primary font-semibold text-size-h6 text-placeholder_3 uppercase">
                Credit cards
              </h2>
            </div>
            <div className="rounded-xl p-space-3 bg-[#1A1E3D]/50">
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
          </div>

          {/* Address */}
          <div className="p-space-2 mt-space-7">
            <div className="flex items-center gap-space-3 mb-space-4">
              <StatusDot />
              <h2 className="font-primary font-semibold text-size-h6 text-placeholder_3 uppercase">
                Delivery Address
              </h2>
            </div>
            <div className="rounded-xl p-space-3 bg-[#1A1E3D]/50">
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
    </div>
  );
};

export default Page;
