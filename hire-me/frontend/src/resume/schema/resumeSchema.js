import { isFieldEmpty } from '../../store/builder/builderModel';

/**
 * THE single list of every section and every field of a resume / profile.
 * The profile pages (view + add/edit) are generated from this list, and a test checks that it matches the
 * builder's data (createItem / emptyPersonalInformation) - so the profile and the resume form can never drift apart.
 *
 * kind:  'object' (one group of fields) | 'text' (one text box) | 'tags' (a list of words) | 'list' (repeatable entries)
 * field.type:  text | email | phone | url | date | textarea | checkbox | select | tags | photo
 */

const LEVELS = ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic'];

export const SECTIONS = [
  {
    id: 'personalInformation', title: 'Personal Information', kind: 'object',
    fields: [
      { name: 'photo', label: 'Photo', type: 'photo' },
      { name: 'fullName', label: 'Full Name', type: 'text', required: true, max: 100, placeholder: 'John Doe' },
      { name: 'email', label: 'Email Address', type: 'email', required: true, max: 254, placeholder: 'youremail@gmail.com' },
      { name: 'phone', label: 'Phone Number', type: 'phone', max: 40, placeholder: '+880 1XXX XXXXXX' },
      { name: 'location', label: 'Location', type: 'text', max: 120, placeholder: 'Dhaka, Bangladesh' },
      { name: 'professionalTitle', label: 'Professional Title', type: 'text', max: 120, placeholder: 'Senior UI/UX Designer' },
      { name: 'linkedin', label: 'LinkedIn Profile', type: 'url', max: 300, placeholder: 'linkedin.com/in/yourname' },
      { name: 'website', label: 'Personal Website', type: 'url', max: 300, placeholder: 'yourwebsite.com' },
    ],
  },
  {
    id: 'professionalSummary', title: 'Professional Summary', kind: 'text',
    fields: [{ name: 'value', label: 'Summary', type: 'textarea', max: 2000, placeholder: 'A creative graphic designer with over 5 years ...' }],
  },
  {
    id: 'workExperience', title: 'Work Experience', kind: 'list', itemLabel: 'Experience', maxItems: 30,
    titleField: 'jobTitle', subtitleField: 'companyName',
    fields: [
      { name: 'companyName', label: 'Company Name', type: 'text', required: true, max: 120, placeholder: 'Google LLC' },
      { name: 'jobTitle', label: 'Job Title', type: 'text', required: true, max: 120, placeholder: 'Senior UI/UX Designer' },
      { name: 'employeeType', label: 'Employee Type', type: 'text', max: 40, placeholder: 'Full-time' },
      { name: 'location', label: 'Location', type: 'text', max: 120, placeholder: 'Dhaka, Bangladesh' },
      { name: 'startDate', label: 'Start Date', type: 'date', required: true },
      { name: 'currentlyWorking', label: 'Currently Working Here', type: 'checkbox' },
      { name: 'endDate', label: 'End Date', type: 'date', requiredUnless: 'currentlyWorking', disabledWhen: 'currentlyWorking' },
      { name: 'jobDescription', label: 'Job Description', type: 'textarea', max: 2000, hint: 'Each sentence (ending with a full stop) becomes its own bullet point.', placeholder: 'Led a team of 5 designers. Improved website conversion by 20%.' },
    ],
  },
  {
    id: 'education', title: 'Education', kind: 'list', itemLabel: 'Education', maxItems: 20,
    titleField: 'institutionName', subtitleField: 'degree',
    fields: [
      { name: 'institutionName', label: 'Institution Name', type: 'text', required: true, max: 150, placeholder: 'University of Dhaka' },
      { name: 'degree', label: 'Degree / Qualification', type: 'text', required: true, max: 150, placeholder: 'Bachelor of Science' },
      { name: 'fieldOfStudy', label: 'Field of Study', type: 'text', max: 150, placeholder: 'Computer Science & Engineering' },
      { name: 'startDate', label: 'Start Date', type: 'date', required: true },
      { name: 'currentlyStudying', label: 'Currently Studying Here', type: 'checkbox' },
      { name: 'endDate', label: 'End Date / Graduation', type: 'date', requiredUnless: 'currentlyStudying', disabledWhen: 'currentlyStudying' },
      { name: 'gpa', label: 'GPA / CGPA', type: 'text', max: 20, placeholder: '3.75 / 4.00' },
      { name: 'description', label: 'Description', type: 'textarea', max: 1500, hint: 'Each sentence becomes its own bullet point.', placeholder: 'Relevant coursework, achievements or activities.' },
    ],
  },
  {
    id: 'projects', title: 'Projects', kind: 'list', itemLabel: 'Project', maxItems: 30,
    titleField: 'projectName', subtitleField: 'role',
    fields: [
      { name: 'projectName', label: 'Project Name', type: 'text', required: true, max: 120, placeholder: 'TechWorld E-commerce Platform' },
      { name: 'projectType', label: 'Project Type', type: 'text', max: 60, placeholder: 'Personal Project' },
      { name: 'role', label: 'Role', type: 'text', max: 100, placeholder: 'Full-Stack Developer' },
      { name: 'keyResponsibilities', label: 'Key Responsibilities', type: 'textarea', max: 1500, hint: 'Each sentence becomes its own bullet point.', placeholder: 'Built the REST API. Implemented authentication.' },
      { name: 'keyAchievements', label: 'Key Achievements', type: 'text', max: 500, placeholder: 'Improved page performance by 35%.' },
      { name: 'technologies', label: 'Technologies & Tools', type: 'tags', maxTags: 30, maxTagLength: 40, placeholder: 'Next.js, Node.js, MongoDB' },
      { name: 'projectUrl', label: 'Project URL', type: 'url', max: 300, placeholder: 'https://yourproject.com' },
      { name: 'projectDescription', label: 'Project Description', type: 'textarea', max: 1500, hint: 'Each sentence becomes its own bullet point.', placeholder: 'Briefly describe the project and the problem it solves.' },
    ],
  },
  {
    id: 'skills', title: 'Skills', kind: 'tags', maxTags: 50, maxTagLength: 50,
    fields: [{ name: 'tags', label: 'Skills', type: 'tags', placeholder: 'Type a skill and press Enter' }],
  },
  {
    id: 'languages', title: 'Languages', kind: 'list', itemLabel: 'Language', maxItems: 15,
    titleField: 'name', subtitleField: 'level',
    fields: [
      { name: 'name', label: 'Language', type: 'text', required: true, max: 50, placeholder: 'English' },
      { name: 'level', label: 'Level', type: 'select', options: LEVELS },
    ],
  },
  {
    id: 'references', title: 'References', kind: 'list', itemLabel: 'Reference', maxItems: 10,
    titleField: 'name', subtitleField: 'company',
    fields: [
      { name: 'name', label: 'Reference Name', type: 'text', required: true, max: 100, placeholder: 'Sarah Ahmed' },
      { name: 'jobTitle', label: 'Job Title', type: 'text', max: 100, placeholder: 'Senior Software Engineer' },
      { name: 'company', label: 'Company / Organization', type: 'text', max: 120, placeholder: 'ABC Technologies Ltd.' },
      { name: 'relationship', label: 'Relationship', type: 'text', max: 60, placeholder: 'Former Manager' },
      { name: 'email', label: 'Email Address', type: 'email', max: 254, placeholder: 'sarah.ahmed@example.com' },
      { name: 'phone', label: 'Phone Number', type: 'phone', max: 40, placeholder: '+880 17XXX XXXXX' },
    ],
  },
];

export const getSection = (id) => SECTIONS.find((section) => section.id === id);

// ───────── validation (client side; the server stores drafts leniently and only sanitises) ─────────

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const isValidPhone = (value) => /^[+\d\s().-]+$/.test(value) && value.replace(/\D/g, '').length >= 7 && value.length <= 40;

function isValidUrl(value) {
  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(value) ? value : `https://${value}`);
    return (url.protocol === 'http:' || url.protocol === 'https:') && url.hostname.includes('.');
  } catch {
    return false;
  }
}

function isValidDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return year >= 1900 && year <= 2100 && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

/** One field -> an error message, or null when it is fine. `record` is the whole entry (for dependent fields). */
function checkField(field, value, record) {
  const text = typeof value === 'string' ? value.trim() : value;
  const empty = isFieldEmpty(value);
  const requiredNow = field.required || (field.requiredUnless && !record?.[field.requiredUnless]);

  if (requiredNow && empty) return `${field.label} is required`;
  if (empty) return null;

  if (field.max && typeof text === 'string' && text.length > field.max) return `${field.label} must be at most ${field.max} characters`;
  if (field.type === 'email' && !EMAIL.test(text)) return 'Enter a valid email address';
  if (field.type === 'phone' && !isValidPhone(text)) return 'Enter a valid phone number';
  if (field.type === 'url' && !isValidUrl(text)) return 'Enter a valid link, e.g. https://example.com';
  if (field.type === 'date' && !isValidDate(text)) return 'Pick a valid date';
  if (field.type === 'select' && field.options && !field.options.includes(text)) return 'Choose one of the options';
  if (field.type === 'tags') {
    if (field.maxTags && value.length > field.maxTags) return `Add at most ${field.maxTags} items`;
    if (value.some((tag) => String(tag).length > (field.maxTagLength ?? 100))) return `Each item must be at most ${field.maxTagLength} characters`;
  }
  return null;
}

function checkEntry(section, record, prefix = '') {
  const errors = {};
  for (const field of section.fields) {
    const message = checkField(field, record?.[field.name], record);
    if (message) errors[`${prefix}${field.name}`] = message;
  }
  // end date must not be before the start date
  if (record?.startDate && record?.endDate && !record.currentlyWorking && !record.currentlyStudying && record.endDate < record.startDate) {
    errors[`${prefix}endDate`] = 'End date cannot be before the start date';
  }
  return errors;
}

/**
 * @returns {{ valid: boolean, errors: Record<string, string> }}
 * error keys:  object -> "fullName" | text -> "value" | tags -> "tags" | list -> "0.endDate" (entry index + field)
 */
export function validateSection(section, value) {
  let errors = {};

  if (section.kind === 'object') errors = checkEntry(section, value);
  else if (section.kind === 'text') {
    const message = checkField(section.fields[0], value, {});
    if (message) errors.value = message;
  } else if (section.kind === 'tags') {
    const list = Array.isArray(value) ? value : [];
    if (list.length > section.maxTags) errors.tags = `Add at most ${section.maxTags} skills`;
    else if (list.some((tag) => String(tag).length > section.maxTagLength)) errors.tags = `Each skill must be at most ${section.maxTagLength} characters`;
  } else {
    const entries = Array.isArray(value) ? value : [];
    if (entries.length > section.maxItems) errors._ = `You can add at most ${section.maxItems} entries`;
    entries.forEach((entry, index) => {
      if (!isFieldEmpty(entry)) Object.assign(errors, checkEntry(section, entry, `${index}.`)); // blank entries are ignored
    });
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

/** What gets saved: blank entries are dropped (an "Add" form always shows one empty entry to type into). */
export const cleanForSave = (section, value) =>
  section.kind === 'list' ? (value ?? []).filter((entry) => !isFieldEmpty(entry)) : value;

/** Server field errors ("workExperience.0.endDate": [...]) -> the keys the editor uses ("0.endDate"). */
export function mapServerErrors(section, fieldErrors) {
  const mapped = {};
  for (const [path, messages] of Object.entries(fieldErrors ?? {})) {
    const [, ...rest] = path.split('.');
    const key = section.kind === 'text' ? 'value' : section.kind === 'tags' ? 'tags' : rest.join('.') || '_';
    mapped[key] = Array.isArray(messages) ? messages[0] : String(messages);
  }
  return mapped;
}
