import React from "react";
import ImageUpload from "./ImageUpload";
import { Input } from "../Input";

const PersonalInformation = () => {
  return (
    <div className="flex flex-col items-center">
      <ImageUpload className="mb-6.5" />
      <div className="flex flex-col items-start gap-space-8 w-full">
        <Input
          label="Full Name"
          labelIcon="fi fi-rr-user"
          placeholder="John Doe"
        />

        <Input
          label="Email Address"
          labelIcon="fi fi-rr-envelope"
          placeholder="youremail@gmail.com"
        />

        <Input
          label="Phone Number"
          labelIcon="fi fi-rr-phone-flip"
          placeholder="John Doe"
        />

        <Input
          label="Location"
          labelIcon="fi fi-rr-marker"
          placeholder="John Doe"
        />

        <Input
          label="Professional Title"
          labelIcon="fi fi-rr-briefcase"
          placeholder="John Doe"
        />

        <Input
          label="LinkedIn Profile"
          labelIcon="fi fi-rr-portfolio"
          placeholder="John Doe"
        />

        <Input
          label="Personal Website"
          labelIcon="fi fi-rr-site-alt"
          placeholder="John Doe"
        />
      </div>
    </div>
  );
};

export default PersonalInformation;
