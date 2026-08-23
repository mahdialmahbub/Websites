const express = require("express");
const router = express.Router();

const { protectCustomer } = require("../middlewares/auth");
const { otpLimiter } = require("../middlewares/rateLimiter");
const { createUploader } = require("../middlewares/upload");
const uploadCustomerImage = createUploader("customers");

const {
  getMyProfile,
  updateMyProfile,
  requestDeleteAccount,
  confirmDeleteAccount,
  requestChangePassword,
  confirmChangePassword,
  toggleTwoFactor,
  getMyDevices,
  logoutDevice,
  searchSettings,
} = require("../controllers/customerController");

const { getMyAddresses, addAddress, updateAddress, deleteAddress } = require("../controllers/addressController");
const { getMyCards, requestAddCard, confirmAddCard, updateCard, deleteCard } = require("../controllers/cardController");
const { getMyWishlist, addToWishlist, removeFromWishlist } = require("../controllers/wishlistController");

router.use(protectCustomer); // every route below requires a logged-in customer

// Profile
router.get("/profile", getMyProfile);
router.patch("/profile", uploadCustomerImage.single("image"), updateMyProfile);

// Settings / Security search
router.get("/settings/search", searchSettings);

// Account Management
router.post("/account/delete/request", otpLimiter, requestDeleteAccount);
router.post("/account/delete/confirm", confirmDeleteAccount);

// Password
router.post("/password/change/request", otpLimiter, requestChangePassword);
router.post("/password/change/confirm", confirmChangePassword);

// Two-Factor Verification
router.patch("/two-factor", toggleTwoFactor);

// Logged-in Devices
router.get("/devices", getMyDevices);
router.delete("/devices/:deviceId", logoutDevice);

// Saved Addresses
router.get("/addresses", getMyAddresses);
router.post("/addresses", addAddress);
router.patch("/addresses/:addressId", updateAddress);
router.delete("/addresses/:addressId", deleteAddress);

// Saved Cards
router.get("/cards", getMyCards);
router.post("/cards/request", otpLimiter, requestAddCard);
router.post("/cards/confirm", confirmAddCard);
router.patch("/cards/:cardId", updateCard);
router.delete("/cards/:cardId", deleteCard);

// Wishlist
router.get("/wishlist", getMyWishlist);
router.post("/wishlist/:productId", addToWishlist);
router.delete("/wishlist/:productId", removeFromWishlist);

module.exports = router;
