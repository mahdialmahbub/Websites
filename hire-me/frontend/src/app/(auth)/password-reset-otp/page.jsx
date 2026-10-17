"use client";

import AuthLayout from "@/app/components/auth/AuthLayout";
import OtpVerifyForm from "@/app/components/auth/OtpVerifyForm";
import { ROUTES } from "@/app/lib/auth";
import { useVerifyResetOtpMutation } from "@/store/api/authApi";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const intro = {
  title: "Verify Your Identity to Reset Your Password",
  description:
    "Enter the verification code sent to your email to securely confirm your identity. After verification, you’ll be able to create a new password and regain access to your account.",
};

const VerifyResetOtpForm = () => {
  const router = useRouter();
  const next = useSearchParams().get("next"); // set when started from the profile page
  const [verifyResetOtp] = useVerifyResetOtpMutation();

  return (
    <OtpVerifyForm
      title="Verify Your OTP"
      action="verify your identity and reset your password."
      submitLabel="Verify Code"
      purpose="reset_password"
      missingEmailRedirect={ROUTES.forgotPassword}
      onVerify={(payload) => verifyResetOtp(payload).unwrap()}
      onSuccess={() =>
        router.replace(
          next
            ? `${ROUTES.resetPassword}?next=${encodeURIComponent(next)}`
            : ROUTES.resetPassword,
        )
      }
    />
  );
};

const Page = () => (
  <AuthLayout intro={intro}>
    {/* useSearchParams needs a Suspense boundary in the App Router */}
    <Suspense fallback={null}>
      <VerifyResetOtpForm />
    </Suspense>
  </AuthLayout>
);

export default Page;
