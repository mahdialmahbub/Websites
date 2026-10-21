import mongoose from 'mongoose';

/**
 * The CATALOG entry of a template (name, category, SEO text, on/off).
 * The look of a template lives in the frontend (src/resume/templates/<slug>); `slug` is the link between
 * the two and is what resumes save in design.templateId.
 */
const templateSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 60 },
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    description: { type: String, default: '', trim: true, maxlength: 400 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    // Optional SEO overrides. When empty the page builds its own title / description.
    metaTitle: { type: String, default: '', trim: true, maxlength: 70 },
    metaDescription: { type: String, default: '', trim: true, maxlength: 170 },
  },
  { timestamps: true },
);

templateSchema.index({ category: 1, isActive: 1, sortOrder: 1 });
templateSchema.index({ isActive: 1, sortOrder: 1, createdAt: 1 });

export const Template = mongoose.model('Template', templateSchema);
