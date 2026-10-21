import mongoose from 'mongoose';

const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    rating: { type: Number, required: true, min: 1, max: 5, validate: Number.isInteger },
    comment: { type: String, default: '', trim: true, maxlength: 1000 },

    // Who wrote it: a user, or a guest (anonymous cookie id + the name they typed, if any).
    user: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    guestId: { type: String, default: null },
    guestName: { type: String, default: '', trim: true, maxlength: 60 },

    resume: { type: Schema.Types.ObjectId, ref: 'Resume', required: true },
    template: { type: Schema.Types.ObjectId, ref: 'Template', default: null }, // null when the template was deleted
    templateSlug: { type: String, default: '' }, //                              kept for display after a deletion

    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

reviewSchema.index({ status: 1, createdAt: -1 });
reviewSchema.index({ resume: 1, createdAt: -1 });

export const Review = mongoose.model('Review', reviewSchema);
