import { ApiError } from '../../lib/ApiError.js';
import { Template } from '../catalog/template.model.js';
import { Resume } from '../resumes/resume.model.js';
import { Review } from './review.model.js';

const DOUBLE_SUBMIT_WINDOW_MS = 10 * 60 * 1000;

const reviewDto = (doc) => ({
  id: String(doc._id),
  rating: doc.rating,
  comment: doc.comment,
  authorName: doc.user?.name ?? (doc.guestName || 'Guest'),
  isGuest: !doc.user,
  resumeId: String(doc.resume),
  templateSlug: doc.templateSlug,
  status: doc.status,
  createdAt: doc.createdAt,
});

/**
 * Saves a review for one of the owner's OWN resumes (guest or user). New reviews wait for approval.
 * A double click / retry within 10 minutes returns the review that was just saved instead of a second one.
 */
export async function createReview(owner, input) {
  const resume = await Resume.findOne({ _id: input.resumeId, ...owner.filter }).select('design.templateId').lean();
  if (!resume) throw new ApiError(404, 'RESUME_NOT_FOUND', 'Resume not found');

  const who = owner.kind === 'user' ? { user: owner.userId } : { guestId: owner.guestId };

  const recent = await Review.findOne({
    resume: resume._id,
    ...who,
    createdAt: { $gte: new Date(Date.now() - DOUBLE_SUBMIT_WINDOW_MS) },
  }).lean();
  if (recent) return { review: reviewDto(recent), existing: true };

  const templateSlug = resume.design?.templateId ?? '';
  const template = templateSlug ? await Template.findOne({ slug: templateSlug }).select('_id').lean() : null;

  const doc = await Review.create({
    rating: input.rating,
    comment: input.comment,
    guestName: owner.kind === 'guest' ? input.guestName : '',
    ...who,
    resume: resume._id,
    template: template?._id ?? null,
    templateSlug,
  });
  return { review: reviewDto(doc.toObject()), existing: false };
}

// ───────── admin ─────────
export async function listReviews({ status, page, limit }) {
  const filter = status ? { status } : {};
  const [total, docs] = await Promise.all([
    Review.countDocuments(filter),
    Review.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('user', 'name')
      .lean(),
  ]);
  return {
    reviews: docs.map(reviewDto),
    pagination: { page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) },
  };
}

export async function setReviewStatus(id, status) {
  const doc = await Review.findByIdAndUpdate(id, { $set: { status } }, { new: true }).populate('user', 'name').lean();
  if (!doc) throw new ApiError(404, 'REVIEW_NOT_FOUND', 'Review not found');
  return reviewDto(doc);
}
