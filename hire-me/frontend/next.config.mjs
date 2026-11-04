// Backend API URL (server-side only)
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:5000";

// ───────── static asset cache ─────────
// public/ er file gulor nam hash hoy na (logo.png, server-error-icon.svg ...), tai "immutable + 1 year" dile
// file bodlalew user er browser purono ta-i dekhabe. Tai ekhane 1 din + background refresh.
// Jodi tumi file er nam e version/hash dao (logo.v2.png), tahole nichher line ta
// "public, max-age=31536000, immutable" kore dite paro.
// /_next/static (hashed) ar /_next/image er cache Next.js nijei thik kore dey, tai ekhane chhoy na.
const PUBLIC_ASSET_CACHE =
  "public, max-age=86400, stale-while-revalidate=604800";

const VIDEO_CACHE = "public, max-age=31536000, immutable";

// ───────── security header ─────────
const securityHeaders = [
  // HTTPS shobshomoy. includeSubDomains: shob subdomain-o (staging.* soho) HTTPS only hobe.
  // "preload" ta hstspreload.org e submit na korle kono kaj kore na, ar submit korle fer-ano kothin.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Camera/mic/location ei site e lage na. Profile photo er jonno camera capture dile "camera=()" tule dao.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow development requests from your mobile device
  allowedDevOrigins: ["192.168.0.105"],

  // Enable React Compiler
  reactCompiler: true,

  // "X-Powered-By: Next.js" header lukai
  poweredByHeader: false,

  // /templates/ -> /templates (308 redirect). canonical() er niti (trailing slash nei) er shathe mil.
  trailingSlash: false,

  // Forward API requests to the Express backend.
  // Ei rewrite filesystem route er PORE check hoy, tai app/api/revalidate/route.js er moto Next.js er nijer
  // API route thakle seta-i age dhore, Express e jay na.
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },

  // Redirect map. permanent: true = 308 (Google purono URL er ranking notun URL e dey).
  async redirects() {
    return [
      // /templates/category (category nam chhara) ekta template slug hishebe dhora porto, tai 404 hoto
      {
        source: "/templates/category",
        destination: "/templates",
        permanent: true,
      },

      // URL bodlale ei dhoroner rule add koro (purono URL e Google er index kora page 404 hote dio na):
      // { source: "/template/:slug", destination: "/templates/:slug", permanent: true },
      // { source: "/templates/:slug/details", destination: "/templates/:slug", permanent: true },
      // { source: "/blog/:year(\\d{4})/:slug", destination: "/blog/:slug", permanent: true },
      // wildcard: { source: "/old-templates/:path*", destination: "/templates/:path*", permanent: true },
    ];
  },

  // Allow remote images
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 din
  },

  async headers() {
    return [
      // Shob page e security header
      { source: "/:path*", headers: securityHeaders },

      // public/ er image ar font (/_next/ bade)
      {
        source: "/((?!_next/).*)\\.(jpg|jpeg|png|webp|avif|svg|ico|woff2)",
        headers: [{ key: "Cache-Control", value: PUBLIC_ASSET_CACHE }],
      },

      // public/videos er video + poster (upore er rule er pore thakte hobe)
      {
        source: "/videos/:path*",
        headers: [{ key: "Cache-Control", value: VIDEO_CACHE }],
      },
      {
        source: "/r/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive, noimageindex",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
