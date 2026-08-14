const Order = require("../models/Order");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const generateInvoicePdf = require("../utils/invoiceGenerator");
const { ORDER_STATUS, CANCELABLE_BEFORE_STATUS } = require("../config/constants");

/**
 * DESIGN NOTE: The spec describes "Cancel Order" as deleting the order from the
 * database, but also requires the status timeline to display a "Canceled" entry
 * with its date/time. Those two requirements conflict — a deleted document can't
 * show a timeline. We resolve this the way real e-commerce platforms do: Cancel
 * is a SOFT cancel (status -> "Canceled", timeline entry added, order kept for
 * records/analytics). "Delete" is a literal hard-delete, but only ever offered
 * for orders that are already finished (Delivered) or already Canceled, so
 * nothing "in flight" can be permanently lost.
 */

const getMyPendingOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    customer: req.customer._id,
    status: { $nin: ["Delivered", "Canceled"] },
  }).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, orders, "Pending orders fetched."));
});

const getMyDeliveredOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ customer: req.customer._id, status: "Delivered" }).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, orders, "Delivered orders fetched."));
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.orderId, customer: req.customer._id }).populate(
    "items.product",
    "title images"
  );
  if (!order) throw new ApiError(404, "Order not found.");
  res.status(200).json(new ApiResponse(200, order, "Order details fetched."));
});

const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.orderId, customer: req.customer._id });
  if (!order) throw new ApiError(404, "Order not found.");

  const cancelableIndex = ORDER_STATUS.indexOf(CANCELABLE_BEFORE_STATUS);
  const currentIndex = ORDER_STATUS.indexOf(order.status);
  if (currentIndex >= cancelableIndex) {
    throw new ApiError(400, `Order can no longer be canceled once it has been ${CANCELABLE_BEFORE_STATUS}.`);
  }

  order.status = "Canceled";
  order.statusTimeline.push({ status: "Canceled", at: new Date() });
  await order.save();

  res.status(200).json(new ApiResponse(200, order, "Order canceled."));
});

const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.orderId, customer: req.customer._id });
  if (!order) throw new ApiError(404, "Order not found.");
  if (!["Delivered", "Canceled"].includes(order.status)) {
    throw new ApiError(400, "Only delivered or canceled orders can be deleted.");
  }
  await order.deleteOne();
  res.status(200).json(new ApiResponse(200, null, "Order deleted."));
});

const downloadInvoice = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.orderId, customer: req.customer._id }).lean();
  if (!order) throw new ApiError(404, "Order not found.");
  generateInvoicePdf(res, order);
});

const getSellerContact = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.orderId, customer: req.customer._id });
  if (!order) throw new ApiError(404, "Order not found.");

  const contacts = [...new Set(order.items.map((i) => i.sellerPhone).filter(Boolean))];
  res.status(200).json(new ApiResponse(200, { sellerPhones: contacts }, "Seller contact fetched."));
});

module.exports = {
  getMyPendingOrders,
  getMyDeliveredOrders,
  getOrderById,
  cancelOrder,
  deleteOrder,
  downloadInvoice,
  getSellerContact,
};
