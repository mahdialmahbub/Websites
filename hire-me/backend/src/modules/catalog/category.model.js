import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    // Made from the name by slugify(), always lower-case. The unique index below is what blocks
    // "Modern" / "modern" / "MODERN" from existing side by side, even when two requests race.
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 60 },
    description: { type: String, default: '', trim: true, maxlength: 300 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Category = mongoose.model('Category', categorySchema);
