"use client";

import React, { useState } from "react";
import Link from "next/link";
import ImageUpload from "./ImageUpload";
import { Input } from "../Input";
import { useSection } from "./useSection";
import { useGetMeQuery } from "@/store/api/authApi";
import { useUploadPhotoMutation } from "@/store/api/uploadApi";
import { LIMITS } from "@/resume/validation";

const PersonalInformation = () => {
  const { value, dispatch, actions, field } = useSection("personalInformation");
  const { updateField } = actions;
  const { data: user } = useGetMeQuery();
  const [uploadPhoto] = useUploadPhotoMutation();
  const [guestHint, setGuestHint] = useState(false);

  const set = (key) => (event) => dispatch(updateField({ section: "personalInformation", field: key, value: event.target.value }));

  // Resolves with the photo URL: ImageUpload shows it. The { url, publicId } pair is saved with the resume.
  const handleUpload = async (file) => {
    const photo = await uploadPhoto(file).unwrap();
    dispatch(updateField({ section: "personalInformation", field: "photo", value: photo }));
    return photo.url;
  };

  // Photos are stored per account, so visitors who are not logged in are asked to log in first.
  const blockGuest = (event) => {
    if (user) return;
    event.preventDefault();
    event.stopPropagation();
    setGuestHint(true);
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="mb-6.5 flex w-full flex-col items-center"
        onClickCapture={blockGuest}
        onKeyDownCapture={(event) => (event.key === "Enter" || event.key === " ") && blockGuest(event)}
        onDropCapture={blockGuest}
      >
        <ImageUpload value={value.photo?.url ?? null} onUpload={handleUpload} />
      </div>
      {guestHint && !user && (
        <p role="status" className="-mt-4 mb-6 text-small text-blue-500">
          Photos can be added once you are logged in.{" "}
          <Link href="/login" className="font-semibold underline">
            Log in
          </Link>
        </p>
      )}

      <div className="flex flex-col items-start gap-space-8 w-full">
        <Input
          label="Full Name"
          labelIcon="fi fi-rr-user"
          placeholder="John Doe"
          autoComplete="name"
          requiredLabel
          maxLength={LIMITS.fullName}
          value={value.fullName}
          onChange={set("fullName")}
          {...field("fullName")}
        />

        <Input
          label="Email Address"
          labelIcon="fi fi-rr-envelope"
          placeholder="youremail@gmail.com"
          type="email"
          autoComplete="email"
          requiredLabel
          maxLength={LIMITS.email}
          value={value.email}
          onChange={set("email")}
          {...field("email")}
        />

        <Input
          label="Phone Number"
          labelIcon="fi fi-rr-phone-flip"
          placeholder="+880 1700 000000"
          type="tel"
          autoComplete="tel"
          maxLength={LIMITS.phone}
          value={value.phone}
          onChange={set("phone")}
          {...field("phone")}
        />

        <Input
          label="Location"
          labelIcon="fi fi-rr-marker"
          placeholder="Dhaka, Bangladesh"
          autoComplete="address-level2"
          maxLength={LIMITS.location}
          value={value.location}
          onChange={set("location")}
          {...field("location")}
        />

        <Input
          label="Professional Title"
          labelIcon="fi fi-rr-briefcase"
          placeholder="Senior UI/UX Designer"
          maxLength={LIMITS.professionalTitle}
          value={value.professionalTitle}
          onChange={set("professionalTitle")}
          {...field("professionalTitle")}
        />

        <Input
          label="LinkedIn Profile"
          labelIcon="fi fi-rr-portfolio"
          placeholder="linkedin.com/in/yourname"
          inputMode="url"
          maxLength={LIMITS.url}
          value={value.linkedin}
          onChange={set("linkedin")}
          {...field("linkedin")}
        />

        <Input
          label="Personal Website"
          labelIcon="fi fi-rr-site-alt"
          placeholder="yourname.com"
          inputMode="url"
          maxLength={LIMITS.url}
          value={value.website}
          onChange={set("website")}
          {...field("website")}
        />
      </div>
    </div>
  );
};

export default PersonalInformation;
