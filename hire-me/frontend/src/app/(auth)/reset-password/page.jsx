"use client";

import { Button } from "@/app/components/Button";
import { PasswordInput } from "@/app/components/PasswordInput";
import AuthLayout from "@/app/components/auth/AuthLayout";
import {
  AuthForm,
  Field,
  FooterLink,
  FormAlert,
} from "@/app/components/auth/AuthForm";
import {
  ROUTES,
  collectErrors,
  getSafeRedirect,
  useAuthForm,
  validators,
} from "@/app/lib/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useResetPasswordMutation } from "@/store/api/authApi";

const intro = {
  title: "Create a New Password",
  description:
    "Choose a strong password that you haven’t used before. Once it’s saved, you can log in and get back to your resume.",
};

const ResetPasswordForm = () => {
  const router = useRouter();
  const rawNext = useSearchParams().get("next");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  // The reset session lives on the server (set by verify-reset-otp). If it is
  // missing or expired the user has to start over.
  const [needsRestart, setNeedsRestart] = useState(false);

  const { values, errors, formError, setErrors, handleChange, applyApiError } =
    useAuthForm({ password: "", confirmPassword: "" });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    const nextErrors = collectErrors({
      password: validators.newPassword(values.password),
      confirmPassword: validators.confirmPassword(
        values.confirmPassword,
        values.password,
      ),
    });
    if (Object.keys(nextErrors).length) return setErrors(nextErrors);

    try {
      await resetPassword({ password: values.password }).unwrap();
      if (rawNext) {
        // Started from the profile page (user is logged in): go back there.
        const dest = getSafeRedirect(rawNext);
        router.replace(`${dest}${dest.includes("?") ? "&" : "?"}passwordUpdated=1`);
      } else {
        router.replace(`${ROUTES.login}?reset=success`);
      }
    } catch (error) {
      if ([401, 403, 410].includes(error.status)) setNeedsRestart(true);
      applyApiError(error);
    }
  };

  return (
    <AuthForm
      title="Create a New Password"
      subtitle="Set a strong new password for your account. Make sure it’s unique and easy for you to remember."
      onSubmit={onSubmit}
      footer={
        <>
          Remember your password?
          <FooterLink href={ROUTES.login}>Login</FooterLink>
        </>
      }
    >
      <FormAlert>{formError}</FormAlert>
      {needsRestart && (
        <div className="flex justify-center">
          <FooterLink href={ROUTES.forgotPassword}>Request a new code</FooterLink>
        </div>
      )}

      <Field error={errors.password}>
        <PasswordInput
          label="New Password"
          placeholder="Enter your new password"
          labelIcon="fi fi-rr-lock"
          darkBg
          name="password"
          autoComplete="new-password"
          value={values.password}
          onChange={handleChange}
          disabled={isLoading}
          aria-invalid={!!errors.password}
        />
      </Field>

      <Field error={errors.confirmPassword}>
        <PasswordInput
          label="Confirm Password"
          placeholder="Re-enter your new password"
          labelIcon="fi fi-rr-lock"
          darkBg
          name="confirmPassword"
          autoComplete="new-password"
          value={values.confirmPassword}
          onChange={handleChange}
          disabled={isLoading}
          aria-invalid={!!errors.confirmPassword}
        />
      </Field>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Reset Password"}
      </Button>
    </AuthForm>
  );
};

const Page = () => (
  <AuthLayout intro={intro}>
    {/* useSearchParams needs a Suspense boundary in the App Router */}
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  </AuthLayout>
);

export default Page;
