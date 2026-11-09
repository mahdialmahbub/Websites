const { body } = require("express-validator");

const placeOrderValidator = [
  body("paymentMethod")
    .isIn(["Cash on Delivery", "Credit Card"])
    .withMessage("Payment method must be Cash on Delivery or Credit Card."),
  body("addressId").optional().isMongoId(),
  body("newAddress").optional().isObject(),
  body("card.cardNumber")
    .if(body("paymentMethod").equals("Credit Card"))
    .if((value, { req }) => !req.body.savedCardId)
    .notEmpty()
    .withMessage("Card number is required for a new card."),
];

module.exports = { placeOrderValidator };
