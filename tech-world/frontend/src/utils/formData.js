/**
 * Converts a plain fields object into FormData, the way the backend expects:
 *  - File / Blob values (or arrays of them) are appended as files
 *  - Plain objects/arrays (variants, colors, specifications, address, etc.)
 *    are JSON.stringify'd, since the backend parses them with JSON.parse
 *  - null/undefined values are skipped entirely
 *
 * Example:
 *   buildFormData({
 *     title: "Wireless Mouse",
 *     variants: [{ name: "Black", priceAdjustment: 0 }],
 *     images: [file1, file2],
 *   })
 */
export const buildFormData = (fields) => {
  const formData = new FormData();

  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
      return;
    }

    if (Array.isArray(value) && value.every((v) => v instanceof File || v instanceof Blob)) {
      value.forEach((file) => formData.append(key, file));
      return;
    }

    if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
      return;
    }

    formData.append(key, String(value));
  });

  return formData;
};
