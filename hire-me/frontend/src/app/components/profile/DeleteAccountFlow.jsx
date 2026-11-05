"use client";

import { useId, useState } from "react";
import { Button } from "../Button";
import ConfirmModal from "../ConfirmModal";
import Modal from "../Modal";
import { OTPField } from "../OTPField";
import { OTP_LENGTH, useCountdown } from "@/app/lib/auth";
import {
  useDeleteAccountMutation,
  useRequestDeleteAccountMutation,
} from "@/store/api/authApi";
import toast from "@/lib/toast";

const PROFILE_PATH = "/profile";
// Used only if the server does not tell us how long to wait (it normally sends resendAfterSeconds).
const FALLBACK_RESEND_SECONDS = 60;

const noop = () => {};

/** "johndoe@gmail.com" -> "jo*****@gmail.com" */
const maskEmail = (email = "") => {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const visible = local.slice(0, Math.min(2, local.length));
  const hidden = "*".repeat(Math.max(local.length - visible.length, 3));
  return `${visible}${hidden}@${domain}`;
};

const isSessionExpired = (err) =>
  err?.status === 401 || err?.code === "UNAUTHENTICATED";

const WARNINGS = [
  "This action is permanent and cannot be undone.",
  "You will lose access to your account and its associated data.",
  "Make sure to download or save any important information before proceeding.",
  "Your account will only be deleted after successful OTP verification.",
];

/**
 * Delete-account flow: confirm modal -> email OTP modal -> account deleted.
 *
 * Mount it only while the flow is active, so every state resets when it closes:
 *   {deleteOpen && <DeleteAccountFlow email={user.email} onClose={() => setDeleteOpen(false)} />}
 *
 * The backend is the only place the code is checked and the account removed:
 *   POST /auth/delete-account/request  -> emails the code (also used by "Resend")
 *   POST /auth/delete-account { otp }  -> verifies the code, deletes the account, ends the session
 */
export default function DeleteAccountFlow({ email, onClose }) {
  const labelId = useId();
  const [step, setStep] = useState("confirm"); // "confirm" | "otp"
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState({ email, expiresInMinutes: null });
  const [cooldown, setCooldown] = useCountdown();

  const [requestOtp, { isLoading: sending }] =
    useRequestDeleteAccountMutation();
  const [deleteAccount, { isLoading: deleting }] = useDeleteAccountMutation();

  const handleClose = () => {
    if (deleting) return;
    onClose();
  };

  const redirectToLogin = () => {
    toast.error("Your session has expired. Please log in again.");
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign(`/login?next=${encodeURIComponent(PROFILE_PATH)}`);
  };

  /** Step 1 (first send) and "Resend OTP". The countdown restarts only when the request succeeds. */
  const sendOtp = async ({ resend = false } = {}) => {
    if (sending || deleting) return;
    if (resend && cooldown > 0) return;
    setError("");

    try {
      const result = await requestOtp().unwrap();
      setSent({
        email: result?.email ?? email,
        expiresInMinutes: result?.expiresInMinutes ?? null,
      });
      setCooldown(result?.resendAfterSeconds ?? FALLBACK_RESEND_SECONDS);
      setOtp("");

      if (resend) {
        toast.success("A new code was sent to your email.");
      } else {
        setStep("otp");
      }
    } catch (err) {
      if (isSessionExpired(err)) return redirectToLogin();
      // The server's own resend limit: follow its remaining time instead of guessing.
      if (err?.retryAfterSeconds) setCooldown(err.retryAfterSeconds);
      setError(err?.message ?? "Could not send the code. Please try again.");
    }
  };

  /** Step 2: the backend verifies the code and deletes the account. */
  const handleDelete = async (event) => {
    event.preventDefault();
    if (deleting) return;

    if (otp.length !== OTP_LENGTH) {
      setError(`Enter the ${OTP_LENGTH}-digit code we emailed you.`);
      return;
    }
    setError("");

    try {
      await deleteAccount({ otp }).unwrap();
      toast.success("Your account has been deleted.");
      // Full page navigation on purpose (same as logout): it wipes the whole
      // Redux / RTK Query cache and avoids the "401 -> /login?next=/profile" redirect race.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/");
    } catch (err) {
      if (isSessionExpired(err)) return redirectToLogin();
      // Wrong / expired code: stay open so the user can try again or resend.
      setError(
        err?.message ?? "Could not delete your account. Please try again.",
      );
    }
  };

  const resendLabel = sending
    ? "Sending..."
    : cooldown > 0
      ? `Resend OTP in ${cooldown}s`
      : "Resend OTP";

  return (
    <>
      {/* 1) Confirmation */}
      <ConfirmModal
        open={step === "confirm"}
        title="Are you sure you want to delete your account?"
        message="We will send a One-Time Password (OTP) to your registered email address to verify your identity. Once you enter the correct OTP and confirm the deletion, your account and associated data will be permanently deleted."
        confirmText="Send OTP"
        isLoading={sending}
        error={error}
        onConfirm={() => sendOtp()}
        onClose={handleClose}
      >
        <ul className="mb-5 space-y-2 rounded-md bg-red-500/5 p-3 text-small text-red-600">
          {WARNINGS.map((text) => (
            <li key={text} className="flex items-start gap-2">
              <i
                className="fi fi-rr-triangle-warning mt-0.5 shrink-0"
                aria-hidden="true"
              />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </ConfirmModal>

      {/* 2) OTP verification */}
      <Modal
        open={step === "otp"}
        title="Verify Your Email Address"
        onClose={deleting ? noop : handleClose}
        className="max-w-lg"
      >
        <form onSubmit={handleDelete} noValidate className="space-y-5">
          <div className="space-y-2">
            <p className="text-small text-neutral-500">
              Code sent to{" "}
              <span className="font-medium break-all text-neutral-700">
                {maskEmail(sent.email)}
              </span>
              {sent.expiresInMinutes
                ? `. It expires in ${sent.expiresInMinutes} minutes.`
                : "."}
            </p>
          </div>

            <div className="flex justify-center mt-9">
              <OTPField
                size="fluid"
                className="w-full max-w-88"
                length={OTP_LENGTH}
                value={otp}
                onChange={(value) => {
                  setOtp(value);
                  if (error) setError("");
                }}
                validation={error ? "error" : "default"}
                disabled={deleting}
                autoFocus
                aria-label="Verification code"
              />
            </div>

          {error && (
            <p
              role="alert"
              className="rounded-md bg-red-500/5 p-3 text-small text-red-600"
            >
              {error}
            </p>
          )}

          <div className="flex items-center justify-center gap-1 text-small text-neutral-500">
            <span>Didn&apos;t get the code?</span>
            <button
              type="button"
              onClick={() => sendOtp({ resend: true })}
              disabled={sending || deleting || cooldown > 0}
              className="rounded px-1 py-1 font-medium text-violet-500 transition-colors hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40 disabled:cursor-not-allowed disabled:text-neutral-400"
            >
              {resendLabel}
            </button>
          </div>

          <div className="flex items-center gap-space-4 *:flex-1">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={deleting}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete Account
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
