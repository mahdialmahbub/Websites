const Customer = require("../models/Customer");
const Device = require("../models/Device");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { createOtp, verifyOtp } = require("../services/otpService");
const { sendEmail, otpEmailTemplate } = require("../utils/sendEmail");
const { generateCustomerToken, setTokenCookie } = require("../utils/generateToken");
const parseJsonField = require("../utils/parseJsonField");

// Parses a simple device label out of the User-Agent header (kept dependency-free;
// swap for the `ua-parser-js` package if you want richer device detection).
const parseDeviceModel = (userAgent = "") => {
  if (/mobile/i.test(userAgent)) return "Mobile Device";
  if (/tablet/i.test(userAgent)) return "Tablet";
  return "Desktop / Laptop";
};

/**
 * STEP 1 — Registration: create the (unverified) customer and send an email OTP.
 * POST /api/auth/register
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, dateOfBirth, gender } = req.body;
  // multipart/form-data sends the nested `address` object as a JSON string — parse it back
  const address = parseJsonField(req.body.address, undefined);

  const existing = await Customer.findOne({ email });
  if (existing && existing.isEmailVerified) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  // Image uploaded via multer (field name: "image") — optional at registration
  const image = req.file
    ? { url: `${process.env.UPLOAD_BASE_URL}/customers/${req.file.filename}`, publicPath: req.file.path }
    : undefined;

  let customer;
  if (existing) {
    // Re-registration attempt before verifying — update details & resend OTP
    Object.assign(existing, { name, password, phone, dateOfBirth, gender, address, image });
    customer = await existing.save();
  } else {
    customer = await Customer.create({ name, email, password, phone, dateOfBirth, gender, address, image });
  }

  const otp = await createOtp({ identifier: email, purpose: "EMAIL_VERIFICATION" });
  await sendEmail({
    to: email,
    subject: "Verify your TechWorld Store account",
    html: otpEmailTemplate(otp, "verify your email address"),
  });

  res
    .status(201)
    .json(new ApiResponse(201, { customerId: customer._id, email }, "OTP sent to your email for verification."));
});

/**
 * STEP 2 — Verify the email OTP to activate the account.
 * POST /api/auth/verify-registration-otp
 *
 * Also logs the customer in immediately (sets the session cookie) so any
 * onboarding steps right after this — like collecting phone number or
 * address — are already authenticated, with no separate login step needed.
 */
const verifyRegistrationOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  await verifyOtp({ identifier: email, purpose: "EMAIL_VERIFICATION", code: otp });

  const customer = await Customer.findOneAndUpdate(
    { email },
    { isEmailVerified: true },
    { new: true }
  );
  if (!customer) throw new ApiError(404, "Customer not found.");

  await issueSessionAndRespond(req, res, customer);
});

/**
 * Resend registration OTP (e.g. user didn't receive it in time)
 * POST /api/auth/resend-otp
 */
const resendOtp = asyncHandler(async (req, res) => {
  const { email, purpose } = req.body; // purpose: "EMAIL_VERIFICATION" | "LOGIN_2FA"
  const otp = await createOtp({ identifier: email, purpose });
  await sendEmail({ to: email, subject: "Your TechWorld Store verification code", html: otpEmailTemplate(otp, "continue") });
  res.status(200).json(new ApiResponse(200, null, "OTP resent."));
});

/**
 * STEP 1 — Login with email + password.
 * If 2FA is disabled -> logs in immediately.
 * If 2FA is enabled -> sends an OTP and expects a follow-up verify call.
 * POST /api/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const customer = await Customer.findOne({ email }).select("+password");
  if (!customer || !(await customer.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password.");
  }
  if (!customer.isEmailVerified) {
    throw new ApiError(403, "Please verify your email before logging in.");
  }

  if (customer.isTwoFactorEnabled) {
    const otp = await createOtp({ identifier: email, purpose: "LOGIN_2FA" });
    await sendEmail({
      to: email,
      subject: "Your login verification code",
      html: otpEmailTemplate(otp, "complete your login"),
    });
    return res
      .status(200)
      .json(new ApiResponse(200, { twoFactorRequired: true, email }, "OTP sent to your email."));
  }

  await issueSessionAndRespond(req, res, customer);
});

/**
 * STEP 2 — Verify login OTP when 2FA is enabled.
 * POST /api/auth/verify-login-otp
 */
const verifyLoginOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  await verifyOtp({ identifier: email, purpose: "LOGIN_2FA", code: otp });

  const customer = await Customer.findOne({ email });
  if (!customer) throw new ApiError(404, "Customer not found.");

  await issueSessionAndRespond(req, res, customer);
});

// Shared: creates JWT + device record, sets cookie, sends the response
const issueSessionAndRespond = async (req, res, customer) => {
  const { token, jti } = generateCustomerToken(customer._id);
  setTokenCookie(res, "customer_token", token, 7 * 24 * 60 * 60 * 1000);

  await Device.create({
    customer: customer._id,
    jti,
    deviceModel: parseDeviceModel(req.headers["user-agent"]),
    location: req.headers["x-geo-location"] || "Unknown Location", // plug a GeoIP service in production
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  const safeCustomer = customer.toObject();
  delete safeCustomer.password;

  res.status(200).json(new ApiResponse(200, { token, customer: safeCustomer }, "Login successful."));
};

/**
 * Logout — clears the cookie and removes this session's device record.
 * POST /api/auth/logout
 */
const logout = asyncHandler(async (req, res) => {
  if (req.tokenId) {
    await Device.deleteOne({ jti: req.tokenId });
  }
  res.clearCookie("customer_token");
  res.status(200).json(new ApiResponse(200, null, "Logged out successfully."));
});

module.exports = { register, verifyRegistrationOtp, resendOtp, login, verifyLoginOtp, logout };
