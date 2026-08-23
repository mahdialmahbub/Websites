/**
 * multipart/form-data (used for any endpoint that accepts an image upload)
 * always sends object/array fields as JSON strings — the browser's FormData
 * API has no concept of nested objects. This safely parses them back,
 * falling back to a default if the field is missing or malformed.
 *
 * Used anywhere a multer-backed route accepts a nested object/array field
 * (address, variants, colors, specifications, badges, etc.).
 */
const parseJsonField = (value, fallback) => {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value !== "string") return value; // already parsed (e.g. plain JSON request, not multipart)
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

module.exports = parseJsonField;
