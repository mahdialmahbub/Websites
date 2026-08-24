const Product = require("../models/Product");
const Review = require("../models/Review");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const {
  calculatePrice,
  getDefaultVariantIds,
} = require("../services/pricingService");

// multipart/form-data sends array/object fields as JSON strings — parse safely
const parseJsonField = (value, fallback) => {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const buildDefaultSupportInfo = (
  { guaranteeMonths, warrantyMonths },
  overrides = {},
) => ({
  guarantee: {
    icon: overrides?.guarantee?.icon || "shield-check",
    title:
      overrides?.guarantee?.title || `${guaranteeMonths || 0} Month Guarantee`,
    subtitle:
      overrides?.guarantee?.subtitle ||
      "Official manufacturer guarantee included",
  },
  replacement: {
    icon: overrides?.replacement?.icon || "refresh-ccw",
    title: overrides?.replacement?.title || "7-Day Replacement",
    subtitle:
      overrides?.replacement?.subtitle ||
      "Easy replacement for damaged or defective items",
  },
  tested: {
    icon: overrides?.tested?.icon || "badge-check",
    title: overrides?.tested?.title || "Quality Tested",
    subtitle:
      overrides?.tested?.subtitle ||
      "Checked by our quality team before shipping",
  },
});

/**
 * POST /api/admin/products  (multipart/form-data, field "images" = multiple files)
 */
const createProduct = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    brand,
    category,
    startingPrice,
    discountPercentage,
    stock,
    guaranteeMonths,
    warrantyMonths,
    sellerPhone,
  } = req.body;

  const variants = parseJsonField(req.body.variants, []);
  const colors = parseJsonField(req.body.colors, []);
  const specifications = parseJsonField(req.body.specifications, []);
  const badges = parseJsonField(req.body.badges, []);
  const supportInfoOverrides = parseJsonField(req.body.supportInfo, {});

  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "At least one product image is required.");
  }

  const images = req.files.map((file) => ({
    url: `${process.env.UPLOAD_BASE_URL}/products/${file.filename}`,
    publicPath: file.path,
  }));

  const price = Number(startingPrice) || 0;
  const discount = Number(discountPercentage) || 0;

  const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;

  const product = await Product.create({
    title,
    description,
    brand,
    category,
    images,
    badges,
    variants,
    colors,
    specifications,

    startingPrice: price,
    discountPercentage: discount,
    finalPrice,

    stock,
    guaranteeMonths: Number(guaranteeMonths) || 0,
    warrantyMonths: Number(warrantyMonths) || 0,

    supportInfo: buildDefaultSupportInfo(
      { guaranteeMonths, warrantyMonths },
      supportInfoOverrides,
    ),

    sellerPhone,
    createdBy: req.admin._id,
  });

  res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully."));
});

/**
 * PUT /api/admin/products/:id  — Edit Product Form uses the same fields as Add Product
 */
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  const textFields = [
    "title",
    "description",
    "brand",
    "category",
    "startingPrice",
    "discountPercentage",
    "stock",
    "guaranteeMonths",
    "warrantyMonths",
    "sellerPhone",
    "status",
  ];

  textFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field];
    }
  });

  if (req.body.variants !== undefined) {
    product.variants = parseJsonField(req.body.variants, product.variants);
  }

  if (req.body.colors !== undefined) {
    product.colors = parseJsonField(req.body.colors, product.colors);
  }

  if (req.body.specifications !== undefined) {
    product.specifications = parseJsonField(
      req.body.specifications,
      product.specifications,
    );
  }

  if (req.body.badges !== undefined) {
    product.badges = parseJsonField(req.body.badges, product.badges);
  }

  if (req.body.supportInfo !== undefined) {
    const overrides = parseJsonField(req.body.supportInfo, {});

    product.supportInfo = buildDefaultSupportInfo(
      {
        guaranteeMonths: product.guaranteeMonths,
        warrantyMonths: product.warrantyMonths,
      },
      overrides,
    );
  }

  // Newly uploaded images are appended
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((file) => ({
      url: `${process.env.UPLOAD_BASE_URL}/products/${file.filename}`,
      publicPath: file.path,
    }));

    product.images.push(...newImages);
  }

  const removeImageIds = parseJsonField(req.body.removeImageIds, []);

  if (removeImageIds.length > 0) {
    product.images = product.images.filter(
      (img) => !removeImageIds.includes(String(img._id)),
    );
  }

  // Recalculate final price
  const price = Number(product.startingPrice) || 0;
  const discount = Number(product.discountPercentage) || 0;

  product.finalPrice = discount > 0 ? price - (price * discount) / 100 : price;

  await product.save();

  res
    .status(200)
    .json(new ApiResponse(200, product, "Product updated successfully."));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new ApiError(404, "Product not found.");
  await Review.deleteMany({ product: product._id });
  res.status(200).json(new ApiResponse(200, null, "Product deleted."));
});

/**
 * GET /api/products — public storefront listing with filters/search/sort/pagination
 * Query: search, category, badge, status, sortBy=price_asc|price_desc|newest, page, limit
 */
const getProducts = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    badge,
    status,
    sortBy,
    page = 1,
    limit = 12,
  } = req.query;

  const filter = {};
  if (status) filter.status = status;
  else filter.status = "Active"; // public storefront only shows active products by default
  if (category) filter.category = category;
  if (badge) filter.badges = badge;
  if (search) filter.$text = { $search: search };

  const sortMap = {
    price_asc: { startingPrice: 1 },
    price_desc: { startingPrice: -1 },
    newest: { createdAt: -1 },
    rating: { "rating.average": -1 },
  };
  const sort = sortMap[sortBy] || { createdAt: -1 };

  const skip = (Number(page) - 1) * Number(limit);
  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("brand category badges")
      .sort(sort)
      .skip(skip)
      .limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit),
      },
    }),
  );
});

/**
 * GET /api/products/:id — full Product Details page payload
 * Query: variantIds (comma separated), quantity
 */
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    "brand category badges",
  );
  if (!product) throw new ApiError(404, "Product not found.");

  const quantity = Number(req.query.quantity) || 1;
  const selectedVariantIds = req.query.variantIds
    ? req.query.variantIds.split(",")
    : getDefaultVariantIds(product);

  const pricing = calculatePrice(product, selectedVariantIds, quantity);

  const [reviews, relatedProducts] = await Promise.all([
    Review.find({ product: product._id })
      .populate("customer", "name image address")
      .sort({ createdAt: -1 }),
    Product.find({
      _id: { $ne: product._id },
      status: "Active",
      $or: [
        { category: product.category },
        { badges: { $in: product.badges } },
      ],
    })
      .limit(8)
      .select("title images startingPrice discountPercentage rating badges"),
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      product,
      pricing,
      selectedVariantIds,
      reviews,
      relatedProducts,
    }),
  );
});

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById,
};
