import { z } from 'zod';

const email = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, 'Email is too long')
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid email address');

const password = z.string().min(8, 'Password must be at least 8 characters').max(128, 'Password is too long');
const otp = z.string().trim().regex(/^\d{6}$/, 'Enter the 6-digit code');
const name = z.string().trim().min(2, 'Name is too short').max(80, 'Name is too long');

export const registerBody = z.object({ name, email, password });
export const loginBody = z.object({ email, password: z.string().min(1, 'Password is required').max(128) });
export const verifyEmailBody = z.object({ email, otp });
export const resendOtpBody = z.object({ email, purpose: z.enum(['verify_email', 'reset_password']) });
export const forgotPasswordBody = z.object({ email });
export const verifyResetOtpBody = z.object({ email, otp });
export const resetPasswordBody = z.object({ password });

export const oauthParams = z.object({ provider: z.enum(['google', 'linkedin']) });
export const oauthStartQuery = z.object({ next: z.string().max(300).optional() });
