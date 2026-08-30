const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");

const { notFound, errorHandler } = require("./middlewares/errorHandler");
const { apiLimiter } = require("./middlewares/rateLimiter");

const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const messageRoutes = require("./routes/messageRoutes");
const catalogRoutes = require("./routes/catalogRoutes");
const deliveryManRoutes = require("./routes/deliveryManRoutes");

const app = express();

// ---------- Core middleware ----------
app.use(helmet({ crossOriginResourcePolicy: false })); // allow images to be loaded cross-origin by the Next.js frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(compression());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(cookieParser());
app.use(mongoSanitize()); // strips $ / . operators from user input to prevent NoSQL injection
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));
app.use("/api", apiLimiter);

// ---------- Static file serving for uploaded images ----------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------- Health check ----------
app.get("/api/health", (req, res) =>
  res.status(200).json({ success: true, message: "API is healthy." }),
);

// ---------- Routes ----------
app.use("/api/auth", authRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/categories", catalogRoutes);
app.use("/api/admin/delivery-men", deliveryManRoutes);

// ---------- 404 + error handling (must be last) ----------
app.use(notFound);
app.use(errorHandler);

module.exports = app;
