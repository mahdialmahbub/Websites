/** A neutral placeholder portrait as an inline SVG, so demo data needs no image file and never breaks. */
const svg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">' +
  '<rect width="200" height="200" fill="#cbd5e1"/>' +
  '<circle cx="100" cy="78" r="38" fill="#94a3b8"/>' +
  '<path d="M28 200c4-44 36-72 72-72s68 28 72 72z" fill="#94a3b8"/></svg>';

export const DEMO_AVATAR = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
