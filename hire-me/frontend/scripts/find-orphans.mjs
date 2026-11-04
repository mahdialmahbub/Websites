// scripts/find-orphans.mjs - "orphan" page khuje ber kore.
// Orphan = sitemap e ache, kintu home theke kono internal link dhore pouchano jay na.
// Google er kache eta weak signal: page ta site er onno kono page theke link paay na.
//
// Run (age `npm run build && npm start` diye site chalu koro):
//   SITE_URL=http://localhost:3000 node scripts/find-orphans.mjs
//
// Orphan paile exit code 1. Onek gobhire (beshi click dure) thaka page WARN hishebe dekhay.
import { parse } from "node-html-parser";

const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
const ORIGIN = new URL(BASE).origin;
const CONCURRENCY = Number(process.env.CHECK_CONCURRENCY) || 5;
const MAX_PAGES = Number(process.env.MAX_PAGES) || 2000;
const MAX_DEPTH = Number(process.env.MAX_DEPTH) || 4; // er beshi click dure hole warning
const TIMEOUT_MS = 15_000;

// Private page crawl kora hoy na (robots.js er list er moto)
const PRIVATE_PATHS = [
  "/builder",
  "/my-resume",
  "/profile",
  "/login",
  "/sign-up",
  "/email-verify",
  "/forgot-password",
  "/password-reset-otp",
  "/reset-password",
];
const isPrivate = (pathname) =>
  PRIVATE_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));

const get = (url) =>
  fetch(url, {
    redirect: "manual",
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { "user-agent": "find-orphans/1.0" },
  });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const decode = (text) =>
  text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');

// Sitemap er URL ar link er URL ek-i key e ana: path, trailing slash chhara, shudhu ?page=N (N > 1) rakhi.
function keyOf(url) {
  const pathname = url.pathname.replace(/\/+$/, "") || "/";
  const page = Number.parseInt(url.searchParams.get("page") ?? "", 10);
  return page > 1 ? `${pathname}?page=${page}` : pathname;
}

function internalUrl(value, fromKey) {
  if (!value) return null;
  const raw = decode(value.trim());
  if (!raw || raw.startsWith("#") || /^(mailto:|tel:|javascript:|data:)/i.test(raw)) return null;
  try {
    const url = new URL(raw, new URL(fromKey, BASE));
    return url.origin === ORIGIN ? url : null;
  } catch {
    return null;
  }
}

// ───────── 1) sitemap er shob URL ─────────
async function loadSitemapKeys() {
  const res = await get(`${BASE}/sitemap.xml`);
  if (res.status !== 200) {
    console.error(`sitemap.xml answered ${res.status} (${BASE}/sitemap.xml)`);
    process.exit(1);
  }
  const xml = await res.text();
  return new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => keyOf(new URL(decode(m[1].trim())))));
}

// ───────── 2) "/" theke link dhore crawl (sitemap theke seed kori na, ei-i to ashol kotha) ─────────
const reachable = new Map(); // key -> depth (kotogulo click e pouchano jay)
const queue = [];
const errors = [];
let active = 0;

function enqueue(url, depth) {
  if (url.pathname.startsWith("/api/")) return;
  const key = keyOf(url);
  if (reachable.has(key) || reachable.size >= MAX_PAGES) return;
  reachable.set(key, depth);
  queue.push({ key, depth });
}

async function crawl({ key, depth }) {
  try {
    const res = await get(`${BASE}${key}`);

    if (res.status >= 300 && res.status < 400) {
      await res.body?.cancel();
      const target = internalUrl(res.headers.get("location"), key);
      if (target) enqueue(target, depth); // redirect e extra click lage na
      return;
    }
    if (res.status >= 400) {
      await res.body?.cancel();
      errors.push(`${key} answered ${res.status}`);
      return;
    }
    if (!res.headers.get("content-type")?.includes("text/html")) {
      await res.body?.cancel();
      return;
    }

    const html = await res.text();
    if (isPrivate(new URL(key, BASE).pathname)) return;

    for (const a of parse(html).querySelectorAll("a[href]")) {
      const url = internalUrl(a.getAttribute("href"), key);
      if (url) enqueue(url, depth + 1);
    }
  } catch (error) {
    errors.push(`${key} ${error.name === "TimeoutError" ? "timeout" : error.message}`);
  }
}

async function worker() {
  for (;;) {
    const job = queue.shift();
    if (!job) {
      if (active === 0) return;
      await sleep(20);
      continue;
    }
    active++;
    try {
      await crawl(job);
    } finally {
      active--;
    }
  }
}

async function main() {
  let sitemapKeys;
  try {
    sitemapKeys = await loadSitemapKeys();
  } catch (error) {
    console.error(`Site e connect hoy ni (${BASE}): ${error.message}`);
    console.error("Age `npm run build && npm start` diye site chalu koro, ba SITE_URL set koro.");
    process.exit(1);
  }

  enqueue(new URL("/", BASE), 0);
  console.log(`Crawling ${BASE} (sitemap e ${sitemapKeys.size} URL) ...`);
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  // ───────── 3) parthokyo-i orphan ─────────
  const orphans = [...sitemapKeys].filter((key) => !reachable.has(key)).sort();

  const deep = [...sitemapKeys]
    .filter((key) => (reachable.get(key) ?? 0) > MAX_DEPTH)
    .sort((a, b) => reachable.get(b) - reachable.get(a));

  // Link paay kintu sitemap e nei (private, ?page=N, noindex template shob bad)
  const notInSitemap = [...reachable.keys()]
    .filter((key) => !sitemapKeys.has(key) && !key.includes("?page=") && !isPrivate(new URL(key, BASE).pathname))
    .sort();

  if (errors.length) console.warn(`\nCrawl error (${errors.length}):\n${errors.join("\n")}`);
  if (deep.length) {
    console.warn(`\nWARN: ${deep.length} page home theke ${MAX_DEPTH} click er beshi dure:`);
    deep.slice(0, 20).forEach((key) => console.warn(`  [${reachable.get(key)} click]`, key));
    if (deep.length > 20) console.warn(`  ... aro ${deep.length - 20} ta`);
  }
  if (notInSitemap.length) {
    console.warn(`\nINFO: ${notInSitemap.length} page link paay kintu sitemap e nei:`);
    notInSitemap.slice(0, 20).forEach((key) => console.warn("  ", key));
  }

  if (orphans.length) {
    console.error(`\nFAIL: orphan: ${orphans.length}`);
    orphans.forEach((key) => console.error("  ", key));
    process.exit(1);
  }
  console.log(`\n✓ ${sitemapKeys.size} sitemap URL - kono orphan nei (${reachable.size} page crawl hoyeche)`);
}

main();
