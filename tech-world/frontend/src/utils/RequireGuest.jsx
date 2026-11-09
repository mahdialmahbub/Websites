"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetMyProfileQuery } from "@/redux";

/**
 * Wrap login/registration pages with this. If the customer is ALREADY
 * logged in, it redirects them away instead of showing the form again.
 *
 * Redirect target priority:
 *   1. ?redirect=<path> in the URL, if present (e.g. someone got bounced
 *      here by RequireAuth from a protected page, then logged in — or was
 *      already logged in the whole time and just landed on /login by mistake)
 *   2. "/" (home) otherwise
 *
 * USAGE:
 *   export default function LoginPage() {
 *     return (
 *       <RequireGuest>
 *         <LoginForm />
 *       </RequireGuest>
 *     );
 *   }
 */
export default function RequireGuest({ children }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const { isLoading, isFetching, isError } = useGetMyProfileQuery();
  const checking = isLoading || isFetching;
  const isAuthenticated = !isError && !checking;

  useEffect(() => {
    if (!checking && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [checking, isAuthenticated, redirectTo, router]);

  // While checking, or right before the redirect kicks in, don't flash the
  // login/registration form at someone who's already signed in.
  if (checking || isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-slate-500 text-sm">Checking your session...</p>
      </div>
    );
  }

  return children;
}
