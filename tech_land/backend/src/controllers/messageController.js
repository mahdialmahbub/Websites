const Message = require("../models/Message");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

/**
 * POST /api/messages — public "Contact Us" style submission.
 * If the sender is a logged-in customer, req.customer will be set by an optional
 * auth middleware upstream; otherwise it's treated as a guest message.
 */
const createMessage = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;
  const doc = await Message.create({
    customer: req.customer?._id,
    name,
    email,
    message,
  });
  res.status(201).json(new ApiResponse(201, doc, "Message sent. Our team will get back to you soon."));
});

/**
 * GET /api/admin/messages — list/search for the admin dashboard Messages section
 */
const getMessagesAdmin = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;
  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { message: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [messages, total] = await Promise.all([
    Message.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Message.countDocuments(filter),
  ]);

  res
    .status(200)
    .json(new ApiResponse(200, { messages, pagination: { total, page: Number(page), limit: Number(limit) } }));
});

const getMessageDetailsAdmin = asyncHandler(async (req, res) => {
  const message = await Message.findByIdAndUpdate(req.params.messageId, { isViewed: true }, { new: true });
  if (!message) throw new ApiError(404, "Message not found.");
  res.status(200).json(new ApiResponse(200, message));
});

module.exports = { createMessage, getMessagesAdmin, getMessageDetailsAdmin };
