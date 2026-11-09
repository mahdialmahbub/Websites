"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetMyAdminProfileQuery } from "@/redux";

/**
 * Wrap /dashboard (and any other admin-only page) with this. Not logged in
 * as an admin -> redirects to /admin/login.
 *
 * USAGE — protect the whole dashboard at once (recommended):
 *   // app/dashboard/layout.jsx
 *   export default function DashboardLayout({ children }) {
 *     return (
 *       <RequireAdminAuth>
 *         <Navbar isDashboard />
 *         {children}
 *       </RequireAdminAuth>
 *     );
 *   }
 */
export default function RequireAdminAuth({ children }) {
  const router = useRouter();

  const { isLoading, isFetching, isError } = useGetMyAdminProfileQuery();
  const checking = isLoading || isFetching;
  const isAdminAuthenticated = !isError && !checking;

  useEffect(() => {
    if (!checking && !isAdminAuthenticated) {
      router.push("/admin/login");
    }
  }, [checking, isAdminAuthenticated, router]);

  if (checking || !isAdminAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-500 text-sm">Checking admin session...</p>
      </div>
    );
  }

  return children;
}
