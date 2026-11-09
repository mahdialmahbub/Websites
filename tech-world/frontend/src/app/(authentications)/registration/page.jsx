"use client";

import { assets } from "@/app/assets/assets";
import Button from "@/app/components/Button";
import InputField from "@/app/components/Input";
import VerificationOTPModal from "@/app/components/VerificationOTPModal";
import { useRegisterMutation, useVerifyRegistrationOtpMutation } from "@/redux";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const contactInfo = [
  {
    name: "Gmail",
    value: "example@gmail.com",
    color: "#ffffff",
    icon: assets.Gmail,
    blackText: true,
    link: "www.gmail.com",
  },
  {
    name: "Facebook",
    value: "mahdialmahbub",
    color: "#0165E1",
    icon: assets.Facebook,
    link: "www.facebook.com",
  },
  {
    name: "WhatsApp",
    value: "+880 17359 99190",
    color: "#39AE41",
    icon: assets.Whats_App,
    link: "www.whatsapp.com",
  },
];

const initialForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  address: {
    floorNumber: "",
    houseNumber: "",
    roadNumber: "",
    locality: "",
    area: "",
    city: "",
    zipCode: "",
    country: "",
  },
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Page = () => {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showOtpModal, setShowOtpModal] = useState(false);

  const [register, { isLoading: registering, error: registerError }] =
    useRegisterMutation();
  const [verifyOtp] = useVerifyRegistrationOtpMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
      if (fieldErrors[name]) {
        setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    else if (!emailRegex.test(form.email))
      errors.email = "Please Enter Currect Email";
    if (!form.password) errors.password = "Password is required";
    else if (form.password.length < 6)
      errors.password = "Password must be at least 6 characters long";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await register(form).unwrap();
      setShowOtpModal(true); // registration succeeded -> open the OTP modal
    } catch (err) {
      // registerError (from the hook) auto-updates and renders below
    }
  };

  const getErrorMessage = (err) => {
    if (!err) return null;
    return (
      err?.data?.error[0] ||
      err?.error ||
      err?.data?.message ||
      "Something went wrong. Please try again."
    );
  };

  return (
    <section className="min-h-screen min-w-full flex justify-center p-space-11 gap-space-11">
      {/* image and other contact informations */}
      <div className="min-h-full flex-1 p-space-8 rounded-[12px] relative overflow-hidden">
        <Image src={assets.overlay1} alt="bg" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 min-h-full flex flex-col items-start justify-between">
          <Button
            showLeftIcon
            leftIcon="fi fi-rr-arrow-small-left"
            variant="text"
            className="text-secondary"
            onClick={() => router.push("/")}
          >
            Back to Home
          </Button>
          <div>
            <h1 className="font-primary font-medium text-[32px] mb-[8px]">
              To get help, Contact us Fluently.
            </h1>
            <p className="font-medium text-size-h5 text-placeholder mt-[18px]">
              Sign in to your account to explore the latest tech and manage your
              orders.
            </p>
            <div className="flex items-center gap-space-3 mt-space-6 mb-space-7">
              {contactInfo.map((item) => (
                <span
                  key={item.name + item.value}
                  className="flex items-center p-space-3 gap-2.5 w-[180px] rounded-[8px]"
                  style={{ backgroundColor: item.color }}
                >
                  <Image
                    alt={item.name}
                    src={item.icon}
                    height={24}
                    width={24}
                  />
                  <div>
                    <h3
                      className={`font-primary font-semibold text-size-medium ${item.blackText && "text-background"}`}
                    >
                      {item.name}
                    </h3>
                    <p
                      className={`font-semibold text-size-medium ${item.blackText && "text-background"}`}
                    >
                      {item.value}
                    </p>
                  </div>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-space-2">
              <i className="fi fi-sr-marker text-secondary text-size-h5"></i>
              <p className="font-medium text-[20px] text-placeholder">
                245 Market Street, San Francisco, CA 94105, USA.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* form */}
      <div className="w-[500px] p-space-8 rounded-[12px] border border-secondary/60 flex flex-col items-center justify-center gap-space-8">
        <div className="w-full text-center">
          <h2 className="font-primary font-medium text-[32px] mb-space-1">
            Create Your Account
          </h2>
          <p className="font-medium text-size-h6 mb-space-7 text-placeholder_3">
            Create an account in seconds
          </p>
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-space-3 mb-space-6">
              <div className="w-full">
                <InputField
                  showIcon
                  icon="fi fi-sr-user"
                  placeholder="Enter your Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  title="Name"
                  className="w-full"
                  showError={fieldErrors.name}
                  errorMessage={fieldErrors.name}
                />
              </div>
              <div className="w-full">
                <InputField
                  showIcon
                  icon="fi fi-sr-envelope"
                  placeholder="Enter your email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  title="Email"
                  className="w-full"
                  showError={fieldErrors.email}
                  errorMessage={fieldErrors.email}
                />
              </div>
              <div className="w-full">
                <InputField
                  showIcon
                  icon="fi fi-rr-password-lock"
                  placeholder="Enter your Password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  title="Password"
                  minLength={6}
                  className="w-full"
                  showError={fieldErrors.password}
                  errorMessage={fieldErrors.password}
                />
              </div>
            </div>

            {registerError && (
              <p className="text-red-500 text-size-small mb-space-4 text-left">
                {getErrorMessage(registerError)}
              </p>
            )}

            <Button type="submit" disabled={registering} className="w-full">
              {registering ? "Creating account..." : "Signup"}
            </Button>
          </form>
        </div>
        <span className="flex items-center gap-space-2">
          <p className="font-semibold text-size-h5 text-placeholder_3">
            Already have an account?
          </p>
          <Button
            type="button"
            variant="text"
            className="text-secondary"
            onClick={() => router.push("/login")}
          >
            Login
          </Button>
        </span>
      </div>

      {showOtpModal && (
        <VerificationOTPModal
          email={form.email}
          onClose={() => setShowOtpModal(false)}
          onSubmit={(otp) => verifyOtp({ email: form.email, otp }).unwrap()}
          onVerified={() => router.push("/contact_number")}
        />
      )}
    </section>
  );
};

export default Page;
