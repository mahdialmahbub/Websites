const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Customer = require("../models/Customer");
const Address = require("../models/Address");
const Card = require("../models/Card");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const generateInvoicePdf = require("../utils/invoiceGenerator");
const { ORDER_STATUS } = require("../config/constants");

const paginate = (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  return { page, limit, skip: (page - 1) * limit };
};

// ============ 1. Dashboard Overview ============

const getOverviewStats = asyncHandler(async (req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [pendingOrdersCount, todaysRevenueAgg, totalProducts, totalCustomers] = await Promise.all([
    Order.countDocuments({ status: { $nin: ["Delivered", "Canceled"] } }),
    Order.aggregate([
      { $match: { createdAt: { $gte: startOfToday }, status: { $ne: "Canceled" } } },
      { $group: { _id: null, revenue: { $sum: "$total" } } },
    ]),
    Product.countDocuments(),
    Customer.countDocuments(),
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      pendingOrdersCount,
      todaysRevenue: todaysRevenueAgg[0]?.revenue || 0,
      totalProducts,
      totalCustomers,
    })
  );
});

// ============ 2. Orders (also powers the "Pending Orders" dashboard widget via ?status=) ============

const getOrders = asyncHandler(async (req, res) => {
  const { status, paymentMethod, sortByPrice, search } = req.query;
  const { page, limit, skip } = paginate(req.query);

  const match = {};
  if (status) match.status = status;
  if (paymentMethod) match.paymentMethod = paymentMethod;

  const pipeline = [
    { $match: match },
    {
      $lookup: { from: "customers", localField: "customer", foreignField: "_id", as: "customer" },
    },
    { $unwind: "$customer" },
  ];

  if (search) {
    pipeline.push({
      $match: {
        $or: [
          { orderId: { $regex: search, $options: "i" } },
          { "customer.name": { $regex: search, $options: "i" } },
          { "customer.phone": { $regex: search, $options: "i" } },
          { "items.productTitle": { $regex: search, $options: "i" } },
        ],
      },
    });
  }

  pipeline.push({ $sort: sortByPrice === "price_asc" ? { total: 1 } : sortByPrice === "price_desc" ? { total: -1 } : { createdAt: -1 } });

  const [orders, totalCountResult] = await Promise.all([
    Order.aggregate([
      ...pipeline,
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          orderId: 1,
          status: 1,
          paymentMethod: 1,
          total: 1,
          deliveryAddress: 1,
          createdAt: 1,
          items: 1,
          "customer.name": 1,
          "customer.image": 1,
          "customer.phone": 1,
        },
      },
    ]),
    Order.aggregate([...pipeline, { $count: "total" }]),
  ]);

  const total = totalCountResult[0]?.total || 0;
  res
    .status(200)
    .json(new ApiResponse(200, { orders, pagination: { total, page, limit, pages: Math.ceil(total / limit) } }));
});

const getOrderDetailsAdmin = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId).populate("customer", "name email phone image");
  if (!order) throw new ApiError(404, "Order not found.");
  res.status(200).json(new ApiResponse(200, order));
});

/**
 * PATCH /api/admin/orders/:orderId — advances order status, appends to the timeline,
 * and can set trackingId/courierName (typically set once status reaches "Shipped").
 */
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, trackingId, courierName, estimatedDeliveryDate } = req.body;
  const order = await Order.findById(req.params.orderId);
  if (!order) throw new ApiError(404, "Order not found.");

  if (status) {
    if (!ORDER_STATUS.includes(status)) throw new ApiError(400, "Invalid status.");
    order.status = status;
    order.statusTimeline.push({ status, at: new Date() });
    if (status === "Delivered") order.paymentStatus = "Paid";
  }
  if (trackingId !== undefined) order.trackingId = trackingId;
  if (courierName !== undefined) order.courierName = courierName;
  if (estimatedDeliveryDate !== undefined) order.estimatedDeliveryDate = estimatedDeliveryDate;

  await order.save();
  res.status(200).json(new ApiResponse(200, order, "Order updated."));
});

const deleteOrderAdmin = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.orderId);
  if (!order) throw new ApiError(404, "Order not found.");
  res.status(200).json(new ApiResponse(200, null, "Order deleted."));
});

const downloadInvoiceAdmin = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId).lean();
  if (!order) throw new ApiError(404, "Order not found.");
  generateInvoicePdf(res, order);
});

// ============ 3. Products ============

const getProductsAdmin = asyncHandler(async (req, res) => {
  const { status, category, sortBy, search } = req.query;
  const { page, limit, skip } = paginate(req.query);

  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (search) filter.$text = { $search: search };

  const sortMap = { price_asc: { startingPrice: 1 }, price_desc: { startingPrice: -1 }, newest: { createdAt: -1 }, stock: { stock: 1 } };
  const sort = sortMap[sortBy] || { createdAt: -1 };

  const [products, total] = await Promise.all([
    Product.find(filter).populate("category", "name").sort(sort).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  res
    .status(200)
    .json(new ApiResponse(200, { products, pagination: { total, page, limit, pages: Math.ceil(total / limit) } }));
});

// ============ 4. Customers ============

const getCustomersAdmin = asyncHandler(async (req, res) => {
  const { sortBy, paymentMethod, search } = req.query;
  const { page, limit, skip } = paginate(req.query);

  const matchStage = {};
  if (search) {
    matchStage.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const pipeline = [
    { $match: matchStage },
    {
      $lookup: {
        from: "orders",
        let: { customerId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$customer", "$$customerId"] }, status: { $ne: "Canceled" } } },
          { $sort: { createdAt: -1 } },
        ],
        as: "orders",
      },
    },
    {
      $addFields: {
        totalSpending: { $sum: "$orders.total" },
        lastOrderDate: { $max: "$orders.createdAt" },
        paymentMethod: { $arrayElemAt: ["$orders.paymentMethod", 0] },
      },
    },
  ];

  if (paymentMethod) pipeline.push({ $match: { paymentMethod } });

  const sortMap = {
    spending_desc: { totalSpending: -1 },
    spending_asc: { totalSpending: 1 },
    newest: { createdAt: -1 },
    name: { name: 1 },
  };
  pipeline.push({ $sort: sortMap[sortBy] || { createdAt: -1 } });

  const [customers, totalCountResult] = await Promise.all([
    Customer.aggregate([
      ...pipeline,
      { $skip: skip },
      { $limit: limit },
      { $project: { name: 1, email: 1, phone: 1, image: 1, totalSpending: 1, lastOrderDate: 1, paymentMethod: 1, createdAt: 1 } },
    ]),
    Customer.aggregate([...pipeline, { $count: "total" }]),
  ]);

  const total = totalCountResult[0]?.total || 0;
  res
    .status(200)
    .json(new ApiResponse(200, { customers, pagination: { total, page, limit, pages: Math.ceil(total / limit) } }));
});

const getCustomerDetailsAdmin = asyncHandler(async (req, res) => {
  const customerId = req.params.customerId;
  const customer = await Customer.findById(customerId);
  if (!customer) throw new ApiError(404, "Customer not found.");

  const [addresses, cards, orders, statsAgg] = await Promise.all([
    Address.find({ customer: customerId }),
    Card.find({ customer: customerId }), // already masked at rest — safe to return as-is
    Order.find({ customer: customerId }).sort({ createdAt: -1 }).select(
      "orderId items status total createdAt"
    ),
    Order.aggregate([
      { $match: { customer: new mongoose.Types.ObjectId(customerId), status: { $ne: "Canceled" } } },
      {
        $group: {
          _id: null,
          totalSpending: { $sum: "$total" },
          totalOrders: { $sum: 1 },
        },
      },
    ]),
    Order.countDocuments({ customer: customerId, status: { $nin: ["Delivered", "Canceled"] } }),
  ]);

  const pendingOrdersCount = await Order.countDocuments({
    customer: customerId,
    status: { $nin: ["Delivered", "Canceled"] },
  });

  res.status(200).json(
    new ApiResponse(200, {
      customer,
      overview: {
        joinDate: customer.createdAt,
        pendingOrdersCount,
        totalSpending: statsAgg[0]?.totalSpending || 0,
        totalOrdersCount: statsAgg[0]?.totalOrders || 0,
      },
      addresses,
      cards,
      orders,
    })
  );
});

const deleteCustomerAdmin = asyncHandler(async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.customerId);
  if (!customer) throw new ApiError(404, "Customer not found.");
  await Promise.all([
    Address.deleteMany({ customer: customer._id }),
    Card.deleteMany({ customer: customer._id }),
  ]);
  res.status(200).json(new ApiResponse(200, null, "Customer deleted."));
});

module.exports = {
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
};
