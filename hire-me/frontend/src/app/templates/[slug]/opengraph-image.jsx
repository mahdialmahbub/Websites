// app/templates/[slug]/opengraph-image.jsx - prottek template er nijossho OG image (1200x630).
// Next.js ei file pele nijei /templates/<slug>/opengraph-image route banay ar page e <meta og:image> boshay.
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getTemplate } from "@/lib/catalog";
import { SITE_NAME } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Ei export ta static. Prottek template er alada alt lagle generateImageMetadata use korte hobe.
export const alt = `${SITE_NAME} resume template preview`;

const SLUG = /^[a-z0-9-]{1,60}$/; // page.jsx er SLUG er moto
const BRAND = "#6D65E9"; // layout er themeColor er shathe mil

// Resume card er rong. Slug theke ekta rong bachi, jate prottek template e alada dekhay.
// (Eta shudhu illustration, template er ashol rong na.)
const ACCENTS = [
  "#6D65E9",
  "#0EA5E9",
  "#10B981",
  "#F59E0B",
  "#EC4899",
  "#EF4444",
];
const accentFor = (slug) =>
  ACCENTS[
    [...slug].reduce((sum, char) => sum + char.charCodeAt(0), 0) %
      ACCENTS.length
  ];

// Boro naam image e dhorbe na, tai shobder shesh e kete "…" dei
const clamp = (text, max) => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.5 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
};

// Naam joto lomba, font toto chhoto
const titleSize = (text) =>
  text.length <= 14 ? 84 : text.length <= 24 ? 68 : 54;

const toArrayBuffer = (buffer) => Uint8Array.from(buffer).buffer;

// assets/fonts/ e Poppins file na thakle default font diye-i image toiri hoy (error dey na)
async function loadFonts() {
  try {
    // Path gulo literal rakhsi: hosting (Vercel) er file tracer variable theke path bujhe na,
    // tai variable dile deploy e font file bundle hoy na.
    const [semiBold, regular] = await Promise.all([
      readFile(join(process.cwd(), "assets/fonts/Poppins-SemiBold.ttf")),
      readFile(join(process.cwd(), "assets/fonts/Poppins-Regular.ttf")),
    ]);
    return [
      {
        name: "Poppins",
        data: toArrayBuffer(semiBold),
        weight: 600,
        style: "normal",
      },
      {
        name: "Poppins",
        data: toArrayBuffer(regular),
        weight: 400,
        style: "normal",
      },
    ];
  } catch {
    return undefined;
  }
}

// next/og (Satori) shudhu flexbox bojhe: ek er beshi child thakle display: "flex" dite hobe.
const Line = ({ width, height = 10, color = "#e5e5ef", marginTop = 12 }) => (
  <div
    style={{
      display: "flex",
      width,
      height,
      borderRadius: height / 2,
      background: color,
      marginTop,
    }}
  />
);

export default async function Image({ params }) {
  const { slug } = await params;

  // API fail korleo image toiri hobe (generic card), na hole social site e image-i thakbe na
  const template = SLUG.test(slug)
    ? await getTemplate(slug).catch(() => null)
    : null;

  // Template na pele (API fail / 404) generic card: duibar "Resume Template" jeno na dekhay
  const name = clamp(template?.name ?? "Resume Templates", 40);
  const subtitle = template
    ? "Resume Template"
    : "Free ATS-Friendly Resume Builder";
  const category = template?.category?.name
    ? clamp(template.category.name, 24)
    : null;
  const accent = accentFor(slug ?? "");
  const fonts = await loadFonts();

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: `linear-gradient(135deg, ${BRAND} 0%, #4F46C8 100%)`,
        color: "#fff",
        fontFamily: "Poppins",
      }}
    >
      {/* Left: text */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          // Satori e width/height er shathe padding jog hoy (content-box), tai padding bad diye size dilam
          width: 570, // 700 - 90 (left) - 40 (right)
          height: size.height - 144, // 630 - 72 (top) - 72 (bottom)
          padding: "72px 40px 72px 90px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 34,
            fontWeight: 600,
            opacity: 0.9,
          }}
        >
          {SITE_NAME}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {category && (
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                padding: "8px 22px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.2)",
                fontSize: 26,
                fontWeight: 400,
                marginBottom: 26,
              }}
            >
              {category}
            </div>
          )}
          <div
            style={{
              display: "flex",
              fontSize: titleSize(name),
              fontWeight: 600,
              lineHeight: 1.1,
            }}
          >
            {name}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 40,
              fontWeight: 400,
              opacity: 0.9,
              marginTop: 14,
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 26,
            fontWeight: 400,
            opacity: 0.85,
          }}
        >
          ATS-friendly · Free to start
        </div>
      </div>

      {/* Right: resume card illustration (fixed-size box, card centered inside) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 500,
          height: size.height,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 330,
            height: 440,
            padding: 32,
            background: "#fff",
            borderRadius: 20,
            transform: "rotate(4deg)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                width: 72,
                height: 72,
                borderRadius: 36,
                background: accent,
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: 20,
              }}
            >
              <Line width={130} height={16} color="#2b2b3c" marginTop={0} />
              <Line width={90} height={12} color={`${accent}55`} />
            </div>
          </div>

          <Line width={120} height={14} color={accent} marginTop={40} />
          <Line width="100%" marginTop={20} />
          <Line width="92%" />
          <Line width="76%" />

          <Line width={120} height={14} color={accent} marginTop={36} />
          <Line width="100%" marginTop={20} />
          <Line width="84%" />
          <Line width="68%" />
        </div>
      </div>
    </div>,
    { ...size, fonts },
  );
}
