import { z } from 'zod';

const OBJECT_ID = /^[a-f\d]{24}$/i;
// eslint-disable-next-line no-control-regex
const clean = (value) => value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');

export const createReviewBody = z.object({
  resumeId: z.string().regex(OBJECT_ID, 'Invalid resume id'),
  rating: z.number({ error: 'Choose a rating from 1 to 5' }).int().min(1, 'Choose a rating from 1 to 5').max(5, 'Choose a rating from 1 to 5'),
  comment: z.string().trim().max(1000, 'Maximum 1000 characters').transform(clean).default(''),
  guestName: z.string().trim().max(60, 'Maximum 60 characters').transform(clean).default(''),
  // Honeypot: the form has a hidden input called "website" that people never fill in, bots do.
  website: z.string().max(200).optional(),
});

export const adminReviewsQuery = z.object({
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
  page: z.coerce.number().int().min(1).max(1000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const reviewIdParams = z.object({ id: z.string().regex(OBJECT_ID, 'Invalid review id') });
export const reviewStatusBody = z.object({ status: z.enum(['pending', 'approved', 'rejected']) });
