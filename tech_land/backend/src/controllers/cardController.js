const Card = require("../models/Card");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { createOtp, verifyOtp } = require("../services/otpService");
const { sendEmail, otpEmailTemplate } = require("../utils/sendEmail");
const { detectCardNetwork, maskCardNumber } = require("../utils/cardHelpers");

const getMyCards = asyncHandler(async (req, res) => {
  const cards = await Card.find({ customer: req.customer._id }).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, cards, "Saved cards fetched."));
});

/**
 * STEP 1 — Customer fills the "Add Card" form. We validate the card fields,
 * temporarily hold them (NOT the CVV — never persisted, not even temporarily)
 * and send an OTP to confirm the customer really owns this card/phone.
 * POST /api/customer/cards/request
 */
const requestAddCard = asyncHandler(async (req, res) => {
  const { cardNumber, cardHolderName, expiryMonth, expiryYear, billingAddress } = req.body;
  // cardNumber and CVV pass through this request only to compute the masked
  // number/network below — neither is ever written to the database.

  const otp = await createOtp({
    identifier: req.customer.email,
    purpose: "ADD_CARD",
    meta: {
      maskedNumber: maskCardNumber(cardNumber),
      last4: cardNumber.slice(-4),
      network: detectCardNetwork(cardNumber),
      cardHolderName,
      expiryMonth,
      expiryYear,
      billingAddress,
    },
  });

  await sendEmail({
    to: req.customer.email,
    subject: "Confirm adding a new card",
    html: otpEmailTemplate(otp, "confirm adding this card to your account"),
  });

  res.status(200).json(new ApiResponse(200, null, "OTP sent to your email to confirm this card."));
});

/**
 * STEP 2 — Verify OTP, then persist only the masked/safe card fields.
 * POST /api/customer/cards/confirm
 */
const confirmAddCard = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const meta = await verifyOtp({ identifier: req.customer.email, purpose: "ADD_CARD", code: otp });

  const card = await Card.create({
    customer: req.customer._id,
    maskedNumber: meta.maskedNumber,
    last4: meta.last4,
    network: meta.network,
    cardHolderName: meta.cardHolderName,
    expiryMonth: meta.expiryMonth,
    expiryYear: meta.expiryYear,
    billingAddress: meta.billingAddress,
  });

  res.status(201).json(new ApiResponse(201, card, "Card added successfully."));
});

const deleteCard = asyncHandler(async (req, res) => {
  const card = await Card.findOneAndDelete({ _id: req.params.cardId, customer: req.customer._id });
  if (!card) throw new ApiError(404, "Card not found.");
  res.status(200).json(new ApiResponse(200, null, "Card removed."));
});

module.exports = { getMyCards, requestAddCard, confirmAddCard, deleteCard };
