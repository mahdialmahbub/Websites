/** Small formatting helpers shared by every template. */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2022-03-15" -> "Mar 2022", "2022" -> "2022", "" -> "" */
export function formatDate(value) {
  if (!value) return '';
  const [year, month] = String(value).split('-');
  const name = MONTHS[Number(month) - 1];
  return name ? `${name} ${year}` : year;
}

/** dateRange("2020-01-01", "", true) -> "Jan 2020 - Present" */
export function dateRange(start, end, current) {
  return [formatDate(start), current ? 'Present' : formatDate(end)].filter(Boolean).join(' - ');
}

/** Only http(s) links may become <a href>. Anything else (javascript: ...) returns null. */
export const safeHref = (value) => (/^https?:\/\//i.test(value ?? '') ? value : null);

/** "https://www.site.com/me/" -> "site.com/me" (for showing a link as text) */
export const prettyUrl = (value) => String(value ?? '').replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');

/** join(["a", "", "b"], " | ") -> "a | b" */
export const joinNonEmpty = (parts, separator = ' | ') => parts.filter(Boolean).join(separator);
