const ApiError = require("../utils/ApiError");

/**
 * Calculates the final price for a product given selected variant IDs and quantity.
 * Formula: (startingPrice + sum(variant.priceAdjustment)) -> apply discount% -> * quantity
 *
 * @param {Object} product - Mongoose Product document (or plain object) with variants[] & discountPercentage
 * @param {string[]} selectedVariantIds - array of variant _id strings the customer selected
 * @param {number} quantity
 * @returns {{unitOriginalPrice:number, unitDiscountedPrice:number, totalPrice:number, appliedVariants:Array, discountPercentage:number}}
 */
const calculatePrice = (product, selectedVariantIds = [], quantity = 1) => {
  if (quantity < 1) throw new ApiError(400, "Quantity must be at least 1");

  const appliedVariants = [];
  let variantAdjustmentTotal = 0;

  for (const variantId of selectedVariantIds) {
    const variant = product.variants.id
      ? product.variants.id(variantId)
      : product.variants.find((v) => String(v._id) === String(variantId));

    if (!variant) throw new ApiError(400, `Invalid variant selection: ${variantId}`);
    appliedVariants.push({ name: variant.name, priceAdjustment: variant.priceAdjustment, group: variant.group });
    variantAdjustmentTotal += variant.priceAdjustment;
  }

  const unitOriginalPrice = Math.max(0, product.startingPrice + variantAdjustmentTotal);
  const discountPercentage = product.discountPercentage || 0;
  const unitDiscountedPrice = Math.round(unitOriginalPrice * (1 - discountPercentage / 100) * 100) / 100;

  return {
    unitOriginalPrice,
    unitDiscountedPrice,
    totalPrice: Math.round(unitDiscountedPrice * quantity * 100) / 100,
    appliedVariants,
    discountPercentage,
  };
};

// Resolves the default-selected variant IDs for a fresh Product Details page load
const getDefaultVariantIds = (product) => {
  return product.variants.filter((v) => v.isDefault).map((v) => String(v._id));
};

module.exports = { calculatePrice, getDefaultVariantIds };
