const crypto = require("crypto");

// Generates a numeric OTP of configured length, e.g. "482913"
const generateNumericOtp = () => {
  const length = Number(process.env.OTP_LENGTH) || 6;
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return String(crypto.randomInt(min, max));
};

// We never store the raw OTP in the DB — only a SHA-256 hash of it.
// This way, even if the database is leaked, OTPs can't be reused.
const hashOtp = (otp) => crypto.createHash("sha256").update(otp).digest("hex");

module.exports = { generateNumericOtp, hashOtp };
