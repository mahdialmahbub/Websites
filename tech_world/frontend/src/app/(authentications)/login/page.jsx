"use client";

import { assets } from "@/app/assets/assets";
import Button from "@/app/components/Button";
import InputField from "@/app/components/Input";
import { useAppSelector } from "@/lib/hooks";

import {
  selectPendingTwoFactorEmail,
  useLoginMutation,
  useVerifyLoginOtpMutation,
} from "@/redux";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const contactInfo = [
  {
    name: "Gmail",
    value: "example@gmail.com",
    color: "#ffffff",
    icon: assets.Gmail,
    blackText: true,
    link: "https://www.gmail.com",
  },
  {
    name: "Facebook",
    value: "mahdialmahbub",
    color: "#0165E1",
    icon: assets.Facebook,
    link: "https://www.facebook.com",
  },
  {
    name: "WhatsApp",
    value: "+880 17359 99190",
    color: "#39AE41",
    icon: assets.Whats_App,
    link: "https://www.whatsapp.com",
  },
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("redirect") || "/";

  // -----------------------------
  // Login states
  // -----------------------------
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // -----------------------------
  // OTP states
  // -----------------------------
  const [otp, setOtp] = useState("");
  const [otpFieldError, setOtpFieldError] = useState("");

  // -----------------------------
  // Field validation
  // -----------------------------
  const [fieldErrors, setFieldErrors] = useState({});

  // -----------------------------
  // Login mutation
  // -----------------------------
  const [
    login,
    {
      isLoading: loggingIn,
      error: loginError,
    },
  ] = useLoginMutation();

  // -----------------------------
  // OTP mutation
  // -----------------------------
  const [
    verifyLoginOtp,
    {
      isLoading: verifying,
      error: otpError,
    },
  ] = useVerifyLoginOtpMutation();

  // -----------------------------
  // Pending 2FA email
  // -----------------------------
  const pendingEmail = useAppSelector(selectPendingTwoFactorEmail);

  // =========================================================
  // Login form validation
  // =========================================================
  const validateLoginForm = () => {
    const errors = {};

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(email.trim())) {
      errors.email = "Please enter a valid email";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  // =========================================================
  // Login handler
  // =========================================================
  const handleLogin = async (e) => {
    e.preventDefault();

    // Clear previous API error on new submission
    setFieldErrors((prev) => ({
      ...prev,
      password: undefined,
    }));

    // Client-side validation
    if (!validateLoginForm()) {
      return;
    }

    try {
      const res = await login({
        email: email.trim(),
        password,
      }).unwrap();

      // If 2FA is not required
      if (!res?.data?.twoFactorRequired) {
        router.push(redirectTo);
      }
    } catch (err) {
      console.error("Login error:", err);

      const message =
        err?.data?.message ||
        "Invalid email or password.";

      // Put API error directly into password field
      setFieldErrors((prev) => ({
        ...prev,
        password: message,
      }));

      // Never keep failed password in state
      setPassword("");
    }
  };

  // =========================================================
  // OTP verification
  // =========================================================
  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      setOtpFieldError("OTP is required");
      return;
    }

    setOtpFieldError("");

    try {
      await verifyLoginOtp({
        email: pendingEmail,
        otp: otp.trim(),
      }).unwrap();

      router.push(redirectTo);
    } catch (err) {
      console.error("OTP verification error:", err);
    }
  };

  // =========================================================
  // Clear login field error when typing
  // =========================================================
  const handleEmailChange = (e) => {
    const value = e.target.value;

    setEmail(value);

    if (fieldErrors.email || fieldErrors.password) {
      setFieldErrors((prev) => ({
        ...prev,
        email: undefined,
        password: undefined,
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;

    setPassword(value);

    if (fieldErrors.password) {
      setFieldErrors((prev) => ({
        ...prev,
        password: undefined,
      }));
    }
  };

  // =========================================================
  // OTP screen
  // =========================================================
  if (pendingEmail) {
    return (
      <form
        onSubmit={handleVerify}
        noValidate
        autoComplete="off"
        className="max-w-sm mx-auto mt-16 space-y-4"
      >
        <h1 className="text-xl font-semibold">
          Enter your OTP
        </h1>

        <p className="text-sm text-slate-400">
          Two-factor code sent to {pendingEmail}
        </p>

        <div>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value);

              if (otpFieldError) {
                setOtpFieldError("");
              }
            }}
            placeholder="Enter OTP"
            maxLength={6}
            className="w-full rounded-lg border border-white/10 bg-[#12141c] px-3 py-2"
          />

          {otpFieldError && (
            <p className="text-red-400 text-sm mt-1 text-left">
              {otpFieldError}
            </p>
          )}
        </div>

        {otpError && (
          <p className="text-red-400 text-sm text-left">
            {otpError?.data?.message ||
              "Unable to verify OTP. Please try again."}
          </p>
        )}

        <button
          type="submit"
          disabled={verifying}
          className="w-full rounded-lg bg-emerald-500 py-2 font-medium disabled:opacity-50"
        >
          {verifying ? "Verifying..." : "Verify & Log in"}
        </button>
      </form>
    );
  }

  // =========================================================
  // Main login page
  // =========================================================
  return (
    <section className="min-h-screen min-w-full flex justify-center p-space-11 gap-space-11">
      {/* =====================================================
          LEFT SIDE
      ====================================================== */}
      <div className="min-h-full flex-1 p-space-8 rounded-[12px] relative overflow-hidden">
        <Image
          src={assets.overlay1}
          alt="Background"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 min-h-full flex flex-col items-start justify-between">
          <Button
            type="button"
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
              Sign in to your account to explore the latest tech
              and manage your orders.
            </p>

            <div className="flex items-center gap-space-3 mt-space-6 mb-space-7">
              {contactInfo.map((item) => (
                <Link
                  href={item.link}
                  key={item.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-space-3 gap-2.5 w-[180px] rounded-[8px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                >
                  <Image
                    alt={item.name}
                    src={item.icon}
                    height={24}
                    width={24}
                  />

                  <div>
                    <h3
                      className={`font-primary font-semibold text-size-medium ${
                        item.blackText ? "text-background" : ""
                      }`}
                    >
                      {item.name}
                    </h3>

                    <p
                      className={`font-semibold text-size-medium ${
                        item.blackText ? "text-background" : ""
                      }`}
                    >
                      {item.value}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-space-2">
              <i className="fi fi-sr-marker text-secondary text-size-h5" />

              <p className="font-medium text-[20px] text-placeholder">
                245 Market Street, San Francisco, CA 94105, USA.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          RIGHT SIDE / LOGIN FORM
      ====================================================== */}
      <div className="w-[500px] p-space-8 rounded-[12px] border border-secondary/60 flex flex-col items-center justify-center gap-space-8">
        <div className="w-full text-center">
          <h2 className="font-primary font-medium text-[32px] mb-space-1">
            Welcome Back
          </h2>

          <p className="font-medium text-size-h6 mb-space-7 text-placeholder_3">
            Access your account to continue shopping
          </p>

          <form
            onSubmit={handleLogin}
            noValidate
            autoComplete="off"
          >
            <div className="space-y-space-4 mb-space-6">
              {/* =================================================
                  EMAIL
              ================================================== */}
              <div className="w-full">
                <InputField
                  showIcon
                  icon="fi fi-sr-envelope"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleEmailChange}
                  type="email"
                  name="email"
                  autoComplete="username"
                  className="w-full"
                  showError={!!fieldErrors.email}
                  errorMessage={fieldErrors.email}
                />
              </div>

              {/* =================================================
                  PASSWORD
              ================================================== */}
              <div className="w-full">
                <InputField
                  showIcon
                  icon="fi fi-rr-password-lock"
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePasswordChange}
                  type="password"
                  name="password"

                  // Prevent browser password save/update prompt
                  autoComplete="new-password"

                  className="w-full"
                  showError={!!fieldErrors.password}
                  errorMessage={fieldErrors.password}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loggingIn}
              className="w-full"
            >
              {loggingIn ? "Logging in..." : "Log in"}
            </Button>
          </form>
        </div>

        {/* =====================================================
            REGISTRATION LINK
        ====================================================== */}
        <span className="flex items-center gap-space-2">
          <p className="font-semibold text-size-h5 text-placeholder_3">
            Don&apos;t Have an Account?
          </p>

          <Link href="/registration">
            <Button
              type="button"
              variant="text"
              className="text-secondary"
            >
              Registration Now
            </Button>
          </Link>
        </span>
      </div>
    </section>
  );
};

export default Page;