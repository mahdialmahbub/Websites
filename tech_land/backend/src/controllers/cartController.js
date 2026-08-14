const Cart = require("../models/Cart");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { calculatePrice } = require("../services/pricingService");

// Builds the full cart response with live-calculated prices for every item
// (never trusts stored prices — always recomputed from the current product doc)
const buildCartResponse = async (customerId) => {
  const cart = await Cart.findOne({ customer: customerId }).populate({
    path: "items.product",
    select: "title images variants startingPrice discountPercentage stock status",
  });

  if (!cart) return { items: [], subtotal: 0 };

  const items = cart.items
    .filter((item) => item.product) // guard against a deleted product still referenced
    .map((item) => {
      const pricing = calculatePrice(item.product, item.selectedVariantIds, item.quantity);
      return {
        cartItemId: item._id,
        product: {
          _id: item.product._id,
          title: item.product.title,
          image: item.product.images?.[0]?.url,
          stock: item.product.stock,
          status: item.product.status,
        },
        selectedVariants: pricing.appliedVariants,
        selectedColor: item.selectedColor,
        quantity: item.quantity,
        unitPrice: pricing.unitDiscountedPrice,
        totalPrice: pricing.totalPrice,
      };
    });

  const subtotal = Math.round(items.reduce((sum, i) => sum + i.totalPrice, 0) * 100) / 100;

  return { items, subtotal };
};

const getMyCart = asyncHandler(async (req, res) => {
  const cart = await buildCartResponse(req.customer._id);
  res.status(200).json(new ApiResponse(200, cart, "Cart fetched."));
});

/**
 * POST /api/cart/items
 * body: { productId, selectedVariantIds: [], selectedColor, quantity }
 * Used by both "Add to Cart" and "Buy Now" (frontend redirects to /cart after this call for Buy Now)
 */
const addToCart = asyncHandler(async (req, res) => {
  const { productId, selectedVariantIds = [], selectedColor, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found.");
  if (product.status !== "Active") throw new ApiError(400, "This product is currently unavailable.");
  if (product.stock < quantity) throw new ApiError(400, `Only ${product.stock} unit(s) in stock.`);

  // Validates the variant IDs exist on the product before storing the selection
  calculatePrice(product, selectedVariantIds, quantity);

  let cart = await Cart.findOne({ customer: req.customer._id });
  if (!cart) cart = new Cart({ customer: req.customer._id, items: [] });

  const existingItem = cart.items.find(
    (item) =>
      String(item.product) === String(productId) &&
      JSON.stringify([...item.selectedVariantIds].sort()) === JSON.stringify([...selectedVariantIds].sort()) &&
      item.selectedColor === selectedColor
  );

  if (existingItem) {
    existingItem.quantity += Number(quantity);
  } else {
    cart.items.push({ product: productId, selectedVariantIds, selectedColor, quantity });
  }

  await cart.save();
  const response = await buildCartResponse(req.customer._id);
  res.status(200).json(new ApiResponse(200, response, "Added to cart."));
});

/**
 * PATCH /api/cart/items/:cartItemId
 * body: { selectedVariantIds, selectedColor, quantity }
 */
const updateCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ customer: req.customer._id });
  if (!cart) throw new ApiError(404, "Cart not found.");

  const item = cart.items.id(req.params.cartItemId);
  if (!item) throw new ApiError(404, "Cart item not found.");

  if (req.body.selectedVariantIds !== undefined) item.selectedVariantIds = req.body.selectedVariantIds;
  if (req.body.selectedColor !== undefined) item.selectedColor = req.body.selectedColor;
  if (req.body.quantity !== undefined) item.quantity = req.body.quantity;

  await cart.save();
  const response = await buildCartResponse(req.customer._id);
  res.status(200).json(new ApiResponse(200, response, "Cart item updated."));
});

const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ customer: req.customer._id });
  if (!cart) throw new ApiError(404, "Cart not found.");

  cart.items = cart.items.filter((item) => String(item._id) !== req.params.cartItemId);
  await cart.save();

  const response = await buildCartResponse(req.customer._id);
  res.status(200).json(new ApiResponse(200, response, "Item removed from cart."));
});

module.exports = { getMyCart, addToCart, updateCartItem, removeCartItem, buildCartResponse };
