/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import InputField from "./Input";
import Button from "./Button";
import toast from "react-hot-toast";
import { useAddAddressMutation, useUpdateAddressMutation } from "@/redux";
import useLockBodyScroll from "../hooks/useLockBodyScroll";

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
  use;
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="max-w-150 w-full space-y-space-7 p-space-7 rounded-2xl bg-background border-2 border-secondary/10"
      >
        {/* header */}
        <div className="flex items-center gap-space-3">
          <i className="fi fi-rr-land-layer-location text-secondary/80 text-[24px]"></i>
          <h2 className="font-semibold text-size-h4 text-placeholder_3">
            {isEditMode ? "Edit Address" : "Add Address"}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-space-6 overflow-y-auto h-75 custom-scrollbar">
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

        <div className="text-center">
          <label className="flex items-center gap-2 text-sm text-slate-400 mb-space-3 max-w-max">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={handleChange("isDefault")}
              className="size-[20px]"
            />
            Set as default address
          </label>
          <div className="flex gap-space-4 *:w-full">
            <Button variant="secondary" type="button" onClick={onClose} color={"#d10000"}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
          <div className="mt-space-3 flex items-center justify-center gap-1.5 text-secondary text-size-large font-semibold">
            <i className="fi fi-rr-shield-check"></i>
            Your location information is safe
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddressModal;
