const Brand = require("../models/Brand");
const Category = require("../models/Category");
const Badge = require("../models/Badge");
const Discount = require("../models/Discount");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

// ---------- Brand ----------
const listBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find().sort({ name: 1 });
  res.status(200).json(new ApiResponse(200, brands));
});
const createBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.create({ name: req.body.name, logo: req.body.logo });
  res.status(201).json(new ApiResponse(201, brand, "Brand created."));
});

// ---------- Category ----------
const listCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.status(200).json(new ApiResponse(200, categories));
});
const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create({ name: req.body.name, variantGroups: req.body.variantGroups || [] });
  res.status(201).json(new ApiResponse(201, category, "Category created."));
});

// ---------- Badge (admin-created badges persist & become reusable defaults) ----------
const listBadges = asyncHandler(async (req, res) => {
  const badges = await Badge.find().sort({ name: 1 });
  res.status(200).json(new ApiResponse(200, badges));
});
const createBadge = asyncHandler(async (req, res) => {
  const badge = await Badge.create({ name: req.body.name, createdBy: req.admin._id });
  res.status(201).json(new ApiResponse(201, badge, "Badge created and saved for future use."));
});

// ---------- Discount tags (15%, 30% defaults + custom) ----------
const listDiscounts = asyncHandler(async (req, res) => {
  const discounts = await Discount.find().sort({ percentage: 1 });
  res.status(200).json(new ApiResponse(200, discounts));
});
const createDiscount = asyncHandler(async (req, res) => {
  const { percentage } = req.body;
  const existing = await Discount.findOne({ percentage });
  if (existing) throw new ApiError(409, "This discount percentage already exists.");
  const discount = await Discount.create({ percentage, createdBy: req.admin._id });
  res.status(201).json(new ApiResponse(201, discount, "Discount tag created."));
});

module.exports = {
  listBrands,
  createBrand,
  listCategories,
  createCategory,
  listBadges,
  createBadge,
  listDiscounts,
  createDiscount,
};
