const Admin = require("../models/Admin");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { generateAdminToken, setTokenCookie } = require("../utils/generateToken");

/**
 * POST /api/admin/auth/login
 * Admin accounts are provisioned via the seed script (src/utils/seed.js) or
 * directly by a super_admin — there is no public admin self-registration
 * form in the spec, which is the correct, secure default for a dashboard.
 */
const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email }).select("+password");
  if (!admin || !(await admin.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const token = generateAdminToken(admin._id);
  setTokenCookie(res, "admin_token", token, 24 * 60 * 60 * 1000);

  const safeAdmin = admin.toObject();
  delete safeAdmin.password;

  res.status(200).json(new ApiResponse(200, { token, admin: safeAdmin }, "Login successful."));
});

const adminLogout = asyncHandler(async (req, res) => {
  res.clearCookie("admin_token");
  res.status(200).json(new ApiResponse(200, null, "Logged out."));
});

const getMyAdminProfile = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, req.admin));
});

module.exports = { adminLogin, adminLogout, getMyAdminProfile };
