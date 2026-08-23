// slugify.js
// Text ke URL-safe slug e convert kore.
// Ex: "FurneiStyle – Premium Furniture Shopping Experience"
//  -> "furneistyle-premium-furniture-shopping-experience"

export function slugify(text = "") {
  return text
    .toString()
    .normalize("NFKD") // accented characters (é, ñ etc.) ke base form e ante
    .replace(/[\u0300-\u036f]/g, "") // accent marks remove
    .toLowerCase()
    .trim()
    .replace(/&/g, "-and-") // & ke "and" e convert
    .replace(/[^a-z0-9]+/g, "-") // jekono non-alphanumeric character ke hyphen
    .replace(/^-+|-+$/g, ""); // shuru/shesh er extra hyphen remove
}

export default slugify;
