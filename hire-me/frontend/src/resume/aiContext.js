/**
 * What the "Improve with AI" button sends: the text of the field plus the information already entered,
 * so an EMPTY field can be written from it. Pure functions (no React, no imports).
 *
 * The sizes match what the API accepts, so a request built here is never refused for being too big.
 */

/** Which form field uses which AI "kind" (the API's field names). */
export const AI_FIELDS = {
  'professionalSummary': 'summary',
  'workExperience.jobDescription': 'jobDescription',
  'education.description': 'educationDescription',
  'projects.keyResponsibilities': 'projectResponsibilities',
  'projects.projectDescription': 'projectDescription',
};

const clip = (value, max = 300) => String(value ?? '').trim().slice(0, max);
const list = (values, max = 15) => (values ?? []).map((value) => clip(value, 120)).filter(Boolean).slice(0, max);
const compact = (object) =>
  Object.fromEntries(Object.entries(object).filter(([, value]) => (Array.isArray(value) ? value.length > 0 : value !== '')));
const joinNonEmpty = (parts, separator) => parts.map((part) => clip(part, 120)).filter(Boolean).join(separator);

/** The current value of one description field. */
export function readFieldValue(content, { section, itemId, field }) {
  if (section === 'professionalSummary') return content.professionalSummary ?? '';
  return (content[section] ?? []).find((item) => item.id === itemId)?.[field] ?? '';
}

/**
 * @param {object} content the builder draft's content
 * @param {{ section: string, itemId?: string, field?: string }} target
 * @returns {{ field: string, text: string, context: object } | null}  null when the target has no AI support
 */
export function buildAiRequest(content, target) {
  const key = target.section === 'professionalSummary' ? 'professionalSummary' : `${target.section}.${target.field}`;
  const kind = AI_FIELDS[key];
  if (!kind) return null;

  const text = readFieldValue(content, target).trim();
  const item = (content[target.section] ?? []).find?.((entry) => entry.id === target.itemId) ?? {};

  if (kind === 'summary') {
    return {
      field: kind,
      text,
      context: compact({
        professionalTitle: clip(content.personalInformation?.professionalTitle),
        targetJobTitle: clip(content.targetJob?.title),
        experience: (content.workExperience ?? [])
          .map((job) => joinNonEmpty([job.jobTitle, job.companyName], ' at '))
          .filter(Boolean)
          .slice(0, 3),
        education: (content.education ?? [])
          .map((entry) => joinNonEmpty([entry.degree, entry.institutionName], ', '))
          .filter(Boolean)
          .slice(0, 2),
        skills: list(content.skills),
      }),
    };
  }

  if (kind === 'jobDescription') {
    return {
      field: kind,
      text,
      context: compact({
        jobTitle: clip(item.jobTitle),
        companyName: clip(item.companyName),
        employeeType: clip(item.employeeType),
        skills: list(content.skills),
      }),
    };
  }

  if (kind === 'educationDescription') {
    return {
      field: kind,
      text,
      context: compact({ degree: clip(item.degree), fieldOfStudy: clip(item.fieldOfStudy), institutionName: clip(item.institutionName) }),
    };
  }

  // project responsibilities / project description
  return {
    field: kind,
    text,
    context: compact({
      projectName: clip(item.projectName),
      projectType: clip(item.projectType),
      role: clip(item.role),
      technologies: list(item.technologies),
      keyAchievements: clip(item.keyAchievements),
    }),
  };
}
