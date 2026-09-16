"use client";

import Tag from "@/app/components/Tag";
import DeviceCard from "@/app/components/settings/DeviceCard";
import StatusDot from "@/app/components/settings/StatusDot";
import ChangePasswordModal from "@/app/components/settings/ChangePasswordModal";
import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  useGetMyProfileQuery,
  useToggleTwoFactorMutation,
  useGetMyDevicesQuery,
  useLogoutDeviceMutation,
} from "@/redux";
import Button from "@/app/components/Button";

// Backend only tells us a generic label ("Mobile Device" / "Tablet" /
// "Desktop / Laptop") — map that to the icon DeviceCard expects.
const mapDeviceType = (deviceModel) => {
  if (deviceModel === "Mobile Device") return "mobile";
  if (deviceModel === "Tablet") return "tablet";
  return "windows";
};

const Page = () => {
  const { data: profileData } = useGetMyProfileQuery();
  const profile = profileData?.data;

  const [toggleTwoFactor, { isLoading: togglingTwoFactor }] = useToggleTwoFactorMutation();

  const { data: devicesData } = useGetMyDevicesQuery();
  const devices = devicesData?.data || [];
  const [logoutDevice] = useLogoutDeviceMutation();

  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleSetTwoFactor = async (enabled) => {
    try {
      await toggleTwoFactor(enabled).unwrap();
      toast.success(enabled ? "Two-factor verification enabled" : "Two-factor verification disabled");
    } catch (err) {
      toast.error(err?.data?.message || "Could not update this setting.");
    }
  };

  const handleLogoutDevice = async (deviceId) => {
    try {
      await logoutDevice(deviceId).unwrap();
      toast.success("Device logged out");
    } catch (err) {
      toast.error(err?.data?.message || "Could not log out that device.");
    }
  };

  const isTwoFactor = !!profile?.isTwoFactorEnabled;

  return (
    <div className="space-y-space-9">
      {/* ============================= PASSWORD ============================= */}
      <div>
        <div className="flex items-center gap-space-3 mb-space-4">
          <StatusDot />
          <h2 className="font-primary font-semibold text-size-h6 text-placeholder_3 uppercase">Password</h2>
        </div>

        <div className="flex items-end gap-space-6">
          <div className="gap-space-3">
            <label className="font-primary font-semibold text-size-h6">Password</label>
            <div className="flex items-center gap-space-1 mt-space-3">
              {/*
                Always masked — there's no "reveal" here on purpose. Passwords
                are one-way hashed, so the real value is never retrievable by
                anyone, including the server itself. "Change Password" below
                is the only real action available for this field.
              */}
              <div className="flex items-center gap-space-3 p-3.5 rounded-lg bg-[#0C1221] border border-secondary/30 w-120">
                <i className="fi fi-sr-password-lock text-size-h6 text-[#2BE7C4]"></i>
                <input
                  type="password"
                  value="••••••••"
                  disabled
                  className="outline-none text-size-large bg-transparent w-full"
                />
              </div>

              <Button
                type="button"
                className="text-red ml-space-3 underline underline-offset-4"
                variant="text"
                onClick={() => setShowChangePassword(true)}
              >
                Change Password
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ======================= TWO FACTOR VERIFICATION ======================= */}
      <div>
        <div className="flex items-center gap-space-3 mb-space-4">
          <StatusDot />
          <h2 className="font-primary font-semibold text-size-h6 text-placeholder_3 uppercase">
            Two Factor Verification
          </h2>
        </div>

        <div className="flex items-center gap-space-6">
          <div className="flex items-center gap-space-1 bg-[#0C1221] border border-secondary/10 rounded-lg p-space-2 *:flex-1">
            <button
              type="button"
              aria-pressed={isTwoFactor}
              onClick={() => handleSetTwoFactor(true)}
              disabled={togglingTwoFactor}
              className={`flex items-center justify-center px-space-4 py-space-2 rounded-sm text-size-large font-medium transition-colors ${
                isTwoFactor ? "bg-secondary text-foreground" : "text-secondary"
              }`}
            >
              Enable
            </button>
            <button
              type="button"
              aria-pressed={!isTwoFactor}
              onClick={() => handleSetTwoFactor(false)}
              disabled={togglingTwoFactor}
              className={`flex items-center justify-center px-space-4 py-space-2 rounded-sm text-size-large font-medium transition-colors ${
                !isTwoFactor ? "bg-secondary text-foreground" : "text-secondary"
              }`}
            >
              Disable
            </button>
          </div>

          <p className="text-red text-size-h6 font-medium font-primary">
            {isTwoFactor
              ? "An OTP will be emailed to you every time you log in"
              : "Enable this to require an OTP every time you log in"}
          </p>
        </div>
      </div>

      {/* =========================== LOGGED IN DEVICES =========================== */}
      <div>
        <div className="flex items-center gap-space-3 mb-space-4">
          <StatusDot />
          <h2 className="font-primary font-semibold text-size-h6 text-placeholder_3 uppercase mr-space-1">
            Logged in Devices
          </h2>
          <Tag text={String(devices.length).padStart(2, "0")} />
        </div>

        <div className="space-y-space-4">
          {devices.length === 0 ? (
            <p className="text-sm text-placeholder_2">No active sessions found.</p>
          ) : (
            devices.map((d) => (
              <DeviceCard
                key={d._id}
                device={mapDeviceType(d.deviceModel)}
                model={d.deviceModel}
                location={d.location}
                isCurrent={d.isCurrentDevice}
                onLogout={() => handleLogoutDevice(d._id)}
              />
            ))
          )}
        </div>
      </div>

      {showChangePassword && (
        <ChangePasswordModal
          onClose={() => setShowChangePassword(false)}
          onSuccess={() => setShowChangePassword(false)}
        />
      )}
    </div>
  );
};

export default Page;
