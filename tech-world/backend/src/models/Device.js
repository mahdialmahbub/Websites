const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true, index: true },
    jti: { type: String, required: true, unique: true }, // matches the JWT's jti claim for this session
    deviceModel: { type: String, default: "Unknown Device" }, // parsed from User-Agent
    location: { type: String, default: "Unknown Location" }, // resolved from IP (via geo lookup service)
    ip: String,
    userAgent: String,
    lastActiveAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Device", deviceSchema);
