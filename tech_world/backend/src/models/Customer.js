const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { GENDER } = require("../config/constants");

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    isEmailVerified: { type: Boolean, default: false },
    password: { type: String, required: true, select: false },
    // Phone is collected in a later onboarding step (right after registration),
    // so it's optional at the schema level too — not required at account creation.
    phone: { type: String, trim: true, default: "" },
    dateOfBirth: { type: Date },
    // If the frontend sends an empty string (unselected dropdown), treat it as
    // "not set" instead of failing the enum check — only real Male/Female/Other
    // values get validated against GENDER.
    gender: { type: String, enum: GENDER, set: (v) => (v === "" ? undefined : v) },
    image: {
      url: { type: String, default: null },
      publicPath: { type: String, default: null }, // relative disk path, for deletion on re-upload
    },

    // Primary registration address (customer can add more later via Address collection)
    address: {
      floorNumber: String,
      houseNumber: String,
      roadNumber: String,
      locality: String,
      area: String,
      city: String,
      zipCode: String,
      country: String,
    },

    // Security
    isTwoFactorEnabled: { type: Boolean, default: false },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    isNotificationEnabled: { type: Boolean, default: true },
    notificationChannel: { type: String, enum: ["email", "number"], default: "email" },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

customerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

customerSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("Customer", customerSchema);
