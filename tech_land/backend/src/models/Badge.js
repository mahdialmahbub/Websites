const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);
// Badges are never auto-deleted — once an admin creates one, it stays in the
// list of available badges for all future products ("saved permanently").

module.exports = mongoose.model("Badge", badgeSchema);
