"use client";

import Button from "@/app/components/Button";
import OrdersTable from "@/app/components/dashboard/orders/OrderTable";
import Select from "@/app/components/dashboard/Select";
import TableToolbar from "@/app/components/dashboard/TableToolbar";
import SearchBar from "@/app/components/SearchBar";
import SavedCard from "@/app/components/cart/SavedCard";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useDeleteCustomerAdminMutation } from "@/redux";

import { useGetCustomerDetailsAdminQuery } from "@/redux";

import Image from "next/image";
import Link from "next/link";
import ConfirmModal from "@/app/components/ConfiremationModal";

const Page = () => {
  const { id } = useParams();

  const { data, isLoading, isFetching, isError, error } =
    useGetCustomerDetailsAdminQuery(id, {
      skip: !id,
    });

  const router = useRouter();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [deleteCustomer, { isLoading: isDeleting }] =
    useDeleteCustomerAdminMutation();

  /*
   * ApiResponse এর response যদি এমন হয়:
   *
   * {
   *   success: true,
   *   data: {
   *     customer: {...},
   *     overview: {...},
   *     addresses: [...],
   *     cards: [...],
   *     orders: [...]
   *   }
   * }
   *
   * তাহলে data?.data হবে মূল payload.
   */

  const customerData = data?.data;

  const customer = customerData?.customer;
  const overview = customerData?.overview;
  const addresses = customerData?.addresses || [];
  const cards = customerData?.cards || [];
  const orders = customerData?.orders || [];

  const handleDeleteCustomer = async () => {
    try {
      await deleteCustomer(id).unwrap();

      setShowDeleteModal(false);

      router.push("/dashboard/customers");
    } catch (error) {
      console.error("Failed to delete customer:", error);
    }
  };

  if (isLoading || isFetching) {
    return (
      <div className="px-space-6 pb-space-6 mt-space-3">
        <div className="min-h-125 rounded-2xl bg-[#1A1E3D]/50 flex items-center justify-center">
          <div className="flex items-center gap-space-3 text-secondary">
            <span className="size-6 rounded-full border-2 border-secondary/20 border-t-secondary animate-spin" />

            <span>Loading customer...</span>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !customer) {
    return (
      <div className="px-space-6 pb-space-6 mt-space-3">
        <div className="min-h-125 rounded-2xl bg-[#1A1E3D]/50 flex flex-col items-center justify-center text-center">
          <i className="fi fi-rr-user-slash text-4xl text-placeholder_3" />

          <h2 className="mt-space-4 text-xl font-semibold">
            Customer Not Found
          </h2>

          <p className="mt-space-2 text-placeholder_3">
            {error?.data?.message || "We couldn't find this customer."}
          </p>

          <Link href="/dashboard/customers" className="mt-space-5">
            <Button
              variant="text"
              showLeftIcon
              leftIcon="fi fi-rr-arrow-small-left"
            >
              Back to Customers
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const {
    _id,
    name,
    email,
    phone,
    dateOfBirth,
    gender,
    image,
    createdAt,
    isActive,
    isEmailVerified,
    isTwoFactorEnabled,
    isNotificationEnabled,
    notificationChannel,
  } = customer;

  const formattedDateOfBirth = dateOfBirth
    ? new Date(dateOfBirth).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  const formattedJoinDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div className="px-space-6 pb-space-6 mt-space-3">
      <div className="p-space-6 space-y-space-8 rounded-2xl bg-[#1A1E3D]/50">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard/customers">
            <Button
              variant="text"
              showLeftIcon
              leftIcon="fi fi-rr-arrow-small-left"
            >
              Back
            </Button>
          </Link>

          <Button
            variant="secondary"
            color="#d10000"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete Customer
          </Button>
        </div>

        <div className="space-y-space-9 px-space-4">
          {/* Customer Profile */}
          <div className="flex items-center justify-between">
            <div className="flex gap-space-3">
              <div className="relative max-h-max">
                {isActive && (
                  <span className="size-4 absolute bottom-0 right-0 bg-green rounded-full border border-background" />
                )}
                <Image
                  alt={name || "Customer"}
                  src={image?.url || "/placeholder-avatar.png"}
                  width={52}
                  height={52}
                  className="w-13 h-13 object-cover rounded-full mt-space-2"
                />
              </div>

              <div>
                <h1 className="font-semibold text-[24px] mb-space-1">
                  {name || "—"}
                </h1>

                <h2 className="font-medium text-size-medium text-placeholder_3 mb-space-2">
                  {String(_id)}
                </h2>

                <p className="font-medium text-size-large text-placeholder_2">
                  Customer since: {formattedJoinDate}
                </p>
              </div>
            </div>

            {/* Overview */}
            <div className="flex items-center gap-space-4">
              <OverviewCard
                label="Total Orders"
                value={overview?.totalOrdersCount ?? 0}
              />

              <OverviewCard
                label="Total Spending"
                value={`$${overview?.totalSpending ?? 0}`}
              />

              <OverviewCard
                label="Pending Orders"
                value={overview?.pendingOrdersCount ?? 0}
              />
            </div>
          </div>

          {/* Personal + Address */}
          <div className="flex gap-space-8 *:flex-1">
            {/* Personal Information */}
            <div>
              <h2 className="font-medium text-size-h6 text-placeholder_3 mb-space-4">
                Personal Information
              </h2>

              <div className="space-y-space-3 p-space-3 bg-[#1A1E3D]/50 rounded-xl">
                <InfoRow label="Email" value={email} />
                <InfoRow label="Phone Number" value={phone} />
                <InfoRow label="Date of Birth" value={formattedDateOfBirth} />
                <InfoRow label="Gender" value={gender} />
                <InfoRow
                  label="Two-Factor Authentication"
                  value={isTwoFactorEnabled ? "Enabled" : "Disabled"}
                />
                <InfoRow
                  label="Notifications"
                  value={
                    isNotificationEnabled
                      ? notificationChannel
                        ? notificationChannel.charAt(0).toUpperCase() +
                          notificationChannel.slice(1).toLowerCase()
                        : "Enabled"
                      : "Disabled"
                  }
                />{" "}
              </div>
            </div>

            {/* Right Side */}
            <div>
              {/* Shipping Address */}
              <div>
                <h2 className="font-medium text-size-h6 text-placeholder_3 mb-space-4">
                  Shipping Address
                </h2>

                <div className="p-space-3 bg-[#1A1E3D]/50 rounded-xl">
                  {addresses.length > 0 ? (
                    <div className="space-y-space-3">
                      {addresses.map((address) => (
                        <AddressCard key={address._id} address={address} />
                      ))}
                    </div>
                  ) : (
                    <div className="py-space-6 text-center text-placeholder_3">
                      <i className="fi fi-rr-map-marker-cross text-2xl" />

                      <p className="mt-space-2">No shipping address added</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Information */}
              <div className="space-y-space-8 mt-space-8">
                <h2 className="font-medium text-size-h6 text-placeholder_3 mb-space-4">
                  Card Information
                </h2>

                <div className="p-space-3 bg-[#1A1E3D]/50 rounded-xl">
                  {cards.length > 0 ? (
                    <div className="space-y-space-3">
                      {cards.map((card) => (
                        <SavedCard key={card._id} card={card} isAdmin={true} />
                      ))}
                    </div>
                  ) : (
                    <div className="py-space-6 text-center text-placeholder_3">
                      <i className="fi fi-rr-credit-card text-2xl" />

                      <p className="mt-space-2">No saved card</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order History */}
        <TableToolbar title="Order History">
          <Select />
          <SearchBar />
        </TableToolbar>

        <OrdersTable orders={orders} />
      </div>
      {showDeleteModal && (
        <ConfirmModal
          title="Delete Customer?"
          message="Are you sure you want to delete this customer? This action cannot be undone."
          confirmText="Delete Customer"
          cancelText="Cancel"
          danger
          isLoading={isDeleting}
          onConfirm={handleDeleteCustomer}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

/* -------------------------------- */
/* Reusable Components */
/* -------------------------------- */

const InfoRow = ({ label, value }) => {
  return (
    <div className="p-space-3 rounded-lg odd:bg-secondary/5 even:bg-primary/5 flex items-center justify-between gap-space-4">
      <h4 className="font-medium text-size-h6">{label}</h4>

      <p className="font-medium text-size-h6 text-right">{value || "—"}</p>
    </div>
  );
};

const AddressCard = ({ address }) => {
  const values = [
    address.floorNumber && `Floor ${address.floorNumber}`,
    address.houseNumber && `House ${address.houseNumber}`,
    address.roadNumber && `Road ${address.roadNumber}`,
    address.locality,
    address.area,
    address.city,
    address.zipCode,
    address.country,
  ].filter(Boolean);

  return (
    <div className="p-space-4 rounded-lg bg-secondary/5">
      <p className="font-medium leading-7">
        {values.length > 0
          ? values.join(", ")
          : "Address information unavailable"}
      </p>
    </div>
  );
};

const OverviewCard = ({ label, value }) => {
  return (
    <div className="min-w-37.5 px-space-4 py-space-3 rounded-xl bg-secondary/5">
      <p className="text-size-medium text-placeholder_3">{label}</p>

      <p className="mt-space-1 text-xl font-semibold">{value}</p>
    </div>
  );
};

export default Page;
