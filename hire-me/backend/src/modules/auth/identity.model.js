import mongoose from 'mongoose';

/** Links a user to an account at an OAuth provider (Google / LinkedIn). */
const identitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    provider: { type: String, enum: ['google', 'linkedin'], required: true },
    providerId: { type: String, required: true },
  },
  { timestamps: true },
);

identitySchema.index({ provider: 1, providerId: 1 }, { unique: true });

export const Identity = mongoose.model('Identity', identitySchema);
