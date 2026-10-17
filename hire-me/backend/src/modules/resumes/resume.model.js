import mongoose from 'mongoose';

const { Schema } = mongoose;

const text = () => ({ type: String, default: '' });

const photoSchema = new Schema(
  { url: { type: String, required: true }, publicId: { type: String, required: true } },
  { _id: false },
);

const personalInformationSchema = new Schema(
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
const experienceSchema = new Schema(
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

const educationSchema = new Schema(
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

const projectSchema = new Schema(
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

const languageSchema = new Schema(
  { id: { type: String, required: true }, name: text(), level: text() },
  { _id: false },
);

const referenceSchema = new Schema(
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
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: 'Untitled Resume' },

    // What "Use This" / Template / Color pickers save. Templates themselves live in the frontend.
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

    // +1 on every save. Lets the client detect that another tab/device saved in between.
    revision: { type: Number, default: 0 },
  },
  { timestamps: true, minimize: false },
);

resumeSchema.index({ user: 1, updatedAt: -1 });

export const Resume = mongoose.model('Resume', resumeSchema);
