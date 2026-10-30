/**
 * Form validation for the resume builder. Pure functions (no React, no imports), shared by every form.
 * The limits are the same ones the API enforces, so what passes here is never refused by the server.
 *
 *   validateSection('workExperience', content.workExperience)
 *   -> { '<entryId>.jobTitle': 'Job title is required', ... }    ({} = valid)
 *
 * Error keys: a field name for object sections ('email'), '<entryId>.<field>' for list entries,
 * '_' for a problem with the section as a whole (too many entries).
 */

export const LIMITS = {
  fullName: 100, email: 254, phone: 40, location: 120, professionalTitle: 120, url: 300,
  summary: 2000,
  workExperience: { max: 30, companyName: 120, jobTitle: 120, employeeType: 40, location: 120, jobDescription: 2000 },
  education: { max: 20, institutionName: 150, degree: 150, fieldOfStudy: 150, gpa: 20, description: 1500 },
  projects: { max: 30, projectName: 120, projectType: 60, role: 100, keyResponsibilities: 1500, keyAchievements: 500, technologies: 30, technology: 40, projectDescription: 1500 },
  skills: { max: 50, length: 50 },
  languages: { max: 15, name: 50, level: 30 },
  references: { max: 10, name: 100, jobTitle: 100, company: 120, relationship: 60, phone: 40 },
};

export const LANGUAGE_LEVELS = ['Basic', 'Conversational', 'Professional', 'Fluent', 'Native'];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[\d\s().-]{6,}$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const clean = (value) => (typeof value === 'string' ? value.trim() : '');

export function isValidDate(value) {
  if (!ISO_DATE.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

/** "linkedin.com/in/me" is fine (the server adds https://); "hello", "javascript:x" and "a b.com" are not. */
export function isValidWebUrl(value) {
  const text = clean(value);
  if (!text || /\s/.test(text)) return false;
  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(text) ? text : `https://${text}`);
    return (url.protocol === 'http:' || url.protocol === 'https:') && url.hostname.includes('.') && !url.hostname.endsWith('.');
  } catch {
    return false;
  }
}

const isLinkedInUrl = (value) => {
  try {
    const text = clean(value);
    const host = new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(text) ? text : `https://${text}`).hostname.toLowerCase();
    return host === 'linkedin.com' || host.endsWith('.linkedin.com');
  } catch {
    return false;
  }
};

/** True when an entry has no text at all (booleans and the id do not count) - such entries are not validated. */
export function isEntryEmpty(entry) {
  return Object.entries(entry).every(([key, value]) => {
    if (key === 'id' || typeof value === 'boolean') return true;
    if (Array.isArray(value)) return value.length === 0;
    return clean(value) === '';
  });
}

// Small helpers that add an error only when there is none yet for that key.
function makeCollector(errors, prefix = '') {
  const add = (key, message) => {
    const full = `${prefix}${key}`;
    if (!errors[full]) errors[full] = message;
  };
  const tooLong = (key, value, max, label) => {
    if (clean(value).length > max) add(key, `${label} can have at most ${max} characters`);
  };
  const required = (key, value, label) => {
    if (clean(value) === '') add(key, `${label} is required`);
  };
  const email = (key, value) => {
    if (clean(value) !== '' && !EMAIL.test(clean(value))) add(key, 'Enter a valid email address, like name@example.com');
  };
  const phone = (key, value) => {
    if (clean(value) !== '' && !PHONE.test(clean(value))) add(key, 'Enter a valid phone number, like +880 1700 000000');
  };
  const url = (key, value, label = 'link') => {
    if (clean(value) !== '' && !isValidWebUrl(value)) add(key, `Enter a valid ${label}, like example.com`);
  };
  const date = (key, value) => {
    if (clean(value) !== '' && !isValidDate(value)) add(key, 'Enter a valid date');
  };
  return { add, tooLong, required, email, phone, url, date };
}

function checkDateOrder(c, entry, currentFlag) {
  if (entry[currentFlag] || !entry.startDate || !entry.endDate) return;
  if (isValidDate(entry.startDate) && isValidDate(entry.endDate) && entry.endDate < entry.startDate) {
    c.add('endDate', 'End date cannot be before the start date');
  }
}

const VALIDATORS = {
  personalInformation(value = {}) {
    const errors = {};
    const c = makeCollector(errors);
    c.required('fullName', value.fullName, 'Full name');
    c.tooLong('fullName', value.fullName, LIMITS.fullName, 'Full name');
    c.required('email', value.email, 'Email address');
    c.email('email', value.email);
    c.tooLong('email', value.email, LIMITS.email, 'Email address');
    c.phone('phone', value.phone);
    c.tooLong('phone', value.phone, LIMITS.phone, 'Phone number');
    c.tooLong('location', value.location, LIMITS.location, 'Location');
    c.tooLong('professionalTitle', value.professionalTitle, LIMITS.professionalTitle, 'Professional title');
    c.url('linkedin', value.linkedin, 'LinkedIn link');
    if (clean(value.linkedin) !== '' && isValidWebUrl(value.linkedin) && !isLinkedInUrl(value.linkedin)) {
      c.add('linkedin', 'Enter your LinkedIn profile link, like linkedin.com/in/yourname');
    }
    c.tooLong('linkedin', value.linkedin, LIMITS.url, 'Link');
    c.url('website', value.website, 'website link');
    c.tooLong('website', value.website, LIMITS.url, 'Link');
    return errors;
  },

  professionalSummary(value = '') {
    const errors = {};
    makeCollector(errors).tooLong('professionalSummary', value, LIMITS.summary, 'Summary');
    return errors;
  },

  workExperience(list = []) {
    const errors = {};
    if (list.length > LIMITS.workExperience.max) errors._ = `You can add up to ${LIMITS.workExperience.max} jobs`;
    for (const entry of list) {
      if (isEntryEmpty(entry)) continue;
      const c = makeCollector(errors, `${entry.id}.`);
      const L = LIMITS.workExperience;
      c.required('companyName', entry.companyName, 'Company name');
      c.required('jobTitle', entry.jobTitle, 'Job title');
      c.tooLong('companyName', entry.companyName, L.companyName, 'Company name');
      c.tooLong('jobTitle', entry.jobTitle, L.jobTitle, 'Job title');
      c.tooLong('employeeType', entry.employeeType, L.employeeType, 'Employee type');
      c.tooLong('location', entry.location, L.location, 'Location');
      c.tooLong('jobDescription', entry.jobDescription, L.jobDescription, 'Description');
      c.date('startDate', entry.startDate);
      c.date('endDate', entry.endDate);
      checkDateOrder(c, entry, 'currentlyWorking');
    }
    return errors;
  },

  education(list = []) {
    const errors = {};
    if (list.length > LIMITS.education.max) errors._ = `You can add up to ${LIMITS.education.max} education entries`;
    for (const entry of list) {
      if (isEntryEmpty(entry)) continue;
      const c = makeCollector(errors, `${entry.id}.`);
      const L = LIMITS.education;
      c.required('institutionName', entry.institutionName, 'Institution name');
      c.tooLong('institutionName', entry.institutionName, L.institutionName, 'Institution name');
      c.tooLong('degree', entry.degree, L.degree, 'Degree');
      c.tooLong('fieldOfStudy', entry.fieldOfStudy, L.fieldOfStudy, 'Field of study');
      c.tooLong('gpa', entry.gpa, L.gpa, 'GPA');
      c.tooLong('description', entry.description, L.description, 'Description');
      c.date('startDate', entry.startDate);
      c.date('endDate', entry.endDate);
      checkDateOrder(c, entry, 'currentlyStudying');
    }
    return errors;
  },

  projects(list = []) {
    const errors = {};
    if (list.length > LIMITS.projects.max) errors._ = `You can add up to ${LIMITS.projects.max} projects`;
    for (const entry of list) {
      if (isEntryEmpty(entry)) continue;
      const c = makeCollector(errors, `${entry.id}.`);
      const L = LIMITS.projects;
      c.required('projectName', entry.projectName, 'Project name');
      c.tooLong('projectName', entry.projectName, L.projectName, 'Project name');
      c.tooLong('projectType', entry.projectType, L.projectType, 'Project type');
      c.tooLong('role', entry.role, L.role, 'Role');
      c.tooLong('keyResponsibilities', entry.keyResponsibilities, L.keyResponsibilities, 'Responsibilities');
      c.tooLong('keyAchievements', entry.keyAchievements, L.keyAchievements, 'Achievements');
      c.tooLong('projectDescription', entry.projectDescription, L.projectDescription, 'Description');
      c.url('projectUrl', entry.projectUrl, 'project link');
      c.tooLong('projectUrl', entry.projectUrl, LIMITS.url, 'Link');
      if ((entry.technologies ?? []).length > L.technologies) c.add('technologies', `You can add up to ${L.technologies} technologies`);
    }
    return errors;
  },

  skills(list = []) {
    const errors = {};
    if (list.length > LIMITS.skills.max) errors._ = `You can add up to ${LIMITS.skills.max} skills`;
    return errors;
  },

  languages(list = []) {
    const errors = {};
    if (list.length > LIMITS.languages.max) errors._ = `You can add up to ${LIMITS.languages.max} languages`;
    for (const entry of list) {
      if (isEntryEmpty(entry)) continue;
      const c = makeCollector(errors, `${entry.id}.`);
      c.required('name', entry.name, 'Language');
      c.tooLong('name', entry.name, LIMITS.languages.name, 'Language');
    }
    return errors;
  },

  references(list = []) {
    const errors = {};
    if (list.length > LIMITS.references.max) errors._ = `You can add up to ${LIMITS.references.max} references`;
    for (const entry of list) {
      if (isEntryEmpty(entry)) continue;
      const c = makeCollector(errors, `${entry.id}.`);
      const L = LIMITS.references;
      c.required('name', entry.name, 'Reference name');
      c.tooLong('name', entry.name, L.name, 'Name');
      c.tooLong('jobTitle', entry.jobTitle, L.jobTitle, 'Job title');
      c.tooLong('company', entry.company, L.company, 'Company');
      c.tooLong('relationship', entry.relationship, L.relationship, 'Relationship');
      c.email('email', entry.email);
      c.tooLong('email', entry.email, LIMITS.email, 'Email address');
      c.phone('phone', entry.phone);
      c.tooLong('phone', entry.phone, L.phone, 'Phone number');
    }
    return errors;
  },
};

/** Errors of one section ({} = valid). Unknown sections are valid. */
export function validateSection(section, value) {
  return VALIDATORS[section]?.(value) ?? {};
}

/** { section: errors } for every section that has at least one error. */
export function validateAll(content) {
  const result = {};
  for (const section of Object.keys(VALIDATORS)) {
    const errors = validateSection(section, content[section]);
    if (Object.keys(errors).length > 0) result[section] = errors;
  }
  return result;
}
