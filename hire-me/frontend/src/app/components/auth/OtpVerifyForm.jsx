"use client";

import { Button } from "@/app/components/Button";
import { OTPField } from "@/app/components/OTPField";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  OTP_LENGTH,
  RESEND_COOLDOWN_SECONDS,
  normalizeEmail,
  useAuthForm,
  useCountdown,
  validators,
} from "@/app/lib/auth";
import { AuthForm, Field, FooterButton } from "./AuthForm";
import { useResendOtpMutation } from "@/store/api/authApi";

/**
 * Reads ?email= from the URL, collects the OTP, and handles resend + cooldown.
 * All messages (error / success / info / warning) are shown as the OTPField's
 * helper text. Priority: field error > form error > notice.
 * Must be rendered inside <Suspense> (it uses useSearchParams).
 *
 * @param {Object}   props
 * @param {string}   props.title                Heading
 * @param {string}   props.action               "verify your email and continue."
 * @param {string}   props.submitLabel          Button text
 * @param {'verify_email'|'reset_password'} props.purpose  Sent to /auth/resend-otp
 * @param {string}   props.missingEmailRedirect Where to go if ?email= is missing
 * @param {(payload: {email: string, otp: string}) => Promise<unknown>} props.onVerify  must throw on failure (use .unwrap())
 * @param {() => void} props.onSuccess          Called after onVerify resolves
 */
const OtpVerifyForm = ({
  title,
  action,
  submitLabel,
  purpose,
  missingEmailRedirect,
  onVerify,
  onSuccess,
}) => {
  const router = useRouter();
  const email = normalizeEmail(useSearchParams().get("email") ?? "");

  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Non-error message: { type: "success" | "info" | "warning", text: string }
  const [notice, setNotice] = useState(null);
  const [cooldown, setCooldown] = useCountdown();

  const {
    values,
    errors,
    formError,
    setErrors,
    setFormError,
    setField,
    applyApiError,
  } = useAuthForm({ otp: "" });

  // Landed here without an email (e.g. typed the URL): nothing to verify.
  useEffect(() => {
    if (!email) router.replace(missingEmailRedirect);
  }, [email, missingEmailRedirect, router]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || !email) return;
    setNotice(null);

    const otpError = validators.otp(values.otp);
    if (otpError) return setErrors({ otp: otpError });

    setIsSubmitting(true);
    try {
      await onVerify({ email, otp: values.otp });
      onSuccess(); // keep the button disabled while navigating
    } catch (error) {
      applyApiError(error);
      setIsSubmitting(false);
    }
  };

  const onResend = async () => {
    if (cooldown > 0 || isResending || !email) return;
    setNotice(null);
    setFormError("");

    try {
      await resendOtp({ email, purpose }).unwrap();
      setNotice({
        type: "success",
        text: "A new code has been sent to your email.",
      });
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      if (error.retryAfterSeconds) {
        // Rate limited: not a real failure, so show it as a warning.
        setCooldown(error.retryAfterSeconds);
        setNotice({
          type: "warning",
          text: error.message || "Please wait before requesting another code.",
        });
        return;
      }
      applyApiError(error);
    }
  };

  const resendLabel =
    cooldown > 0
      ? `Resend in ${cooldown}s`
      : isResending
        ? "Sending..."
        : "Resend";

  // One message at a time, shown under the OTP cells.
  const helper = errors.otp
    ? { validation: "error", text: errors.otp }
    : formError
      ? { validation: "error", text: formError }
      : notice
        ? { validation: notice.type, text: notice.text }
        : null;

  return (
    <AuthForm
      title={title}
      subtitle={
        <>
          We’ve sent a {OTP_LENGTH}-digit verification code to{" "}
          <span className="font-semibold break-all">{email}</span>. Enter the
          code below to {action}
        </>
      }
      onSubmit={onSubmit}
      footer={
        <>
          Didn’t receive the code?
          <FooterButton
            onClick={onResend}
            disabled={cooldown > 0 || isResending}
          >
            {resendLabel}
          </FooterButton>
        </>
      }
    >
      <Field center>
        <div className="flex items-center justify-center">
          <OTPField
            length={OTP_LENGTH}
            value={values.otp}
            onChange={(value) => {
              setField("otp", value);
              setNotice(null);
            }}
            disabled={isSubmitting}
            validation={helper?.validation}
            helperText={helper?.text}
          />
        </div>
      </Field>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Verifying..." : submitLabel}
      </Button>
    </AuthForm>
  );
};

export default OtpVerifyForm;
