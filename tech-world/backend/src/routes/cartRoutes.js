const express = require("express");
const router = express.Router();

const { protectCustomer } = require("../middlewares/auth");
const { getMyCart, addToCart, updateCartItem, removeCartItem } = require("../controllers/cartController");

router.use(protectCustomer);

router.get("/", getMyCart);
router.post("/items", addToCart);
router.patch("/items/:cartItemId", updateCartItem);
router.delete("/items/:cartItemId", removeCartItem);

module.exports = router;
