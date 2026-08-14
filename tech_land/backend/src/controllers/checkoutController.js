const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Address = require("../models/Address");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { calculatePrice } = require("../services/pricingService");
const { createOtp, verifyOtp } = require("../services/otpService");
const sendSms = require("../utils/sendSms");
const { detectCardNetwork, maskCardNumber } = require("../utils/cardHelpers");
const generateOrderId = require("../utils/generateOrderId");

const SHIPPING_CHARGE = () => Number(process.env.DEFAULT_SHIPPING_CHARGE) || 0;
const VAT_PERCENTAGE = () => Number(process.env.VAT_PERCENTAGE) || 0;
const DELIVERY_DURATION_DAYS = 5;

// Builds order-ready item snapshots + the full price summary from the customer's live cart
const buildOrderPricing = async (customerId) => {
  const cart = await Cart.findOne({ customer: customerId }).populate({
    path: "items.product",
    select: "title images brand variants startingPrice discountPercentage stock status sellerPhone guaranteeMonths warrantyMonths supportInfo",
    populate: { path: "brand", select: "name" },
  });

  if (!cart || cart.items.length === 0) throw new ApiError(400, "Your cart is empty.");

  let subtotal = 0;
  let discount = 0;
  const items = [];

  for (const cartItem of cart.items) {
    const product = cartItem.product;
    if (!product) continue;
    if (product.status !== "Active") throw new ApiError(400, `"${product.title}" is no longer available.`);
    if (product.stock < cartItem.quantity) throw new ApiError(400, `Insufficient stock for "${product.title}".`);

    const pricing = calculatePrice(product, cartItem.selectedVariantIds, cartItem.quantity);

    subtotal += pricing.unitOriginalPrice * cartItem.quantity;
    discount += (pricing.unitOriginalPrice - pricing.unitDiscountedPrice) * cartItem.quantity;

    items.push({
      product: product._id,
      productTitle: product.title,
      productImage: product.images?.[0]?.url,
      brandName: product.brand?.name,
      selectedVariants: pricing.appliedVariants,
      color: cartItem.selectedColor,
      quantity: cartItem.quantity,
      unitPrice: pricing.unitDiscountedPrice,
      totalPrice: pricing.totalPrice,
      sellerPhone: product.sellerPhone,
      guaranteeMonths: product.guaranteeMonths,
      warrantyMonths: product.warrantyMonths,
      supportInfo: product.supportInfo,
    });
  }

  subtotal = Math.round(subtotal * 100) / 100;
  discount = Math.round(discount * 100) / 100;
  const shippingCharge = SHIPPING_CHARGE();
  const vat = Math.round(((subtotal - discount) * VAT_PERCENTAGE()) / 100 * 100) / 100;
  const total = Math.round((subtotal - discount + shippingCharge + vat) * 100) / 100;

  return { items, subtotal, discount, shippingCharge, vat, total };
};

// Resolves the delivery address either from a saved addressId or inline new-address fields
const resolveDeliveryAddress = async (customerId, { addressId, newAddress }) => {
  if (addressId) {
    const saved = await Address.findOne({ _id: addressId, customer: customerId });
    if (!saved) throw new ApiError(404, "Selected address not found.");
    return saved.toObject();
  }
  if (newAddress) return newAddress;
  throw new ApiError(400, "A delivery address is required.");
};

const decrementStockAndBumpSoldCount = async (items) => {
  await Promise.all(
    items.map((item) =>
      Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, soldCount: item.quantity },
      })
    )
  );
};

const createOrderDocument = async ({ customerId, pricing, deliveryAddress, paymentMethod, paymentStatus, cardSnapshot }) => {
  const now = new Date();
  const order = await Order.create({
    orderId: generateOrderId(),
    customer: customerId,
    items: pricing.items,
    status: "Pending",
    statusTimeline: [{ status: "Pending", at: now }],
    paymentMethod,
    paymentStatus,
    cardSnapshot,
    subtotal: pricing.subtotal,
    discount: pricing.discount,
    shippingCharge: pricing.shippingCharge,
    vat: pricing.vat,
    total: pricing.total,
    deliveryAddress,
    estimatedDeliveryDurationDays: DELIVERY_DURATION_DAYS,
    estimatedDeliveryDate: new Date(now.getTime() + DELIVERY_DURATION_DAYS * 24 * 60 * 60 * 1000),
  });

  await decrementStockAndBumpSoldCount(pricing.items);
  await Cart.findOneAndUpdate({ customer: customerId }, { items: [] });

  return order;
};

/**
 * POST /api/checkout/place-order
 * body: { paymentMethod: "Cash on Delivery" | "Credit Card",
 *         addressId? , newAddress?,
 *         savedCardId? , card?: { cardNumber, cardHolderName, expiryMonth, expiryYear, cvv } }
 *
 * COD -> order is created immediately.
 * Credit Card -> an OTP is sent to the customer's registered phone; order is only
 *                created after verify-payment-otp succeeds (see below).
 */
const placeOrder = asyncHandler(async (req, res) => {
  const { paymentMethod, addressId, newAddress, savedCardId, card } = req.body;

  const pricing = await buildOrderPricing(req.customer._id);
  const deliveryAddress = await resolveDeliveryAddress(req.customer._id, { addressId, newAddress });

  if (paymentMethod === "Cash on Delivery") {
    const order = await createOrderDocument({
      customerId: req.customer._id,
      pricing,
      deliveryAddress,
      paymentMethod,
      paymentStatus: "Pending",
    });
    return res.status(201).json(new ApiResponse(201, { order, paymentVerificationRequired: false }, "Order placed."));
  }

  if (paymentMethod === "Credit Card") {
    let cardSnapshot;
    if (savedCardId) {
      const Card = require("../models/Card");
      const savedCard = await Card.findOne({ _id: savedCardId, customer: req.customer._id });
      if (!savedCard) throw new ApiError(404, "Saved card not found.");
      cardSnapshot = { maskedNumber: savedCard.maskedNumber, network: savedCard.network };
    } else if (card?.cardNumber) {
      cardSnapshot = { maskedNumber: maskCardNumber(card.cardNumber), network: detectCardNetwork(card.cardNumber) };
    } else {
      throw new ApiError(400, "Card details or a saved card are required for Credit Card payment.");
    }

    // Store the fully-priced draft order in the OTP's meta so verify-payment-otp
    // can create the exact same order without re-trusting client input.
    const otp = await createOtp({
      identifier: req.customer.phone,
      purpose: "PAYMENT_VERIFICATION",
      meta: { pricing, deliveryAddress, paymentMethod, cardSnapshot },
    });
    await sendSms({ to: req.customer.phone, message: `Your Tect Store payment verification code is ${otp}.` });

    return res
      .status(200)
      .json(new ApiResponse(200, { paymentVerificationRequired: true }, "OTP sent to your registered phone number."));
  }

  throw new ApiError(400, "Invalid payment method.");
});

/**
 * POST /api/checkout/verify-payment-otp
 * body: { otp }
 */
const verifyPaymentOtp = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const meta = await verifyOtp({ identifier: req.customer.phone, purpose: "PAYMENT_VERIFICATION", code: otp });

  const order = await createOrderDocument({
    customerId: req.customer._id,
    pricing: meta.pricing,
    deliveryAddress: meta.deliveryAddress,
    paymentMethod: meta.paymentMethod,
    paymentStatus: "Paid",
    cardSnapshot: meta.cardSnapshot,
  });

  res.status(201).json(new ApiResponse(201, { order }, "Payment verified. Order confirmed!"));
});

module.exports = { placeOrder, verifyPaymentOtp };
