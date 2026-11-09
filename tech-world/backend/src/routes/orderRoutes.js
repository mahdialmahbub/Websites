const express = require("express");
const router = express.Router();

const { protectCustomer } = require("../middlewares/auth");
const {
  getMyPendingOrders,
  getMyDeliveredOrders,
  getOrderById,
  cancelOrder,
  deleteOrder,
  downloadInvoice,
  getSellerContact,
  getMyOrderStats,
} = require("../controllers/orderController");

router.use(protectCustomer);

router.get("/pending", getMyPendingOrders);
router.get("/delivered", getMyDeliveredOrders);
router.get("/stats", getMyOrderStats);
router.get("/:orderId", getOrderById);
router.post("/:orderId/cancel", cancelOrder);
router.delete("/:orderId", deleteOrder);
router.get("/:orderId/invoice", downloadInvoice);
router.get("/:orderId/seller-contact", getSellerContact);

module.exports = router;
