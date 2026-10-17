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
import { AuthForm, Field, FooterButton, FormAlert } from "./AuthForm";
import { useResendOtpMutation } from "@/store/api/authApi";

/**
 * Reads ?email= from the URL, collects the OTP, and handles resend + cooldown.
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
  const [info, setInfo] = useState("");
  const [cooldown, setCooldown] = useCountdown();

  const { values, errors, formError, setErrors, setFormError, setField, applyApiError } =
    useAuthForm({ otp: "" });

  // Landed here without an email (e.g. typed the URL): nothing to verify.
  useEffect(() => {
    if (!email) router.replace(missingEmailRedirect);
  }, [email, missingEmailRedirect, router]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || !email) return;
    setInfo("");

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
    setInfo("");
    setFormError("");

    try {
      await resendOtp({ email, purpose }).unwrap();
      setInfo("A new code has been sent to your email.");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      if (error.retryAfterSeconds) setCooldown(error.retryAfterSeconds);
      applyApiError(error);
    }
  };

  const resendLabel =
    cooldown > 0 ? `Resend in ${cooldown}s` : isResending ? "Sending..." : "Resend";

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
      <FormAlert variant="success">{info}</FormAlert>
      <FormAlert>{formError}</FormAlert>

      <Field error={errors.otp} center>
        <div className="flex items-center justify-center">
          <OTPField
            length={OTP_LENGTH}
            value={values.otp}
            onChange={(value) => setField("otp", value)}
            disabled={isSubmitting}
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
