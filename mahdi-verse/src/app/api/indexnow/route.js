// src/app/api/indexnow/route.js
import { timingSafeEqual } from 'node:crypto'
import sitemap from '@/src/app/sitemap'

const ENDPOINT = 'https://api.indexnow.org/indexnow'
const MAX_URLS = 10000

const json = (body, status = 200) => Response.json(body, { status })

function isAuthorized(req) {
  const secret = process.env.INDEXNOW_SECRET
  if (!secret) return false

  const received = Buffer.from(req.headers.get('x-indexnow-secret') ?? '')
  const expected = Buffer.from(secret)
  return received.length === expected.length && timingSafeEqual(received, expected)
}

export async function POST(req) {
  if (!isAuthorized(req)) {
    return json({ ok: false, error: 'Unauthorized' }, 401)
  }

  // Staging / local theke kokhono search engine ke URL pathabo na
  if (process.env.NEXT_PUBLIC_ENV !== 'production') {
    return json({ ok: false, error: 'IndexNow only runs in production' }, 400)
  }

  const key = process.env.INDEXNOW_KEY
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (!key || !siteUrl) {
    return json({ ok: false, error: 'INDEXNOW_KEY or NEXT_PUBLIC_SITE_URL is missing' }, 500)
  }

  const host = new URL(siteUrl).host

  // Body te { urls: [...] } dile shudhu oigulo, na dile sitemap er sob URL
  const body = await req.json().catch(() => ({}))
  const requested =
    Array.isArray(body.urls) && body.urls.length
      ? body.urls
      : sitemap().map(({ url }) => url)

  // Duplicate bad, ar shudhu nijer host er valid URL rakho
  const urlList = [...new Set(requested)]
    .filter((url) => {
      try {
        return new URL(url).host === host
      } catch {
        return false
      }
    })
    .slice(0, MAX_URLS)

  if (urlList.length === 0) {
    return json({ ok: false, error: 'No valid URLs for this host' }, 400)
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host,
      key,
      keyLocation: `https://${host}/${key}.txt`,
      urlList,
    }),
  })

  return json({ ok: res.ok, status: res.status, submitted: urlList.length })
}