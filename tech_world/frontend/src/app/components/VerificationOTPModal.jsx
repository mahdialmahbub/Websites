"use client";

import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import InputField from "./Input";
import useLockBodyScroll from "@/app/hooks/useLockBodyScroll";

/**
 * Reusable OTP verification modal — segmented digit boxes with
 * auto-advance-forward on fill and auto-back on backspace.
 *
 * Two modes:
 *
 * 1) Plain OTP verify (registration, login 2FA, etc.) — default behaviour,
 *    unchanged from before:
 *      <VerificationOTPModal email={email} onSubmit={verify} onVerified={...} onClose={...} />
 *
 * 2) OTP verify + new password (forgot password) — pass `requirePasswordStep`.
 *    After `onSubmit(otp)` resolves successfully, the modal switches to an
 *    internal "password" step instead of closing. There is no external way
 *    to reach the password form without a successful OTP verify happening
 *    first inside this same component instance — that's the whole guard.
 *      <VerificationOTPModal
 *        email={email}
 *        onSubmit={verifyOtp}                       // returns e.g. resetToken
 *        requirePasswordStep
 *        onPasswordSubmit={(newPw, confirmPw, otpResult) => resetPassword(...)}
 *        onVerified={() => router.push("/login")}
 *        onClose={...}
 *      />
 *
 * Props:
 *   title              — heading text for the OTP step
 *   description        — subtext under the heading (overrides the auto email text)
 *   email               — if provided (and no custom description), shows "Code sent to {email}"
 *   length              — number of OTP digits (default: 6)
 *   footerNote          — small secure-notice line under the buttons (optional)
 *   onSubmit            — async (otp: string) => any — throws on failure.
 *                         Return value (if any) is passed through to onPasswordSubmit
 *                         as `otpResult` when requirePasswordStep is used.
 *   requirePasswordStep — if true, shows a new-password form after OTP success
 *                         instead of calling onVerified immediately
 *   passwordStepTitle       — heading for the password step (default: "Set a new password")
 *   passwordStepDescription — subtext for the password step
 *   onPasswordSubmit    — async (newPassword, confirmPassword, otpResult) => void
 *                         Required when requirePasswordStep is true. Throws on failure.
 *   onVerified          — called once the flow is fully done
 *                         (after OTP alone, or after the password step if enabled)
 *   onClose             — closes the modal
 */
export default function VerificationOTPModal({
  title = "Verify your email",
  description,
  email,
  length = 6,
  footerNote = "Your information is secure and encrypted.",
  onSubmit,
  requirePasswordStep = false,
  passwordStepTitle = "Set a new password",
  passwordStepDescription = "Choose a new password for your account.",
  onPasswordSubmit,
  onVerified,
  onClose,
}) {
  // "otp" | "password"
  const [internalStep, setInternalStep] = useState("otp");
  const [otpResult, setOtpResult] = useState(null);

  // --- OTP step state ---
  const [otpValues, setOtpValues] = useState(Array(length).fill(""));
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const otpRefs = useRef([]);

  // --- Password step state ---
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  useLockBodyScroll();

  const resolvedDescription =
    description ||
    (email
      ? `Code sent to ${email}`
      : "Enter the verification code we sent you.");

  useEffect(() => {
    if (internalStep === "otp") otpRefs.current[0]?.focus();
  }, [internalStep]);

  // Close on Escape, matching every other modal in the app.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function focusOtp(index) {
    otpRefs.current[index]?.focus();
  }

  function handleOtpChange(index, e) {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    const char = digitsOnly.slice(-1);
    setOtpValues((prev) => {
      const next = [...prev];
      next[index] = char || "";
      return next;
    });
    if (errorMessage) setErrorMessage("");
    if (char && index < length - 1) focusOtp(index + 1);
  }

  function handleOtpKeyDown(index, e) {
    if (e.key === "Backspace") {
      if (!otpValues[index] && index > 0) {
        e.preventDefault();
        setOtpValues((prev) => {
          const next = [...prev];
          next[index - 1] = "";
          return next;
        });
        focusOtp(index - 1);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      focusOtp(index - 1);
    } else if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      focusOtp(index + 1);
    }
  }

  function handleOtpPaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!pasted) return;
    const next = Array(length).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setOtpValues(next);
    focusOtp(Math.min(pasted.length, length - 1));
  }

  const otp = otpValues.join("");
  const isOtpComplete = otp.length === length;

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!isOtpComplete || submitting) return;
    setSubmitting(true);
    setErrorMessage("");
    try {
      const result = await onSubmit(otp);
      if (requirePasswordStep) {
        setOtpResult(result);
        setInternalStep("password");
      } else {
        onVerified?.();
      }
    } catch (err) {
      setErrorMessage(
        err?.data?.message || err?.message || "Invalid OTP. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // --- Password step handlers ---
  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
    if (passwordErrors.newPassword) {
      setPasswordErrors((prev) => ({ ...prev, newPassword: undefined }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (passwordErrors.confirmPassword) {
      setPasswordErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    }
  };

  const validatePassword = () => {
    const errors = {};
    if (!newPassword) {
      errors.newPassword = "New password is required";
    } else if (newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    }
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (newPassword && confirmPassword !== newPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordStepSubmit = async (e) => {
    e.preventDefault();
    if (passwordSubmitting) return;
    if (!validatePassword()) return;

    setPasswordSubmitting(true);
    setPasswordErrorMessage("");
    try {
      await onPasswordSubmit(newPassword, confirmPassword, otpResult);
      onVerified?.();
    } catch (err) {
      setPasswordErrorMessage(
        err?.data?.message ||
          err?.message ||
          "Unable to reset password. Please try again.",
      );
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const isPasswordStep = internalStep === "password";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <form
        onSubmit={isPasswordStep ? handlePasswordStepSubmit : handleOtpSubmit}
        onClick={(event) => event.stopPropagation()}
        className="my-8 w-full max-w-105 space-y-space-6 rounded-2xl border-2 border-secondary/10 bg-background p-space-7"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-space-4">
          <div className="flex min-w-0 items-center gap-space-3">
            <i
              className={`shrink-0 text-[24px] text-secondary ${
                isPasswordStep ? "fi fi-rr-lock" : "fi fi-rr-password-lock"
              }`}
            />
            <h2 className="truncate font-semibold text-size-h4 text-placeholder_3">
              {isPasswordStep ? passwordStepTitle : title}
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

        <p className="text-sm text-placeholder_3">
          {isPasswordStep ? passwordStepDescription : resolvedDescription}
        </p>

        {!isPasswordStep ? (
          <>
            {/* OTP boxes */}
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${length}, minmax(0,1fr))`,
              }}
            >
              {otpValues.map((val, i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleOtpChange(i, e)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  onPaste={handleOtpPaste}
                  onFocus={(e) => e.target.select()}
                  className="w-full rounded-xl border border-secondary/20 bg-background py-3 text-center text-size-large font-semibold text-foreground outline-none transition-colors hover:border-secondary/50 focus-within:border-secondary/80"
                />
              ))}
            </div>

            {errorMessage && (
              <p className="flex items-center gap-1.5 text-xs text-red">
                <i className="fi fi-rr-cross-circle" />
                {errorMessage}
              </p>
            )}
          </>
        ) : (
          <>
            {/* New password */}
            <div className="w-full">
              <InputField
                showIcon
                icon="fi fi-rr-password-lock"
                placeholder="Enter new password"
                value={newPassword}
                onChange={handleNewPasswordChange}
                type="password"
                name="newPassword"
                autoComplete="new-password"
                className="w-full"
                showError={!!passwordErrors.newPassword}
                errorMessage={passwordErrors.newPassword}
              />
            </div>

            {/* Confirm password */}
            <div className="w-full">
              <InputField
                showIcon
                icon="fi fi-rr-password-lock"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                className="w-full"
                showError={!!passwordErrors.confirmPassword}
                errorMessage={passwordErrors.confirmPassword}
              />
            </div>

            {passwordErrorMessage && (
              <p className="flex items-center gap-1.5 text-xs text-red">
                <i className="fi fi-rr-cross-circle" />
                {passwordErrorMessage}
              </p>
            )}
          </>
        )}

        {/* Footer */}
        <div className="space-y-space-4 border-t border-white/5 pt-space-6">
          <div className="flex gap-space-4 *:w-full">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            {!isPasswordStep ? (
              <Button type="submit" disabled={!isOtpComplete || submitting}>
                {submitting ? "Verifying..." : "Verify"}
              </Button>
            ) : (
              <Button type="submit" disabled={passwordSubmitting}>
                {passwordSubmitting ? "Saving..." : "Save & Log in"}
              </Button>
            )}
          </div>
          {footerNote && (
            <div className="flex items-center justify-center gap-1.5 text-center text-size-large font-semibold text-secondary">
              <i className="fi fi-rr-shield-check" />
              {footerNote}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
