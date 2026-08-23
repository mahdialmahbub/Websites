"use client";

import { useState } from "react";
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-150 w-full space-y-space-9 p-space-7 rounded-2xl bg-background border-2 border-secondary"
      >
        <div className="space-y-space-6 flex items-center flex-col overflow-y-auto max-h-100 custom-scrollbar">
          {/* image + hover-to-change */}
          <label className="relative cursor-pointer group">
            <Image
              height={100}
              width={100}
              alt="profile"
              src={imagePreview || "/placeholder-avatar.png"}
              className="w-25 h-25 object-cover rounded-full"
            />
            <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <i className="fi fi-rr-camera text-white text-lg"></i>
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
            <label className="font-semibold font-primary text-size-h6 text-foreground px-space-1">Gender</label>
            <div className="flex items-center gap-space-3 mt-space-3">
              {GENDERS.map((g) => (
                <button key={g} type="button" onClick={() => setGender(g)}>
                  <Chips text={g} isSelected={gender === g} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-space-4 *:flex-1">
          <Button variant="secondary" type="button" onClick={onClose} color={"#d10000"}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileModal;
