"use client";

import Button from "@/app/components/Button";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useRequestChangePasswordMutation, useConfirmChangePasswordMutation } from "@/redux";

const OTP_LENGTH = 6;

/**
 * ChangePasswordModal
 * -----------------------------------------------------------------------
 * Opening this modal automatically triggers an OTP email (matches "prothome
 * otp dite hobe" — the OTP is already on its way the moment this appears).
 * OTP + new password are entered together and submitted as one step.
 * -----------------------------------------------------------------------
 */
const ChangePasswordModal = ({ onClose = () => {}, onSuccess = () => {} }) => {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const otpRefs = useRef([]);
  const otpRequestedRef = useRef(false); // guards against double-sending in React Strict Mode

  const [requestChangePassword] = useRequestChangePasswordMutation();
  const [confirmChangePassword, { isLoading: submitting }] = useConfirmChangePasswordMutation();

  // Fire the OTP email once, right when the modal opens
  useEffect(() => {
    if (otpRequestedRef.current) return;
    otpRequestedRef.current = true;
    requestChangePassword()
      .unwrap()
      .then(() => toast.success("OTP sent to your email"))
      .catch((err) => setError(err?.data?.message || "Could not send OTP. Please try again."));
  }, [requestChangePassword]);

  // ---- OTP box handlers ----
  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setOtp((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (digit && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;

    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((char, i) => (next[i] = char));
    setOtp(next);
    otpRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const otpValue = otp.join("");
    if (otpValue.length < OTP_LENGTH) {
      setError("Please enter the full 6-digit OTP.");
      return;
    }
    if (!newPassword) {
      setError("Please enter your new password.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      await confirmChangePassword({ otp: otpValue, newPassword }).unwrap();
      toast.success("Password changed successfully");
      onSuccess();
    } catch (err) {
      setError(err?.data?.message || "Failed to change password.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-200 w-full space-y-space-9 p-space-7 rounded-2xl bg-background border-2 border-secondary my-8 relative"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-space-6 right-space-6 text-placeholder_2 hover:text-foreground transition-colors"
        >
          <i className="fi fi-rr-cross-small text-[24px]"></i>
        </button>

        <div className="flex items-center gap-space-3">
          <i className="fi fi-sr-password-lock text-secondary text-[32px]"></i>
          <h2 className="font-semibold text-size-h3">Change Password</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-space-6">
          <div>
            <div className="flex items-center justify-between mb-2 px-space-1">
              <label className="text-[#EAECF2] text-sm font-medium">OTP</label>
              <span className="text-[#1FD8A4] text-xs font-medium">Required</span>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  onPaste={handleOtpPaste}
                  className="w-full bg-[#0B0F1E] h-11 border border-white/10 rounded-xl text-center text-base font-semibold text-[#EAECF2] outline-none focus:border-[#1FD8A4]/60 transition-colors"
                />
              ))}
            </div>

            <p className="flex items-center gap-1.5 mt-2 text-xs text-secondary text-size-large">
              <i className="fi fi-rr-info"></i>
              OTP is sent to your email
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2 px-space-1">
              <label htmlFor="newPassword" className="text-[#EAECF2] text-sm font-medium">
                New Password
              </label>
              <span className="text-[#1FD8A4] text-xs font-medium">Required</span>
            </div>
            <div className="flex items-center gap-space-3 p-3.5 rounded-lg bg-[#0C1221] border border-secondary/30">
              <i className="fi fi-sr-password-lock text-size-h6 text-[#2BE7C4]"></i>
              <input
                id="newPassword"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                className="outline-none text-size-large bg-transparent w-full text-[#EAECF2]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="text-placeholder_2 hover:text-secondary transition-colors"
              >
                <i className={`fi ${showPassword ? "fi-rr-eye-crossed" : "fi-rr-eye"}`}></i>
              </button>
            </div>
          </div>

          {error && (
            <p className="flex items-center gap-1.5 text-xs text-red">
              <i className="fi fi-rr-cross-circle"></i>
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-space-4">
            <Button type="button" variant="text" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Confirm"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
