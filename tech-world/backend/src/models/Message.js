const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" }, // optional (guest contact allowed too)
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    isViewed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

messageSchema.index({ name: "text", email: "text", message: "text" });

module.exports = mongoose.model("Message", messageSchema);
