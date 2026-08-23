const express = require("express");
const router = express.Router();

const { protectAdmin } = require("../middlewares/auth");
const { loginLimiter } = require("../middlewares/rateLimiter");
const { createUploader } = require("../middlewares/upload");
const uploadProductImages = createUploader("products");
const validate = require("../middlewares/validate");
const { productValidator } = require("../validators/productValidators");

const { adminLogin, adminLogout, getMyAdminProfile } = require("../controllers/adminAuthController");
const {
  listBrands,
  createBrand,
  listCategories,
  createCategory,
  listBadges,
  createBadge,
  listDiscounts,
  createDiscount,
} = require("../controllers/catalogController");
const { createProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const { deleteReview } = require("../controllers/reviewController");
const {
  getOverviewStats,
  getOrders,
  getOrderDetailsAdmin,
  updateOrderStatus,
  deleteOrderAdmin,
  downloadInvoiceAdmin,
  getProductsAdmin,
  getCustomersAdmin,
  getCustomerDetailsAdmin,
  deleteCustomerAdmin,
} = require("../controllers/adminDashboardController");
const { getMessagesAdmin, getMessageDetailsAdmin } = require("../controllers/messageController");

// ---------- Auth (public) ----------
router.post("/auth/login", loginLimiter, adminLogin);

// Everything below requires a logged-in admin
router.use(protectAdmin);

router.post("/auth/logout", adminLogout);
router.get("/auth/me", getMyAdminProfile);

// ---------- Catalog: Brand / Category / Badge / Discount ----------
router.get("/brands", listBrands);
router.post("/brands", createBrand);
router.get("/categories", listCategories);
router.post("/categories", createCategory);
router.get("/badges", listBadges);
router.post("/badges", createBadge);
router.get("/discounts", listDiscounts);
router.post("/discounts", createDiscount);

// ---------- Products ----------
router.post("/products", uploadProductImages.array("images", 10), productValidator, validate, createProduct);
router.put("/products/:id", uploadProductImages.array("images", 10), updateProduct);
router.delete("/products/:id", deleteProduct);
router.get("/products", getProductsAdmin);

// ---------- Reviews (delete only, from Edit Product page) ----------
router.delete("/reviews/:reviewId", deleteReview);

// ---------- Dashboard Overview ----------
router.get("/dashboard/overview", getOverviewStats);

// ---------- Dashboard / Orders ----------
router.get("/orders", getOrders);
router.get("/orders/:orderId", getOrderDetailsAdmin);
router.patch("/orders/:orderId", updateOrderStatus);
router.delete("/orders/:orderId", deleteOrderAdmin);
router.get("/orders/:orderId/invoice", downloadInvoiceAdmin);

// ---------- Dashboard / Customers ----------
router.get("/customers", getCustomersAdmin);
router.get("/customers/:customerId", getCustomerDetailsAdmin);
router.delete("/customers/:customerId", deleteCustomerAdmin);

// ---------- Dashboard / Messages ----------
router.get("/messages", getMessagesAdmin);
router.get("/messages/:messageId", getMessageDetailsAdmin);

module.exports = router;
