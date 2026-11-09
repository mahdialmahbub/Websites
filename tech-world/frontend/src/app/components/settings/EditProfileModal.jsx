"use client";

import { useEffect, useState } from "react";
import Button from "../Button";
import InputField from "../Input";
import Image from "next/image";
import PhoneInput from "../PhoneInput";
import Chips from "../Chips";
import toast from "react-hot-toast";
import { useGetMyProfileQuery, useUpdateMyProfileMutation } from "@/redux";
import useLockBodyScroll from "@/app/hooks/useLockBodyScroll";

const GENDERS = ["Male", "Female", "Other"];

/**
 * Fetches the current profile itself (self-contained — no need for the
 * parent to pass it down). Pass `onClose` to control when it closes.
 */
const EditProfileModal = ({ onClose }) => {
  useLockBodyScroll();
  const { data } = useGetMyProfileQuery();
  const profile = data?.data;

  const [updateProfile, { isLoading }] = useUpdateMyProfileMutation();

  const [name, setName] = useState(profile?.name || "");
  const [dateOfBirth, setDateOfBirth] = useState(profile?.dateOfBirth ? profile.dateOfBirth.slice(0, 10) : "");
  const [gender, setGender] = useState(profile?.gender || "");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(profile?.image?.url || null);

  // PhoneInput's controlled mode needs a countryCode+number pair it doesn't
  // have from a stored E.164 string, so instead: show the current number as
  // read-only, and only send a new one if the customer actually types one.
  const [newPhone, setNewPhone] = useState(null); // { fullNumber, isValid } | null

  // Close on Escape, matching every other modal in the app.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleImagePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPhone && !newPhone.isValid) {
      toast.error("Please enter a valid phone number, or leave it blank to keep your current one.");
      return;
    }

    try {
      await updateProfile({
        name,
        dateOfBirth,
        gender,
        phone: newPhone?.isValid ? newPhone.fullNumber : undefined,
        image: imageFile || undefined,
      }).unwrap();
      toast.success("Profile updated");
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Could not update profile.");
    }
  };

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
            <i className="fi fi-rr-user shrink-0 text-[24px] text-secondary" />
            <h2 className="truncate font-semibold text-size-h4 text-placeholder_3">Edit Profile</h2>
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

        <div className="-mr-1 flex max-h-[65vh] flex-col items-center space-y-space-6 overflow-y-auto pr-1 custom-scrollbar">
          {/* image + hover-to-change */}
          <label className="group relative cursor-pointer">
            <Image
              height={100}
              width={100}
              alt="profile"
              src={imagePreview || "/placeholder-avatar.png"}
              className="h-25 w-25 rounded-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <i className="fi fi-rr-camera text-lg text-white" />
            </div>
            <input type="file" accept="image/png,image/jpeg" hidden onChange={handleImagePick} />
          </label>

          <InputField
            type="text"
            name="name"
            title="Name"
            placeholder="e.g. John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Email is not editable — the backend never allows changing it here */}
          <InputField type="email" name="email" title="Email" value={profile?.email || ""} disabled />

          <div className="w-full">
            <PhoneInput
              title="Phone Number"
              onChange={(val) => setNewPhone(val)}
              placeholder="Leave blank to keep current number"
              showInfo
              infoMessage={`Current phone: ${profile?.phone || "Not set"}`}
            />
          </div>

          <InputField
            type="date"
            name="dob"
            title="Date of Birth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />

          <div className="w-full">
            <label className="px-space-1 font-primary text-size-h6 font-semibold text-foreground">
              Gender
            </label>
            <div className="mt-space-3 flex items-center gap-space-3">
              {GENDERS.map((g) => (
                <button key={g} type="button" onClick={() => setGender(g)}>
                  <Chips text={g} isSelected={gender === g} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="space-y-space-4 border-t border-white/5 pt-space-6">
          <div className="flex gap-space-4 *:w-full">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-center text-size-large font-semibold text-secondary">
            <i className="fi fi-rr-shield-check" />
            Your personal information is kept private and secure.
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProfileModal;
