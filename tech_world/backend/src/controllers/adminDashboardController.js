const mongoose = require("mongoose");
const Order = require("../models/Order.js");
const Product = require("../models/Product.js");
const Customer = require("../models/Customer.js");
const Address = require("../models/Address.js");
const Card = require("../models/Card.js");
const DeliveryMan = require("../models/DeliveryMan.js");
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

  const [pendingOrdersCount, todaysRevenueAgg, totalProducts, totalCustomers] =
    await Promise.all([
      Order.countDocuments({ status: { $nin: ["Delivered", "Canceled"] } }),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfToday },
            status: { $ne: "Canceled" },
          },
        },
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
    }),
  );
});

// ============ 2. Orders (also powers the "Pending Orders" dashboard widget via ?status=) ============

const getOrders = asyncHandler(async (req, res) => {
  const { status, paymentMethod, sortByPrice, search } = req.query;

  const { page, limit, skip } = paginate(req.query);

  const match = {};

  if (status) {
    match.status = status;
  }

  if (paymentMethod) {
    match.paymentMethod = paymentMethod;
  }

  const pipeline = [
    { $match: match },

    // =========================
    // CUSTOMER LOOKUP
    // =========================
    {
      $lookup: {
        from: "customers",
        localField: "customer",
        foreignField: "_id",
        as: "customer",
      },
    },

    {
      $unwind: "$customer",
    },

    // =========================
    // DELIVERY MAN LOOKUP
    // =========================
    {
      $lookup: {
        from: "deliverymen",
        localField: "deliveryMan",
        foreignField: "_id",
        as: "deliveryMan",
      },
    },

    {
      $unwind: {
        path: "$deliveryMan",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];

  // =========================
  // SEARCH
  // =========================
  if (search) {
    pipeline.push({
      $match: {
        $or: [
          {
            orderId: {
              $regex: search,
              $options: "i",
            },
          },
          {
            "customer.name": {
              $regex: search,
              $options: "i",
            },
          },
          {
            "customer.phone": {
              $regex: search,
              $options: "i",
            },
          },
          {
            "items.productTitle": {
              $regex: search,
              $options: "i",
            },
          },
          {
            "deliveryMan.name": {
              $regex: search,
              $options: "i",
            },
          },
          {
            "deliveryMan.contact": {
              $regex: search,
              $options: "i",
            },
          },
        ],
      },
    });
  }

  // =========================
  // SORT
  // =========================
  pipeline.push({
    $sort:
      sortByPrice === "price_asc"
        ? { total: 1 }
        : sortByPrice === "price_desc"
          ? { total: -1 }
          : { createdAt: -1 },
  });

  // =========================
  // GET ORDERS + COUNT
  // =========================
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

          // Current delivery man
          deliveryMan: {
            _id: "$deliveryMan._id",
            name: "$deliveryMan.name",
            contact: "$deliveryMan.contact",
            courierServiceName: "$deliveryMan.courierServiceName",
            email: "$deliveryMan.email",
            address: "$deliveryMan.address",
            vehicleType: "$deliveryMan.vehicleType",
            vehicleNumber: "$deliveryMan.vehicleNumber",
            image: "$deliveryMan.image",
            status: "$deliveryMan.status",
          },

          // Historical snapshot
          deliveryManDetails: 1,

          // Customer
          "customer.name": 1,
          "customer.image": 1,
          "customer.phone": 1,
        },
      },
    ]),

    Order.aggregate([...pipeline, { $count: "total" }]),
  ]);

  const total = totalCountResult[0]?.total || 0;

  res.status(200).json(
    new ApiResponse(200, {
      orders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    }),
  );
});

const getOrderDetailsAdmin = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId)
    .populate("customer", "name email phone image")
    .populate(
      "deliveryMan",
      "name contact courierServiceName email address vehicleType vehicleNumber image status",
    );

  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  res.status(200).json(new ApiResponse(200, order));
});
/**
 * PATCH /api/admin/orders/:orderId — advances order status, appends to the timeline,
 * and can set trackingId/estimatedDeliveryDate/deliveryManId (typically set once status
 * reaches "Shipped").
 */

const updateOrderStatus = asyncHandler(async (req, res) => {
  const {
    status,
    trackingId,
    estimatedDeliveryDate,
    deliveryManId,
  } = req.body;

  // ============================================
  // VALIDATE ORDER ID
  // ============================================
  if (!mongoose.Types.ObjectId.isValid(req.params.orderId)) {
    throw new ApiError(400, "Invalid order ID.");
  }

  // ============================================
  // VALIDATE DELIVERY MAN ID
  // ============================================
  if (
    deliveryManId !== undefined &&
    deliveryManId !== null &&
    deliveryManId !== "" &&
    !mongoose.Types.ObjectId.isValid(deliveryManId)
  ) {
    throw new ApiError(400, "Invalid delivery man ID.");
  }

  const session = await mongoose.startSession();

  try {
    let updatedOrder;

    await session.withTransaction(async () => {
      // ==========================================
      // FIND ORDER
      // ==========================================
      const order = await Order.findById(
        req.params.orderId,
      ).session(session);

      if (!order) {
        throw new ApiError(404, "Order not found.");
      }

      // ==========================================
      // PREVIOUS STATE
      // ==========================================
      const previousStatus = order.status;

      const previousDeliveryManId =
        order.deliveryMan
          ? order.deliveryMan.toString()
          : null;

      // ==========================================
      // CURRENT STATE VARIABLES
      // ==========================================
      let nextStatus = previousStatus;

      let nextDeliveryManId =
        previousDeliveryManId;

      let nextDeliveryMan = null;

      // ==========================================
      // TERMINAL STATUS HELPER
      // ==========================================
      const isTerminalStatus = (value) =>
        value === "Delivered" ||
        value === "Cancelled";

      // ==========================================
      // STATUS VALIDATION
      // ==========================================
      if (status !== undefined) {
        if (!ORDER_STATUS.includes(status)) {
          throw new ApiError(
            400,
            "Invalid order status.",
          );
        }

        nextStatus = status;
      }

      // ==========================================
      // DELIVERY MAN VALIDATION / FETCH
      // ==========================================
      if (deliveryManId !== undefined) {
        // ------------------------------
        // UNASSIGN
        // ------------------------------
        if (
          deliveryManId === null ||
          deliveryManId === ""
        ) {
          nextDeliveryManId = null;
        }

        // ------------------------------
        // ASSIGN / REASSIGN
        // ------------------------------
        else {
          nextDeliveryMan = await DeliveryMan.findById(
            deliveryManId,
          )
            .session(session)
            .lean();

          if (!nextDeliveryMan) {
            throw new ApiError(
              404,
              "Delivery man not found.",
            );
          }

          nextDeliveryManId =
            nextDeliveryMan._id.toString();
        }
      }

      // ==========================================
      // PREVIOUS / NEXT "IN HAND" STATE
      // ==========================================
      const wasInHand =
        !!previousDeliveryManId &&
        !isTerminalStatus(previousStatus);

      const willBeInHand =
        !!nextDeliveryManId &&
        !isTerminalStatus(nextStatus);

      // ==========================================
      // DELIVERY MAN COUNTER CHANGES
      // ==========================================

      // ------------------------------------------
      // SAME DELIVERY MAN
      // ------------------------------------------
      if (
        previousDeliveryManId ===
        nextDeliveryManId
      ) {
        // Active -> Terminal
        if (wasInHand && !willBeInHand) {
          await DeliveryMan.updateOne(
            {
              _id: previousDeliveryManId,
              ordersInHand: { $gt: 0 },
            },
            {
              $inc: {
                ordersInHand: -1,
              },
            },
            { session },
          );
        }

        // Terminal -> Active
        else if (!wasInHand && willBeInHand) {
          await DeliveryMan.updateOne(
            {
              _id: nextDeliveryManId,
            },
            {
              $inc: {
                ordersInHand: 1,
              },
            },
            { session },
          );
        }
      }

      // ------------------------------------------
      // DELIVERY MAN CHANGED
      // ------------------------------------------
      else {
        // Remove from previous delivery man
        if (
          previousDeliveryManId &&
          wasInHand
        ) {
          await DeliveryMan.updateOne(
            {
              _id: previousDeliveryManId,
              ordersInHand: { $gt: 0 },
            },
            {
              $inc: {
                ordersInHand: -1,
              },
            },
            { session },
          );
        }

        // Add to new delivery man
        if (
          nextDeliveryManId &&
          willBeInHand
        ) {
          await DeliveryMan.updateOne(
            {
              _id: nextDeliveryManId,
            },
            {
              $inc: {
                ordersInHand: 1,
              },
            },
            { session },
          );
        }
      }

      // ==========================================
      // TOTAL DELIVERED ORDERS
      // ==========================================
      //
      // Only increment when this order genuinely
      // transitions into Delivered.
      //
      if (
        previousStatus !== "Delivered" &&
        nextStatus === "Delivered" &&
        nextDeliveryManId
      ) {
        await DeliveryMan.updateOne(
          {
            _id: nextDeliveryManId,
          },
          {
            $inc: {
              totalDeliveredOrders: 1,
            },
          },
          { session },
        );
      }

      // ==========================================
      // APPLY ORDER STATUS
      // ==========================================
      if (status !== undefined) {
        if (nextStatus !== previousStatus) {
          order.status = nextStatus;

          order.statusTimeline.push({
            status: nextStatus,
            at: new Date(),
          });
        }

        // Delivered => Paid
        if (nextStatus === "Delivered") {
          order.paymentStatus = "Paid";
        }
      }

      // ==========================================
      // TRACKING ID
      // ==========================================
      if (trackingId !== undefined) {
        order.trackingId = trackingId;
      }

      // ==========================================
      // ESTIMATED DELIVERY DATE
      // ==========================================
      if (
        estimatedDeliveryDate !== undefined
      ) {
        order.estimatedDeliveryDate =
          estimatedDeliveryDate || null;
      }

      // ==========================================
      // DELIVERY MAN REFERENCE + SNAPSHOT
      // ==========================================
      if (deliveryManId !== undefined) {
        // ------------------------------
        // UNASSIGN
        // ------------------------------
        if (!nextDeliveryManId) {
          order.deliveryMan = null;
          order.deliveryManDetails = null;
        }

        // ------------------------------
        // ASSIGN / REASSIGN
        // ------------------------------
        else {
          order.deliveryMan =
            nextDeliveryMan._id;

          order.deliveryManDetails = {
            name: nextDeliveryMan.name,
            contact: nextDeliveryMan.contact,
            courierServiceName:
              nextDeliveryMan.courierServiceName,
            email: nextDeliveryMan.email,
            address: nextDeliveryMan.address,
            vehicleType:
              nextDeliveryMan.vehicleType,
            vehicleNumber:
              nextDeliveryMan.vehicleNumber,

            image: nextDeliveryMan.image
              ? {
                  url: nextDeliveryMan.image.url,
                  publicPath:
                    nextDeliveryMan.image.publicPath,
                }
              : undefined,
          };
        }
      }

      // ==========================================
      // SAVE ORDER
      // ==========================================
      await order.save({ session });

      // ==========================================
      // GET UPDATED ORDER
      // ==========================================
      updatedOrder = await Order.findById(
        order._id,
      )
        .populate(
          "customer",
          "name email phone image",
        )
        .populate(
          "deliveryMan",
          [
            "name",
            "contact",
            "courierServiceName",
            "email",
            "address",
            "vehicleType",
            "vehicleNumber",
            "image",
            "status",
            "totalDeliveredOrders",
            "ordersInHand",
          ].join(" "),
        )
        .session(session);
    });

    // ============================================
    // RESPONSE
    // ============================================
    return res.status(200).json(
      new ApiResponse(
        200,
        updatedOrder,
        "Order updated successfully.",
      ),
    );
  } finally {
    await session.endSession();
  }
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

  const sortMap = {
    price_asc: { startingPrice: 1 },
    price_desc: { startingPrice: -1 },
    newest: { createdAt: -1 },
    stock: { stock: 1 },
  };
  const sort = sortMap[sortBy] || { createdAt: -1 };

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Product.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      products,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    }),
  );
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
          {
            $match: {
              $expr: { $eq: ["$customer", "$$customerId"] },
              status: { $ne: "Canceled" },
            },
          },
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
      {
        $project: {
          name: 1,
          email: 1,
          phone: 1,
          image: 1,
          totalSpending: 1,
          lastOrderDate: 1,
          paymentMethod: 1,
          createdAt: 1,
        },
      },
    ]),
    Customer.aggregate([...pipeline, { $count: "total" }]),
  ]);

  const total = totalCountResult[0]?.total || 0;
  res.status(200).json(
    new ApiResponse(200, {
      customers,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    }),
  );
});

const getCustomerDetailsAdmin = asyncHandler(async (req, res) => {
  const customerId = req.params.customerId;
  const customer = await Customer.findById(customerId);
  if (!customer) throw new ApiError(404, "Customer not found.");

  const [addresses, cards, orders, statsAgg] = await Promise.all([
    Address.find({ customer: customerId }),
    Card.find({ customer: customerId }), // already masked at rest — safe to return as-is
    Order.find({ customer: customerId })
      .sort({ createdAt: -1 })
      .select("orderId items status total createdAt"),
    Order.aggregate([
      {
        $match: {
          customer: new mongoose.Types.ObjectId(customerId),
          status: { $ne: "Canceled" },
        },
      },
      {
        $group: {
          _id: null,
          totalSpending: { $sum: "$total" },
          totalOrders: { $sum: 1 },
        },
      },
    ]),
    Order.countDocuments({
      customer: customerId,
      status: { $nin: ["Delivered", "Canceled"] },
    }),
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
    }),
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
