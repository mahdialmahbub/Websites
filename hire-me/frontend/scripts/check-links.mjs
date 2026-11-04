// scripts/check-links.mjs - site crawl kore broken internal link, broken image/icon/og:image khuje ber kore.
//
// Run (age `npm run build && npm start` diye site chalu koro):
//   SITE_URL=http://localhost:3000 node scripts/check-links.mjs
//
// Broken (4xx/5xx) kichu paile exit code 1 (CI fail). Redirect hoy emon link WARN hishebe dekhay.
import { parse } from "node-html-parser";

const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
const ORIGIN = new URL(BASE).origin;
const CONCURRENCY = Number(process.env.CHECK_CONCURRENCY) || 5;
const MAX_PAGES = Number(process.env.MAX_PAGES) || 2000; // infinite crawl thekano
const TIMEOUT_MS = 15_000;

// Login/private page: status check hoy, kintu vitor theke aro link khuja hoy na,
// ar login e redirect hole warning dewa hoy na (robots.js er private list er moto)
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
    headers: { "user-agent": "check-links/1.0" },
  });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const decode = (text) =>
  text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');

// Page key: hash bad, trailing slash bad, shudhu ?page=N (N > 1) rakhi.
// Tai /builder?template=a, /builder?template=b ... shob ek page hishebe ek bar-i check hoy.
function pageKey(url) {
  let pathname = url.pathname.replace(/\/+$/, "") || "/";
  const page = Number.parseInt(url.searchParams.get("page") ?? "", 10);
  if (page > 1 && !isPrivate(pathname)) pathname += `?page=${page}`;
  return pathname;
}

// Asset key: image, icon, og:image. Query rakhi (/_next/image?url=...&w=...)
const assetKey = (url) => `${url.pathname}${url.search}`;

const pagesSeen = new Set();
const assetsSeen = new Set();
const queue = [];
const broken = [];
const warnings = [];
let active = 0;

// href/src ke URL banay. Shudhu nijer site er URL return kore.
function resolveInternal(value, pageKeyValue) {
  if (!value) return null;
  const raw = decode(value.trim());
  if (!raw || raw.startsWith("#") || /^(mailto:|tel:|javascript:|data:|blob:)/i.test(raw)) return null;
  try {
    const url = new URL(raw, new URL(pageKeyValue, BASE));
    return url.origin === ORIGIN ? url : null;
  } catch {
    return null;
  }
}

function addPage(url, from) {
  if (url.pathname.startsWith("/api/")) return;
  const key = pageKey(url);
  if (pagesSeen.has(key) || pagesSeen.size >= MAX_PAGES) return;
  pagesSeen.add(key);
  queue.push({ type: "page", key, from });
}

function addAsset(url, from) {
  const key = assetKey(url);
  if (assetsSeen.has(key)) return;
  assetsSeen.add(key);
  queue.push({ type: "asset", key, from });
}

async function checkAsset({ key, from }) {
  try {
    const res = await get(`${BASE}${key}`);
    await res.body?.cancel();
    if (res.status >= 400) broken.push({ url: key, status: res.status, foundOn: from });
  } catch (error) {
    broken.push({ url: key, status: error.name === "TimeoutError" ? "timeout" : error.message, foundOn: from });
  }
}

async function checkPage({ key, from }) {
  const { pathname } = new URL(key, BASE);
  try {
    const res = await get(`${BASE}${key}`);

    // Redirect: link e final URL deowa bhalo (extra hop ar SEO te link equity kome)
    if (res.status >= 300 && res.status < 400) {
      await res.body?.cancel();
      const location = res.headers.get("location");
      if (!isPrivate(pathname)) {
        warnings.push(`${key} redirects (${res.status}) -> ${location}   [linked from ${from}]`);
      }
      const target = location && resolveInternal(location, key);
      if (target) addPage(target, key);
      return;
    }

    if (res.status >= 400) {
      await res.body?.cancel();
      broken.push({ url: key, status: res.status, foundOn: from });
      return;
    }

    if (!res.headers.get("content-type")?.includes("text/html")) {
      await res.body?.cancel();
      return;
    }

    const root = parse(await res.text());
    if (isPrivate(pathname)) return; // private page er vitor theke link khuji na

    for (const a of root.querySelectorAll("a[href]")) {
      const url = resolveInternal(a.getAttribute("href"), key);
      if (url) addPage(url, key);
    }

    // Image (next/image er /_next/image o), favicon, manifest, og:image
    const assetValues = [
      ...root.querySelectorAll("img[src]").map((node) => node.getAttribute("src")),
      ...root.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"], link[rel="manifest"]').map((node) => node.getAttribute("href")),
      ...root.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]').map((node) => node.getAttribute("content")),
    ];
    for (const value of assetValues) {
      const url = resolveInternal(value, key);
      if (url) addAsset(url, key);
    }
  } catch (error) {
    broken.push({ url: key, status: error.name === "TimeoutError" ? "timeout" : error.message, foundOn: from });
  }
}

// Queue ta crawl er shathe shathe baray, tai worker gulo queue khali + keu kaj kortese na hole shesh hoy
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
      await (job.type === "page" ? checkPage(job) : checkAsset(job));
    } finally {
      active--;
    }
  }
}

// Sitemap er URL gulo-o seed hishebe nei, jate kono page home theke link na thakleo check hoy
async function seedFromSitemap() {
  try {
    const res = await get(`${BASE}/sitemap.xml`);
    if (res.status !== 200) return;
    const xml = await res.text();
    for (const [, loc] of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const { pathname, search } = new URL(decode(loc.trim()));
      addPage(new URL(`${pathname}${search}`, BASE), "sitemap.xml");
    }
  } catch {
    // sitemap na pele shudhu "/" theke crawl hobe
  }
}

async function main() {
  try {
    const res = await get(BASE);
    await res.body?.cancel();
  } catch (error) {
    console.error(`Site e connect hoy ni (${BASE}): ${error.message}`);
    console.error("Age `npm run build && npm start` diye site chalu koro, ba SITE_URL set koro.");
    process.exit(1);
  }

  addPage(new URL("/", BASE), "start");
  await seedFromSitemap();

  console.log(`Crawling ${BASE} ...`);
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  if (pagesSeen.size >= MAX_PAGES) {
    warnings.push(`MAX_PAGES (${MAX_PAGES}) e pouchhe gese, kichu page check hoy ni. Beshi lagle MAX_PAGES barao.`);
  }
  if (warnings.length) console.warn(`\nWARN (${warnings.length}):\n${warnings.join("\n")}`);

  if (broken.length) {
    console.error(`\nFAIL: ${broken.length} broken URL`);
    console.table(broken);
    process.exit(1); // CI fail
  }
  console.log(`\n✓ ${pagesSeen.size} page + ${assetsSeen.size} asset - kono broken link nei`);
}

main();
