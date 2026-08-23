"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useGetMyProfileQuery } from "@/redux";

/**
 * Wrap any page (or a whole route group's layout) with this to require a
 * logged-in customer. Not authenticated -> redirects to
 * /login?redirect=<currentPath>, so the login page can send them right back
 * here afterward (see the `redirectTo` logic already in the Login page).
 *
 * USAGE — protect one page directly:
 *   export default function CartPage() {
 *     return <RequireAuth><CartContent /></RequireAuth>;
 *   }
 *
 * USAGE — protect a whole group of pages at once (recommended, see README below):
 *   // app/(protected)/layout.jsx
 *   export default function ProtectedLayout({ children }) {
 *     return <RequireAuth>{children}</RequireAuth>;
 *   }
 */
export default function RequireAuth({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const { isLoading, isFetching, isError } = useGetMyProfileQuery();
  const checking = isLoading || isFetching;
  const isAuthenticated = !isError && !checking; // profile query only succeeds with a valid session

  useEffect(() => {
    if (!checking && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [checking, isAuthenticated, pathname, router]);

  // While checking, or right before the redirect kicks in, never render the
  // protected content — show a neutral loading state instead.
  if (checking || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-slate-500 text-sm">Checking your session...</p>
      </div>
    );
  }

  return children;
}
