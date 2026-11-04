// scripts/seo-audit.mjs - sitemap theke shob URL niye prottek page er SEO metadata audit.
//
// Run (age `npm run build && npm start` diye site chalu koro):
//   SITE_URL=http://localhost:3000 node scripts/seo-audit.mjs
// Production check:
//   SITE_URL=https://your-domain.com node scripts/seo-audit.mjs
//
// FAIL hole exit code 1 (CI te build fail korbe). WARN shudhu dekhay, build fail kore na.
import { parse } from "node-html-parser";

const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
const CONCURRENCY = Number(process.env.AUDIT_CONCURRENCY) || 5;
const TIMEOUT_MS = 15_000;

const failures = [];
const warnings = [];
const addFail = (tag, url) => failures.push(`[${tag}] ${url}`);
const addWarn = (tag, url) => warnings.push(`[${tag}] ${url}`);

const isLocal = (value) => /localhost|127\.0\.0\.1/.test(value);
const normalize = (url) => (url ?? "").replace(/\/+$/, "");
const decode = (text) =>
  text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'");

// redirect: "manual" => 301/302 ke 200 bhule jabo na, status hishebe dhora porbe
const get = (url) =>
  fetch(url, {
    redirect: "manual",
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { "user-agent": "seo-audit/1.0" },
  });

// Sitemap e production domain thakleo audit BASE (jemon localhost) theke fetch kori
const toFetchUrl = (url) => {
  const { pathname, search } = new URL(url);
  return `${BASE}${pathname}${search}`;
};

// Ek shathe CONCURRENCY ta kore request (shob URL ek ek kore korle onek dhire hoy)
async function mapLimit(items, limit, task) {
  const results = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await task(items[index]);
    }
  });
  await Promise.all(workers);
  return results;
}

// ───────── 1) sitemap theke shob URL ─────────
async function loadSitemapUrls() {
  const res = await get(`${BASE}/sitemap.xml`);
  if (res.status !== 200) {
    console.error(`sitemap.xml answered ${res.status} (${BASE}/sitemap.xml)`);
    process.exit(1);
  }
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => decode(m[1].trim()));
}

// ───────── 2) ekta page er data tule ana ─────────
async function auditPage(url) {
  const row = { url, status: 0 };
  try {
    const res = await get(toFetchUrl(url));
    row.status = res.status;
    if (res.status !== 200) return row;

    const doc = parse(await res.text());
    const meta = (selector) => doc.querySelector(selector)?.getAttribute("content")?.trim() ?? null;

    row.title = doc.querySelector("title")?.text?.trim() ?? null;
    row.description = meta('meta[name="description"]');
    row.canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute("href")?.trim() ?? null;
    // robots ar googlebot, duita meta-i dekhi
    row.robots = `${meta('meta[name="robots"]') ?? ""} ${meta('meta[name="googlebot"]') ?? ""}`.toLowerCase();
    row.h1Count = doc.querySelectorAll("h1").length;
    row.ogImage = meta('meta[property="og:image"]');
    row.ogTitle = meta('meta[property="og:title"]');
    row.twitterCard = meta('meta[name="twitter:card"]');
    row.lang = doc.querySelector("html")?.getAttribute("lang") ?? null;
    row.imgNoAlt = doc.querySelectorAll("img:not([alt])").length;

    const ld = doc.querySelectorAll('script[type="application/ld+json"]');
    row.jsonLdCount = ld.length;
    row.jsonLdInvalid = ld.filter((node) => {
      try {
        JSON.parse(node.rawText);
        return false;
      } catch {
        return true;
      }
    }).length;
  } catch (error) {
    row.error = error.name === "TimeoutError" ? "timeout" : error.message;
  }
  return row;
}

// ───────── 3) robots.txt ─────────
async function auditRobots() {
  const url = `${BASE}/robots.txt`;
  try {
    const res = await get(url);
    if (res.status !== 200) return addFail(`robots.txt status ${res.status}`, url);
    const text = await res.text();

    // Shudhu "User-agent: *" group dekhi. Kono specific bot (jemon SemrushBot) block thakle seta thik ache.
    const groups = text.split(/\n\s*\n/);
    const star = groups.find((group) => /user-agent:\s*\*/i.test(group));
    if (star && /^\s*disallow:\s*\/\s*$/im.test(star)) {
      addFail("robots.txt blocks the whole site (NEXT_PUBLIC_ENV=production set ache?)", url);
    }
    if (!/^\s*sitemap:/im.test(text)) addFail("robots.txt has no Sitemap line", url);
  } catch (error) {
    addFail(`robots.txt unreachable (${error.message})`, url);
  }
}

// ───────── 4) niyom gulo proyog ─────────
function checkRow(row) {
  const { url } = row;

  if (row.error) return addFail(`request failed: ${row.error}`, url);
  if (row.status !== 200) return addFail(`status ${row.status}`, url);

  if (!row.title) addFail("title missing", url);
  else if (row.title.length > 70) addWarn(`title ${row.title.length} chars (>70)`, url);

  if (!row.description) addFail("description missing", url);
  else if (row.description.length > 160) addWarn(`description ${row.description.length} chars (>160)`, url);
  else if (row.description.length < 50) addWarn(`description ${row.description.length} chars (too short)`, url);

  if (!row.canonical) addFail("canonical missing", url);
  else if (normalize(row.canonical) !== normalize(url)) {
    addFail(`canonical mismatch -> ${row.canonical}`, url);
  }

  if (row.h1Count !== 1) addFail(`h1 count ${row.h1Count}`, url);
  if (row.robots.includes("noindex")) addFail("NOINDEX in sitemap!", url);
  if (!row.ogImage) addFail("og:image missing", url);
  else if (!/^https?:\/\//.test(row.ogImage)) addWarn("og:image is not an absolute URL", url);
  if (!row.ogTitle) addWarn("og:title missing", url);
  if (!row.twitterCard) addWarn("twitter:card missing", url);
  if (!row.lang) addWarn("<html lang> missing", url);
  if (row.imgNoAlt > 0) addFail(`${row.imgNoAlt} img without alt`, url);
  if (row.jsonLdCount === 0) addWarn("no JSON-LD", url);
  if (row.jsonLdInvalid > 0) addFail(`${row.jsonLdInvalid} invalid JSON-LD block`, url);
}

// Ek-i value 2+ page e thakle duplicate
function findDuplicates(rows, key) {
  const seen = new Map();
  for (const row of rows) {
    if (!row[key]) continue;
    seen.set(row[key], [...(seen.get(row[key]) ?? []), row.url]);
  }
  return [...seen.entries()].filter(([, urls]) => urls.length > 1);
}

// ───────── main ─────────
async function main() {
  let urls;
  try {
    urls = await loadSitemapUrls();
  } catch (error) {
    console.error(`Site e connect hoy ni (${BASE}): ${error.message}`);
    console.error("Age `npm run build && npm start` diye site chalu koro, ba SITE_URL set koro.");
    process.exit(1);
  }

  if (urls.length === 0) {
    console.error("Sitemap e kono URL nei.");
    process.exit(1);
  }

  // Sitemap nijei thik ache kina
  if (!isLocal(BASE) && urls.some(isLocal)) {
    addFail("sitemap has localhost URLs (NEXT_PUBLIC_SITE_URL set ache?)", `${BASE}/sitemap.xml`);
  }
  for (const [url, list] of findDuplicates(urls.map((url) => ({ url, key: url })), "key")) {
    addFail(`URL ${list.length} bar sitemap e ache`, url);
  }

  await auditRobots();

  console.log(`Auditing ${urls.length} URL (${BASE}) ...`);
  const rows = await mapLimit([...new Set(urls)], CONCURRENCY, auditPage);

  rows.forEach(checkRow);

  for (const [title, list] of findDuplicates(rows, "title")) {
    addFail(`duplicate title "${title}" x${list.length}`, list.slice(0, 3).join(", "));
  }
  for (const [description, list] of findDuplicates(rows, "description")) {
    addFail(`duplicate description "${description.slice(0, 50)}..." x${list.length}`, list.slice(0, 3).join(", "));
  }

  // ───────── 5) fol ─────────
  if (warnings.length) console.warn(`\nWARN (${warnings.length}):\n${warnings.join("\n")}`);
  if (failures.length) {
    console.error(`\nFAIL (${failures.length}):\n${failures.join("\n")}`);
    process.exit(1);
  }
  console.log(`\n✓ ${rows.length} URL - shob metadata check pass`);
}

main();
