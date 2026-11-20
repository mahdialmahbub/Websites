/* ============================================================
   PROJECT DATA STRUCTURE (notun project add korar template)
   ------------------------------------------------------------
   Legend:
   [req]  = lagbei
   [opt]  = thakle dao, na thakle bad dao (section dekhabe na)
   (img)  = static import object (import x from "./Folder/x.jpg")
            ba remote URL string (https://...)

   {
     // ---------- Basic Info ----------
     id: "p1",                       // [req] unique id
     slug: "my-project-slug",        // [req] URL e use hoy. lowercase, space → "-", special char (– & .) dibe na
     title: "Project Title",         // [req] card + page heading
     description: "Short summary",   // [req] card e dekhabe. design/development e alada description na thakle hero te eta dekhabe

     // ---------- Shared Project Data (design + development duitar jonno) ----------
     finalDesign: {
       description: "Final design er intro",   // [req]
       tools: [figma, nextjs],                 // [req] upore define kora tool chips
       coverImage: {                           // [req] card er thumbnail
         src: Project_cover,                   //   (img)
         alt: "Cover image description",
       },
       images: [                               // [req] gallery. [{ src, alt }]
         { src: Project_1, alt: "Screen 1" },  //   (img)
       ],
     },

     // ---------- Full pages (shared) [opt] ----------
     // Pura website er page gulo device onujayi dekhay. PagePreviewSection e render hoy.
     // Design ar development duita view e dekhate chaile duita view-তেই PagePreviewSection boshao.
     pagePreviews: {
       label: "Full Landing Page",            // [opt] section heading. default "Full Pages"
       description: "Section intro",          // [opt]
       pages: [                               // [req] ekta website e joto page, toto entry
         {
           name: "Home",                      // [req] page tab e dekhabe
           desktop: Home_desktop,             // [opt] (img) static import, SHOROSHORI import dao
           tablet: Home_tablet,               // [opt] (img)
           mobile: {                          // [opt] light + dark thakle { light, dark } dao
             light: Home_mobile_light,        //   (img)
             dark: Home_mobile_dark,          //   (img)
           },
         },
         {
           name: "Pricing",
           desktop: Pricing_desktop,          // shudhu desktop dile tablet/mobile frame dekhabe na
         },
       ],
     },

     // ---------- Client ----------
     clientIntro: "Client / project context",  // [opt]
     client: {
       id: "c1",                               // [req]
       image: (img),                           // [req] client avatar
       name: "Client Name",                    // [req] self project hole "Self-Initiated Project"
       position: "Client er role / company",   // [req]
       feedback: [],                           // [opt] client review gulo (khali thakle review dekhabe na)
     },

     // ============================================================
     // UI UX DESIGN VIEW  (shudhu design case study hole)
     // ============================================================
     design: {
       tags: ["UI UX Design", "Category"],     // [req] chip
       description: "Design side er summary",  // [opt] hero te dekhabe. na dile project.description
       caseStudyLink: "#",                     // [opt] Behance / Figma link

       overview: { title: "Project Overview", description: "..." },  // [req]
       problems: ["Problem 1", "Problem 2"],                          // [req] string array
       solutions: ["Solution 1", "Solution 2"],                       // [req] string array

       journeyIntro: "Design process er intro",
       journey: [                                                     // [req] process steps
         {
           icon: "fi fi-rr-users-alt",   // flaticon uicons class
           title: "Step name",
           subtitle: "Step e ki kora hoyeche",
           duration: "2 - 3 days",
         },
       ],

       interactiveFeatures: ["Feature 1", "Feature 2"],               // [opt]

       colors: {
         description: "Color palette er explanation",
         shades: {
           primary: palette.blue,        // 9-step ramp (light → dark)
           secondary: palette.sky,
         },
         others: [{ name: "Background", code: "#F8FAFC" }],           // light mode extra colors
         dark:   [{ name: "Background", code: "#0B1120" }],           // dark mode colors
       },

       // ---------- Design tokens (shobgulo [opt], shared constant ba nijer custom) ----------
       spacing: spacing8pt,              // { description, scale: [{ name, value }] }  value = px

       rounded: roundedScale,            // { description, scale: [{ name, value, unit? }] }
                                         //   unit: "px" (default) ba "%" (jemon rounded-circle: 50, unit "%")

       lineHeight: lineHeightScale,      // { description, sampleText?: ["Line 1", "Line 2"],
                                         //   scale: [{ name, value }] }  value = unitless (1.1, 1.6)

       fontSize: fontSizeScale,          // { description, device?: "Desktop", sampleText?: "Text",
                                         //   scale: [{ name, value }] }  value = px
                                         //   Mobile scale add korte chaile alada object baniye device: "Mobile"

       typographyIntro: "Typography er intro",
       typography: [
         { fontName: "Inter", usedFor: "Title", weights: ["Medium", "Bold"] },
       ],

       learningsTitle: "What I learned from this project",
       learnings: ["Learning 1", "Learning 2"],
     },

     // ============================================================
     // FULL STACK DEVELOPMENT VIEW  (shudhu development case study hole)
     // ============================================================
     development: {
       tags: ["Full Stack Development", "Category"],   // [req]
       description: "Engineering side er summary",     // [req] hero te dekhabe
       liveUrl: "#",                                   // [opt] live site link. real URL dao, "#" dile kaj korbe na
       githubUrl: "",                                  // [opt] khali thakle button dekhabe na

       overview: { title: "Project Overview", description: "..." },
       problems: ["Technical problem 1"],
       solutions: ["Technical solution 1"],

       stackIntro: "Tech stack choose korar karon",
       stack: [
         { title: "Frontend", items: ["React", "Tailwind CSS"] },
         { title: "Backend",  items: ["Node.js", "Express.js"] },
         { title: "Database", items: ["MongoDB"] },
         { title: "Tools & Services", items: ["Vercel"] },
       ],

       journeyIntro: "Development process er intro",
       journey: [
         { icon: "fi fi-rr-server", title: "...", subtitle: "...", duration: "..." },
       ],

       interactiveFeatures: ["Feature 1", "Feature 2"],

       apiIntro: "API design er intro",                // [opt] backend project hole
       apiRoutes: [
         { method: "GET", path: "/api/example", note: "Route ta ki kore" },
       ],

       dataModelIntro: "Database design er intro",     // [opt]
       dataModel: [
         { name: "User", fields: ["name", "email", "role"] },
       ],

       performance: ["Optimization 1", "Optimization 2"],   // [opt] bullet list

       // [opt] Lighthouse score card (Desktop / Mobile). PerformanceScoresSection e dekhabe
       performanceScores: {
         description: "Measured with Google PageSpeed Insights, powered by Lighthouse.",
         testedOn: "Nov 10, 2026",                          // [opt] tag e dekhabe. site change korle update koro
         reports: [
           {
             device: "Desktop",                            // "Desktop" ba "Mobile" (icon auto)
             summary: "One-line result",                   // [opt] card er description
             scores: {                                     // 0-100. 90+ green, 50-89 orange, 0-49 red (auto)
               performance: 94,
               accessibility: 96,
               bestPractices: 100,
               seo: 100,
             },
             agentic: "2/2",                               // [opt] "Agentic Browsing 2/2" tag
             href: "https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fyour-site.vercel.app&form_factor=desktop",
                                                           // [opt] "Check live performance" button, new tab e khole
           },
         ],
       },

       // [opt] ListPanel e simple button dite chaile (performanceScores er href thakle eta lagbe na, duplicate hobe)
       performanceReports: [{ label: "Desktop Report", href: "https://..." }],

       security: ["Security measure 1", "Security measure 2"], // [opt]

       learningsTitle: "Takeaways",
       learnings: ["Takeaway 1", "Takeaway 2"],
     },
   }

   NOTES:
   - Local image: file ta ei folder e rakho, tarpor import koro, direct object hishebe use koro
     (string e convert korbe na).
   - Remote image (picsum, cloudinary): next.config e remotePatterns allow korte hobe.
   - Shudhu design project hole `development` key ta, shudhu dev project hole `design` key ta
     bad dite paro. (withProjectMeta / ProjectCard eta handle kore kina check kore nio.)
   - Notun field (pagePreviews, rounded, lineHeight, fontSize, performanceScores) add korle
     withProjectMeta (utils/projectViews) oi field bad dicche kina check koro,
     ar page e oi section component render korte bhulo na.
   - Lighthouse score er link e "?url=" er porer URL encode kora thakte hobe
     (https://x.com → https%3A%2F%2Fx.com).

   pagePreviews NOTES:
   - finalDesign.images e { src, alt } object dite hoy, kintu pagePreviews e na.
     Ekhane shudhu raw import dao (desktop: Home_desktop). { src, alt } wrapper dile
     "object should only be passed ... static image import" error ashbe.
   - Light/Dark toggle nijei ashbe, jodi kono ekta device image e { light, dark } dui-i thake.
     Kono image e dark na thakle plain import dao, duita mode e ekoi image dekhabe.
     Kono device e shudhu { light } ba { dark } dile onno mode e oi image-i dekhabe,
     ar frame e "Light only" / "Dark only" likha ashbe.
   - Toggle shudhu preview image bodlay, site er nijer dark/light theme na.
   - Device er image na dile oi device er frame dekhabe na. Responsive na hole
     (jemon non-responsive website) shudhu desktop dao, fake tablet/mobile image dio na.
   - Figma export size: Desktop 1440px, Tablet 768px, Mobile 390px wide (Mobile 2x = 780px dile sharp).
     Full height frame export koro, height image onujayi hobe. Light ar dark ekoi size e export koro,
     na hole toggle korle layout lafabe.
   - Display width: Desktop 100%, Tablet 60%, Mobile 34% (PagePreviewViewer.jsx er DEVICES e bodlano jay).
   - Ekta page thakle tab bar hide hoy, shudhu "Page 1 / 1" ar frame er indicator dekhabe.
   ============================================================ */

import { tools } from "@/src/app/assets/assets";
import { withProjectMeta } from "@/src/app/utils/projectViews";

// GrowthPilot
import GrowthPilot_cover from "./GrowthPilot/Cover.jpg";
import GrowthPilot_1 from "./GrowthPilot/1.jpg";
import GrowthPilot_2 from "./GrowthPilot/2.jpg";
import GrowthPilot_3 from "./GrowthPilot/3.jpg";
import GrowthPilot_4 from "./GrowthPilot/4.jpg";
import GrowthPilot_5 from "./GrowthPilot/5.jpg";
import GrowthPilot_6 from "./GrowthPilot/6.jpg";
import GrowthPilot_7 from "./GrowthPilot/7.jpg";
import GrowthPilot_8 from "./GrowthPilot/8.jpg";
import GrowthPilot_9 from "./GrowthPilot/9.jpg";
import GrowthPilot_Home_Desktop_Light from "./GrowthPilot/GrowthPilot_Home_Desktop_Light.jpg";
import GrowthPilot_Home_Tab_Light from "./GrowthPilot/GrowthPilot_Home_Tab_Light.jpg";
import GrowthPilot_Home_Mobile_Light from "./GrowthPilot/GrowthPilot_Home_Mobile_Light.jpg";
import GrowthPilot_Home_Desktop_Dark from "./GrowthPilot/GrowthPilot_Home_Desktop_Dark.jpg";
import GrowthPilot_Home_Tab_Dark from "./GrowthPilot/GrowthPilot_Home_Tab_Dark.jpg";
import GrowthPilot_Home_Mobile_Dark from "./GrowthPilot/GrowthPilot_Home_Mobile_Dark.jpg";

//Urban Nest
import UrbanNest_Cover from "./UrbanNest/Cover.jpg";
import UrbanNest_LandingPage from "./UrbanNest/landing_page.jpg";
import UrbanNest_MockUp from "./UrbanNest/MockUp.jpg";

// ---------- Placeholder image helpers (picsum.photos) ----------
// Same seed = sobsomoy same image, tai reload korle image bodlabe na.
const pic = (seed, w = 1200, h = 800) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;
const shots = (seed, alts) =>
  alts.map((alt, i) => ({ src: pic(`${seed}-${i + 1}`), alt }));

// ---------- Shared tool chips (design view e dekhabe) ----------
const figma = { name: "Figma", logo: tools.figma1 };
const illustrator = { name: "Illustrator", logo: tools.illustrator };
const photoshop = { name: "Photoshop", logo: tools.photoshop };
const nextjs = { name: "Next.js", logo: tools.nextjs };

// ---------- Shared 9-step color ramps (light -> dark) ----------
const palette = {
  orange: [
    "#FFF7ED",
    "#FFEDD5",
    "#FED7AA",
    "#FDBA74",
    "#FB923C",
    "#F97316",
    "#EA580C",
    "#C2410C",
    "#7C2D12",
  ],
  slate: [
    "#F8FAFC",
    "#F1F5F9",
    "#E2E8F0",
    "#CBD5E1",
    "#94A3B8",
    "#64748B",
    "#475569",
    "#334155",
    "#0F172A",
  ],
  amber: [
    "#FFFBEB",
    "#FEF3C7",
    "#FDE68A",
    "#FCD34D",
    "#FBBF24",
    "#F59E0B",
    "#D97706",
    "#B45309",
    "#78350F",
  ],
  stone: [
    "#FAFAF9",
    "#F5F5F4",
    "#E7E5E4",
    "#D6D3D1",
    "#A8A29E",
    "#78716C",
    "#57534E",
    "#44403C",
    "#1C1917",
  ],
  blue: [
    "#EFF6FF",
    "#DBEAFE",
    "#BFDBFE",
    "#93C5FD",
    "#60A5FA",
    "#3B82F6",
    "#2563EB",
    "#1D4ED8",
    "#1E3A8A",
  ],
  violet: [
    "#F5F3FF",
    "#EDE9FE",
    "#DDD6FE",
    "#C4B5FD",
    "#A78BFA",
    "#8B5CF6",
    "#7C3AED",
    "#6D28D9",
    "#4C1D95",
  ],
  emerald: [
    "#ECFDF5",
    "#D1FAE5",
    "#A7F3D0",
    "#6EE7B7",
    "#34D399",
    "#10B981",
    "#059669",
    "#047857",
    "#064E3B",
  ],
  sky: [
    "#F0F9FF",
    "#E0F2FE",
    "#BAE6FD",
    "#7DD3FC",
    "#38BDF8",
    "#0EA5E9",
    "#0284C7",
    "#0369A1",
    "#0C4A6E",
  ],
  green: [
    "#F0FDF4",
    "#DCFCE7",
    "#BBF7D0",
    "#86EFAC",
    "#4ADE80",
    "#22C55E",
    "#16A34A",
    "#15803D",
    "#14532D",
  ],
};

// ---------- Shared 4/8pt spacing scale (p1 chara baki design view gulo use kore) ----------
const spacing8pt = {
  description:
    "A consistent 8-point spacing scale that keeps layouts balanced, predictable and easy to adapt across screen sizes.",
  scale: [
    { name: "Space-0", value: 0 },
    { name: "Space-1", value: 4 },
    { name: "Space-2", value: 8 },
    { name: "Space-3", value: 12 },
    { name: "Space-4", value: 16 },
    { name: "Space-5", value: 20 },
    { name: "Space-6", value: 24 },
    { name: "Space-7", value: 32 },
    { name: "Space-8", value: 40 },
    { name: "Space-9", value: 48 },
    { name: "Space-10", value: 64 },
    { name: "Space-11", value: 80 },
    { name: "Space-12", value: 96 },
    { name: "Space-13", value: 128 },
    { name: "Space-14", value: 160 },
  ],
};

// ---------- Shared rounded (border radius) scale ----------
const growthPilotImages = [
  GrowthPilot_1,
  GrowthPilot_2,
  GrowthPilot_3,
  GrowthPilot_4,
  GrowthPilot_5,
  GrowthPilot_6,
  GrowthPilot_7,
  GrowthPilot_8,
  GrowthPilot_9,
].map((src, i) => ({
  src,
  alt: `GrowthPilot landing page preview ${i + 1}`,
}));

const urbanNestImages = [
  UrbanNest_Cover,
  UrbanNest_LandingPage,
  UrbanNest_MockUp,
].map((src, i) => ({
  src,
  alt: `UrbanNest landing page preview ${i + 1}`,
}));

const rawProjects = [
  // ============================================================
  // p1 — GrowthPilot (design + development) | Self project
  // ============================================================
  {
    id: "p1",
    slug: "growthpilot-landing-page-design-nextjs-development",
    title: "GrowthPilot - Landing Page Design & Next.js Development.",
    description:
      "A Landing Page That Looks Sharp and Ranks Smart Most landing pages either look great or perform well. GrowthPilot does both. I designed it in Figma and built it in Next.js, so nothing got lost between mockup and final product. ✦ Conversion-focused UI with clear hierarchy and bold typography ✦ Fast, responsive Next.js build ✦ On-page SEO: meta tags, semantic HTML, optimized images ✦ Works on mobile, tablet, and desktop Tools: Figma · Next.js · React · Tailwind CSS · Vercel",

    // ---------- Shared Project Data ----------
    finalDesign: {
      description:
        "A Landing Page That Looks Sharp and Converts Most landing pages either look great or perform well. For GrowthPilot, I designed a page that does both in Figma, with a conversion-focused layout, clear hierarchy and bold typography. Every section guides visitors toward the final call to action, built from reusable components and a consistent spacing system that stays clean across mobile, tablet and desktop.",
      tools: [figma, nextjs],

      coverImage: {
        src: GrowthPilot_cover,
        alt: "GrowthPilot landing page cover preview",
      },

      images: growthPilotImages,
    },
    pagePreviews: {
      label: "Full Landing Page",
      description:
        "The complete page across desktop, tablet and mobile, so you can see how the layout adapts on every screen.",
      pages: [
        {
          name: "Home",
          desktop: {
            light: GrowthPilot_Home_Desktop_Light,
            dark: GrowthPilot_Home_Desktop_Dark,
          },
          tablet: {
            light: GrowthPilot_Home_Tab_Light,
            dark: GrowthPilot_Home_Tab_Dark,
          },
          mobile: {
            light: GrowthPilot_Home_Mobile_Light,
            dark: GrowthPilot_Home_Mobile_Dark,
          },
        },
      ],
    },

    // ============================================================
    // UI UX DESIGN VIEW
    // ============================================================
    design: {
      tags: ["UI UX Design", "Landing Page Design"],
      caseStudyLink:
        "https://www.behance.net/gallery/258350739/Landing-Page-Design-Nextjs-Development-Live-Preview",

      overview: {
        title: "Project Overview",
        description:
          "Designed a conversion-focused landing page for GrowthPilot in Figma, with a clear visual hierarchy, bold typography and a layout that guides visitors from the first headline to the final call to action. The design was created to translate directly into a fast, responsive and SEO-friendly Next.js build.",
      },

      problems: [
        "Many landing pages either look impressive or convert well, but rarely achieve both",
        "Visitors often could not understand the value of the product within the first few seconds",
        "Weak content hierarchy and unclear calls to action made it easy to lose attention before signing up",
        "Designs that were not planned for development often lost quality or consistency in the final build",
        "Layouts that worked on desktop became cluttered and hard to read on tablet and mobile",
      ],

      solutions: [
        "Created a hero section with a bold headline, a short supporting message and a prominent primary call to action",
        "Structured the page into clear sections that move from the problem to features, proof and the final conversion",
        "Used strong typography and generous spacing to create a clear hierarchy and keep the content easy to scan",
        "Designed with reusable components and a consistent spacing system so the Figma design matches the final Next.js build",
        "Built responsive layouts for mobile, tablet and desktop, with semantic content structure that supports on-page SEO",
      ],

      journeyIntro:
        "From understanding what makes a landing page convert to designing a sharp, fast-loading page ready for development, here is how the GrowthPilot design evolved.",

      journey: [
        {
          icon: "fi fi-rr-users-alt",
          title: "Research & Goals",
          subtitle:
            "Studied high-converting landing pages, defined the main goal of the page and identified what visitors need to see before they sign up.",
          duration: "1 - 2 days",
        },
        {
          icon: "fi fi-rr-sitemap",
          title: "Content & Page Structure",
          subtitle:
            "Planned the section flow from hero to features, proof and final call to action, so every section has one clear job.",
          duration: "1 - 2 days",
        },
        {
          icon: "fi fi-rr-pencil-ruler",
          title: "Wireframing",
          subtitle:
            "Created low-fidelity wireframes to test the layout, content hierarchy and call to action placement before adding any visual styling.",
          duration: "2 - 3 days",
        },
        {
          icon: "fi fi-rr-palette",
          title: "Visual Identity",
          subtitle:
            "Defined the color palette, bold typography and spacing system that give the page a confident, modern and consistent look.",
          duration: "2 - 3 days",
        },
        {
          icon: "fi fi-rr-layers",
          title: "UI Design",
          subtitle:
            "Designed high-fidelity desktop, tablet and mobile layouts in Figma using reusable components that map directly to the Next.js build.",
          duration: "4 - 5 days",
        },
        {
          icon: "fi fi-rr-comment-check",
          title: "Review & Handoff",
          subtitle:
            "Reviewed the design for readability, spacing and responsiveness, then refined details and prepared it for a smooth development handoff.",
          duration: "1 - 2 days",
        },
      ],

      interactiveFeatures: [
        "Sticky navigation bar with a persistent call to action",
        "Smooth scroll navigation between page sections",
        "Hover and focus states on buttons, cards and links",
        "Scroll-triggered section animations",
        "Expandable FAQ accordion",
        "Responsive mobile menu with a clear call to action",
      ],

      colors: {
        description:
          "A calming blue and sky-inspired palette that communicates reliability and professionalism while maintaining a clean, approachable interface.",

        shades: {
          primary: ["#5A4BFF"],
          secondary: ["#F5576C"],
        },

        others: [
          { name: "Background", code: "#FAFBFF" },
          { name: "Foreground", code: "#0B1120" },
          { name: "Accent-1", code: "#56CCF2" },
          { name: "Accent-2", code: "#F59E0B" },
          { name: "Accent-3", code: "#22C55E" },
          { name: "Accent-4", code: "#EAFBF3" },
          { name: "Accent-5", code: "#FFF4E6" },
          { name: "Accent-6", code: "#EEF2FF" },
        ],

        dark: [
          { name: "Foreground", code: "#FAFBFF" },
          { name: "Background", code: "#0B1120" },
        ],
      },

      spacing: spacing8pt,

      rounded: {
        description:
          "A consistent corner radius scale that gives buttons, cards and containers a soft, cohesive look across the whole interface.",
        scale: [
          { name: "rounded-xs", value: 4 },
          { name: "rounded-sm", value: 6 },
          { name: "rounded-md", value: 8 },
          { name: "rounded-lg", value: 12 },
          { name: "rounded-xl", value: 16 },
          { name: "rounded-2xl", value: 24 },
          { name: "rounded-pill", value: 99 },
          { name: "rounded-circle", value: 50, unit: "%" },
        ],
      },

      // ---------- Shared font-size scale (Desktop) ----------
      fontSize: {
        description:
          "A desktop type scale that moves from a bold display size down to compact captions, keeping the hierarchy clear and every text style easy to read.",
        scale: [
          { name: "text-Display", value: 64 },
          { name: "text-H1", value: 48 },
          { name: "text-H2", value: 36 },
          { name: "text-H3", value: 28 },
          { name: "text-H4", value: 22 },
          { name: "text-H5", value: 18 },
          { name: "text-H6", value: 16 },
          { name: "text-Lead", value: 20 },
          { name: "text-Body", value: 16 },
          { name: "text-Small", value: 14 },
          { name: "text-Caption", value: 12 },
        ],
      },

      typographyIntro:
        "A modern, highly readable typography system that creates a clear visual hierarchy and keeps service information easy to scan.",

      typography: [
        {
          fontName: "Work Sans",
          weights: ["Regular", "Medium", "Semi Bold", "Bold"],
        },
      ],

      learningsTitle: "What I learned from this project",

      learnings: [
        "A clear visual hierarchy helps visitors understand the value of a product within the first few seconds",
        "Designing with reusable components and a spacing system makes the handoff to development much smoother",
        "A strong call to action works best when it is repeated at the right moments, not just placed once",
      ],
    },

    // ============================================================
    // FULL STACK DEVELOPMENT VIEW
    // ============================================================
    development: {
      tags: ["Next.js", "SEO Optimized", "Deployment"],

      description:
        "The engineering behind Fixora: a complete home service marketplace with location-based discovery, provider management, appointment scheduling, online payments and role-based dashboards.",

      liveUrl: "https://websites-two-gilt.vercel.app",
      githubUrl: "",

      overview: {
        title: "Project Overview",
        description:
          "A Landing Page That Is Fast and Ranks Smart I built the GrowthPilot design in Next.js, so nothing got lost between the mockup and the final product. ✦ Fast, responsive build that matches the Figma design ✦ On-page SEO: meta tags, semantic HTML, optimized images ✦ Works smoothly on mobile, tablet, and desktop ✦ Deployed on Vercel Tools: Next.js · React · Tailwind CSS · Vercel",
      },

      problems: [
        "Customers needed a reliable way to discover nearby professionals and compare service options",
        "Manual appointment scheduling created conflicts between provider availability and customer requests",
        "Providers had no centralized system to manage services, bookings and customer information",
        "Payment verification and booking confirmation needed to remain synchronized",
      ],

      solutions: [
        "Implemented location-based service discovery with category, price and availability filters",
        "Created an availability management system with protected appointment slots",
        "Built separate customer, provider and admin dashboards with role-based permissions",
        "Integrated SSLCommerz with server-side payment verification and automated booking status updates",
      ],

      stackIntro:
        "The technology stack was selected to support location-based search, appointment management, secure payments and scalable dashboard functionality.",

      stack: [
        {
          title: "Frontend",
          items: ["Next.js", "Tailwind CSS"],
        },
        {
          title: "Tools & Services",
          items: ["Visual Studio Code", "Vercel"],
        },
      ],

      journeyIntro:
        "A look at how the GrowthPilot design was turned into a fast, responsive and SEO-friendly Next.js landing page, from project setup to deployment on Vercel.",

      journey: [
        {
          icon: "fi fi-rr-sitemap",
          title: "Planning & Setup",
          subtitle:
            "Reviewed the Figma design, planned the component structure and set up a Next.js project with Tailwind CSS and the design tokens.",
          duration: "1 day",
        },
        {
          icon: "fi fi-rr-puzzle-alt",
          title: "Component Development",
          subtitle:
            "Built reusable React components for buttons, cards, navigation and sections, matching the Figma spacing, colors and typography.",
          duration: "2 - 3 days",
        },
        {
          icon: "fi fi-rr-browser",
          title: "Page Assembly",
          subtitle:
            "Assembled the full landing page section by section, from the hero to the final call to action, with smooth scrolling and interactive elements.",
          duration: "2 - 3 days",
        },
        {
          icon: "fi fi-sr-mobile-button",
          title: "Responsive Layouts",
          subtitle:
            "Implemented mobile, tablet and desktop layouts with Tailwind breakpoints and tested them across different screen sizes.",
          duration: "1 - 2 days",
        },
        {
          icon: "fi fi-rr-search",
          title: "SEO & Performance",
          subtitle:
            "Added meta tags, semantic HTML and optimized images with next/image, then improved loading speed and checked results with Lighthouse.",
          duration: "1 - 2 days",
        },
        {
          icon: "fi fi-rr-site-browser",
          title: "Testing & Deployment",
          subtitle:
            "Tested the page across browsers and devices, fixed final details and deployed it to Vercel.",
          duration: "1 day",
        },
      ],

      interactiveFeatures: [
        "Fully responsive layout for mobile, tablet and desktop",
        "Sticky navigation bar with smooth scrolling between sections",
        "Scroll-triggered section animations",
        "Reusable React components for buttons, cards and sections",
        "Dynamic meta tags and Open Graph tags for SEO and social sharing",
        "Semantic HTML structure with proper heading hierarchy",
        "Optimized images with next/image and lazy loading",
        "Deployed on Vercel with fast global delivery",
      ],

      performance: [
        "Achieved a Lighthouse Performance score of 94 on desktop and 92 on mobile, tested with Google PageSpeed Insights",
        "Scored a perfect 100 in both Best Practices and SEO on desktop and mobile",
        "Reached 96 in Accessibility on both desktop and mobile through semantic HTML and readable color contrast",
        "Optimized images with next/image for responsive sizing, modern formats and lazy loading",
        "Passed 2/2 Agentic Browsing checks, confirming the page structure is easy for browsers and AI agents to read",
      ],

      performanceScores: {
        description:
          "Measured with Google PageSpeed Insights, powered by Lighthouse.",
        testedOn: "Nov 10, 2026",
        reports: [
          {
            device: "Desktop",
            scores: {
              performance: 94,
              accessibility: 96,
              bestPractices: 100,
              seo: 100,
            },
            agentic: "2/2",
            href: "https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fyour-site.vercel.app&form_factor=desktop",
          },
          {
            device: "Mobile",
            scores: {
              performance: 92,
              accessibility: 96,
              bestPractices: 100,
              seo: 100,
            },
            agentic: "2/2",
            href: "https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fyour-site.vercel.app&form_factor=mobile",
          },
        ],
      },

      learningsTitle: "Takeaways",

      learnings: [
        "Building from a well-structured Figma design with reusable components keeps the final build fast to develop and consistent with the mockup",
        "Semantic HTML, proper meta tags and optimized images are the foundation of a 100 SEO and Best Practices score",
        "Testing on both desktop and mobile with PageSpeed Insights early helps catch performance and accessibility issues before launch",
      ],
    },
  },

  // ============================================================
  // p1 — GrowthPilot (design + development) | Self project
  // ============================================================
  {
    id: "p2",
    slug: "urban-nest-real-estate-website-landing-page-uiux-nextjs",
    title: "UrbanNest - Real Estate Website Landing Page | UI UX & Next.js",
    description:
      "Discover a modern approach to real estate through a clean, intuitive, and visually engaging website experience. From thoughtful UI UX design to frontend development, every detail is crafted to make property discovery feel effortless and engaging. Designed in Figma. Developed with Next.js & Tailwind CSS. Successfully deployed and ready to explore. Explore the live preview below!",

    // ---------- Shared Project Data ----------
    finalDesign: {
      description:
        "A Landing Page That Looks Sharp and Converts Most landing pages either look great or perform well. For GrowthPilot, I designed a page that does both in Figma, with a conversion-focused layout, clear hierarchy and bold typography. Every section guides visitors toward the final call to action, built from reusable components and a consistent spacing system that stays clean across mobile, tablet and desktop.",
      tools: [figma, nextjs],

      coverImage: {
        src: UrbanNest_Cover,
        alt: "UrbanNest landing page cover preview",
      },

      images: urbanNestImages,
    },

    pagePreviews: {
      label: "Full Landing Page",
      description:
        "The complete page across desktop, tablet and mobile, so you can see how the layout adapts on every screen.",
      pages: [
        {
          name: "Home",
          desktop: UrbanNest_LandingPage,
        },
      ],
    },

    // ============================================================
    // UI UX DESIGN VIEW
    // ============================================================
    design: {
      tags: ["UI UX Design", "Landing Page Design"],
      caseStudyLink:
        "https://www.behance.net/gallery/258411347/Real-Estate-Website-Landing-Page-UIUX-Nextjs",

      overview: {
        title: "Project Overview",
        description:
          "Designed a clean, desktop-focused real estate website in Figma where visitors can explore properties through large imagery, clear property details and a calm, modern layout. The goal was to make property discovery feel effortless and visually engaging.",
      },

      problems: [
        "Many real estate websites feel cluttered, making it hard to find the right property quickly",
        "Property listings often lacked a clear visual hierarchy, so key details like price and location were easy to miss",
        "Heavy use of text and small images made browsing properties feel tiring instead of engaging",
        "Unclear navigation and search made it difficult for visitors to move from discovery to enquiry",
      ],

      solutions: [
        "Created a clean, spacious layout with large property imagery so listings feel engaging to browse",
        "Designed clear property cards that put price, location and key details in a consistent, easy-to-scan structure",
        "Used a simple visual hierarchy, modern typography and generous spacing to keep the experience calm and intuitive",
        "Structured the page flow so visitors can move naturally from exploring properties to taking the next step",
      ],

      journeyIntro:
        "From understanding how people browse properties to designing a clean, image-led desktop experience, here is how the real estate website design evolved.",

      journey: [
        {
          icon: "fi fi-rr-users-alt",
          title: "Research & Goals",
          subtitle:
            "Studied modern real estate websites, noted what makes property browsing feel tiring and defined a clean, engaging direction.",
          duration: "1 - 2 days",
        },
        {
          icon: "fi fi-rr-sitemap",
          title: "Content & Page Structure",
          subtitle:
            "Planned the page flow so visitors can move naturally from the first impression to exploring properties and taking the next step.",
          duration: "1 - 2 days",
        },
        {
          icon: "fi fi-rr-pencil-ruler",
          title: "Wireframing",
          subtitle:
            "Created low-fidelity desktop wireframes to test the layout, property card structure and content hierarchy before adding visual styling.",
          duration: "2 - 3 days",
        },
        {
          icon: "fi fi-rr-palette",
          title: "Visual Identity",
          subtitle:
            "Defined the color palette, typography and spacing that give the website a modern, trustworthy and consistent look.",
          duration: "2 - 3 days",
        },
        {
          icon: "fi fi-rr-layers",
          title: "UI Design",
          subtitle:
            "Designed high-fidelity desktop screens in Figma with large property imagery and reusable components such as cards and buttons.",
          duration: "4 - 5 days",
        },
        {
          icon: "fi fi-rr-comment-check",
          title: "Review & Handoff",
          subtitle:
            "Reviewed the design for readability, spacing and consistency, then refined the details and prepared it for development.",
          duration: "1 - 2 days",
        },
      ],

      interactiveFeatures: [
        "Large, image-led property cards that make listings engaging to browse",
        "Clear navigation that guides visitors through the website",
        "Consistent property card layout for price, location and key details",
        "Hover and focus states on buttons, cards and links",
        "Clear call to action for exploring properties and getting in touch",
      ],

      colors: {
        description:
          "A calming blue and sky-inspired palette that communicates reliability and professionalism while maintaining a clean, approachable interface.",

        shades: {
          primary: [
            "#E7F1F1",
            "#C5DEDC",
            "#98C4C1",
            "#68A9A4",
            "#3A8F88",
            "#0F766E",
            "#0D645E",
            "#0B544E",
            "#09433F",
            "#073531",
          ],
        },

        others: [
          { name: "Background", code: "#0F172A" },
          { name: "Foreground", code: "#FAFAF9" },
          { name: "Placeholder", code: "#7C8798" },
        ],
      },

      spacing: spacing8pt,

      rounded: {
        description:
          "A consistent corner radius scale that gives buttons, cards and containers a soft, cohesive look across the whole interface.",
        scale: [
          { name: "rounded-xs", value: 4 },
          { name: "rounded-sm", value: 6 },
          { name: "rounded-md", value: 8 },
          { name: "rounded-lg", value: 12 },
          { name: "rounded-xl", value: 16 },
          { name: "rounded-2xl", value: 24 },
          { name: "rounded-pill", value: 99 },
          { name: "rounded-circle", value: 50, unit: "%" },
        ],
      },

      // ---------- Shared font-size scale (Desktop) ----------
      fontSize: {
        description:
          "A desktop type scale that moves from a bold display size down to compact captions, keeping the hierarchy clear and every text style easy to read.",
        scale: [
          { name: "text-Display", value: 64 },
          { name: "text-H1", value: 48 },
          { name: "text-H2", value: 36 },
          { name: "text-H3", value: 28 },
          { name: "text-H4", value: 22 },
          { name: "text-H5", value: 18 },
          { name: "text-H6", value: 16 },
          { name: "text-Lead", value: 20 },
          { name: "text-Body", value: 16 },
          { name: "text-Small", value: 14 },
          { name: "text-Caption", value: 12 },
        ],
      },

      typographyIntro:
        "A modern, highly readable typography system that creates a clear visual hierarchy and keeps service information easy to scan.",

      typography: [
        {
          fontName: "Playfair Display",
          usedFor: "Heading",
          weights: ["Semi Bold", "Bold"],
        },
        {
          fontName: "Inter",
          usedFor: "Body",
          weights: ["Regular", "Medium", "Semi Bold", "Bold"],
        },
      ],

      learningsTitle: "What I learned from this project",

      learnings: [
        "Large imagery and generous spacing make property browsing feel calm and engaging",
        "A consistent card structure helps visitors compare properties quickly",
        "Responsive layouts should be planned from the start, not added later",
      ],
    },

    // ============================================================
    // FULL STACK DEVELOPMENT VIEW
    // ============================================================
    development: {
      tags: ["Next.js", "SEO Optimized", "Deployment", "Non Responsive"],

      description:
        "The engineering behind Fixora: a complete home service marketplace with location-based discovery, provider management, appointment scheduling, online payments and role-based dashboards.",

      liveUrl: "https://urbannest-ashy.vercel.app",
      githubUrl: "",

      overview: {
        title: "Project Overview",
        description:
          "A modern real estate website brought to life with clean, reusable code. I turned the Figma design into a fast, polished desktop website, matching the spacing, typography and visual details closely. Developed with Next.js & Tailwind CSS. Successfully deployed and ready to explore. Explore the live preview bellow.",
      },

      problems: [
        "The Figma design needed to be translated into code without losing its spacing, typography and visual details",
        "Property sections with many images and cards needed to load smoothly without slowing the page down",
        "Repeated UI elements like property cards and buttons needed a consistent, maintainable structure",
      ],

      solutions: [
        "Built the interface in Next.js and Tailwind CSS, matching the Figma spacing, colors and typography closely",
        "Used next/image to optimize property images and keep the page loading smoothly",
        "Created reusable React components for property cards, sections and buttons to keep the code clean and consistent",
        "Deployed the finished website so it can be explored live through the live preview",
      ],

      stackIntro:
        "The technology stack was selected to support location-based search, appointment management, secure payments and scalable dashboard functionality.",

      stack: [
        {
          title: "Frontend",
          items: ["Next.js", "Tailwind CSS"],
        },
        {
          title: "Tools & Services",
          items: ["Visual Studio Code", "Vercel"],
        },
      ],

      journeyIntro:
        "A look at how the real estate design was turned into a clean Next.js website, from project setup to the live deployment.",

      journey: [
        {
          icon: "fi fi-rr-sitemap",
          title: "Planning & Setup",
          subtitle:
            "Reviewed the Figma design, planned the component structure and set up a Next.js project with Tailwind CSS and the design tokens.",
          duration: "1 day",
        },
        {
          icon: "fi fi-rr-puzzle-alt",
          title: "Component Development",
          subtitle:
            "Built reusable React components for the navigation, property cards, buttons and sections, following the Figma design.",
          duration: "2 - 3 days",
        },
        {
          icon: "fi fi-rr-browser",
          title: "Page Assembly",
          subtitle:
            "Assembled the full website section by section, from the first screen to the final call to action.",
          duration: "2 - 3 days",
        },
        {
          icon: "fi fi-rr-layers",
          title: "Styling & Polish",
          subtitle:
            "Refined spacing, typography and hover states so the final website matches the Figma design closely.",
          duration: "1 - 2 days",
        },
        {
          icon: "fi fi-rr-search",
          title: "Image Optimization",
          subtitle:
            "Used next/image for property images to keep the image-heavy sections loading smoothly.",
          duration: "1 day",
        },
        {
          icon: "fi fi-rr-site-browser",
          title: "Testing & Deployment",
          subtitle:
            "Checked the website in the browser, fixed final details and deployed it live for the preview.",
          duration: "1 day",
        },
      ],

      interactiveFeatures: [
        "Built with Next.js and Tailwind CSS",
        "Reusable React components for property cards, sections and buttons",
        "Property images optimized with next/image",
        "Hover and focus states that match the Figma design",
        "Deployed live and ready to explore",
      ],

      performance: [
        "Built with Next.js, which renders pages efficiently and keeps the website fast to load",
        "Optimized property images with next/image to keep image-heavy sections loading smoothly",
        "Used reusable React components and Tailwind CSS to keep the code and styles lean and consistent",
        "Deployed live so the website can be explored and tested in a real browser",
      ],

      learningsTitle: "Takeaways",

      learnings: [
        "Reusable components keep the code clean and the design consistent across the whole website",
        "Optimizing images early helps image-heavy pages load smoothly",
        "Next time I would build responsive layouts from the start, so the website works on every screen size",
      ],
    },
  },
];

// views + merged tags jure dey (ProjectCard top level `tags` ei theke pay)
const projectsData = rawProjects.map(withProjectMeta);

export default projectsData;
