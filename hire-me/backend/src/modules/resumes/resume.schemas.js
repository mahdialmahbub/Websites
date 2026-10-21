import { z } from 'zod';

const OBJECT_ID = /^[a-f\d]{24}$/i;
export const resumeIdParams = z.object({ id: z.string().regex(OBJECT_ID, 'Invalid resume id') });
export const slugParams = z.object({ slug: z.string().regex(/^[\w-]{8,32}$/, 'Invalid link') });

// Strips invisible control characters (keeps tab and new lines) from pasted text.
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const clean = (value) => value.replace(CONTROL_CHARS, '');

const text = (max) => z.string().trim().max(max, `Maximum ${max} characters`).transform(clean);
/** Optional text inside a section: missing -> "" */
const field = (max) => text(max).default('');

/*
 * AUTOSAVE STORES DRAFTS. A draft can be half typed ("john@", "linkedin.com/in/"), so formats are NOT
 * enforced here - the UI validates, and anything shown on a public page is checked again at render time.
 * What the server does enforce: sizes, no control characters, and no dangerous link schemes.
 */
const DANGEROUS_SCHEME = /^\s*(javascript|data|vbscript|file|blob):/i;
const HAS_SCHEME = /^[a-z][a-z\d+.-]*:\/\//i;

// "linkedin.com/in/me" -> "https://linkedin.com/in/me"
const urlField = z
  .string()
  .trim()
  .max(300, 'Maximum 300 characters')
  .refine((value) => !DANGEROUS_SCHEME.test(value), 'This kind of link is not allowed')
  .transform((value) => (value === '' || HAS_SCHEME.test(value) ? value : `https://${value}`))
  .transform(clean)
  .default('');

const emailField = field(254);
const phoneField = field(40);
const dateField = z.string().trim().max(10).regex(/^[\d-]*$/, 'Use the YYYY-MM-DD format').default('');

const itemId = z.string().trim().max(64).regex(/^[\w-]*$/, 'Invalid id').optional();

const uniqueList = (list) => {
  const seen = new Set();
  return list.filter((entry) => {
    const key = entry.toLowerCase();
    if (!entry || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const tagList = (maxItems, maxLength) =>
  z
    .array(z.string().trim().max(maxLength, `Maximum ${maxLength} characters`).transform(clean))
    .max(maxItems, `Maximum ${maxItems} items`)
    .transform(uniqueList);

// ───────── sections ─────────
const personalInformation = z.object({
  photo: z
    .object({ url: z.string().trim().max(600), publicId: z.string().trim().max(300) })
    .nullable()
    .default(null),
  fullName: field(100),
  email: emailField,
  phone: phoneField,
  location: field(120),
  professionalTitle: field(120),
  linkedin: urlField,
  website: urlField,
});

const experienceItem = z
  .object({
    id: itemId,
    companyName: field(120),
    jobTitle: field(120),
    employeeType: field(40),
    location: field(120),
    startDate: dateField,
    endDate: dateField,
    currentlyWorking: z.boolean().default(false),
    jobDescription: field(2000),
  })
  .transform((item) => (item.currentlyWorking ? { ...item, endDate: '' } : item));

const educationItem = z
  .object({
    id: itemId,
    institutionName: field(150),
    degree: field(150),
    fieldOfStudy: field(150),
    startDate: dateField,
    endDate: dateField,
    currentlyStudying: z.boolean().default(false),
    gpa: field(20),
    description: field(1500),
  })
  .transform((item) => (item.currentlyStudying ? { ...item, endDate: '' } : item));

const projectItem = z.object({
  id: itemId,
  projectName: field(120),
  projectType: field(60),
  role: field(100),
  keyResponsibilities: field(1500),
  keyAchievements: field(500),
  technologies: tagList(30, 40).default([]),
  projectUrl: urlField,
  projectDescription: field(1500),
});

const languageItem = z.object({ id: itemId, name: field(50), level: field(30) });

const referenceItem = z.object({
  id: itemId,
  name: field(100),
  jobTitle: field(100),
  company: field(120),
  relationship: field(60),
  email: emailField,
  phone: phoneField,
});

const design = z.object({
  templateId: z.string().trim().regex(/^[\w-]{1,50}$/, 'Invalid template id').optional(),
  color: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, 'Use a hex color like #1a2b3c').optional(),
  font: z.string().trim().regex(/^[\w\s-]{1,50}$/, 'Invalid font name').optional(),
});

const titleField = z.string().trim().min(1, 'Title is required').max(100, 'Maximum 100 characters').transform(clean);
const targetJob = z.object({ title: field(120), description: field(5000) });

/**
 * The 8 sections shared by resumes and the profile.
 * Do not build update schemas with .partial(): in zod 4 defaults inside optional fields would be applied
 * to sections that were NOT sent and silently wipe them.
 */
export const sections = {
  personalInformation: personalInformation.optional(),
  professionalSummary: text(2000).optional(),
  workExperience: z.array(experienceItem).max(30, 'Maximum 30 entries').optional(),
  education: z.array(educationItem).max(20, 'Maximum 20 entries').optional(),
  projects: z.array(projectItem).max(30, 'Maximum 30 entries').optional(),
  skills: tagList(50, 50).optional(),
  languages: z.array(languageItem).max(15, 'Maximum 15 entries').optional(),
  references: z.array(referenceItem).max(10, 'Maximum 10 entries').optional(),
};

// ───────── request bodies ─────────

/** The profile page's save: any subset of the 8 sections. */
export const profileUpdateBody = z.object(sections);

/**
 * Create a resume. Three ways to call it:
 *  - {}                          -> new resume pre-filled from the user's profile
 *  - { design }                  -> same, with a template chosen ("Use This")
 *  - { clientDraftId, ...sections } -> create from a browser draft (guest draft after login). Safe to retry.
 */
export const createResumeBody = z.object({
  title: titleField.optional(),
  design: design.optional(),
  clientDraftId: z.string().regex(/^[\w-]{8,64}$/, 'Invalid draft id').optional(),
  targetJob: targetJob.optional(),
  ...sections,
});

/**
 * Autosave body: send ONLY the sections that changed. A section you send replaces the stored one
 * (arrays included), except `design`, which is merged key by key.
 */
export const updateResumeBody = z.object({
  title: titleField.optional(),
  design: design.optional(),
  targetJob: targetJob.optional(),
  revision: z.number().int().min(0).optional(),
  ...sections,
});

export const shareBody = z.object({
  hideContact: z.boolean().optional(),
  rotate: z.boolean().optional(),
});

// ───────── list / claim ─────────
export const listResumesQuery = z.object({
  page: z.coerce.number().int().min(1).max(1000).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

/** Optional: the guest's latest data from the browser (localStorage) so auto-fill keeps working after login. */
export const claimBody = z.object({
  draft: z.object(sections).optional(),
});

export const generateBody = z.object({
  hideContact: z.boolean().optional(),
});
