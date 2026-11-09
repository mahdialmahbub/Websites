// models/DeliveryMan.js
const mongoose = require("mongoose");

const deliveryManSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contact: { type: String, required: true },
    courierServiceName: { type: String, required: true },
    email: { type: String },
    address: { type: String },
    vehicleType: {
      type: String,
      enum: ["Bike", "Car", "Van", "Truck", "Cycle"], // apnar actual fleet onujayi list ta adjust korben
    },
    vehicleNumber: { type: String },
    image: {
      url: { type: String },
      publicPath: { type: String },
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    totalDeliveredOrders: {
      type: Number,
      default: 0,
      min: 0,
    },

    ordersInHand: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("DeliveryMan", deliveryManSchema);
