// scripts/check-links.mjs
import { parse } from 'node-html-parser'

// Usage: npm run check:links
//        npm run check:links -- http://localhost:3000
const BASE = new URL(process.argv[2] ?? process.env.INDEXNOW_SITE_URL ?? 'http://localhost:3000')
const MAX_PAGES = 500 // safety limit so a link loop can never run forever

const seen = new Set()
const queue = [{ path: '/', from: null }]
const broken = []
const redirects = []

// Turn an href into a clean internal path, or null for external / non-page links
function toInternalPath(href, currentPath) {
  if (!href || /^(mailto:|tel:|javascript:|#)/i.test(href)) return null

  let url
  try {
    url = new URL(href, new URL(currentPath, BASE))
  } catch {
    return null
  }

  if (url.origin !== BASE.origin) return null
  // Skip Next.js internals (scripts, images, chunks)
  if (url.pathname.startsWith('/_next/')) return null

  // Query strings and hashes point to the same page, so only the pathname is kept
  return url.pathname
}

// 1) Crawl every internal link, starting from the home page
while (queue.length > 0 && seen.size < MAX_PAGES) {
  const { path, from } = queue.shift()
  if (seen.has(path)) continue
  seen.add(path)

  const res = await fetch(new URL(path, BASE), { redirect: 'manual' })

  // A redirecting internal link is outdated: it should point to the final URL
  if (res.status >= 300 && res.status < 400) {
    const location = res.headers.get('location')
    redirects.push({ path, status: res.status, to: location, from })

    const target = toInternalPath(location, path)
    if (target) queue.push({ path: target, from: path })
    continue
  }

  if (res.status >= 400) {
    broken.push({ path, status: res.status, from })
    continue
  }

  // Only HTML pages can contain more links (PDFs, images, etc. are just status-checked)
  if (!res.headers.get('content-type')?.includes('text/html')) {
    await res.body?.cancel()
    continue
  }

  const root = parse(await res.text())
  for (const a of root.querySelectorAll('a[href]')) {
    const target = toInternalPath(a.getAttribute('href'), path)
    if (target && !seen.has(target)) queue.push({ path: target, from: path })
  }
}

// 2) Orphan check: sitemap URLs that no internal link points to
const orphans = []
const sitemapRes = await fetch(new URL('/sitemap.xml', BASE))
if (sitemapRes.ok) {
  const xml = await sitemapRes.text()
  for (const [, loc] of xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)) {
    const { pathname } = new URL(loc.replaceAll('&amp;', '&'))
    if (!seen.has(pathname)) orphans.push({ path: pathname })
  }
}

// 3) Report
if (redirects.length > 0) {
  console.warn(`⚠ ${redirects.length} internal link(s) point to a redirect (update them to the final URL):`)
  console.table(redirects)
}

if (orphans.length > 0) {
  console.warn(`⚠ ${orphans.length} sitemap URL(s) are not linked from any page:`)
  console.table(orphans)
}

if (broken.length > 0) {
  console.error(`✖ ${broken.length} broken internal link(s):`)
  console.table(broken)
  process.exit(1) // fails CI
}

console.log(`✓ ${seen.size} internal URLs checked, no broken links`)