const mongoose = require("mongoose");
const { ORDER_STATUS, PAYMENT_METHOD, PAYMENT_STATUS } = require("../config/constants");

// Snapshot of a variant selection at the time of order (so future product edits
// never change historical order records)
const orderVariantSnapshotSchema = new mongoose.Schema(
  { name: String, group: String, priceAdjustment: Number },
  { _id: false }
);

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    productTitle: { type: String, required: true },
    productImage: { type: String },
    brandName: { type: String },
    selectedVariants: [orderVariantSnapshotSchema],
    color: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    sellerPhone: { type: String },
    guaranteeMonths: { type: Number, default: 0 },
    warrantyMonths: { type: Number, default: 0 },
    supportInfo: { type: mongoose.Schema.Types.Mixed },
  },
  { _id: false }
);

const addressSnapshotSchema = new mongoose.Schema(
  {
    apartmentNumber: String,
    buildingNumber: String,
    roadNumber: String,
    locality: String,
    area: String,
    city: String,
    postCode: String,
    country: String,
  },
  { _id: false }
);

const statusTimelineEntrySchema = new mongoose.Schema(
  {
    status: { type: String, enum: ORDER_STATUS, required: true },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true, index: true },

    items: { type: [orderItemSchema], validate: (v) => v.length > 0 },

    status: { type: String, enum: ORDER_STATUS, default: "Pending" },
    statusTimeline: [statusTimelineEntrySchema],

    paymentMethod: { type: String, enum: PAYMENT_METHOD, required: true },
    paymentStatus: { type: String, enum: PAYMENT_STATUS, default: "Pending" },
    cardSnapshot: {
      maskedNumber: String,
      network: String,
    },

    subtotal: { type: Number, required: true },
    discount: { type: Number, required: true, default: 0 },
    shippingCharge: { type: Number, required: true, default: 0 },
    vat: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },

    deliveryAddress: { type: addressSnapshotSchema, required: true },

    estimatedDeliveryDate: { type: Date },
    estimatedDeliveryDurationDays: { type: Number },
    trackingId: { type: String },
    courierName: { type: String },
  },
  { timestamps: true }
);

orderSchema.index({ status: 1, paymentMethod: 1 });
orderSchema.index({ customer: 1, status: 1 });

module.exports = mongoose.model("Order", orderSchema);
