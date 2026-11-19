// src/app/projects/[slug]/opengraph-image.jsx
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import projectsData from "../../assets/projects/projects";

export const alt = "Project case study preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const FALLBACK_TITLE = "Project case study";
const BG_FROM = "#E9FBFD";
const BG_TO = "#F0EFFF";
// 135deg = top-left theke bottom-right. Direction badlate chaile angle change koro
// (90deg = left -> right, 180deg = top -> bottom)
const BACKGROUND = `linear-gradient(135deg, ${BG_FROM} 0%, ${BG_TO} 100%)`;
const LOGO_PATH = "/logo.png"; // public/logo.png

// ---------------------------------------------------------------------------
// Chips component (light mode, big variant) er style, OG image er jonno
// Satori Tailwind class bujhe na, tai actual value gula ekhane boshano hoyeche.
//
// Chips.jsx theke map:
//   bg-secondary-50        -> background
//   text-secondary-900     -> color
//   text-size-sm           -> fontSize
//   py-2.5 / px-space-5    -> paddingY / paddingX
//   rounded-full           -> borderRadius
//   font-semibold          -> fontWeight 600
//   chips-shadow           -> boxShadow
// ---------------------------------------------------------------------------
const CHIP = {
  background: "#E9FBFD", // secondary-50 (light)
  color: "#0E5964", // secondary-900
  fontSize: 12, // text-size-sm
  fontWeight: 600, // font-semibold
  paddingY: 8, // py-2.5 = 0.625rem
  paddingX: 16, // px-space-5
  boxShadow: [
    "1px 1px 2px rgba(255, 255, 255, 0.3)",
    "-1px -1px 2px rgba(196, 211, 213, 0.5)",
    "inset 1px -1px 2px rgba(196, 211, 213, 0.2)",
    "inset -1px 1px 2px rgba(196, 211, 213, 0.2)",
    "inset -1px -1px 2px rgba(255, 255, 255, 0.9)",
    "inset 1px 1px 3px rgba(196, 211, 213, 0.9)",
  ].join(", "), // chips-shadow
};

// OG image 1200px wide, tai real UI size e chip khub chhoto dekhabe.
// 1 dile exact site er size, 1.5 dile OG te readable.
const CHIP_SCALE = 1.5;
const s = (n) => Math.round(n * CHIP_SCALE);

const truncate = (text = "", max) =>
  text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;

function getTags(project) {
  const tags = project.tags?.length
    ? project.tags
    : [...(project.design?.tags ?? []), ...(project.development?.tags ?? [])];
  return [...new Set(tags)].slice(0, 3);
}

// Remote URL hole shoja use hoy, local (/projects/..., /logo.png) hole public folder theke porhe data URI banay.
// ImageResponse (Satori) relative URL ("/logo.png") resolve korte pare na, tai data URI dorkar.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const MIME = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  svg: "image/svg+xml",
};

const toDataUri = (buffer, mime) =>
  `data:${mime};base64,${buffer.toString("base64")}`;

// src hote pare: string path, remote URL, ba static import object { src, width, height }
async function getImageSrc(input) {
  if (!input) return null;

  const src = typeof input === "string" ? input : input.src;
  if (!src || typeof src !== "string") return null;

  if (src.startsWith("data:")) return src;
  if (/^https?:\/\//i.test(src)) return src;

  const ext = path.extname(src.split("?")[0]).slice(1).toLowerCase();
  const mime = MIME[ext];
  if (!mime) return null; // webp/avif ImageResponse e support kore na

  // 1) Static import: /_next/static/media/... → .next folder e thake
  if (src.startsWith("/_next/")) {
    const relative = src.replace(/^\/_next\//, "").split("?")[0];
    const candidates = [
      path.join(process.cwd(), ".next", relative), // production build
      path.join(process.cwd(), ".next", "dev", relative), // dev (Turbopack)
    ];

    for (const file of candidates) {
      try {
        return toDataUri(await readFile(file), mime);
      } catch {
        // porer candidate try koro
      }
    }

    // 2) Fallback: dev server theke fetch
    try {
      const res = await fetch(new URL(src, SITE_URL));
      if (res.ok) {
        return toDataUri(Buffer.from(await res.arrayBuffer()), mime);
      }
    } catch {}

    return null;
  }

  // 3) public folder er file (jemon /logo.png)
  try {
    const file = await readFile(path.join(process.cwd(), "public", src));
    return toDataUri(file, mime);
  } catch {
    return null;
  }
}

// Build time e prottek project er image toiri hobe
export function generateStaticParams() {
  return projectsData.map(({ slug }) => ({ slug }));
}

export default async function Image({ params }) {
  const { slug } = await params;
  const project = projectsData.find((p) => p.slug === slug);

  const title = truncate(project?.title ?? FALLBACK_TITLE, 80);
  const description = truncate(project?.description ?? "", 120);
  const tags = project ? getTags(project) : [];
  const [cover, logo] = await Promise.all([
    getImageSrc(project?.finalDesign?.coverImage?.src),
    getImageSrc(LOGO_PATH),
  ]);

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundImage: BACKGROUND,
        color: "#0b0f19",
        padding: 64,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 48,
              fontWeight: 700,
              lineHeight: 1.25,
              marginBottom: 16,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              lineHeight: 1.4,
              color: "#6B7280",
              marginBottom: 32,
            }}
          >
            {description}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {tags.map((tag) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  whiteSpace: "nowrap",
                  background: CHIP.background,
                  color: CHIP.color,
                  fontSize: s(CHIP.fontSize),
                  fontWeight: CHIP.fontWeight,
                  padding: `${s(CHIP.paddingY)}px ${s(CHIP.paddingX)}px`,
                  borderRadius: 9999,
                  boxShadow: CHIP.boxShadow,
                  marginRight: 14,
                  marginBottom: 14,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {logo && (
          <div style={{ display: "flex" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo}
              alt="Logo"
              width={220}
              height={64}
              style={{ objectFit: "contain", objectPosition: "left center" }}
            />
          </div>
        )}
      </div>

      {cover && (
        <div style={{ display: "flex", marginLeft: 48 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover}
            alt={title}
            width={420}
            height={502}
            style={{ objectFit: "cover", borderRadius: 24 }}
          />
        </div>
      )}
    </div>,
    { ...size },
  );
}
