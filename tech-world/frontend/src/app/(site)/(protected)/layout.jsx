import RequireAuth from "@/utils/RequireAuth";

export default function ProtectedLayout({ children }) {
  return <RequireAuth>{children}</RequireAuth>;
}
