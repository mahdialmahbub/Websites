/**
 * Pure helpers behind the builder state. No React / Redux imports on purpose - easy to test.
 *
 * THE BUILDER ALWAYS WORKS ON A LOCAL DRAFT (Redux + localStorage), for guests and logged-in users alike:
 *   guest      -> the draft only lives in the browser
 *   logged in  -> the same draft is auto-saved to the server (first save creates the resume, later saves PATCH it)
 * so "guest builds a resume, then logs in" is just "the first save happens later".
 */

export const STORAGE_KEY = 'rb.builderDraft.v1';

/** ownerId of a draft whose server resume belongs to an anonymous guest (see the guest cookie on the server). */
export const GUEST_OWNER = 'guest';

/** The newest information a guest typed (all 8 sections). It auto-fills their NEXT resume and is handed to the account at login. */
export const GUEST_PROFILE_KEY = 'rb.guestProfile.v1';

/** The 8 sections shared with the profile, plus the resume-only targetJob. */
export const CONTENT_SECTIONS = [
  'personalInformation',
  'professionalSummary',
  'workExperience',
  'education',
  'projects',
  'skills',
  'languages',
  'references',
  'targetJob',
];
/** Sections that are shared with the profile page (used to decide "is this draft blank?"). */
export const PROFILE_SECTIONS = CONTENT_SECTIONS.filter((section) => section !== 'targetJob');

export const newId = () =>
  globalThis.crypto?.randomUUID?.() ?? `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export const emptyPersonalInformation = () => ({
  photo: null, // { url, publicId } from the upload endpoint
  fullName: '',
  email: '',
  phone: '',
  location: '',
  professionalTitle: '',
  linkedin: '',
  website: '',
});

// Dates are 'YYYY-MM-DD' strings.
const itemFactories = {
  workExperience: () => ({
    id: newId(), companyName: '', jobTitle: '', employeeType: '', location: '',
    startDate: '', endDate: '', currentlyWorking: false, jobDescription: '',
  }),
  education: () => ({
    id: newId(), institutionName: '', degree: '', fieldOfStudy: '',
    startDate: '', endDate: '', currentlyStudying: false, gpa: '', description: '',
  }),
  projects: () => ({
    id: newId(), projectName: '', projectType: '', role: '', keyResponsibilities: '',
    keyAchievements: '', technologies: [], projectUrl: '', projectDescription: '',
  }),
  languages: () => ({ id: newId(), name: '', level: '' }),
  references: () => ({ id: newId(), name: '', jobTitle: '', company: '', relationship: '', email: '', phone: '' }),
};

/** A new empty entry for an array section: createItem('workExperience') */
export const createItem = (section) => itemFactories[section]();

export const emptyContent = () => ({
  personalInformation: emptyPersonalInformation(),
  professionalSummary: '',
  workExperience: [],
  education: [],
  projects: [],
  skills: [],
  languages: [],
  references: [],
  targetJob: { title: '', description: '' },
});

export const emptyDesign = () => ({ templateId: null, color: null, font: null });

export const createDraft = () => ({
  draftId: newId(), // sent with the first save: makes "create resume from this draft" safe to retry
  resumeId: null, //   set once the draft is backed by a server resume
  ownerId: null, //    user id that owns that resume
  revision: null,
  title: 'Untitled Resume',
  design: emptyDesign(),
  content: emptyContent(),
  dirty: {}, //        { sectionName: changeCounter } - sections changed since they were last saved
});

/** Same rule as the server: '', null, booleans, [] and structures of only such values are empty. */
export function isFieldEmpty(value) {
  if (value === null || value === undefined || typeof value === 'boolean') return true;
  if (typeof value === 'string') return value.trim() === '';
  if (typeof value === 'number') return false;
  if (Array.isArray(value)) return value.every(isFieldEmpty);
  if (typeof value === 'object') return Object.entries(value).every(([key, v]) => key === 'id' || isFieldEmpty(v));
  return false;
}

export const isContentBlank = (content) => PROFILE_SECTIONS.every((section) => isFieldEmpty(content[section]));

// ───────── dirty tracking ─────────
// Every change bumps a counter. A save remembers the counters it sent and clears a section only if its
// counter did not change meanwhile - so edits typed DURING a save are never lost.
export function touch(state, key) {
  state.dirty[key] = (state.dirty[key] ?? 0) + 1;
}

export function clearSaved(state, counters) {
  for (const [key, counter] of Object.entries(counters)) {
    if (state.dirty[key] === counter) delete state.dirty[key];
  }
}

// ───────── localStorage <-> state ─────────
export const persistable = ({ draftId, resumeId, ownerId, revision, title, design, content, dirty }) => ({
  draftId, resumeId, ownerId, revision, title, design, content, dirty,
});

/** Merges whatever was stored with today's defaults, so an old or damaged draft can never crash the builder. */
export function sanitizeStored(stored) {
  const base = createDraft();
  if (!stored || typeof stored !== 'object') return base;

  const content = { ...base.content };
  for (const key of Object.keys(content)) {
    if (stored.content?.[key] !== undefined) content[key] = stored.content[key];
  }
  content.personalInformation = { ...base.content.personalInformation, ...(stored.content?.personalInformation ?? {}) };
  content.targetJob = { ...base.content.targetJob, ...(stored.content?.targetJob ?? {}) };

  return {
    draftId: typeof stored.draftId === 'string' && stored.draftId ? stored.draftId : base.draftId,
    resumeId: stored.resumeId ?? null,
    ownerId: stored.ownerId ?? null,
    revision: Number.isInteger(stored.revision) ? stored.revision : null,
    title: typeof stored.title === 'string' && stored.title ? stored.title : base.title,
    design: { ...base.design, ...(stored.design ?? {}) },
    content,
    dirty: stored.dirty && typeof stored.dirty === 'object' ? stored.dirty : {},
  };
}

// ───────── what is sent to the API ─────────
/** { templateId, color, font } without the empty ones (the API rejects null). */
export const cleanDesign = (design) =>
  Object.fromEntries(Object.entries(design).filter(([, value]) => typeof value === 'string' && value !== ''));

const safeTitle = (title) => title.trim() || 'Untitled Resume';

/** First save: the whole draft. */
export const buildCreateBody = (draft) => ({
  title: safeTitle(draft.title),
  design: cleanDesign(draft.design),
  clientDraftId: draft.draftId,
  ...draft.content,
});

/** Later saves: only the sections whose keys are in `keys`. */
export function buildPatch(draft, keys) {
  const patch = {};
  for (const key of keys) {
    if (key === 'title') patch.title = safeTitle(draft.title);
    else if (key === 'design') patch.design = cleanDesign(draft.design);
    else if (key in draft.content) patch[key] = draft.content[key];
  }
  return patch;
}

// ───────── guest auto-fill (localStorage) ─────────
export function readGuestProfile() {
  try {
    const stored = JSON.parse(localStorage.getItem(GUEST_PROFILE_KEY) ?? 'null');
    return stored && typeof stored === 'object' ? stored : null;
  } catch {
    return null;
  }
}

/** Keeps the latest NON-EMPTY value of every section (an empty value never wipes what was saved before). */
export function rememberGuestProfile(content) {
  try {
    const saved = readGuestProfile() ?? {};
    for (const section of PROFILE_SECTIONS) {
      if (!isFieldEmpty(content[section])) saved[section] = content[section];
    }
    localStorage.setItem(GUEST_PROFILE_KEY, JSON.stringify(saved));
  } catch {
    /* storage full / blocked: auto-fill just will not work for guests */
  }
}

export function clearGuestProfile() {
  try {
    localStorage.removeItem(GUEST_PROFILE_KEY);
  } catch {
    /* ignore */
  }
}

// ───────── list helpers ─────────
/** Moves the entry with this id one step up (-1) or down (+1). Returns a new array; out-of-range moves change nothing. */
export function moveInList(list, id, direction) {
  const from = list.findIndex((entry) => entry.id === id);
  const to = from + direction;
  if (from === -1 || to < 0 || to >= list.length) return list;
  const next = [...list];
  [next[from], next[to]] = [next[to], next[from]];
  return next;
}
