import mongoose from 'mongoose';

const { Schema } = mongoose;

const text = () => ({ type: String, default: '' });

const photoSchema = new Schema(
  { url: { type: String, required: true }, publicId: { type: String, required: true } },
  { _id: false },
);

export const personalInformationSchema = new Schema(
  {
    photo: { type: photoSchema, default: null },
    fullName: text(),
    email: text(),
    phone: text(),
    location: text(),
    professionalTitle: text(),
    linkedin: text(),
    website: text(),
  },
  { _id: false },
);

// Dates are stored as "YYYY-MM-DD" strings: no time zone surprises, trivially sortable.
export const experienceSchema = new Schema(
  {
    id: { type: String, required: true },
    companyName: text(),
    jobTitle: text(),
    employeeType: text(),
    location: text(),
    startDate: text(),
    endDate: text(),
    currentlyWorking: { type: Boolean, default: false },
    jobDescription: text(),
  },
  { _id: false },
);

export const educationSchema = new Schema(
  {
    id: { type: String, required: true },
    institutionName: text(),
    degree: text(),
    fieldOfStudy: text(),
    startDate: text(),
    endDate: text(),
    currentlyStudying: { type: Boolean, default: false },
    gpa: text(),
    description: text(),
  },
  { _id: false },
);

export const projectSchema = new Schema(
  {
    id: { type: String, required: true },
    projectName: text(),
    projectType: text(),
    role: text(),
    keyResponsibilities: text(),
    keyAchievements: text(),
    technologies: { type: [String], default: [] },
    projectUrl: text(),
    projectDescription: text(),
  },
  { _id: false },
);

export const languageSchema = new Schema(
  { id: { type: String, required: true }, name: text(), level: text() },
  { _id: false },
);

export const referenceSchema = new Schema(
  {
    id: { type: String, required: true },
    name: text(),
    jobTitle: text(),
    company: text(),
    relationship: text(),
    email: text(),
    phone: text(),
  },
  { _id: false },
);

const resumeSchema = new Schema(
  {
    // Exactly one owner: a logged-in user OR an anonymous guest (httpOnly cookie id).
    // A guest's resumes move to the user (guestId is removed) when the guest logs in - see claimGuestResumes.
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    guestId: { type: String },
    title: { type: String, default: 'Untitled Resume' },

    // draft = being edited, generated = the user pressed "Generate" at least once (it has a share link).
    // There is NO limit on resumes per template or per user.
    status: { type: String, enum: ['draft', 'generated'], default: 'draft' },
    generatedAt: Date,

    // 0-100, calculated by the ATS rules (added in a later phase). null = not calculated yet.
    atsScore: { type: Number, min: 0, max: 100, default: null },

    // What "Use This" / Template / Color pickers save. design.templateId = Template.slug.
    // The look of a template lives in the frontend; the Template collection holds its catalog data.
    design: {
      templateId: { type: String, default: null },
      color: { type: String, default: null },
      font: { type: String, default: null },
    },

    personalInformation: { type: personalInformationSchema, default: () => ({}) },
    professionalSummary: text(),
    workExperience: { type: [experienceSchema], default: [] },
    education: { type: [educationSchema], default: [] },
    projects: { type: [projectSchema], default: [] },
    skills: { type: [String], default: [] },
    languages: { type: [languageSchema], default: [] },
    references: { type: [referenceSchema], default: [] },

    // Optional job the resume is tailored for (used by the ATS match score later).
    targetJob: { title: text(), description: text() },

    // Public share link. Managed only by the share endpoints (never by the client's autosave).
    share: {
      enabled: { type: Boolean, default: false },
      slug: { type: String },
      hideContact: { type: Boolean, default: true }, // privacy first: e-mail / phone hidden on the public page
      sharedAt: Date,
    },

    // Set when the resume was created from a browser draft. Makes "create from draft" idempotent (retries, double clicks).
    sourceDraftId: { type: String },

    // +1 on every save. Lets the client detect that another tab/device saved in between.
    revision: { type: Number, default: 0 },
  },
  { timestamps: true, minimize: false },
);

// A resume must belong to somebody.
resumeSchema.pre('validate', function () {
  if (!this.user && !this.guestId) {
    this.invalidate('user', 'A resume needs an owner');
  }
});

resumeSchema.index({ user: 1, updatedAt: -1 });
resumeSchema.index({ guestId: 1, updatedAt: -1 }, { partialFilterExpression: { guestId: { $type: 'string' } } });
resumeSchema.index({ 'share.slug': 1 }, { unique: true, partialFilterExpression: { 'share.slug': { $type: 'string' } } });
// Unchanged from milestone 2 (same options, so MongoDB keeps the existing index). Only users send a
// clientDraftId; guests are saved straight to the database, so their resumes never have a sourceDraftId.
resumeSchema.index(
  { user: 1, sourceDraftId: 1 },
  { unique: true, partialFilterExpression: { sourceDraftId: { $type: 'string' } } },
);

export const Resume = mongoose.model('Resume', resumeSchema);
