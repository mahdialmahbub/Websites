const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { GENDER } = require("../config/constants");

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    isEmailVerified: { type: Boolean, default: false },
    password: { type: String, required: true, select: false },
    phone: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: GENDER },
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
    isNotificationEnabled: { type: Boolean, default: true },

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
