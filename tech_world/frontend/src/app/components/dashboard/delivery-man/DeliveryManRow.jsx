/* eslint-disable react-hooks/set-state-in-effect */
// components/dashboard/delivery-man/DeliveryManRow.jsx
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";

import Tag from "../../Tag";
import DeliveryManStatusToggle from "./DeliveryManStatusToggle";
import DeliveryManFormModal from "./DeliveryManFormModal";
import DeliveryManDetailsModal from "./DeliveryManDetailsModal";
import ConfirmModal from "../../ConfiremationModal";

import {
  useGetDeliveryManDetailsQuery,
  useUpdateDeliveryManStatusMutation,
  useDeleteDeliveryManMutation,
} from "@/redux";
import DeliveryManStatusChangeToggle from "./DeliveryManStatusChangeToggle";

// --------------------------------------------------
// Helpers
// --------------------------------------------------

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// --------------------------------------------------
// Component
// --------------------------------------------------

const DeliveryManRow = ({ deliveryManId }) => {
  // ------------------------------------------------
  // Modal states
  // ------------------------------------------------

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // ------------------------------------------------
  // Local status state
  // ------------------------------------------------

  const [status, setStatus] = useState("");

  // ------------------------------------------------
  // Fetch single/full delivery man details
  //
  // API only runs when deliveryManId exists.
  // ------------------------------------------------

  const {
    data: deliveryManResponse,
    isLoading: isRowLoading,
    isError: isRowError,
  } = useGetDeliveryManDetailsQuery(deliveryManId, {
    skip: !deliveryManId,
  });

  // ------------------------------------------------
  // Normalize API response
  //
  // Depending on your backend response:
  //
  // data.data
  // OR
  // data.data.deliveryMan
  //
  // this supports both.
  // ------------------------------------------------

  const deliveryMan =
    deliveryManResponse?.data?.deliveryMan ?? deliveryManResponse?.data ?? null;

  // ------------------------------------------------
  // Mutations
  // ------------------------------------------------

  const [updateStatus] = useUpdateDeliveryManStatusMutation();
  const [deleteDeliveryMan, { isLoading: deleting }] =
    useDeleteDeliveryManMutation();

  // ------------------------------------------------
  // When API delivery man arrives, update local status
  // ------------------------------------------------

  useEffect(() => {
    if (deliveryMan?.status) {
      setStatus(deliveryMan.status);
    }
  }, [deliveryMan?.status]);

  // ------------------------------------------------
  // Status change
  // ------------------------------------------------

  const handleStatusChange = async (newStatus) => {
    if (!deliveryMan?._id) return;

    const previousStatus = status;

    // Optimistic UI
    setStatus(newStatus);

    try {
      await updateStatus({
        id: deliveryMan._id,
        status: newStatus,
      }).unwrap();
    } catch (err) {
      // Revert if API fails
      setStatus(previousStatus);

      toast.error(err?.data?.message || "Could not update status.");
    }
  };

  // ------------------------------------------------
  // Delete delivery man
  // ------------------------------------------------

  const handleConfirmDelete = async () => {
    if (!deliveryMan?._id) return;

    try {
      await deleteDeliveryMan(deliveryMan._id).unwrap();

      toast.success("Delivery man deleted");

      setShowDeleteConfirm(false);
    } catch (err) {
      toast.error(err?.data?.message || "Could not delete this delivery man.");

      setShowDeleteConfirm(false);
    }
  };

  // ------------------------------------------------
  // Loading
  // ------------------------------------------------

  if (isRowLoading || !deliveryMan) {
    return (
      <tr className="border-b border-secondary/5">
        <td colSpan={7} className="p-space-4 text-center text-placeholder_3">
          Loading delivery man...
        </td>
      </tr>
    );
  }

  // ------------------------------------------------
  // Error
  // ------------------------------------------------

  if (isRowError) {
    return (
      <tr className="border-b border-secondary/5">
        <td colSpan={7} className="p-space-4 text-center text-red-400">
          Failed to load delivery man.
        </td>
      </tr>
    );
  }

  // ------------------------------------------------
  // Render
  // ------------------------------------------------

  return (
    <>
      <tr
        className="
          border-b border-secondary/5
          last:border-0
          odd:bg-primary/5
          even:bg-secondary/5
          transition-colors
          hover:odd:bg-primary/10
          hover:even:bg-secondary/10
          *:first:rounded-l-xl
          *:last:rounded-r-xl
          overflow-hidden
          text-size-h6
          *:p-space-3
        "
      >
        {/* ------------------------------------------
            Name
        ------------------------------------------ */}

        <td>
          <div className="flex items-center gap-space-3">
            {deliveryMan.image?.url && (
              <Image
                alt={deliveryMan.name ?? "Delivery Man"}
                src={deliveryMan.image.url}
                height={42}
                width={42}
                className="rounded-full size-10.5 object-cover"
              />
            )}

            <div className="space-y-0.5">
              <p className="font-medium text-size-large">
                {deliveryMan.name ?? "—"}
              </p>

              <h6 className="font-medium text-size-h6 text-placeholder_3">
                {deliveryMan.contact ?? "—"}
              </h6>
            </div>
          </div>
        </td>

        {/* ------------------------------------------
            Email
        ------------------------------------------ */}

        <td>{deliveryMan.email ?? "—"}</td>

        {/* ------------------------------------------
            Vehicle
        ------------------------------------------ */}

        <td>
          {deliveryMan.vehicleType
            ? `${deliveryMan.vehicleType}${
                deliveryMan.vehicleNumber
                  ? ` — ${deliveryMan.vehicleNumber}`
                  : ""
              }`
            : "—"}
        </td>

        {/* ------------------------------------------
            Status
        ------------------------------------------ */}

        <td>
          <DeliveryManStatusChangeToggle
            disabled={isRowLoading}
            status={status || deliveryMan.status}
            onChange={handleStatusChange}
          />
        </td>

        {/* ------------------------------------------
            Total Deliveries
        ------------------------------------------ */}

        <td>
          <Tag property="filter" text={deliveryMan.ordersInHand ?? 0} />
        </td>

        {/* ------------------------------------------
            Joined On
        ------------------------------------------ */}

        <td>{formatDate(deliveryMan.createdAt)}</td>

        {/* ------------------------------------------
            Actions
        ------------------------------------------ */}

        <td>
          <div className="flex items-center justify-end gap-space-2">
            {/* Delete */}

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              aria-label="Delete delivery man"
              className="
                p-space-2
                rounded-md
                bg-red-500/10
                text-red-500
              "
            >
              <i className="fi fi-rr-trash" />
            </button>

            {/* Edit */}

            <button
              type="button"
              onClick={() => setShowEditModal(true)}
              aria-label="Edit delivery man"
              className="
                p-space-2
                rounded-md
                bg-green-500/10
                text-green-500
              "
            >
              <i className="fi fi-rr-edit" />
            </button>

            {/* Details */}

            <button
              type="button"
              onClick={() => setShowDetailsModal(true)}
              aria-label="View delivery man details"
              className="
                p-space-2
                rounded-md
                bg-secondary/10
                text-secondary
              "
            >
              <i className="fi fi-rr-arrow-small-right" />
            </button>
          </div>
        </td>
      </tr>

      {/* =================================================
          EDIT MODAL
      ================================================= */}

      {showEditModal &&
        typeof document !== "undefined" &&
        createPortal(
          <DeliveryManFormModal
            deliveryMan={{
              ...deliveryMan,
              status: status || deliveryMan.status,
            }}
            onClose={() => setShowEditModal(false)}
            onSaved={() => {}}
          />,
          document.body,
        )}

      {/* =================================================
          DETAILS MODAL
      ================================================= */}

      {showDetailsModal &&
        typeof document !== "undefined" &&
        createPortal(
          <DeliveryManDetailsModal
            deliveryMan={{
              ...deliveryMan,
              status: status || deliveryMan.status,
            }}
            onClose={() => setShowDetailsModal(false)}
            onEdit={() => {
              setShowDetailsModal(false);
              setShowEditModal(true);
            }}
          />,
          document.body,
        )}

      {/* =================================================
          DELETE CONFIRMATION
      ================================================= */}

      {showDeleteConfirm &&
        typeof document !== "undefined" &&
        createPortal(
          <ConfirmModal
            title="Delete this delivery man?"
            message={`This will permanently delete ${
              deliveryMan.name ?? "this delivery man"
            }. This can't be undone.`}
            confirmText="Delete"
            isLoading={deleting}
            onConfirm={handleConfirmDelete}
            onClose={() => setShowDeleteConfirm(false)}
          />,
          document.body,
        )}
    </>
  );
};

export default DeliveryManRow;
