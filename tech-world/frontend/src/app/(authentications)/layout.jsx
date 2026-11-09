import RequireGuest from "@/utils/RequireGuest";

export default function authLayout({ children }) {
  return <RequireGuest>{children}</RequireGuest>;
}
