/**
 * "Modern & Clean!" -> "modern-clean"
 * The same text always gives the same slug, whatever its letter case ("Modern" / "MODERN" -> "modern"),
 * which is what makes the unique index on `slug` also block case-only duplicates.
 * Returns '' when the text has no latin letters or numbers (the caller must reject that).
 */
export const slugify = (value) =>
  String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // accents: "Café" -> "Cafe"
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/g, '');
