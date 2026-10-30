/**
 * Seed + migration for the template catalog.   Run:  npm run seed
 * Safe to run again and again (everything is an upsert).
 *
 *  1. creates the categories and the templates that exist in the frontend registry
 *     (frontend/src/resume/templates/registry.js)  -> add new ones to the lists below
 *  2. migration: any template that has no category yet gets the "General" one
 */
import mongoose from "mongoose";
import { connectDB, disconnectDB } from "../src/config/db.js";
import { upsertCategoryByName } from "../src/modules/catalog/catalog.service.js";
import { Template } from "../src/modules/catalog/template.model.js";

const CATEGORIES = ["Professional", "Creative", "Modern", "Simple", "Student"];

// Keep in sync with the frontend registry: id = slug, category = one of the names above.
const TEMPLATES = [
  {
    slug: "professional",
    name: "Professional",
    category: "Professional",
    description:
      "Two columns with a coloured sidebar. Clean and easy for recruiters and ATS to read.",
    sortOrder: 0,
  },
  {
    slug: "minimal", // Part A er id er shathe hubohu mile
    name: "Minimal",
    category: "Simple",
    description:
      "A clean single-column layout with a large name, spaced headings and thin rules.",
    sortOrder: 2,
  },
  {
    slug: "timeline",
    name: "Timeline",
    category: "Modern",
    description:
      "A bold two-column layout with a coloured profile band, a work timeline and a dark sidebar.",
    sortOrder: 1,
  },
  {
    slug: "modern",
    name: "Modern",
    category: "Modern",
    description:
      "A clean two-column layout with a coloured sidebar for contact details and skills.",
    sortOrder: 3,
  },
];

const DEFAULT_CATEGORY = "General";

await connectDB();

for (const name of CATEGORIES) await upsertCategoryByName(name);

for (const item of TEMPLATES) {
  const category = await upsertCategoryByName(item.category);
  await Template.updateOne(
    { slug: item.slug },
    {
      $setOnInsert: {
        slug: item.slug,
        name: item.name,
        description: item.description,
        sortOrder: item.sortOrder,
        category: category._id,
        isActive: true,
      },
    },
    { upsert: true },
  );
}

// Migration: templates saved before categories existed (no `category` field at all).
const general = await upsertCategoryByName(DEFAULT_CATEGORY);
const migrated = await Template.collection.updateMany(
  { $or: [{ category: { $exists: false } }, { category: null }] },
  { $set: { category: general._id } },
);

console.log(
  `Seed done. Categories: ${await mongoose.model("Category").countDocuments()}, templates: ${await Template.countDocuments()}, migrated to "${DEFAULT_CATEGORY}": ${migrated.modifiedCount}`,
);
await disconnectDB();
