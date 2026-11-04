// proxy.js - environment-vittik surokkha (project root e, `app/` folder er pashe).
//
// NEXT.JS VERSION:
//   Next.js 16+      -> file er nam `proxy.js`, function er nam `proxy` (ekhon jemon ache)
//   Next.js 15 ba age -> file er nam `middleware.js` kore dao, ar `export function proxy` ke
//                        `export function middleware` kore dao. Ar kichu bodlate hobe na.
//
// Production (NEXT_PUBLIC_ENV=production): kichui kore na, shob request jete dey.
// Staging / preview: (1) Basic Auth diye bondho, (2) X-Robots-Tag: noindex header, jate
// Google kono bhabei index na kore (robots.js shudhu "crawl" thamay, "index" na).
import { NextResponse } from "next/server";

const ENV = process.env.NEXT_PUBLIC_ENV;
const IS_PROD = ENV === "production";
const IS_DEV = process.env.NODE_ENV === "development"; // `npm run dev` e login lagbe na

// Basic Auth chhara khola thakbe:
//  - /robots.txt: crawler "Disallow: /" dekhte pabe (401 dile se dekhte pay na)
//  - /api/revalidate, /api/indexnow: Express backend ei route call kore, tader nijer secret ache
const PUBLIC_PATHS = ["/robots.txt", "/api/revalidate", "/api/indexnow"];

const NOINDEX = "noindex, nofollow, noarchive";

// Shob response e (401/503 shoho) noindex header boshay
const withNoIndex = (response) => {
  response.headers.set("X-Robots-Tag", NOINDEX);
  return response;
};

// Duita string same kina, shomoy dekhe password anduj kora jay na emon bhabe
function safeEqual(a, b) {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i += 1) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

function isAuthorized(header, user, pass) {
  if (!header?.startsWith("Basic ")) return false;

  let decoded;
  try {
    decoded = atob(header.slice(6));
  } catch {
    return false;
  }

  // Password e ":" thakte pare, tai prothom ":" e bhaag kori
  const separator = decoded.indexOf(":");
  if (separator === -1) return false;

  const userOk = safeEqual(decoded.slice(0, separator), user);
  const passOk = safeEqual(decoded.slice(separator + 1), pass);
  return userOk && passOk;
}

export function proxy(request) {
  if (IS_PROD || IS_DEV) return NextResponse.next();

  const user = process.env.STAGING_USER;
  const pass = process.env.STAGING_PASS;

  if (!PUBLIC_PATHS.includes(request.nextUrl.pathname)) {
    // Staging e user/pass set na thakle site khola na rekhe bondho kore dei (fail closed).
    // Doc er code e eta hoy na: STAGING_USER na thakle "undefined:undefined" diye dhukte para jay.
    if (ENV === "staging" && (!user || !pass)) {
      return withNoIndex(new NextResponse("Staging credentials are not configured.", { status: 503 }));
    }

    // 1) Basic Auth: ashol badha
    if (user && pass && !isAuthorized(request.headers.get("authorization"), user, pass)) {
      return withNoIndex(
        new NextResponse("Authentication required", {
          status: 401,
          headers: { "WWW-Authenticate": 'Basic realm="staging"' },
        }),
      );
    }
  }

  // 2) Header level e noindex: ditiyo protirokkha
  return withNoIndex(NextResponse.next());
}

// _next/static, _next/image, favicon bade shob request e cholbe
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
