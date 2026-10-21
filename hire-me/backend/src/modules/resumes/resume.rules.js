/**
 * Pure rules (no database, no HTTP) - easy to test.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * "Is this resume complete enough to Generate?"
 * Autosave accepts half-typed drafts; Generate is where the content must be valid.
 *
 * @returns {Record<string, string[]>} fieldErrors keyed by path (empty object = ready)
 */
export function checkReadyToGenerate(resume) {
  const errors = {};
  const add = (path, message) => (errors[path] ??= []).push(message);

  const personal = resume.personalInformation ?? {};
  if (!personal.fullName?.trim()) add('personalInformation.fullName', 'Full name is required');
  if (!personal.email?.trim()) add('personalInformation.email', 'Email is required');
  else if (!EMAIL.test(personal.email.trim())) add('personalInformation.email', 'Enter a valid email address');

  const hasBody =
    Boolean(resume.professionalSummary?.trim()) ||
    (resume.workExperience ?? []).length > 0 ||
    (resume.education ?? []).length > 0 ||
    (resume.projects ?? []).length > 0 ||
    (resume.skills ?? []).length > 0;
  if (!hasBody) {
    add('_', 'Add a summary, experience, education, projects or skills before generating');
  }

  // Dates: an end date can never be before the start date.
  const checkDates = (section, items) =>
    items.forEach((item, index) => {
      if (item.startDate && item.endDate && item.endDate < item.startDate) {
        add(`${section}.${index}.endDate`, 'End date cannot be before the start date');
      }
    });
  checkDates('workExperience', resume.workExperience ?? []);
  checkDates('education', resume.education ?? []);

  return errors;
}
