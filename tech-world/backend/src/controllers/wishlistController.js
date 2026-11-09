const Customer = require("../models/Customer");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const getMyWishlist = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.customer._id).populate({
    path: "wishlist",
    select: "title images startingPrice discountPercentage rating badges status",
  });
  res.status(200).json(new ApiResponse(200, customer.wishlist));
});

const addToWishlist = asyncHandler(async (req, res) => {
  await Customer.findByIdAndUpdate(req.customer._id, {
    $addToSet: { wishlist: req.params.productId }, // no duplicates
  });
  res.status(200).json(new ApiResponse(200, null, "Added to wishlist."));
});

const removeFromWishlist = asyncHandler(async (req, res) => {
  await Customer.findByIdAndUpdate(req.customer._id, {
    $pull: { wishlist: req.params.productId },
  });
  res.status(200).json(new ApiResponse(200, null, "Removed from wishlist."));
});

module.exports = { getMyWishlist, addToWishlist, removeFromWishlist };
