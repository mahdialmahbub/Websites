const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const Customer = require("../models/Customer");
const Admin = require("../models/Admin");

// Extracts a bearer token from the Authorization header, falling back to the httpOnly cookie
const extractToken = (req, cookieName) => {
  if (req.headers.authorization?.startsWith("Bearer ")) {
    return req.headers.authorization.split(" ")[1];
  }
  return req.cookies?.[cookieName];
};

const protectCustomer = asyncHandler(async (req, res, next) => {
  const token = extractToken(req, "customer_token");
  if (!token) throw new ApiError(401, "Not authorized. Please log in.");

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const customer = await Customer.findById(decoded.id).select("-password");
  if (!customer) throw new ApiError(401, "Customer account not found.");

  req.customer = customer;
  req.tokenId = decoded.jti; // used to identify "current device" in logged-in devices list
  next();
});

const protectAdmin = asyncHandler(async (req, res, next) => {
  const token = extractToken(req, "admin_token");
  if (!token) throw new ApiError(401, "Admin not authorized. Please log in.");

  const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
  const admin = await Admin.findById(decoded.id).select("-password");
  if (!admin) throw new ApiError(401, "Admin account not found.");

  req.admin = admin;
  next();
});

module.exports = { protectCustomer, protectAdmin };
