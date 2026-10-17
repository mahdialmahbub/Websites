import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
    emailVerified: { type: Boolean, default: false },
    emailVerifiedAt: Date,
    // select:false -> never loaded unless a query asks for it with .select('+passwordHash')
    passwordHash: { type: String, select: false },
    avatarUrl: String,
    // Bumped on password reset. Sessions store the value they were created with, so old sessions stop working.
    authVersion: { type: Number, default: 0 },
    lastLoginAt: Date,
  },
  { timestamps: true },
);

export const User = mongoose.model('User', userSchema);

/** The only shape of a user that is ever sent to the browser. */
export const toPublicUser = (user) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  emailVerified: user.emailVerified,
  avatarUrl: user.avatarUrl ?? null,
  createdAt: user.createdAt,
});
