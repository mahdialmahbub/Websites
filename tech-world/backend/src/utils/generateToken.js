const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

// jti (JWT ID) uniquely identifies this login session/device, so we can later
// show "Logged-in Devices" and know which one is the "current device".
const generateCustomerToken = (customerId, jti = uuidv4()) => {
  const token = jwt.sign({ id: customerId, role: "customer", jti }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
  return { token, jti };
};

const generateAdminToken = (adminId) => {
  return jwt.sign({ id: adminId, role: "admin" }, process.env.ADMIN_JWT_SECRET, {
    expiresIn: process.env.ADMIN_JWT_EXPIRES_IN || "1d",
  });
};

// Sets the JWT as an httpOnly cookie (professional practice: avoids XSS token theft vs localStorage)
const setTokenCookie = (res, cookieName, token, maxAgeMs) => {
  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: maxAgeMs,
  });
};

module.exports = { generateCustomerToken, generateAdminToken, setTokenCookie };
