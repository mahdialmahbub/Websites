"use client";

import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Input";
import { PasswordInput } from "@/app/components/PasswordInput";
import AuthLayout from "@/app/components/auth/AuthLayout";
import {
  AuthForm,
  Field,
  FooterLink,
  FormAlert,
} from "@/app/components/auth/AuthForm";
import SocialAuth from "@/app/components/auth/SocialAuth";
import { fluid } from "@/app/components/auth/fluid";
import {
  ROUTES,
  collectErrors,
  getSafeRedirect,
  normalizeEmail,
  useAuthForm,
  useRedirectIfAuthenticated,
  validators,
  withEmail,
} from "@/app/lib/auth";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useLoginMutation } from "@/store/api/authApi";

const intro = {
  title: "Build a Resume That Gets Noticed",
  description:
    "Create professional, ATS-friendly resumes with AI-powered suggestions, smart templates, and personalized content designed to help you stand out to employers.",
};

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = getSafeRedirect(searchParams.get("next"));
  const justReset = searchParams.get("reset") === "success";

  useRedirectIfAuthenticated(next);

  const [login, { isLoading }] = useLoginMutation();
  const { values, errors, formError, setErrors, handleChange, applyApiError } =
    useAuthForm({ email: "", password: "" });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    const email = normalizeEmail(values.email);
    const nextErrors = collectErrors({
      email: validators.email(email),
      password: values.password ? null : "Enter your password",
    });
    if (Object.keys(nextErrors).length) return setErrors(nextErrors);

    try {
      await login({ email, password: values.password }).unwrap();
      router.replace(next);
    } catch (error) {
      // Account exists but the email was never confirmed -> finish verification.
      if (error.code === "EMAIL_NOT_VERIFIED") {
        router.push(withEmail(ROUTES.verifyEmail, error.details?.email ?? email));
        return;
      }
      applyApiError(error);
    }
  };

  return (
    <AuthForm
      title="Welcome Back"
      subtitle="Sign in to continue building, managing, and improving your professional resume with AI-powered tools."
      onSubmit={onSubmit}
      footer={
        <>
          Don’t Have an Account?
          <FooterLink href={ROUTES.signUp}>Sign Up</FooterLink>
        </>
      }
    >
      {justReset && (
        <FormAlert variant="success">
          Your password has been updated. Log in with your new password.
        </FormAlert>
      )}
      <FormAlert>{formError}</FormAlert>

      <Field error={errors.email}>
        <Input
          label="Email"
          placeholder="Email"
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

      {/* Password + forgot link */}
      <div className={`flex flex-col ${fluid.gapTight}`}>
        <Field error={errors.password}>
          <PasswordInput
            label="Password"
            placeholder="Password"
            labelIcon="fi fi-rr-lock"
            darkBg
            name="password"
            autoComplete="current-password"
            value={values.password}
            onChange={handleChange}
            disabled={isLoading}
            aria-invalid={!!errors.password}
          />
        </Field>
        <Link
          href={ROUTES.forgotPassword}
          className={`flex min-h-11 items-center self-start text-red-400 sm:text-red-500 ${fluid.forgot}`}
        >
          Forgot Password?
        </Link>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </Button>

      <SocialAuth next={next} disabled={isLoading} />
    </AuthForm>
  );
};

const Page = () => (
  <AuthLayout intro={intro}>
    {/* useSearchParams needs a Suspense boundary in the App Router */}
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  </AuthLayout>
);

export default Page;
