// Ekta project e kon kon "view" (design / development) ache, shob logic ekhane.
// Notun view lagle (jemon "case-study") VIEW_META te ekta entry add korlei hobe.

/**
 * @typedef {Record<string, any> & {
 *   id: string,
 *   slug?: string,
 *   title: string,
 *   primaryView?: "design" | "development",
 *   design?: Record<string, any>,
 *   development?: Record<string, any>,
 * }} Project
 */

// "UI/UX Design" ar "UI UX Design" duitake same dhore compare korar jonno
const normalize = (str = "") => str.toLowerCase().replace(/[^a-z0-9]/g, "");

export const VIEW_META = {
  // switchLabel = onno view te jawar button er text
  // category    = /projects page er filter button er label (page.jsx er categories er shathe mil thakte hobe)
  design: { switchLabel: "Design", category: "UI UX Design" },
  development: { switchLabel: "Development", category: "Development" },
};


const VIEW_KEYS = Object.keys(VIEW_META);

/**
 * Project e je je view er data ache tar list. jemon ["design", "development"]
 * @param {Project} project
 * @returns {string[]}
 */
export const getProjectViews = (project) =>
  VIEW_KEYS.filter((key) => Boolean(project?.[key]));

/**
 * Prothome kon view dekhabe:
 * 1) preferred (jodi project e sei view thake), 2) project.primaryView, 3) prothom available view
 * @param {Project} project
 * @param {string} [preferred]
 * @returns {string | null}
 */
export const getDefaultView = (project, preferred) => {
  const views = getProjectViews(project);
  if (preferred && views.includes(preferred)) return preferred;
  if (project?.primaryView && views.includes(project.primaryView)) {
    return project.primaryView;
  }
  return views[0] ?? null;
};

/**
 * Category filter: design wala project "UI UX Design" e, development wala "Development" e dekhabe.
 * Dui view thakle duitai te dekhabe.
 * @param {Project} project
 * @param {string} category
 */
export const matchesCategory = (project, category) => {
  if (!category || category === "All") return true;
  return getProjectViews(project).some(
    (key) => normalize(VIEW_META[key].category) === normalize(category),
  );
};

/**
 * Raw project e `views` ar merged `tags` jure dey. ProjectCard er jonno tags top level e thake.
 * @param {Project} project
 */
export const withProjectMeta = (project) => {
  const views = getProjectViews(project);
  const tags = [...new Set(views.flatMap((key) => project[key].tags ?? []))];
  return { ...project, views, tags };
};
