"use client";

import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Input";
import { PasswordInput } from "@/app/components/PasswordInput";
import AuthLayout from "@/app/components/auth/AuthLayout";
import { AuthForm, FooterLink } from "@/app/components/auth/AuthForm";
import SocialAuth from "@/app/components/auth/SocialAuth";
import {
  ROUTES,
  collectErrors,
  normalizeEmail,
  useAuthForm,
  useRedirectIfAuthenticated,
  validators,
  withEmail,
} from "@/app/lib/auth";
import { useRouter } from "next/navigation";
import { useRegisterMutation } from "@/store/api/authApi";

const intro = {
  title: "Your Career Starts With a Strong Resume",
  description:
    "Create a professional, ATS-friendly resume with AI-powered content suggestions and smart templates—so you can present your skills with confidence.",
};

const SignUpForm = () => {
  const router = useRouter();
  useRedirectIfAuthenticated();

  const [register, { isLoading }] = useRegisterMutation();
  const { values, errors, formError, setErrors, handleChange, applyApiError } =
    useAuthForm({ name: "", email: "", password: "" });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    const name = values.name.trim();
    const email = normalizeEmail(values.email);
    const nextErrors = collectErrors({
      name: validators.name(name),
      email: validators.email(email),
      password: validators.newPassword(values.password),
    });
    if (Object.keys(nextErrors).length) return setErrors(nextErrors);

    try {
      await register({ name, email, password: values.password }).unwrap();
      router.push(withEmail(ROUTES.verifyEmail, email));
    } catch (error) {
      // Registered earlier but never verified -> continue with the OTP.
      if (error.code === "EMAIL_NOT_VERIFIED") {
        router.push(withEmail(ROUTES.verifyEmail, email));
        return;
      }
      applyApiError(error);
    }
  };

  return (
    <AuthForm
      title="Create Your Account"
      subtitle="Sign up to build, manage, and improve your professional resume with powerful AI-driven tools and modern resume templates."
      onSubmit={onSubmit}
      footer={
        <>
          Already Have an Account?
          <FooterLink href={ROUTES.login}>Login</FooterLink>
        </>
      }
    >
      <Input
        label="Name"
        placeholder="John Doe"
        isLabelIcon
        labelIcon="fi fi-rr-user"
        darkBg
        name="name"
        autoComplete="name"
        value={values.name}
        onChange={handleChange}
        disabled={isLoading}
        aria-invalid={!!errors.name}
        validation={errors.name ? "error" : "default"}
        helperText={errors.name}
      />

      {/* API-level errors (e.g. "email already in use") show under the email field */}
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
        aria-invalid={!!(errors.email || formError)}
        validation={errors.email || formError ? "error" : "default"}
        helperText={errors.email || formError}
      />

      <PasswordInput
        label="Create a Password"
        placeholder="Enter your password"
        labelIcon="fi fi-rr-lock"
        darkBg
        name="password"
        autoComplete="new-password"
        value={values.password}
        onChange={handleChange}
        disabled={isLoading}
        aria-invalid={!!errors.password}
        validation={errors.password ? "error" : "default"}
        helperText={errors.password}
      />

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Sign Up"}
      </Button>

      <SocialAuth disabled={isLoading} />
    </AuthForm>
  );
};

const Page = () => (
  <AuthLayout intro={intro}>
    <SignUpForm />
  </AuthLayout>
);

export default Page;
