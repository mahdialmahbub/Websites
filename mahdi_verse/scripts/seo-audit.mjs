// scripts/seo-audit.mjs
import { parse } from "node-html-parser";

// Usage: npm run seo:audit            -> INDEXNOW_SITE_URL (live site)
//        npm run seo:audit -- http://localhost:3000
const BASE = (
  process.argv[2] ??
  process.env.INDEXNOW_SITE_URL ??
  "http://localhost:3000"
).replace(/\/+$/, "");

const errors = [];
const warnings = [];
const fail = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);

// 1) Sitemap theke sob URL
const sitemapRes = await fetch(`${BASE}/sitemap.xml`);
if (!sitemapRes.ok) {
  console.error(
    `✖ ${BASE}/sitemap.xml pawa jay nai (status ${sitemapRes.status})`,
  );
  process.exit(1);
}
const xml = await sitemapRes.text();
const sitemapUrls = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((m) =>
  m[1].replaceAll("&amp;", "&"),
);

// 2) Prottek page fetch kore data tule nao
function schemaTypes(json) {
  const nodes = json["@graph"] ?? [json];
  return nodes.flatMap((node) => node["@type"] ?? []);
}

const rows = [];
for (const url of sitemapUrls) {
  const pathname = new URL(url).pathname;
  // BASE theke fetch (local hole localhost), kintu sitemap er URL er sathe canonical milabo
  const res = await fetch(`${BASE}${pathname}`, { redirect: "manual" });
  const html = res.status === 200 ? await res.text() : "";
  const doc = parse(html);

  const jsonLdTypes = [];
  let jsonLdBlocks = 0;
  let jsonLdInvalid = 0;
  for (const block of doc.querySelectorAll(
    'script[type="application/ld+json"]',
  )) {
    jsonLdBlocks += 1;
    try {
      jsonLdTypes.push(...schemaTypes(JSON.parse(block.rawText)));
    } catch {
      jsonLdInvalid += 1;
    }
  }

  rows.push({
    url,
    pathname,
    status: res.status,
    title: doc.querySelector("title")?.text?.trim() || null,
    description:
      doc
        .querySelector('meta[name="description"]')
        ?.getAttribute("content")
        ?.trim() || null,
    canonical:
      doc.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null,
    robots:
      doc.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "",
    h1Count: doc.querySelectorAll("h1").length,
    ogImage:
      doc.querySelector('meta[property="og:image"]')?.getAttribute("content") ??
      null,
    imgNoAlt: doc.querySelectorAll("img:not([alt])").length,
    jsonLdBlocks,
    jsonLdInvalid,
    jsonLdTypes,
  });
}

// 3) Niyom gulo prayog
for (const r of rows) {
  if (r.status !== 200) {
    fail(`[status ${r.status}] ${r.url}`);
    continue;
  }

  if (!r.title) fail(`[title missing] ${r.url}`);
  else if (r.title.length > 65)
    warn(`[title ${r.title.length} chars, Google ~60 e kete dey] ${r.url}`);

  if (!r.description) fail(`[description missing] ${r.url}`);
  else if (r.description.length > 160)
    warn(`[description ${r.description.length} chars] ${r.url}`);

  if (!r.canonical) fail(`[canonical missing] ${r.url}`);
  else if (r.canonical !== r.url)
    fail(`[canonical mismatch] ${r.url} → ${r.canonical}`);

  if (r.h1Count !== 1) fail(`[h1 count ${r.h1Count}] ${r.url}`);
  if (r.robots.includes("noindex")) fail(`[NOINDEX in sitemap!] ${r.url}`);
  if (!r.ogImage) fail(`[og:image missing] ${r.url}`);
  if (r.imgNoAlt > 0) fail(`[${r.imgNoAlt} img without alt] ${r.url}`);

  if (r.jsonLdBlocks === 0) warn(`[no JSON-LD] ${r.url}`);
  if (r.jsonLdInvalid > 0)
    fail(`[${r.jsonLdInvalid} invalid JSON-LD block] ${r.url}`);

  const hasWebSite = r.jsonLdTypes.includes("WebSite");
  if (r.pathname === "/" && !hasWebSite)
    fail(`[WebSite schema missing on home] ${r.url}`);
  if (r.pathname !== "/" && hasWebSite)
    fail(`[WebSite schema only home e thakbe] ${r.url}`);
}

function findDuplicates(key) {
  const seen = new Map();
  for (const r of rows) {
    if (!r[key]) continue;
    seen.set(r[key], [...(seen.get(r[key]) ?? []), r.url]);
  }
  return [...seen.entries()].filter(([, urls]) => urls.length > 1);
}

for (const [text, urls] of findDuplicates("title")) {
  fail(`[duplicate title] "${text}" ×${urls.length}: ${urls.join(", ")}`);
}
for (const [text, urls] of findDuplicates("description")) {
  fail(`[duplicate description] ×${urls.length}: ${urls.join(", ")}`);
}

// 4) Phol
if (warnings.length)
  console.warn(
    `⚠ ${warnings.length} ta warning:\n  ${warnings.join("\n  ")}\n`,
  );

if (errors.length) {
  console.error(`✖ ${errors.length} ta somossha:\n  ${errors.join("\n  ")}`);
  process.exit(1);
}

console.log(`✓ ${rows.length} URL: sob SEO check pass`);
