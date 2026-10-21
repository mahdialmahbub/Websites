import { NextResponse } from 'next/server'

// Only the staging environment is protected.
// Production and local development (NEXT_PUBLIC_ENV unset) are left open.
const IS_STAGING = process.env.NEXT_PUBLIC_ENV === 'staging'

const ROBOTS_HEADER = 'noindex, nofollow, noarchive'

export function middleware(req) {
  if (!IS_STAGING) return NextResponse.next()

  const user = process.env.STAGING_USER
  const pass = process.env.STAGING_PASS

  // Fail closed: without credentials, never fall back to a guessable
  // value such as "undefined:undefined".
  if (!user || !pass) {
    return new NextResponse('Staging credentials are not configured', {
      status: 503,
      headers: { 'X-Robots-Tag': ROBOTS_HEADER },
    })
  }

  // Layer 1: Basic Auth is the real barrier.
  const expected = 'Basic ' + btoa(`${user}:${pass}`)
  if (req.headers.get('authorization') !== expected) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="staging"',
        // Also sent on the 401 so crawlers that never get past the
        // login prompt still see the noindex signal.
        'X-Robots-Tag': ROBOTS_HEADER,
      },
    })
  }

  // Layer 2: noindex header as a second line of defense.
  const res = NextResponse.next()
  res.headers.set('X-Robots-Tag', ROBOTS_HEADER)
  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}