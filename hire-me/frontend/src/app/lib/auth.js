import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetMeQuery } from "@/store/api/authApi";

/* -------------------------------------------------------------------------- */
/*  Config                                                                    */
/* -------------------------------------------------------------------------- */

export const ROUTES = {
  login: "/login",
  signUp: "/sign-up",
  verifyEmail: "/email-verify",
  forgotPassword: "/forgot-password",
  verifyResetOtp: "/password-reset-otp",
  resetPassword: "/reset-password",
};

/** Where to go after a successful login / email verification. */
export const DEFAULT_REDIRECT = "/";

/** Must match what the backend sends. */
export const OTP_LENGTH = 6;
export const RESEND_COOLDOWN_SECONDS = 60;
export const PASSWORD_MIN_LENGTH = 8;

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

export const normalizeEmail = (email = "") => email.trim().toLowerCase();

export const withEmail = (path, email) =>
  `${path}?email=${encodeURIComponent(email)}`;

/** Only allow same-site relative paths (blocks open redirects like //evil.com). */
export const getSafeRedirect = (next) =>
  next && /^\/(?![\\/])/.test(next) ? next : DEFAULT_REDIRECT;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validators = {
  name: (value = "") => {
    const v = value.trim();
    if (!v) return "Enter your name";
    if (v.length < 2) return "Name must be at least 2 characters";
    return null;
  },
  email: (value = "") => {
    const v = value.trim();
    if (!v) return "Enter your email address";
    if (!EMAIL_RE.test(v)) return "Enter a valid email address";
    return null;
  },
  /** Used on sign-up / reset only. On login just check it is not empty. */
  newPassword: (value = "") => {
    if (!value) return "Enter a password";
    if (value.length < PASSWORD_MIN_LENGTH)
      return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
    return null;
  },
  confirmPassword: (value = "", password = "") => {
    if (!value) return "Confirm your password";
    if (value !== password) return "Passwords do not match";
    return null;
  },
  otp: (value = "") =>
    new RegExp(`^\\d{${OTP_LENGTH}}$`).test(value)
      ? null
      : `Enter the ${OTP_LENGTH}-digit code`,
};

/** Keeps only the rules that failed: { email: "msg" }. */
export const collectErrors = (rules) =>
  Object.fromEntries(Object.entries(rules).filter(([, msg]) => msg));

/** { "personalInformation.email": ["msg"] } -> { email: "msg" } */
const toFieldErrors = (fieldErrors) =>
  Object.fromEntries(
    Object.entries(fieldErrors ?? {}).map(([key, msgs]) => [
      key.split(".").pop(),
      Array.isArray(msgs) ? msgs[0] : msgs,
    ]),
  );

/* -------------------------------------------------------------------------- */
/*  Hooks                                                                     */
/* -------------------------------------------------------------------------- */

/** Values + field errors + form-level error, shared by every auth form. */
export function useAuthForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  const setField = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
    setFormError("");
  }, []);

  const handleChange = useCallback(
    (e) => setField(e.target.name, e.target.value),
    [setField],
  );

  /** Takes the ApiError thrown by `.unwrap()` and shows it in the right place. */
  const applyApiError = useCallback((error) => {
    const fields = toFieldErrors(error?.fieldErrors);
    if (Object.keys(fields).length) setErrors(fields);
    else
      setFormError(error?.message ?? "Something went wrong. Please try again.");
  }, []);

  return {
    values,
    errors,
    formError,
    setErrors,
    setFormError,
    setField,
    handleChange,
    applyApiError,
  };
}

/** Counts down once per second. Returns [secondsLeft, start(seconds)]. */
export function useCountdown() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  return [seconds, setSeconds];
}

/** Login / sign-up pages: if a session already exists, leave. */
export function useRedirectIfAuthenticated(target = DEFAULT_REDIRECT) {
  const router = useRouter();
  const { data: user } = useGetMeQuery();

  useEffect(() => {
    if (user) router.replace(target);
  }, [user, target, router]);
}
