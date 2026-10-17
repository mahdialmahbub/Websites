"use client";

import AuthLayout from "@/app/components/auth/AuthLayout";
import OtpVerifyForm from "@/app/components/auth/OtpVerifyForm";
import { DEFAULT_REDIRECT, ROUTES } from "@/app/lib/auth";
import { useVerifyEmailMutation } from "@/store/api/authApi";
// TODO: adjust this path to your project
import { useRouter } from "next/navigation";
import { Suspense } from "react";

const intro = {
  title: "Verify Your Email to Get Started",
  description:
    "Enter the verification code sent to your email address to confirm your account and keep your resume secure. Once verified, you can continue building and managing your professional resume with confidence.",
};

const VerifyEmailForm = () => {
  const router = useRouter();
  const [verifyEmail] = useVerifyEmailMutation();

  return (
    <OtpVerifyForm
      title="Verify Your Email"
      action="verify your email and continue."
      submitLabel="Verify Email"
      purpose="verify_email"
      missingEmailRedirect={ROUTES.signUp}
      // A successful verification also logs the user in (cookie is set by the server)
      onVerify={(payload) => verifyEmail(payload).unwrap()}
      onSuccess={() => router.replace(DEFAULT_REDIRECT)}
    />
  );
};

const Page = () => (
  <AuthLayout intro={intro}>
    {/* useSearchParams needs a Suspense boundary in the App Router */}
    <Suspense fallback={null}>
      <VerifyEmailForm />
    </Suspense>
  </AuthLayout>
);

export default Page;
