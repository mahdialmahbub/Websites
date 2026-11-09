"use client";

import { assets } from "@/app/assets/assets";
import Button from "@/app/components/Button";
import InputField from "@/app/components/Input";
import VerificationOTPModal from "@/app/components/VerificationOTPModal";

import {
  useForgotPasswordMutation,
  useVerifyForgotPasswordOtpMutation,
  useResetPasswordMutation,
} from "@/redux";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

  // -----------------------------
  // Email step state
  // -----------------------------
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // -----------------------------
  // Modal state
  // -----------------------------
  // "email" -> "modal" (the modal itself then internally handles
  // otp -> password, so there's only ONE modal instance/mount for the
  // whole flow — see VerificationOTPModal's requirePasswordStep).
  const [showModal, setShowModal] = useState(false);

  // -----------------------------
  // Mutations
  // -----------------------------
  const [forgotPassword, { isLoading: sendingOtp }] = useForgotPasswordMutation();
  const [verifyForgotPasswordOtp] = useVerifyForgotPasswordOtpMutation();
  const [resetPassword] = useResetPasswordMutation();

  // =========================================================
  // Step 1 — request OTP
  // =========================================================
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (fieldErrors.email) {
      setFieldErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) {
      setFieldErrors({ email: "Email is required" });
      return;
    }
    if (!emailRegex.test(trimmed)) {
      setFieldErrors({ email: "Please enter a valid email" });
      return;
    }

    try {
      await forgotPassword(trimmed).unwrap();
      setShowModal(true);
    } catch (err) {
      console.error("Forgot password error:", err);
      setFieldErrors({
        email: err?.data?.message || "Something went wrong. Please try again.",
      });
    }
  };

  // =========================================================
  // Step 2 — verify OTP. Return value becomes `otpResult` inside the modal,
  // which the modal then hands back to handleResetPassword below as its
  // 3rd argument — that's how the resetToken travels from step 2 to step 3
  // without ever living in this page's own state.
  // =========================================================
  const handleVerifyOtp = async (otp) => {
    // Throws on failure — the modal shows the error itself.
    const res = await verifyForgotPasswordOtp({ email: email.trim(), otp }).unwrap();
    return res?.data?.resetToken;
  };

  // =========================================================
  // Step 3 — set new password. `resetToken` here is the value handleVerifyOtp
  // returned above, passed through by the modal — never externally settable.
  // =========================================================
  const handleResetPassword = async (newPassword, confirmPassword, resetToken) => {
    // Throws on failure — the modal shows the error itself.
    await resetPassword({ resetToken, newPassword, confirmPassword }).unwrap();
  };

  return (
    <>
      <section className="min-h-screen min-w-full flex justify-center p-space-11 gap-space-11">
        {/* =====================================================
            LEFT SIDE
        ====================================================== */}
        <div className="min-h-full flex-1 p-space-8 rounded-xl relative overflow-hidden">
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
              onClick={() => router.push("/login")}
            >
              Back to Login
            </Button>

            <div>
              <h1 className="font-primary font-medium text-[32px] mb-[8px]">
                Forgot your password? No worries.
              </h1>

              <p className="font-medium text-size-h5 text-placeholder mt-4.5">
                Enter the email linked to your account and we&apos;ll send you a
                code to reset your password.
              </p>

              <div className="flex items-center gap-space-3 mt-space-6 mb-space-7">
                {contactInfo.map((item) => (
                  <Link
                    href={item.link}
                    key={item.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-space-3 gap-2.5 w-45 rounded-lg"
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
            RIGHT SIDE / FORGOT PASSWORD FORM
        ====================================================== */}
        <div className="w-125 p-space-8 rounded-xl border border-secondary/60 flex flex-col items-center justify-center gap-space-8">
          <div className="w-full text-center">
            <h2 className="font-primary font-medium text-[32px] mb-space-1">
              Forgot Password
            </h2>

            <p className="font-medium text-size-h6 mb-space-7 text-placeholder_3">
              We&apos;ll email you a one-time code to verify it&apos;s you
            </p>

            <form onSubmit={handleSendOtp} noValidate autoComplete="off">
              <div className="space-y-space-4 mb-space-6">
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
              </div>

              <Button type="submit" disabled={sendingOtp} className="w-full">
                {sendingOtp ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>
          </div>

          <span className="flex items-center gap-space-2">
            <p className="font-semibold text-size-h5 text-placeholder_3">
              Remembered your password?
            </p>

            <Link href="/login">
              <Button type="button" variant="text" className="text-secondary">
                Back to Login
              </Button>
            </Link>
          </span>
        </div>
      </section>

      {/* =====================================================
          Single modal: OTP step, then (on success) the new-password step,
          both inside the SAME VerificationOTPModal instance. There is no
          way to reach the password form without this modal's own internal
          OTP verification succeeding first.
      ====================================================== */}
      {showModal && (
        <VerificationOTPModal
          title="Verify your email"
          email={email.trim()}
          onSubmit={handleVerifyOtp}
          requirePasswordStep
          passwordStepTitle="Set a new password"
          passwordStepDescription="Choose a new password for your account."
          onPasswordSubmit={handleResetPassword}
          onVerified={() => router.push("/")}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default Page;