"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/app/components/Breadcrumb";
import Button from "@/app/components/Button";
import EditProfileModal from "@/app/components/settings/EditProfileModal";
import {
  useLogoutMutation,
  useRequestDeleteAccountMutation,
  useConfirmDeleteAccountMutation,
} from "@/redux";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import ConfirmModal from "@/app/components/ConfiremationModal";

const settingsLink = [
  { name: "Profile", href: "/settings/profile" },
  { name: "Security", href: "/settings/security" },
  { name: "Legal & Policy", href: "/settings/legal&policy" },
  { name: "Help & Support", href: "/settings/help&support" },
];

const SettingsLayout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteOtp, setShowDeleteOtp] = useState(false);
  const [deleteOtp, setDeleteOtp] = useState("");

  const [logout, { isLoading: loggingOut }] = useLogoutMutation();
  const [requestDeleteAccount, { isLoading: sendingDeleteOtp }] = useRequestDeleteAccountMutation();
  const [confirmDeleteAccount, { isLoading: deletingAccount }] = useConfirmDeleteAccountMutation();

  const handleConfirmLogout = async () => {
    await logout();
    setShowLogoutConfirm(false);
    router.push("/login");
  };

  // Step 1 of account deletion: confirm intent -> send OTP
  const handleConfirmDeleteIntent = async () => {
    try {
      await requestDeleteAccount().unwrap();
      setShowDeleteConfirm(false);
      setShowDeleteOtp(true);
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong.");
      setShowDeleteConfirm(false);
    }
  };

  // Step 2: verify OTP -> account actually gets deleted
  const handleConfirmDeleteOtp = async () => {
    try {
      await confirmDeleteAccount(deleteOtp).unwrap();
      toast.success("Your account has been deleted.");
      router.push("/");
    } catch (err) {
      toast.error(err?.data?.message || "Invalid OTP.");
    }
  };

  return (
    <section className="mx-auto w-[80%]">
      <div className=" bg-[#1A1E3D]/50 rounded-2xl space-y-space-8 p-space-7">
        <div className="flex justify-between">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Settings" }]} />
          <div className="flex items-center gap-space-8">
            <Button onClick={() => setShowEditProfile(true)}>Edit Profile</Button>
            <Button variant="text" className="text-red" onClick={() => setShowLogoutConfirm(true)}>
              Logout
            </Button>
            <Button variant="text" className="text-red" onClick={() => setShowDeleteConfirm(true)}>
              Delete Account
            </Button>
          </div>
        </div>

        <div>
          <h1 className="font-semibold text-[20px] mb-space-4 text-placeholder_3">Settings</h1>
          <div className="flex p-space-2 gap-space-4 rounded-xl bg-[#0C1221]">
            {settingsLink.map((item) => (
              <Link
                href={item.href}
                key={item.href}
                className={`text-size-h5 font-semibold py-space-2 px-5.5 rounded-lg ${
                  pathname === item.href ? "bg-primary/60 text-[#EAECF2]" : "bg-primary/10 text-primary/80"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        {children}
      </div>

      {showEditProfile && <EditProfileModal onClose={() => setShowEditProfile(false)} />}

      {showLogoutConfirm && (
        <ConfirmModal
          title="Log out?"
          message="You'll need to log in again to access your account."
          confirmText="Logout"
          isLoading={loggingOut}
          onConfirm={handleConfirmLogout}
          onClose={() => setShowLogoutConfirm(false)}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmModal
          title="Delete your account?"
          message="This is permanent and can't be undone. We'll first send a verification code to your email."
          confirmText="Send OTP"
          isLoading={sendingDeleteOtp}
          onConfirm={handleConfirmDeleteIntent}
          onClose={() => setShowDeleteConfirm(false)}
        />
      )}

      {showDeleteOtp && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-105 bg-background border-2 border-secondary rounded-2xl p-space-7 space-y-space-6">
            <div className="flex items-center gap-space-3">
              <i className="fi fi-rr-password-lock text-red text-size-h3"></i>
              <h2 className="font-semibold text-size-h4">Confirm account deletion</h2>
            </div>
            <p className="text-sm text-placeholder_2">
              Enter the OTP we sent to your email to permanently delete your account.
            </p>
            <input
              value={deleteOtp}
              onChange={(e) => setDeleteOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full rounded-lg border border-white/10 bg-[#0d0f16] px-3 py-2 text-sm"
            />
            <div className="flex gap-space-4">
              <button
                type="button"
                onClick={() => setShowDeleteOtp(false)}
                className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteOtp}
                disabled={deletingAccount}
                className="flex-1 rounded-lg bg-red py-2.5 text-sm font-medium text-white disabled:opacity-50"
              >
                {deletingAccount ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SettingsLayout;
