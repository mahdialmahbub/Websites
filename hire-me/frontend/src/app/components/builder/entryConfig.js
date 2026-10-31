/* -------------------------------------------------------------------------- */
/*  ENTRY_CONFIG — repeatable section (job, education, project, reference)     */
/*  er card header e ki dekhabe, shob ekhane thake.                            */
/*                                                                             */
/*  Notun section lagle shudhu ekhane ekta entry add korlei hobe.              */
/*                                                                             */
/*  - label                  : singular naam ("Add job", "Job deleted", "Job 1") */
/*  - icon                   : header er left e icon class                     */
/*  - titleKey / subtitleKey : item er kon field header e show hobe            */
/*  - meta(item)             : subtitle er niche choto line (e.g. date range)  */
/*  - badge(item)            : title er pashe choto badge (e.g. "Current")     */
/* -------------------------------------------------------------------------- */

/**
 * @typedef {"workExperience" | "education" | "projects" | "references"} EntrySection
 */

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const toText = (value) => (value == null ? "" : String(value).trim());

// "2023-09-02" -> "Sep 2023". Date input er value ISO string, tai manually parse
// kora hoy, jate timezone er karone ek din age/pore na hoy.
const formatMonth = (value) => {
  const text = toText(value);
  const match = text.match(/^(\d{4})-(\d{2})/);
  if (!match) return text;

  const month = MONTHS_SHORT[Number(match[2]) - 1];
  return month ? `${month} ${match[1]}` : match[1];
};

// ("2023-09-01", "", true) -> "Sep 2023 – Present"
const formatRange = (start, end, isCurrent = false) => {
  const from = formatMonth(start);
  const to = isCurrent ? "Present" : formatMonth(end);
  if (!from && !to) return "";
  return `${from || "?"} – ${to || "?"}`;
};

export const ENTRY_CONFIG = {
  workExperience: {
    label: "job",
    icon: "fi fi-rr-briefcase",
    titleKey: "companyName",
    subtitleKey: "jobTitle",
    meta: (d) => formatRange(d.startDate, d.endDate, d.currentlyWorking),
    badge: (d) => (d.currentlyWorking ? "Current" : ""),
  },

  education: {
    label: "education entry",
    icon: "fi fi-rr-graduation-cap",
    titleKey: "institutionName",
    subtitleKey: "degree",
    meta: (d) => formatRange(d.startDate, d.endDate, d.currentlyStudying),
  },

  projects: {
    label: "project",
    icon: "fi fi-rr-clipboard-list",
    titleKey: "projectName",
    subtitleKey: "projectType",
    meta: (d) => toText(d.role),
  },

  references: {
    label: "reference",
    icon: "fi fi-rr-user",
    titleKey: "name",
    subtitleKey: "jobTitle",
    meta: (d) => toText(d.company),
  },
};

// Config e nai emon section dile jate kichu na bhange
export const DEFAULT_ENTRY = {
  label: "entry",
  icon: "fi fi-rr-document",
  titleKey: "",
  subtitleKey: "",
};

// Header e jei text gulo dekhabe shegulo ek jaygay banay
export const getEntrySummary = (config, item) => ({
  title: toText(item[config.titleKey]),
  subtitle: toText(item[config.subtitleKey]),
  meta: config.meta?.(item) ?? "",
  badge: config.badge?.(item) ?? "",
});
