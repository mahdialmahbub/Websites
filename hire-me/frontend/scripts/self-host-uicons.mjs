// Run from the frontend folder:  node scripts/self-host-uicons.mjs
//
// Downloads the exact Flaticon UIcons CSS you use from the CDN, downloads the
// woff2 font each one needs, and writes ONE combined css file that points to
// your own copy of the fonts. Result: every icon works (same files as the CDN),
// no third-party request, and the fonts load with font-display: swap.

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

// 1) Paste the exact CSS URLs your site loads today (copy them from your layout / <head>).
//    Pattern: https://cdn-uicons.flaticon.com/<VERSION>/uicons-<style>/css/uicons-<style>.css
const CSS_URLS = [
  "https://cdn-uicons.flaticon.com/VERSION/uicons-regular-rounded/css/uicons-regular-rounded.css", // fi-rr-
  "https://cdn-uicons.flaticon.com/VERSION/uicons-solid-rounded/css/uicons-solid-rounded.css", // fi-sr-
  "https://cdn-uicons.flaticon.com/VERSION/uicons-solid-chubby/css/uicons-solid-chubby.css", // fi-sc-
  "https://cdn-uicons.flaticon.com/VERSION/uicons-brands/css/uicons-brands.css", // fi-brands-
];

// 2) Where to write things (change if your project layout is different).
const CSS_OUT = "src/assets/uicons/uicons.css";
const FONT_DIR = "public/fonts/uicons";
const FONT_URL_BASE = "/fonts/uicons"; // how the browser reaches FONT_DIR

if (CSS_URLS.some((u) => u.includes("VERSION"))) {
  throw new Error("Replace VERSION in CSS_URLS with the real CDN URLs first.");
}

await mkdir(FONT_DIR, { recursive: true });
await mkdir(path.dirname(CSS_OUT), { recursive: true });

const get = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res;
};

const parts = [];

for (const cssUrl of CSS_URLS) {
  let css = await (await get(cssUrl)).text();

  const faces = css.match(/@font-face\s*{[^}]*}/g) ?? [];
  if (faces.length === 0) throw new Error(`No @font-face found in ${cssUrl}`);

  for (const face of faces) {
    const family = face
      .match(/font-family:\s*["']?([^"';]+)["']?/)?.[1]
      ?.trim();
    const rel = face.match(
      /url\(\s*["']?([^"')]+?\.woff2)(?:[?#][^"')]*)?["']?\s*\)/,
    )?.[1];
    if (!family || !rel) {
      throw new Error(`No woff2 source in the @font-face of ${cssUrl}`);
    }

    const fontUrl = new URL(rel, cssUrl);
    const file = path.basename(fontUrl.pathname);
    const buf = Buffer.from(await (await get(fontUrl)).arrayBuffer());
    await writeFile(path.join(FONT_DIR, file), buf);

    const block =
      `@font-face{font-family:"${family}";` +
      `src:url("${FONT_URL_BASE}/${file}") format("woff2");` +
      `font-weight:normal;font-style:normal;font-display:swap;}`;
    css = css.replace(face, () => block);

    console.log(`ok  ${family}  ->  ${file}  (${(buf.length / 1024).toFixed(0)} KiB)`);
  }

  parts.push(`/* ${cssUrl} */\n${css.trim()}\n`);
}

await writeFile(CSS_OUT, parts.join("\n"));
console.log(`\nWrote ${CSS_OUT}`);
