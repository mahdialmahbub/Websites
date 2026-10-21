// scripts/check-orphans.mjs
import { parse } from 'node-html-parser'

// Usage: npm run check:orphans
//        npm run check:orphans -- http://localhost:3000
const BASE = new URL(process.argv[2] ?? process.env.INDEXNOW_SITE_URL ?? 'http://localhost:3000')
const MAX_PAGES = 500 // safety limit so a link loop can never run forever

// Comparable path: no query, no hash, no trailing slash (except the root)
const normalize = (pathname) => (pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname)

// Resolve an href against the current page, return an internal path or null
function toInternalPath(href, currentPath) {
  if (!href || /^(mailto:|tel:|javascript:)/i.test(href)) return null

  try {
    const url = new URL(href, new URL(currentPath, BASE))
    if (url.origin !== BASE.origin) return null
    if (url.pathname.startsWith('/_next/')) return null
    return normalize(url.pathname)
  } catch {
    return null
  }
}

// 1) All URLs listed in the sitemap
const sitemapUrl = new URL('/sitemap.xml', BASE)
const sitemapRes = await fetch(sitemapUrl)
if (!sitemapRes.ok) {
  console.error(`✖ Could not load ${sitemapUrl} (status ${sitemapRes.status})`)
  process.exit(1)
}

const xml = await sitemapRes.text()
const sitemapPaths = new Set(
  [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map(([, loc]) =>
    normalize(new URL(loc.replaceAll('&amp;', '&')).pathname),
  ),
)

// 2) Crawl from the home page by following links, the same way a search engine does
const visited = new Set()
const okPages = new Set() // pages that returned HTML successfully
const inbound = new Map() // path -> set of pages that link to it
const queue = ['/']

while (queue.length > 0 && visited.size < MAX_PAGES) {
  const path = queue.shift()
  if (visited.has(path)) continue
  visited.add(path)

  const res = await fetch(new URL(path, BASE))
  if (!res.ok || !res.headers.get('content-type')?.includes('text/html')) {
    await res.body?.cancel()
    continue
  }
  okPages.add(path)

  const root = parse(await res.text())
  for (const a of root.querySelectorAll('a[href]')) {
    const target = toInternalPath(a.getAttribute('href'), path)
    if (!target || target === path) continue // skip external links and self links

    if (!inbound.has(target)) inbound.set(target, new Set())
    inbound.get(target).add(path)
    if (!visited.has(target)) queue.push(target)
  }
}

// 3) Compare the sitemap with what the crawl could actually reach
const orphans = [...sitemapPaths].filter((path) => path !== '/' && !inbound.has(path))
const unlisted = [...okPages].filter((path) => !sitemapPaths.has(path))

console.log(`Crawled ${okPages.size} pages, sitemap lists ${sitemapPaths.size} URLs\n`)

console.log('Internal links pointing to each sitemap URL:')
console.table(
  [...sitemapPaths]
    .map((path) => ({ path, inboundLinks: inbound.get(path)?.size ?? 0 }))
    .sort((a, b) => a.inboundLinks - b.inboundLinks),
)

if (unlisted.length > 0) {
  console.warn(`⚠ ${unlisted.length} linked page(s) are not in the sitemap (fine for noindex pages):`)
  console.table(unlisted.map((path) => ({ path })))
}

if (orphans.length > 0) {
  console.error(`✖ ${orphans.length} orphan page(s): in the sitemap but not linked from any page:`)
  console.table(orphans.map((path) => ({ path })))
  process.exit(1) // fails CI
}

console.log('✓ No orphan pages')