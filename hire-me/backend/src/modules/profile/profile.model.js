import mongoose from 'mongoose';
import {
  educationSchema,
  experienceSchema,
  languageSchema,
  personalInformationSchema,
  projectSchema,
  referenceSchema,
} from '../resumes/resume.model.js';

const { Schema } = mongoose;

/**
 * The user's reusable "master data" - the same 8 sections as the builder / profile page.
 * New resumes start pre-filled from it, and it is updated from the resumes the user builds.
 * One document per user.
 */
const profileSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    personalInformation: { type: personalInformationSchema, default: () => ({}) },
    professionalSummary: { type: String, default: '' },
    workExperience: { type: [experienceSchema], default: [] },
    education: { type: [educationSchema], default: [] },
    projects: { type: [projectSchema], default: [] },
    skills: { type: [String], default: [] },
    languages: { type: [languageSchema], default: [] },
    references: { type: [referenceSchema], default: [] },
  },
  { timestamps: true, minimize: false },
);

export const Profile = mongoose.model('Profile', profileSchema);
