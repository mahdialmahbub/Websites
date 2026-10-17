"use client";

import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Input";
import AuthLayout from "@/app/components/auth/AuthLayout";
import {
  AuthForm,
  Field,
  FooterLink,
  FormAlert,
} from "@/app/components/auth/AuthForm";
import {
  ROUTES,
  normalizeEmail,
  useAuthForm,
  useCountdown,
  validators,
  withEmail,
} from "@/app/lib/auth";
import { useRouter } from "next/navigation";
import { useForgotPasswordMutation } from "@/store/api/authApi";

const intro = {
  title: "Forgot Your Password? We’ll Help You Reset It",
  description:
    "Enter the email address linked to your account and we’ll send you a verification code. Use it to confirm it’s you and choose a new password.",
};

const ForgotPasswordForm = () => {
  const router = useRouter();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [cooldown, setCooldown] = useCountdown();

  const { values, errors, formError, setErrors, handleChange, applyApiError } =
    useAuthForm({ email: "" });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isLoading || cooldown > 0) return;

    const email = normalizeEmail(values.email);
    const emailError = validators.email(email);
    if (emailError) return setErrors({ email: emailError });

    try {
      await forgotPassword({ email }).unwrap();
      router.push(withEmail(ROUTES.verifyResetOtp, email));
    } catch (error) {
      // Account exists but the email was never confirmed -> finish that first.
      if (error.code === "EMAIL_NOT_VERIFIED") {
        router.push(withEmail(ROUTES.verifyEmail, email));
        return;
      }
      if (error.retryAfterSeconds) setCooldown(error.retryAfterSeconds);
      applyApiError(error);
    }
  };

  const buttonLabel = isLoading
    ? "Sending code..."
    : cooldown > 0
      ? `Try again in ${cooldown}s`
      : "Send Code";

  return (
    <AuthForm
      title="Forgot Password?"
      subtitle="No worries. Enter your email address and we’ll send you a verification code to reset your password."
      onSubmit={onSubmit}
      footer={
        <>
          Remember your password?
          <FooterLink href={ROUTES.login}>Login</FooterLink>
        </>
      }
    >
      <FormAlert>{formError}</FormAlert>

      <Field error={errors.email}>
        <Input
          label="Email"
          placeholder="you@example.com"
          isLabelIcon
          labelIcon="fi fi-rr-envelope"
          darkBg
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          disabled={isLoading}
          aria-invalid={!!errors.email}
        />
      </Field>

      <Button type="submit" disabled={isLoading || cooldown > 0}>
        {buttonLabel}
      </Button>
    </AuthForm>
  );
};

const Page = () => (
  <AuthLayout intro={intro}>
    <ForgotPasswordForm />
  </AuthLayout>
);

export default Page;
