// components/dashboard/delivery-man/DeliveryManFormModal.jsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Info } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../Button"; // adjust path if your Button lives elsewhere
import Select from "../Select";
import useLockBodyScroll from "@/app/hooks/useLockBodyScroll";
import { useAddDeliveryManMutation, useUpdateDeliveryManMutation } from "@/redux";

const vehicleOptions = [
  { label: "Bike", value: "Bike" },
  { label: "Cycle", value: "Cycle" },
  { label: "Car", value: "Car" },
  { label: "Van", value: "Van" },
  { label: "Truck", value: "Truck" },
];

const emptyForm = {
  name: "",
  contact: "",
  email: "",
  courierServiceName: "",
  address: "",
  vehicleType: "Bike",
  vehicleNumber: "",
};

const inputClass =
  "pl-10 pr-4 border rounded-xl transition-colors w-full bg-background text-foreground placeholder-placeholder_3 outline-none text-sm py-3 border-secondary/20 hover:border-secondary/50 focus-within:border-secondary/80";

const iconClass =
  "text-size-h6 text-[#2BE7C4]/70 absolute left-3.5 top-1/2 -translate-y-1/2";

/**
 * One modal, two modes:
 * - No `deliveryMan` prop → Add mode: empty form, calls addDeliveryMan.
 * - `deliveryMan` prop passed (must include _id) → Edit mode: form
 *   pre-filled from it, calls updateDeliveryMan.
 */
const DeliveryManFormModal = ({ deliveryMan = null, onClose, onSaved }) => {
  useLockBodyScroll();
  const isEditMode = Boolean(deliveryMan?._id);

  const [form, setForm] = useState({
    name: deliveryMan?.name ?? emptyForm.name,
    contact: deliveryMan?.contact ?? emptyForm.contact,
    email: deliveryMan?.email ?? emptyForm.email,
    courierServiceName: deliveryMan?.courierServiceName ?? emptyForm.courierServiceName,
    address: deliveryMan?.address ?? emptyForm.address,
    vehicleType: deliveryMan?.vehicleType ?? emptyForm.vehicleType,
    vehicleNumber: deliveryMan?.vehicleNumber ?? emptyForm.vehicleNumber,
  });

  // Selected file + a local preview URL. In edit mode this starts out
  // showing the existing photo until a new one is picked.
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(deliveryMan?.image?.url || "");

  const [addDeliveryMan, { isLoading: adding }] = useAddDeliveryManMutation();
  const [updateDeliveryMan, { isLoading: updating }] = useUpdateDeliveryManMutation();
  const isSubmitting = adding || updating;

  const canSubmit = Boolean(form.name && form.contact && form.courierServiceName);

  // Close on Escape, matching every other modal in the app.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handlePrimaryAction = async () => {
    if (!canSubmit) {
      toast.error("Name, contact and courier service name are required.");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (imageFile) formData.append("image", imageFile);

    try {
      if (isEditMode) {
        await updateDeliveryMan({ id: deliveryMan._id, formData }).unwrap();
        toast.success("Delivery man updated");
      } else {
        await addDeliveryMan(formData).unwrap();
        toast.success("Delivery man added");
      }

      onSaved?.();
      onClose();
    } catch (err) {
      toast.error(
        err?.data?.message || `Could not ${isEditMode ? "update" : "add"} delivery man.`,
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="my-8 w-full max-w-150 space-y-space-7 rounded-2xl border-2 border-secondary/10 bg-background p-space-7"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-space-4">
          <div className="flex min-w-0 items-center gap-space-3">
            <i className="fi fi-rr-delivery-man shrink-0 text-[24px] text-secondary" />
            <h2 className="truncate font-semibold text-size-h4 text-placeholder_3">
              {isEditMode ? "Edit Delivery Man" : "Add Delivery Man"}
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

        <div className="-mr-1 max-h-[65vh] space-y-space-7 overflow-y-auto pr-1 custom-scrollbar">
          {/* photo */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="px-space-1 font-primary text-size-large font-medium text-foreground">
                Photo
              </label>
              <span className="text-xs font-primary font-semibold text-placeholder_3">Optional</span>
            </div>
            <div className="flex items-center gap-space-4">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-full border border-secondary/20 bg-secondary/10">
                {preview ? (
                  <Image src={preview} alt={form.name || "Delivery man"} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <i className="fi fi-sr-user text-[20px] text-placeholder_3" />
                  </div>
                )}
              </div>
              <label className="cursor-pointer text-sm font-semibold text-secondary hover:underline">
                {isEditMode ? "Change photo" : "Upload photo"}
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="mt-2 flex items-center gap-1.5 px-space-1 text-xs text-sky-400">
              <Info className="size-3.5" />
              JPG, PNG or WEBP — up to 5MB
            </p>
          </div>

          {/* name */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="px-space-1 font-primary text-size-large font-medium text-foreground">
                Name
              </label>
              <span className="text-xs font-primary font-semibold text-green">Required</span>
            </div>
            <div className="relative">
              <i className={`${iconClass} fi fi-sr-user`} />
              <input
                type="text"
                value={form.name}
                onChange={handleChange("name")}
                placeholder="e.g. Rahim Uddin"
                className={inputClass}
              />
            </div>
          </div>

          {/* contact + email */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="px-space-1 font-primary text-size-large font-medium text-foreground">
                  Contact Number
                </label>
                <span className="text-xs font-primary font-semibold text-green">Required</span>
              </div>
              <div className="relative">
                <i className={`${iconClass} fi fi-sr-phone-call`} />
                <input
                  type="tel"
                  value={form.contact}
                  onChange={handleChange("contact")}
                  placeholder="e.g. 017XXXXXXXX"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="px-space-1 font-primary text-size-large font-medium text-foreground">
                  Email
                </label>
                <span className="text-xs font-primary font-semibold text-placeholder_3">Optional</span>
              </div>
              <div className="relative">
                <i className={`${iconClass} fi fi-sr-envelope`} />
                <input
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  placeholder="e.g. rahim@example.com"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* courier service name */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="px-space-1 font-primary text-size-large font-medium text-foreground">
                Courier Service Name
              </label>
              <span className="text-xs font-primary font-semibold text-green">Required</span>
            </div>
            <div className="relative">
              <i className={`${iconClass} fi fi-sr-shipping-fast`} />
              <input
                type="text"
                value={form.courierServiceName}
                onChange={handleChange("courierServiceName")}
                placeholder="e.g. Pathao Courier"
                className={inputClass}
              />
            </div>
          </div>

          {/* address */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="px-space-1 font-primary text-size-large font-medium text-foreground">
                Address
              </label>
              <span className="text-xs font-primary font-semibold text-placeholder_3">Optional</span>
            </div>
            <div className="relative">
              <i className={`${iconClass} fi fi-sr-marker`} />
              <input
                type="text"
                value={form.address}
                onChange={handleChange("address")}
                placeholder="e.g. Savar, Dhaka"
                className={inputClass}
              />
            </div>
          </div>

          {/* vehicle type + number */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <Select
                label="Vehicle Type"
                options={vehicleOptions}
                value={form.vehicleType}
                onChange={(value) => setForm((prev) => ({ ...prev, vehicleType: value }))}
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="px-space-1 font-primary text-size-large font-medium text-foreground">
                  Vehicle Number
                </label>
                <span className="text-xs font-primary font-semibold text-placeholder_3">Optional</span>
              </div>
              <div className="relative">
                <i className={`${iconClass} fi fi-sr-car-side`} />
                <input
                  type="text"
                  value={form.vehicleNumber}
                  onChange={handleChange("vehicleNumber")}
                  placeholder="e.g. DHK-1234"
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-space-4 border-t border-white/5 pt-space-6 *:w-full">
          <Button type="button" onClick={onClose} variant="secondary">
            Cancel
          </Button>

          <Button type="button" onClick={handlePrimaryAction} disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? "Saving..." : isEditMode ? "Save Changes" : "Add Delivery Man"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryManFormModal;
