require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Admin = require("../models/Admin");
const Discount = require("../models/Discount");

const run = async () => {
  await connectDB();

  // ---------- Seed the first admin account ----------
  const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_SEED_EMAIL });
  if (!existingAdmin) {
    await Admin.create({
      name: process.env.ADMIN_SEED_NAME || "Super Admin",
      email: process.env.ADMIN_SEED_EMAIL,
      password: process.env.ADMIN_SEED_PASSWORD,
      role: "super_admin",
    });
    console.log(`✅ Admin created: ${process.env.ADMIN_SEED_EMAIL}`);
  } else {
    console.log("ℹ️  Admin already exists, skipping.");
  }

  // ---------- Seed default discount tags (15%, 30%) ----------
  for (const percentage of [15, 30]) {
    const exists = await Discount.findOne({ percentage });
    if (!exists) {
      await Discount.create({ percentage, isDefault: true });
      console.log(`✅ Default discount tag created: ${percentage}%`);
    }
  }

  console.log("🌱 Seeding complete.");
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
