// routes/deliveryManRoutes.js
const express = require("express");
const router = express.Router();

const {
  createDeliveryMan,
  getDeliveryMen,
  getDeliveryManDetails,
  updateDeliveryMan,
  updateDeliveryManStatus,
  deleteDeliveryMan,
} = require("../controllers/deliveryManController");
const { protectAdmin } = require("../middlewares/auth");
const { createUploader } = require("../middlewares/upload");

const uploadDeliveryManImage = createUploader("delivery-man");

router
  .route("/")
  .get(protectAdmin, getDeliveryMen)
  .post(protectAdmin, uploadDeliveryManImage.single("image"), createDeliveryMan);

router
  .route("/:id")
  .get(protectAdmin, getDeliveryManDetails)
  .put(protectAdmin, uploadDeliveryManImage.single("image"), updateDeliveryMan)
  .delete(protectAdmin, deleteDeliveryMan);

router.patch("/:id/status", protectAdmin, updateDeliveryManStatus);

module.exports = router;
