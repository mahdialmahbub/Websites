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
    slug: "playful",
    name: "Playful",
    category: "Creative",
    description:
      "A friendly layout with a coloured contact band, a round photo and a light confetti pattern.",
    sortOrder: 4,
  },
  {
    slug: "bold-teal",
    name: "Bold Teal",
    category: "Modern",
    description:
      "A strong coloured sidebar with a round photo, a big name block and centred section headings.",
    sortOrder: 5,
  },
  {
    slug: "arch",
    name: "Arch",
    category: "Simple",
    description:
      "A soft rounded sidebar with a round photo, a large name and plenty of white space.",
    sortOrder: 6,
  },
  {
    slug: "executive",
    name: "Executive",
    category: "Professional",
    description:
      "A dark sidebar, a wide name banner with a round photo and a work timeline with date tags.",
    sortOrder: 7,
  },
  {
    slug: "creative-dark",
    name: "Creative Dark",
    category: "Creative",
    description:
      "A dark three-column layout with a hexagon photo, a coloured centre strip and sketch-style icons.",
    sortOrder: 8,
  },
  {
    slug: "classic-serif",
    name: "Classic Serif",
    category: "Professional",
    description:
      "A traditional layout with a centred serif name, a ruled header and two columns. No photo.",
    sortOrder: 9,
  },
  {
    slug: "elegant",
    name: "Elegant",
    category: "Simple",
    description:
      "A calm layout with a big serif name, a grey summary box and a thin dividing line. No photo.",
    sortOrder: 10,
  },
  {
    slug: "rounded",
    name: "Rounded",
    category: "Student",
    description:
      "A friendly layout with a round photo, a coloured name banner, pill-shaped headings and grey content boxes.",
    sortOrder: 11,
  },
  {
    slug: "wave",
    name: "Wave",
    category: "Modern",
    description:
      "A coloured header with a soft wave, a round photo, a light sidebar and icons on the experience.",
    sortOrder: 12,
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
