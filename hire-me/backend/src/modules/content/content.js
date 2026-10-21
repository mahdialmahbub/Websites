/**
 * "Content" = the part of a resume that is also kept in the user's PROFILE:
 * the 8 sections of the builder / profile page. Design, title and share settings are resume-only.
 */
export const PROFILE_SECTIONS = Object.freeze([
  'personalInformation',
  'professionalSummary',
  'workExperience',
  'education',
  'projects',
  'skills',
  'languages',
  'references',
]);

export const ARRAY_SECTIONS = Object.freeze(['workExperience', 'education', 'projects', 'languages', 'references']);

/** '', null, undefined, booleans, [], {} and structures that only contain such values are "empty". */
export function isFieldEmpty(value) {
  if (value === null || value === undefined || typeof value === 'boolean') return true;
  if (typeof value === 'string') return value.trim() === '';
  if (typeof value === 'number') return false;
  if (Array.isArray(value)) return value.every(isFieldEmpty);
  if (typeof value === 'object') return Object.entries(value).every(([key, v]) => key === 'id' || isFieldEmpty(v));
  return false;
}

/** Keeps only the listed sections that are present (not undefined) in `source`. */
export function pickSections(source, names = PROFILE_SECTIONS) {
  const picked = {};
  for (const name of names) if (source?.[name] !== undefined) picked[name] = source[name];
  return picked;
}

export const withIds = (items, makeId) => items.map((item) => ({ ...item, id: item.id || makeId() }));

const sameValue = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/** Field-level merge for the personalInformation object. */
function mergeObject(previous, incoming, mode) {
  const merged = { ...previous };
  for (const [key, value] of Object.entries(incoming)) {
    if (isFieldEmpty(value)) continue; // never blank out something because the other side is empty
    if (mode === 'overwrite' || isFieldEmpty(previous[key])) merged[key] = value;
  }
  return merged;
}

/**
 * Decides what to write into the profile.
 *  mode "fill"      -> only fill gaps: sections (or personalInformation fields) that are still empty
 *  mode "overwrite" -> the incoming non-empty sections win; empty incoming sections never wipe the profile
 *
 * @returns {{ set: Record<string, unknown>, sections: string[] }}  `set` is ready for MongoDB $set
 */
export function planMerge(current = {}, incoming = {}, mode = 'fill') {
  const set = {};

  for (const section of PROFILE_SECTIONS) {
    const next = incoming[section];
    if (isFieldEmpty(next)) continue;
    const previous = current[section];

    if (section === 'personalInformation') {
      const merged = mergeObject(previous ?? {}, next, mode);
      if (!sameValue(merged, previous ?? {})) set[section] = merged;
      continue;
    }

    if (mode === 'fill' && !isFieldEmpty(previous)) continue;
    if (sameValue(next, previous)) continue;
    set[section] = next;
  }

  return { set, sections: Object.keys(set) };
}
