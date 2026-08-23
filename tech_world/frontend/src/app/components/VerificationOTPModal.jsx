"use client";

import { useEffect, useRef, useState } from "react";
import Button from "./Button";

/**
 * Reusable OTP verification modal — segmented digit boxes with
 * auto-advance-forward on fill and auto-back on backspace.
 *
 * Props:
 *   title       — heading text
 *   description — subtext under the heading (overrides the auto email text)
 *   email       — if provided (and no custom description), shows
 *                 "Code sent to {email}"
 *   length      — number of OTP digits (default: 6)
 *   footerNote  — small secure-notice line under the buttons (optional)
 *   onSubmit    — async (otp: string) => void — throws on failure.
 *                 If omitted, falls back to a default verify call below.
 *   onVerified  — called after a successful verify (e.g. router.push)
 *   onClose     — closes the modal
 */
export default function VerificationOTPModal({
  title = "Verify your email",
  description,
  email,
  length = 6,
  footerNote = "Your information is secure and encrypted.",
  onSubmit,
  onVerified,
  onClose,
}) {
  const [otpValues, setOtpValues] = useState(Array(length).fill(""));
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const otpRefs = useRef([]);

  const resolvedDescription =
    description || (email ? `Code sent to ${email}` : "Enter the verification code we sent you.");

  useEffect(() => {
    otpRefs.current[0]?.focus();
  }, []);

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
  const isComplete = otp.length === length;

  // Default verify call, used only if the caller doesn't pass onSubmit.
  // Replace the URL/body with your real registration-OTP endpoint.
  async function defaultVerify(code) {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp: code }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.message || "Invalid OTP. Please try again.");
    }
    return data;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isComplete || submitting) return;
    setSubmitting(true);
    setErrorMessage("");
    try {
      if (onSubmit) {
        await onSubmit(otp);
      } else {
        await defaultVerify(otp);
      }
      onVerified?.();
    } catch (err) {
      setErrorMessage(
        err?.data?.message || err?.message || "Invalid OTP. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-105 w-full space-y-space-7 p-space-7 rounded-2xl bg-background border-2 border-secondary/10"
      >
        <div className="flex items-center gap-space-3">
          <i className="fi fi-rr-password-lock text-secondary text-size-h3"></i>
          <h2 className="font-semibold text-size-h4 text-placeholder_3">
            {title}
          </h2>
        </div>

        <p className="text-sm text-placeholder_3">{resolvedDescription}</p>

        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${length}, minmax(0,1fr))` }}
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
              className="border rounded-xl transition-colors w-full bg-background text-foreground text-center text-size-large outline-none py-3 border-secondary/20 hover:border-secondary/50 focus-within:border-secondary/80"
            />
          ))}
        </div>

        {errorMessage && <p className="text-red-400 text-sm">{errorMessage}</p>}

        <div className="text-center">
          <div className="flex gap-space-4 *:w-full">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isComplete || submitting}>
              {submitting ? "Verifying..." : "Verify"}
            </Button>
          </div>
          {footerNote && (
            <div className="mt-space-3 flex items-center gap-1.5 justify-center text-secondary text-[14px] font-semibold">
              <i className="fi fi-rr-shield-check"></i>
              {footerNote}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}