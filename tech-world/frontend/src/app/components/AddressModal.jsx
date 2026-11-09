/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import InputField from "./Input";
import Button from "./Button";
import toast from "react-hot-toast";
import { useAddAddressMutation, useUpdateAddressMutation } from "@/redux";
import useLockBodyScroll from "@/app/hooks/useLockBodyScroll";

const emptyForm = {
  apartmentNumber: "",
  buildingNumber: "",
  roadNumber: "",
  locality: "",
  area: "",
  city: "",
  postCode: "",
  country: "",
  isDefault: false,
};

/**
 * Props:
 *   onClose         — closes the modal (Cancel button or successful save)
 *   editingAddress  — pass an existing address object to edit it;
 *                     omit (or pass null) to add a brand-new address
 */
const AddressModal = ({ onClose, editingAddress }) => {
  useLockBodyScroll();
  const isEditMode = !!editingAddress;
  const [form, setForm] = useState(editingAddress || emptyForm);

  const [addAddress, { isLoading: adding }] = useAddAddressMutation();
  const [updateAddress, { isLoading: updating }] = useUpdateAddressMutation();
  const isLoading = adding || updating;

  // Re-sync the form if a different address gets passed in (e.g. user
  // closes this modal and opens it again for a different address)
  useEffect(() => {
    setForm(editingAddress || emptyForm);
  }, [editingAddress]);

  // Close on Escape, matching every other modal in the app.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({
      ...prev,
      [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.city.trim() || !form.country.trim()) {
      toast.error("City and Country are required.");
      return;
    }

    try {
      if (isEditMode) {
        await updateAddress({
          addressId: editingAddress._id,
          ...form,
        }).unwrap();
        toast.success("Address updated");
      } else {
        await addAddress(form).unwrap();
        toast.success("Address added");
      }
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Could not save address");
    }
  };

  const fields = [
    ["apartmentNumber", "Apartment", "e.g. 5"],
    ["buildingNumber", "Building", "e.g. 12"],
    ["roadNumber", "Road Number", "e.g. 2"],
    ["locality", "Locality", "e.g. Kafrul"],
    ["area", "Area", "e.g. Mirpur"],
    ["city", "City", "e.g. Dhaka"],
    ["postCode", "Post Code", "e.g. 1212"],
    ["country", "Country", "e.g. Bangladesh"],
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
        className="my-8 w-full max-w-150 space-y-space-7 rounded-2xl border-2 border-secondary/10 bg-background p-space-7"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-space-4">
          <div className="flex min-w-0 items-center gap-space-3">
            <i className="fi fi-rr-land-layer-location shrink-0 text-[24px] text-secondary" />
            <h2 className="truncate font-semibold text-size-h4 text-placeholder_3">
              {isEditMode ? "Edit Address" : "Add Address"}
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

        <div className="-mr-1 grid max-h-[65vh] grid-cols-2 gap-space-6 overflow-y-auto pr-1 custom-scrollbar">
          {fields.map(([key, label, placeholder]) => (
            <InputField
              key={key}
              title={label}
              value={form[key]}
              onChange={handleChange(key)}
              placeholder={placeholder}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="space-y-space-4 border-t border-white/5 pt-space-6 text-center">
          <label className="mb-space-3 flex max-w-max items-center gap-2 text-sm text-slate-400">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={handleChange("isDefault")}
              className="size-[20px] accent-secondary"
            />
            Set as default address
          </label>
          <div className="flex gap-space-4 *:w-full">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-size-large font-semibold text-secondary">
            <i className="fi fi-rr-shield-check" />
            Your location information is safe
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddressModal;
