// data/categories.js

import { products } from "../assets/assets";

function toSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
}

export function getCategories() {
  const seen = new Map();

  products.forEach((product) => {
    if (!product.category) return;

    if (!seen.has(product.category)) {
      seen.set(product.category, {
        id: seen.size + 1,
        name: product.category,
        slug: toSlug(product.category),
        // shei category er prothom product er first image ke
        // category thumbnail hisebe use kora hocche
        image: product.images?.[0],
      });
    }
  });

  return Array.from(seen.values());
}

export const categories = getCategories();