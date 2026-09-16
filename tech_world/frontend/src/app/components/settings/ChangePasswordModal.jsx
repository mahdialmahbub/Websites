"use client";

import { useEffect, useRef, useState } from "react";
import { Info } from "lucide-react";
import toast from "react-hot-toast";
import useLockBodyScroll from "@/app/hooks/useLockBodyScroll";
import { useRequestChangePasswordMutation, useConfirmChangePasswordMutation } from "@/redux";
import Button from "../Button";

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
  useLockBodyScroll();

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

  // Close on Escape, matching every other modal in the app.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

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
            <i className="fi fi-rr-password-lock shrink-0 text-[24px] text-secondary" />
            <h2 className="truncate font-semibold text-size-h4 text-placeholder_3">
              Change Password
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

        <form onSubmit={handleSubmit} className="space-y-space-7">
          {/* OTP */}
          <div>
            <div className="mb-2 flex items-center justify-between px-space-1">
              <label className="font-primary text-size-large font-medium text-foreground">OTP</label>
              <span className="text-xs font-primary font-semibold text-green">Required</span>
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
                  onFocus={(e) => e.target.select()}
                  className="w-full rounded-xl border border-secondary/20 bg-background py-3 text-center text-size-large font-semibold text-foreground outline-none transition-colors hover:border-secondary/50 focus-within:border-secondary/80"
                />
              ))}
            </div>

            <p className="mt-2 flex items-center gap-1.5 px-space-1 text-xs text-sky-400">
              <Info className="size-3.5" />
              OTP is sent to your email
            </p>
          </div>

          {/* New password */}
          <div>
            <div className="mb-2 flex items-center justify-between px-space-1">
              <label htmlFor="newPassword" className="font-primary text-size-large font-medium text-foreground">
                New Password
              </label>
              <span className="text-xs font-primary font-semibold text-green">Required</span>
            </div>
            <div className="relative">
              <i className="fi fi-sr-password-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-size-h6 text-[#2BE7C4]/70" />
              <input
                id="newPassword"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                className="w-full rounded-xl border border-secondary/20 bg-background py-3 pl-10 pr-11 text-sm text-foreground placeholder-placeholder_3 outline-none transition-colors hover:border-secondary/50 focus-within:border-secondary/80"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-placeholder_2 transition-colors hover:text-secondary"
              >
                <i className={`fi ${showPassword ? "fi-rr-eye-crossed" : "fi-rr-eye"}`} />
              </button>
            </div>
            <p className="mt-2 flex items-center gap-1.5 px-space-1 text-xs text-sky-400">
              <Info className="size-3.5" />
              At least 8 characters
            </p>
          </div>

          {error && (
            <p className="flex items-center gap-1.5 text-xs text-red">
              <i className="fi fi-rr-cross-circle" />
              {error}
            </p>
          )}

          {/* Footer */}
          <div className="space-y-space-4 border-t border-white/5 pt-space-6">
            <div className="flex gap-space-4 *:w-full">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Confirm"}
              </Button>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-center text-size-large font-semibold text-secondary">
              <i className="fi fi-rr-shield-check" />
              Your password is encrypted and never shared.
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
