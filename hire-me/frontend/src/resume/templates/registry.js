import minimal from './minimal';
import modern from './modern';
import professional from './professional';
import timeline from './timeline';

/**
 * ➜ TO ADD A TEMPLATE:  create its folder (copy ./professional), then import it here and add it to TEMPLATES.
 *   That is the only place that needs to change.
 */
const TEMPLATES = [professional, modern, timeline, minimal];

/** Allowed categories, in the order you want them shown. Add a new category here. */
export const TEMPLATE_CATEGORIES = ['Professional', 'Creative', 'Modern', 'Simple', 'Student'];

export const DEFAULT_TEMPLATE_ID = 'professional';

// A helpful error in development when a template is missing something (instead of a mysterious crash later).
function assertTemplate(template) {
  const problems = [];
  if (!template.id || !/^[a-z0-9-]+$/.test(template.id)) problems.push('id must be lower-case letters, numbers and dashes');
  if (!template.name) problems.push('name is missing');
  if (!TEMPLATE_CATEGORIES.includes(template.category)) problems.push(`category must be one of: ${TEMPLATE_CATEGORIES.join(', ')}`);
  if (!template.demoData?.personalInformation) problems.push('demoData is missing (every template needs complete demo data)');
  if (typeof template.buildBlocks !== 'function') problems.push('buildBlocks(data) is missing');
  if (typeof template.Page !== 'function') problems.push('Page component is missing');
  if (problems.length) throw new Error(`Template "${template?.id ?? '?'}" is invalid:\n - ${problems.join('\n - ')}`);
}
TEMPLATES.forEach(assertTemplate);
if (new Set(TEMPLATES.map((template) => template.id)).size !== TEMPLATES.length) {
  throw new Error('Two templates use the same id - ids must be unique.');
}

export const listTemplates = () => TEMPLATES;

/** Unknown / missing ids (old saved resumes) fall back to the default template. */
export const getTemplate = (id) =>
  TEMPLATES.find((template) => template.id === id) ?? TEMPLATES.find((template) => template.id === DEFAULT_TEMPLATE_ID);

/** Categories that really have templates (for the filter tabs on the templates page). */
export const listCategories = () => TEMPLATE_CATEGORIES.filter((category) => TEMPLATES.some((template) => template.category === category));

export const listTemplatesByCategory = (category) =>
  !category || category === 'All' ? TEMPLATES : TEMPLATES.filter((template) => template.category === category);
