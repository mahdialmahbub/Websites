/**
 * The description fields that have an "Improve with AI" button.
 * `max` is the longest text the resume accepts for that field (same numbers as the resume schema).
 */

const has = (value) => (Array.isArray(value) ? value.length > 0 : Boolean(String(value ?? '').trim()));

export const FIELDS = {
  summary: {
    label: 'professional summary',
    max: 2000,
    shape: 'paragraph',
    style: 'A professional summary of 2 to 4 sentences, written as ONE paragraph (about 40 to 90 words). It covers the role, the strongest skills and the focus of the person.',
    contextKeys: ['professionalTitle', 'targetJobTitle', 'experience', 'education', 'skills'],
    enough: (c) => has(c.professionalTitle) || has(c.experience) || has(c.education) || (c.skills ?? []).length >= 2,
    missing: 'Add your professional title, a job or some skills first, then try again.',
  },
  jobDescription: {
    label: 'job description',
    max: 2000,
    shape: 'lines',
    style: '3 to 5 short achievement-focused sentences, EACH ON ITS OWN LINE, each ending with a full stop. Describe responsibilities and results.',
    contextKeys: ['jobTitle', 'companyName', 'employeeType', 'skills'],
    enough: (c) => has(c.jobTitle),
    missing: 'Add the job title first, then try again.',
  },
  educationDescription: {
    label: 'education description',
    max: 1500,
    shape: 'lines',
    style: '1 to 3 short sentences, EACH ON ITS OWN LINE, each ending with a full stop, about coursework, achievements or activities.',
    contextKeys: ['degree', 'fieldOfStudy', 'institutionName'],
    enough: (c) => has(c.degree) || has(c.institutionName),
    missing: 'Add the degree or the institution first, then try again.',
  },
  projectResponsibilities: {
    label: 'project responsibilities',
    max: 1500,
    shape: 'lines',
    style: '2 to 4 short sentences, EACH ON ITS OWN LINE, each ending with a full stop, about what the person built or was responsible for.',
    contextKeys: ['projectName', 'projectType', 'role', 'technologies', 'keyAchievements'],
    enough: (c) => has(c.projectName) || has(c.role),
    missing: 'Add the project name or your role first, then try again.',
  },
  projectDescription: {
    label: 'project description',
    max: 1500,
    shape: 'paragraph',
    style: '2 to 3 sentences written as ONE paragraph: what the project is, the problem it solves and the technologies used.',
    contextKeys: ['projectName', 'projectType', 'role', 'technologies', 'keyAchievements'],
    enough: (c) => has(c.projectName),
    missing: 'Add the project name first, then try again.',
  },
};

export const FIELD_NAMES = Object.keys(FIELDS);

/** Context labels shown to the AI. */
export const CONTEXT_LABELS = {
  professionalTitle: 'Professional title',
  targetJobTitle: 'Target job',
  experience: 'Work experience',
  education: 'Education',
  skills: 'Skills',
  jobTitle: 'Job title',
  companyName: 'Company',
  employeeType: 'Employment type',
  degree: 'Degree',
  fieldOfStudy: 'Field of study',
  institutionName: 'Institution',
  projectName: 'Project name',
  projectType: 'Project type',
  role: 'Role',
  technologies: 'Technologies',
  keyAchievements: 'Key achievements',
};
