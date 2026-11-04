// tests/seo.spec.js - Playwright diye SEO regression test.
//
// Run:
//   npx playwright test                                   (local: build kore start kore)
//   PREVIEW_URL=https://your-domain.com npx playwright test   (live / preview site)
//
// Category ar template er URL hardcode kora nei: sitemap theke prothom ta niye test kori,
// tai template er slug bodlale test bhenge na.
import { test, expect } from "@playwright/test";

const BASE = (process.env.PREVIEW_URL ?? "http://localhost:3000").replace(
  /\/+$/,
  "",
);
const IS_LOCAL = /localhost|127\.0\.0\.1/.test(BASE);
const MIN_SITEMAP_URLS = Number(process.env.MIN_SITEMAP_URLS) || 5; // tomar site e URL kom hole kombao
const TITLE_MIN = 10;
const TITLE_MAX = 75;
const DESCRIPTION_MIN = 50;
const DESCRIPTION_MAX = 160;

// robots.js ar check-links.mjs er list er shathe mil
const PRIVATE_PATHS = [
  "/builder",
  "/my-resume",
  "/create-resume",
  "/profile",
  "/login",
  "/sign-up",
  "/email-verify",
  "/forgot-password",
  "/password-reset-otp",
  "/reset-password",
];

// ───────── helper ─────────
// locator.getAttribute() element na thakle 30 second opekkha kore, tai evaluateAll use kori
const attrs = (page, selector, attribute) =>
  page
    .locator(selector)
    .evaluateAll(
      (nodes, name) => nodes.map((node) => node.getAttribute(name) ?? ""),
      attribute,
    );

async function sitemapPaths(request) {
  const res = await request.get(`${BASE}/sitemap.xml`);
  expect(res.status()).toBe(200);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => new URL(match[1].replace(/&amp;/g, "&")).pathname,
  );
}

// ───────── 1) page gulor SEO basics ─────────
const pages = [
  { name: "home", path: "/" },
  { name: "templates listing", path: "/templates" },
  { name: "category", find: /^\/templates\/category\/[^/]+$/ },
  { name: "template", find: /^\/templates\/[^/]+$/ },
];

for (const t of pages) {
  test(`${t.name}: SEO basics`, async ({ page, request }) => {
    const path =
      t.path ??
      (await sitemapPaths(request)).find((candidate) => t.find.test(candidate));
    test.skip(!path, `sitemap e ${t.name} er kono URL nei`);

    const res = await page.goto(BASE + path);
    expect(res?.status()).toBe(200);

    // title: ache, ar khub choto/boro na
    const title = await page.title();
    expect(title.length).toBeGreaterThan(TITLE_MIN);
    expect(title.length).toBeLessThan(TITLE_MAX);

    // description
    const [description = ""] = await attrs(
      page,
      'meta[name="description"]',
      "content",
    );
    expect(description.length).toBeGreaterThan(DESCRIPTION_MIN);
    expect(description.length).toBeLessThanOrEqual(DESCRIPTION_MAX);

    // canonical: self-referencing (query bade). Live site e domain-o mile thakte hobe.
    const [canonical] = await attrs(page, 'link[rel="canonical"]', "href");
    expect(canonical, "canonical missing").toBeTruthy();
    const canonicalUrl = new URL(canonical);
    expect(canonicalUrl.pathname.replace(/\/+$/, "") || "/").toBe(path);
    if (!IS_LOCAL) expect(canonicalUrl.origin).toBe(new URL(BASE).origin);

    // thik ekta H1
    await expect(page.locator("h1")).toHaveCount(1);

    // oniccha-krito noindex nei
    const robots = [
      ...(await attrs(page, 'meta[name="robots"]', "content")),
      ...(await attrs(page, 'meta[name="googlebot"]', "content")),
    ].join(" ");
    expect(robots).not.toContain("noindex");

    // og:image ache, ar absolute URL
    const [ogImage] = await attrs(page, 'meta[property="og:image"]', "content");
    expect(ogImage, "og:image missing").toMatch(/^https?:\/\//);

    // shob image e alt
    await expect(page.locator("img:not([alt])")).toHaveCount(0);

    // JSON-LD boidho
    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((nodes) => nodes.map((node) => node.textContent ?? ""));
    expect(blocks.length).toBeGreaterThan(0);
    for (const block of blocks) {
      expect(() => JSON.parse(block)).not.toThrow();
      const data = JSON.parse(block);
      expect(data["@context"]).toBe("https://schema.org");
    }
  });
}

// ───────── 2) 404 shothik status dey (soft 404 noy) ─────────
const notFoundPaths = [
  ["unknown page", "/__definitely-not-a-page__"],
  ["unknown template", "/templates/definitely-not-a-template"],
  ["invalid template slug", "/templates/Not_A_Valid_Slug"],
  ["unknown category", "/templates/category/definitely-not-a-category"],
  ["page number past the end", "/templates?page=1000"],
];

for (const [name, path] of notFoundPaths) {
  test(`404 status: ${name}`, async ({ request }) => {
    const res = await request.get(BASE + path);
    expect(res.status()).toBe(404);
  });
}

// ───────── 3) sitemap boidho o jothesto boro ─────────
test("sitemap valid ar jothesto boro", async ({ request }) => {
  const paths = await sitemapPaths(request);

  // hotat khali (shudhu static page) sitemap dhora porbe
  expect(paths.length).toBeGreaterThanOrEqual(MIN_SITEMAP_URLS);

  // ek URL duibar nei
  expect(new Set(paths).size).toBe(paths.length);

  // private page sitemap e nei
  const leaked = paths.filter((p) =>
    PRIVATE_PATHS.some(
      (privatePath) => p === privatePath || p.startsWith(`${privatePath}/`),
    ),
  );
  expect(leaked, `private page in sitemap: ${leaked.join(", ")}`).toEqual([]);
});

// ───────── 4) robots.txt ─────────
test("robots.txt thik ache", async ({ request }) => {
  const res = await request.get(`${BASE}/robots.txt`);
  expect(res.status()).toBe(200);
  const text = await res.text();

  expect(text).toMatch(/^sitemap:\s*https?:\/\/\S+\/sitemap\.xml/im);

  // Shudhu "User-agent: *" group dekhi (SemrushBot er Disallow: / thik ache)
  const group =
    text.split(/\n\s*\n/).find((block) => /user-agent:\s*\*/i.test(block)) ??
    "";
  expect(group).not.toMatch(/^\s*disallow:\s*\/\s*$/im);
  expect(group).toMatch(/disallow:\s*\/api\//i);
  expect(group).toMatch(/disallow:\s*\/builder/i);
});
