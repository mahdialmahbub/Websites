const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");
const Device = require("../models/Device");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { createOtp, verifyOtp } = require("../services/otpService");
const { sendEmail, otpEmailTemplate } = require("../utils/sendEmail");
const {
  generateCustomerToken,
  setTokenCookie,
} = require("../utils/generateToken");
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
    ? {
        url: `${process.env.UPLOAD_BASE_URL}/customers/${req.file.filename}`,
        publicPath: req.file.path,
      }
    : undefined;

  let customer;
  if (existing) {
    // Re-registration attempt before verifying — update details & resend OTP
    Object.assign(existing, {
      name,
      password,
      phone,
      dateOfBirth,
      gender,
      address,
      image,
    });
    customer = await existing.save();
  } else {
    customer = await Customer.create({
      name,
      email,
      password,
      phone,
      dateOfBirth,
      gender,
      address,
      image,
    });
  }

  const otp = await createOtp({
    identifier: email,
    purpose: "EMAIL_VERIFICATION",
  });
  await sendEmail({
    to: email,
    subject: "Verify your TechWorld Store account",
    html: otpEmailTemplate(otp, "verify your email address"),
  });

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { customerId: customer._id, email },
        "OTP sent to your email for verification.",
      ),
    );
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

  await verifyOtp({
    identifier: email,
    purpose: "EMAIL_VERIFICATION",
    code: otp,
  });

  const customer = await Customer.findOneAndUpdate(
    { email },
    { isEmailVerified: true },
    { new: true },
  );
  if (!customer) throw new ApiError(404, "Customer not found.");

  await issueSessionAndRespond(req, res, customer);
});

/**
 * Resend registration OTP (e.g. user didn't receive it in time)
 * POST /api/auth/resend-otp
 */
const resendOtp = asyncHandler(async (req, res) => {
  const { email, purpose } = req.body; // purpose: "EMAIL_VERIFICATION" | "LOGIN_2FA" | "FORGOT_PASSWORD"
  const otp = await createOtp({ identifier: email, purpose });
  await sendEmail({
    to: email,
    subject: "Your TechWorld Store verification code",
    html: otpEmailTemplate(otp, "continue"),
  });
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
      .json(
        new ApiResponse(
          200,
          { twoFactorRequired: true, email },
          "OTP sent to your email.",
        ),
      );
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

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { token, customer: safeCustomer },
        "Login successful.",
      ),
    );
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

/* -------------------------------------------------------------------------- */
/*                          FORGOT PASSWORD — 3 STEPS                         */
/* -------------------------------------------------------------------------- */

/**
 * STEP 1 — Customer clicks "Forgot Password" and submits their email.
 * We send an OTP to that email (purpose: FORGOT_PASSWORD).
 * POST /api/auth/forgot-password
 * body: { email }
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, "Email is required.");

  const customer = await Customer.findOne({ email });
  // NOTE: we intentionally return the SAME success message whether or not the
  // email exists, so the endpoint can't be used to enumerate registered emails.
  if (!customer || !customer.isEmailVerified) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "If an account exists for this email, an OTP has been sent.",
        ),
      );
  }

  const otp = await createOtp({
    identifier: email,
    purpose: "FORGOT_PASSWORD",
  });
  await sendEmail({
    to: email,
    subject: "Reset your TechWorld Store password",
    html: otpEmailTemplate(otp, "reset your password"),
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { email },
        "If an account exists for this email, an OTP has been sent.",
      ),
    );
});

/**
 * STEP 2 — Customer submits the OTP they received.
 * On success we DON'T log them in — instead we issue a short-lived, single
 * purpose "resetToken" (JWT) that the client must send back with the new
 * password. This stops someone from skipping the OTP step and calling
 * reset-password directly with just an email.
 * POST /api/auth/verify-forgot-password-otp
 * body: { email, otp }
 */
const verifyForgotPasswordOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  await verifyOtp({ identifier: email, purpose: "FORGOT_PASSWORD", code: otp });

  const customer = await Customer.findOne({ email });
  if (!customer) throw new ApiError(404, "Customer not found.");

  const resetToken = jwt.sign(
    {
      customerId: customer._id,
      email: customer.email,
      purpose: "FORGOT_PASSWORD",
    },
    process.env.RESET_PASSWORD_TOKEN_SECRET, // add this to your .env
    { expiresIn: "10m" },
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { resetToken },
        "OTP verified. You can now set a new password.",
      ),
    );
});

/**
 * STEP 3 — Customer submits new password + confirmPassword + resetToken
 * (resetToken comes from STEP 2's response, kept in memory/state on the
 * frontend — do NOT store it in localStorage).
 * POST /api/auth/reset-password
 * body: { resetToken, newPassword, confirmPassword }
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken, newPassword, confirmPassword } = req.body;

  if (!resetToken) throw new ApiError(400, "Reset token is missing.");
  if (!newPassword || newPassword.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters long.");
  }
  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "Passwords do not match.");
  }

  let payload;
  try {
    payload = jwt.verify(resetToken, process.env.RESET_PASSWORD_TOKEN_SECRET);
  } catch (err) {
    throw new ApiError(
      401,
      "Reset link has expired or is invalid. Please request a new OTP.",
    );
  }
  if (payload.purpose !== "FORGOT_PASSWORD") {
    throw new ApiError(401, "Invalid reset token.");
  }

  const customer = await Customer.findById(payload.customerId).select(
    "+password",
  );
  if (!customer) throw new ApiError(404, "Customer not found.");

  // Assumes Customer model hashes `password` in a pre("save") hook, same as
  // during registration — do NOT hash it manually here or it'll double-hash.
  customer.password = newPassword;
  await customer.save();

  // Invalidate every OLD session/device — the password just changed, so any
  // previously issued token should no longer be trusted.
  await Device.deleteMany({ customer: customer._id });

  // Log the customer straight in on THIS device/session — no 2FA OTP here,
  // even if isTwoFactorEnabled is true. They already proved it's really them
  // by verifying the FORGOT_PASSWORD email OTP two steps ago; asking for a
  // second OTP right now would be redundant, not extra security.
  await issueSessionAndRespond(req, res, customer);
});

module.exports = {
  register,
  verifyRegistrationOtp,
  resendOtp,
  login,
  verifyLoginOtp,
  logout,
  forgotPassword,
  verifyForgotPasswordOtp,
  resetPassword,
};
