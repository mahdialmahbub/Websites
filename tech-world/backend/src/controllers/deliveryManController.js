// controllers/deliveryManController.js
const fs = require("fs");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const DeliveryMan = require("../models/DeliveryMan");
const Order = require("../models/Order");

const paginate = (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  return { page, limit, skip: (page - 1) * limit };
};

// Builds the { url, publicPath } pair we store on the document.
// Subfolder MUST match the one passed to createUploader() in the routes
// file ("delivery-man") — otherwise the file saves in one folder but the
// URL points at another, and the image 404s.
const buildImagePayload = (req) => ({
  url: `${process.env.UPLOAD_BASE_URL}/delivery-man/${req.file.filename}`,
  publicPath: req.file.path,
});

// Best-effort delete — logs but never throws, since a missing/already-gone
// file shouldn't block the actual DB operation.
const deleteImageFile = (publicPath) => {
  if (!publicPath) return;

  fs.unlink(publicPath, (err) => {
    if (err && err.code !== "ENOENT") {
      console.error("Failed to delete delivery man image:", err);
    }
  });
};

const createDeliveryMan = asyncHandler(async (req, res) => {
  const {
    name,
    contact,
    courierServiceName,
    email,
    address,
    vehicleType,
    vehicleNumber,
  } = req.body;

  if (!name || !contact || !courierServiceName) {
    throw new ApiError(400, "Name, contact and courier service name are required.");
  }

  const deliveryMan = await DeliveryMan.create({
    name,
    contact,
    courierServiceName,
    email,
    address,
    vehicleType,
    vehicleNumber,
    image: req.file ? buildImagePayload(req) : undefined,
  });

  res.status(201).json(new ApiResponse(201, deliveryMan, "Delivery man created."));
});

const getDeliveryMen = asyncHandler(async (req, res) => {
  const { status, search, sortBy } = req.query;
  const { page, limit, skip } = paginate(req.query);

  const matchStage = {};
  if (status) matchStage.status = status;
  if (search) {
    matchStage.$or = [
      { name: { $regex: search, $options: "i" } },
      { contact: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { vehicleNumber: { $regex: search, $options: "i" } },
    ];
  }

  const pipeline = [
    { $match: matchStage },
    {
      $lookup: {
        from: "orders",
        let: { deliveryManId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$deliveryMan", "$$deliveryManId"] },
                  { $eq: ["$status", "Delivered"] },
                ],
              },
            },
          },
        ],
        as: "deliveredOrders",
      },
    },
    { $addFields: { completedDeliveries: { $size: "$deliveredOrders" } } },
    { $project: { deliveredOrders: 0 } },
  ];

  const sortMap = {
    name: { name: 1 },
    newest: { createdAt: -1 },
    deliveries_desc: { completedDeliveries: -1 },
  };
  pipeline.push({ $sort: sortMap[sortBy] || { createdAt: -1 } });

  const [deliveryMen, totalCountResult] = await Promise.all([
    DeliveryMan.aggregate([...pipeline, { $skip: skip }, { $limit: limit }]),
    DeliveryMan.aggregate([...pipeline, { $count: "total" }]),
  ]);

  const total = totalCountResult[0]?.total || 0;

  res.status(200).json(
    new ApiResponse(
      200,
      {
        deliveryMen,
        pagination: { total, page, limit, pages: Math.ceil(total / limit) },
      },
      "Delivery men fetched.",
    ),
  );
});

const getDeliveryManDetails = asyncHandler(async (req, res) => {
  const deliveryMan = await DeliveryMan.findById(req.params.id).lean();
  if (!deliveryMan) throw new ApiError(404, "Delivery man not found.");

  const completedDeliveries = await Order.countDocuments({
    deliveryMan: deliveryMan._id,
    status: "Delivered",
  });

  res
    .status(200)
    .json(new ApiResponse(200, { ...deliveryMan, completedDeliveries }, "Delivery man fetched."));
});

const updateDeliveryMan = asyncHandler(async (req, res) => {
  const updates = { ...req.body };

  // Only touch the image if a new file actually came in — otherwise leave
  // the existing one alone.
  if (req.file) {
    const existing = await DeliveryMan.findById(req.params.id);
    if (!existing) throw new ApiError(404, "Delivery man not found.");

    deleteImageFile(existing.image?.publicPath);
    updates.image = buildImagePayload(req);
  }

  const deliveryMan = await DeliveryMan.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });
  if (!deliveryMan) throw new ApiError(404, "Delivery man not found.");

  res.status(200).json(new ApiResponse(200, deliveryMan, "Delivery man updated."));
});

const updateDeliveryManStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["active", "inactive"].includes(status)) {
    throw new ApiError(400, "Status must be 'active' or 'inactive'.");
  }
  const deliveryMan = await DeliveryMan.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!deliveryMan) throw new ApiError(404, "Delivery man not found.");
  res.status(200).json(new ApiResponse(200, deliveryMan, "Delivery man status updated."));
});

const deleteDeliveryMan = asyncHandler(async (req, res) => {
  const deliveryMan = await DeliveryMan.findByIdAndDelete(req.params.id);
  if (!deliveryMan) throw new ApiError(404, "Delivery man not found.");

  deleteImageFile(deliveryMan.image?.publicPath);

  res.status(200).json(new ApiResponse(200, {}, "Delivery man deleted."));
});

module.exports = {
  createDeliveryMan,
  getDeliveryMen,
  getDeliveryManDetails,
  updateDeliveryMan,
  updateDeliveryManStatus,
  deleteDeliveryMan,
};
