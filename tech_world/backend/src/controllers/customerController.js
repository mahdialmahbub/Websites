const Customer = require("../models/Customer");
const Device = require("../models/Device");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { createOtp, verifyOtp } = require("../services/otpService");
const { sendEmail, otpEmailTemplate } = require("../utils/sendEmail");
const parseJsonField = require("../utils/parseJsonField");

// ---------- Profile ----------

const getMyProfile = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, req.customer, "Profile fetched."));
});

const updateMyProfile = asyncHandler(async (req, res) => {
  const allowedFields = ["name", "phone", "dateOfBirth", "gender", "isNotificationEnabled", "notificationChannel"];
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  // `address` is a nested object — multipart/form-data sends it as a JSON string
  if (req.body.address !== undefined) {
    updates.address = parseJsonField(req.body.address, undefined);
  }

  if (req.file) {
    updates.image = {
      url: `${process.env.UPLOAD_BASE_URL}/customers/${req.file.filename}`,
      publicPath: req.file.path,
    };
  }

  const customer = await Customer.findByIdAndUpdate(req.customer._id, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(new ApiResponse(200, customer, "Profile updated."));
});

// ---------- Delete Account (OTP protected) ----------

const requestDeleteAccount = asyncHandler(async (req, res) => {
  const otp = await createOtp({ identifier: req.customer.email, purpose: "DELETE_ACCOUNT" });
  await sendEmail({
    to: req.customer.email,
    subject: "Confirm account deletion",
    html: otpEmailTemplate(otp, "permanently delete your account"),
  });
  res.status(200).json(new ApiResponse(200, null, "OTP sent to your email to confirm account deletion."));
});

const confirmDeleteAccount = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  await verifyOtp({ identifier: req.customer.email, purpose: "DELETE_ACCOUNT", code: otp });

  await Customer.findByIdAndDelete(req.customer._id);
  await Device.deleteMany({ customer: req.customer._id });

  res.clearCookie("customer_token");
  res.status(200).json(new ApiResponse(200, null, "Account permanently deleted."));
});

// ---------- Change Password (OTP protected) ----------

const requestChangePassword = asyncHandler(async (req, res) => {
  const otp = await createOtp({ identifier: req.customer.email, purpose: "CHANGE_PASSWORD" });
  await sendEmail({
    to: req.customer.email,
    subject: "Change password verification",
    html: otpEmailTemplate(otp, "change your password"),
  });
  res.status(200).json(new ApiResponse(200, null, "OTP sent to your email."));
});

const confirmChangePassword = asyncHandler(async (req, res) => {
  const { otp, newPassword } = req.body;
  await verifyOtp({ identifier: req.customer.email, purpose: "CHANGE_PASSWORD", code: otp });

  const customer = await Customer.findById(req.customer._id);
  customer.password = newPassword; // pre-save hook re-hashes
  await customer.save();

  res.status(200).json(new ApiResponse(200, null, "Password changed successfully."));
});

// ---------- Two-Factor Verification ----------

const toggleTwoFactor = asyncHandler(async (req, res) => {
  const { enabled } = req.body;
  const customer = await Customer.findByIdAndUpdate(
    req.customer._id,
    { isTwoFactorEnabled: !!enabled },
    { new: true }
  );
  res
    .status(200)
    .json(new ApiResponse(200, { isTwoFactorEnabled: customer.isTwoFactorEnabled }, "Two-factor setting updated."));
});

// ---------- Logged-in Devices ----------

const getMyDevices = asyncHandler(async (req, res) => {
  const devices = await Device.find({ customer: req.customer._id }).sort({ lastActiveAt: -1 });
  const withCurrentFlag = devices.map((d) => ({
    ...d.toObject(),
    isCurrentDevice: d.jti === req.tokenId,
  }));
  res.status(200).json(new ApiResponse(200, withCurrentFlag, "Devices fetched."));
});

const logoutDevice = asyncHandler(async (req, res) => {
  const { deviceId } = req.params;
  const device = await Device.findOne({ _id: deviceId, customer: req.customer._id });
  if (!device) throw new ApiError(404, "Device not found.");
  if (device.jti === req.tokenId) {
    throw new ApiError(400, "You can't remotely log out your current device. Use Logout instead.");
  }
  await device.deleteOne();
  res.status(200).json(new ApiResponse(200, null, "Device logged out."));
});

// ---------- Settings Search ----------

// Static searchable index of every Settings/Security option shown in the UI
const SETTINGS_INDEX = [
  { key: "edit-profile", title: "Edit Profile", section: "Account Management", keywords: "edit profile name phone update" },
  { key: "logout", title: "Logout", section: "Account Management", keywords: "logout sign out" },
  { key: "delete-account", title: "Delete Account", section: "Account Management", keywords: "delete remove close account" },
  { key: "password", title: "Change Password", section: "Password", keywords: "password change reset security" },
  { key: "two-factor", title: "Two-Factor Verification", section: "Two-Factor Verification", keywords: "2fa two factor otp login security" },
  { key: "devices", title: "Logged-in Devices", section: "Logged-in Devices", keywords: "devices sessions logout device location" },
];

const searchSettings = asyncHandler(async (req, res) => {
  const q = (req.query.q || "").toLowerCase().trim();
  const results = q
    ? SETTINGS_INDEX.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.section.toLowerCase().includes(q) ||
          item.keywords.includes(q)
      )
    : SETTINGS_INDEX;

  res.status(200).json(new ApiResponse(200, results, "Search results."));
});

module.exports = {
  getMyProfile,
  updateMyProfile,
  requestDeleteAccount,
  confirmDeleteAccount,
  requestChangePassword,
  confirmChangePassword,
  toggleTwoFactor,
  getMyDevices,
  logoutDevice,
  searchSettings,
};
