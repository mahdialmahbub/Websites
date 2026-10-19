// projects.js
// Ekta project e 2 dhoroner "view" thakte pare: `design` (UI/UX) ar `development`.
//
//   Shudhu UI/UX project      -> sudhu `design: {...}` rakho
//   Shudhu development project -> sudhu `development: {...}` rakho
//   Dui-i thakle               -> dui block-i rakho. UI te automatic "Design" / "Development"
//                                 switch button ashbe, kono extra kichu korte hobe na.
//
// `primaryView` (optional): dui view thakle prothome kon ta dekhabe. na dile design age.
// Top level e shared data thake: title, description (card summary), finalDesign, client.
//
// Ei file e 10 ta project ache:
//   p1  design + development   (FurneiStyle)      -> client c1
//   p2  design only            (FitPulse)         -> client c2
//   p3  development only       (MediQueue)        -> client c3
//   p4  design + development   (BrewNest)         -> client c4
//   p5  design + development   (LearnLoop, primaryView: "development") -> client c5
//   p6  design only            (FinSage)          -> client c6
//   p7  development only       (TableTalk)        -> client c7
//   p8  design only            (WanderWay)        -> client c8
//   p9  development only       (LogiTrack)        -> client c9
//   p10 design + development   (KartBD)           -> client c10
//
// Image niyom: p1 e nijer public folder er image (/projects/FurneiStyle/...) use kora hoyeche.
// Baki project gulor image file ekhono nai, tai 3rd-party API theke placeholder image newa hoyeche
// (project image -> picsum.photos, client avatar -> randomuser.me).
// Nijer image add korle shudhu `src` ta replace kore dio, jemon p1 e kora ache.

import { tools } from "@/src/app/assets/assets";
import { withProjectMeta } from "@/src/app/utils/projectViews";

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

// ---------- Shared 9-step color ramps (light -> dark) ----------
const palette = {
  orange: ["#FFF7ED", "#FFEDD5", "#FED7AA", "#FDBA74", "#FB923C", "#F97316", "#EA580C", "#C2410C", "#7C2D12"],
  slate: ["#F8FAFC", "#F1F5F9", "#E2E8F0", "#CBD5E1", "#94A3B8", "#64748B", "#475569", "#334155", "#0F172A"],
  amber: ["#FFFBEB", "#FEF3C7", "#FDE68A", "#FCD34D", "#FBBF24", "#F59E0B", "#D97706", "#B45309", "#78350F"],
  stone: ["#FAFAF9", "#F5F5F4", "#E7E5E4", "#D6D3D1", "#A8A29E", "#78716C", "#57534E", "#44403C", "#1C1917"],
  blue: ["#EFF6FF", "#DBEAFE", "#BFDBFE", "#93C5FD", "#60A5FA", "#3B82F6", "#2563EB", "#1D4ED8", "#1E3A8A"],
  violet: ["#F5F3FF", "#EDE9FE", "#DDD6FE", "#C4B5FD", "#A78BFA", "#8B5CF6", "#7C3AED", "#6D28D9", "#4C1D95"],
  emerald: ["#ECFDF5", "#D1FAE5", "#A7F3D0", "#6EE7B7", "#34D399", "#10B981", "#059669", "#047857", "#064E3B"],
  sky: ["#F0F9FF", "#E0F2FE", "#BAE6FD", "#7DD3FC", "#38BDF8", "#0EA5E9", "#0284C7", "#0369A1", "#0C4A6E"],
  green: ["#F0FDF4", "#DCFCE7", "#BBF7D0", "#86EFAC", "#4ADE80", "#22C55E", "#16A34A", "#15803D", "#14532D"],
};

// ---------- Shared 4/8pt spacing scale (p1 chara baki design view gulo use kore) ----------
const spacing8pt = {
  description:
    "A consistent 4/8-point spacing scale that keeps layouts balanced, predictable and easy to adapt across screen sizes.",
  scale: [
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
  ],
};

const rawProjects = [
  // ============================================================
  // p1 — FurneiStyle (design + development)  |  client: c1
  // ============================================================
  {
    id: "p1",
    slug: "furneistyle-premium-furniture-shopping-experience",
    // primaryView: "design",

    // ---------- Shared (dui view-er jonno) ----------
    title: "FurneiStyle – Premium Furniture Shopping Experience",
    // card + SEO description. design view e alada description na dile eta-i hero te dekhabe
    description:
      "A modern furniture e-commerce platform focused on creating a seamless shopping experience through intuitive navigation, responsive layouts, and engaging product interactions.",

    finalDesign: {
      description:
        "The polished final interface that brings together research, strategy, and visual design into a cohesive, user-friendly product focused on both functionality and aesthetics.",
      // tools shudhu design view e dekhabe
      tools: [
        { name: "Figma", logo: tools.figma1 },
        { name: "Illustrator", logo: tools.illustrator },
        { name: "Photoshop", logo: tools.photoshop },
      ],
      coverImage: {
        src: "/projects/FurneiStyle/1.jpg",
        alt: "UI Kit Landing Page preview",
      }, // project card er cover image
      // hero thumbnail carousel + final design gallery, duita-i ei list theke
      images: [
        {
          src: "/projects/FurneiStyle/1.jpg",
          alt: "UI Kit Landing Page preview",
        },
        {
          src: "/projects/FurneiStyle/2.jpg",
          alt: "Furniture homepage preview",
        },
        { src: "/projects/FurneiStyle/3.jpg", alt: "Product video preview" },
        {
          src: "/projects/FurneiStyle/4.jpg",
          alt: "Furniture catalog preview",
        },
        {
          src: "/projects/FurneiStyle/5.jpg",
          alt: "Furniture catalog preview",
        },
        {
          src: "/projects/FurneiStyle/6.jpg",
          alt: "Furniture catalog preview",
        },
      ],
    },

    clientIntro:
      "User feedback and project outcomes that highlight improvements in usability, visual appeal, and overall experience, along with key insights that shaped the final design.",
    client: {
      id: "c1",
      image: "/clients/clientImages/Ahmed_Al_Farsi.jpg",
      name: "Ahmed Al-Farsi",
      position: "First-time Home Buyer",
      feedback: [
        {
          rating: 4.8,
          comment:
            "Finding our new home became so much easier with the virtual tours and smart filters. We saved weeks of searching.",
        },
      ],
    },

    // =====================================================
    // UI/UX DESIGN view
    // =====================================================
    design: {
      tags: ["UI/UX Design", "Ecommerce platform"],
      caseStudyLink: "#",

      overview: {
        title: "Project Overview",
        description:
          "Designed and developed a premium furniture marketplace where users can easily browse collections, compare products, and complete purchases with minimal friction.",
      },

      problems: [
        "Users struggled to visualize properties without physically visiting them",
        "Filtering options were too generic to match specific buyer needs",
        "Contacting agents required too many steps, causing drop-offs",
      ],
      solutions: [
        "Added 360° virtual tour integration on every listing page",
        "Introduced advanced filters for budget, amenities, and neighborhood score",
        "Simplified agent contact to a single tap-to-chat button",
      ],

      journeyIntro:
        "Explore the complete design process, from identifying user problems and researching ideas to wireframing, prototyping, and refining the final solution through iterative improvements.",
      journey: [
        {
          icon: "fi fi-rr-users-alt",
          title: "Discovery",
          subtitle:
            "Conducted interviews with home buyers and agents to uncover pain points and define the core problems within the property search experience.",
          duration: "1 - 3 days",
        },
        {
          icon: "fi fi-rr-sitemap",
          title: "Information Architecture",
          subtitle:
            "Mapped out user flows for property search, listing comparison, and agent contact to establish a clear and intuitive navigation structure.",
          duration: "2 - 3 days",
        },
        {
          icon: "fi fi-rr-pencil-ruler",
          title: "Wireframing",
          subtitle:
            "Designed low-fidelity wireframes to explore listing layout options and validate filter placement before committing to visual design.",
          duration: "3 - 5 days",
        },
        {
          icon: "fi fi-rr-palette",
          title: "Visual Identity",
          subtitle:
            "Crafted a warm, trustworthy design language — including typography, color palette, and iconography — tailored to the tone of real estate.",
          duration: "2 - 4 days",
        },
        {
          icon: "fi fi-rr-layers",
          title: "UI Design",
          subtitle:
            "Translated wireframes into high-fidelity screens, incorporating real listing data to produce a polished, production-ready interface.",
          duration: "5 - 7 days",
        },
        {
          icon: "fi fi-rr-comment-check",
          title: "Usability Testing",
          subtitle:
            "Ran prototype testing sessions with target users to validate the search flow, refine micro-interactions, and ensure a seamless contact experience.",
          duration: "2 - 3 days",
        },
      ],

      interactiveFeatures: [
        "360° virtual property tours",
        "Map-based search with live listing pins",
        "Saved search alerts with instant notifications",
      ],

      colors: {
        description:
          "A carefully selected color palette that strengthens the brand identity, improves readability, and creates a visually engaging experience while maintaining accessibility and consistency.",
        shades: {
          primary: [
            "#F5F0FB",
            "#E6D9F5",
            "#D3BFF0",
            "#BC9DEA",
            "#A279E3",
            "#8752DB",
            "#6B33C9",
            "#4E1F9E",
            "#2E1160",
          ],
          secondary: [
            "#EEF2FF",
            "#E0E7FF",
            "#C7D2FE",
            "#A5B4FC",
            "#818CF8",
            "#6366F1",
            "#4F46E5",
            "#4338CA",
            "#312E81",
          ],
        },
        others: [
          { name: "Placeholder", code: "#9CA3AF" },
          { name: "Background", code: "#F8FAFC" },
          { name: "Foreground", code: "#0B0F19" },
        ],
        dark: [
          { name: "Background", code: "#0D0D14" },
          { name: "Surface", code: "#16161F" },
          { name: "Elevated", code: "#1E1E2C" },
          { name: "Border", code: "#2C2C3E" },
          { name: "Muted", code: "#3E3E55" },
          { name: "Foreground", code: "#E2E4F0" },
        ],
      },

      spacing: {
        description:
          "A structured spacing system built on consistent alignment, balanced white space, and responsive layouts to ensure clarity, usability, and a seamless experience across devices.",
        scale: [
          { name: "Space-1", value: 4 },
          { name: "Space-2", value: 8 },
          { name: "Space-3", value: 12 },
          { name: "Space-4", value: 14 },
          { name: "Space-5", value: 16 },
          { name: "Space-6", value: 20 },
          { name: "Space-7", value: 28 },
          { name: "Space-8", value: 32 },
          { name: "Space-9", value: 38 },
          { name: "Space-10", value: 64 },
          { name: "Space-11", value: 82 },
          { name: "Space-12", value: 120 },
        ],
      },

      typographyIntro:
        "A modern typography hierarchy designed to enhance readability, establish visual consistency, and guide users naturally through content with clear headings and body text.",
      typography: [
        {
          fontName: "Roboto",
          usedFor: "Title",
          weights: ["Regular", "Medium", "Semi Bold", "Bold"],
        },
        {
          fontName: "Inter",
          usedFor: "Body",
          weights: ["Regular", "Medium", "Semi Bold", "Bold"],
        },
      ],

      learningsTitle: "What I learned from this project",
      learnings: [
        "Visual context builds buyer confidence faster than text descriptions",
        "Reducing contact friction directly increases agent response rates",
        "Map-based discovery is essential for location-driven decisions",
      ],
    },

    // =====================================================
    // FULL STACK DEVELOPMENT view
    // (Figma te jeguloy placeholder chilo, segulo sample text diye bhorechi. nijer real info diye replace korben)
    // =====================================================
    development: {
      tags: ["Full Stack Development"],
      description:
        "The engineering build behind FurneiStyle — the same marketplace covered in the UI/UX case study, now from the other side: schema design, API architecture, payments, and an admin dashboard the client runs without ever opening the codebase.",
      liveUrl: "#",
      githubUrl: "", // khali thakle button dekhabe na

      overview: {
        title: "Project Overview",
        description:
          "Took the FurneiStyle design from Figma to a deployed store: a MongoDB schema built for products with dozens of variants, a Node/Express API handling auth and orders, and a React storefront wired to Stripe for checkout — plus an admin panel so the client can manage and track orders without writing a line of code.",
      },

      problems: [
        "Furniture has real variants — fabric, finish, and size all change the price, and a flat product schema couldn't represent that cleanly",
        "Product pages are image-heavy, and early builds took 4+ seconds to load the full catalog",
        "The client needed to add new arrivals and update stock daily, with zero interest in touching code",
        "Checkout was frequently abandoned when users were forced to create an account before seeing the shipping cost",
      ],
      solutions: [
        "Modeled products with a nested variants array — each with its own SKU, price delta, and stock count — instead of duplicating products per size",
        "Served images through Cloudinary with responsive srcsets and lazy-loading, dropping catalog load to roughly 600ms",
        "Built a custom admin dashboard with drag-and-drop image upload and inline stock editing, so adding a product takes under a minute",
        "Added guest checkout with Stripe that shows shipping cost upfront, only asking for an account after the order is placed",
      ],

      stackIntro:
        "Every tool here solved something specific in this build, not just a line for the resume.",
      stack: [
        {
          title: "Frontend",
          items: [
            "React",
            "Redux Toolkit",
            "Tailwind CSS",
            "React Router",
            "React Hook Form",
          ],
        },
        {
          title: "Backend",
          items: ["Node.js", "Express.js", "JWT", "Multer", "Nodemailer"],
        },
        { title: "Database", items: ["MongoDB", "Mongoose"] },
        {
          title: "Tools & Services",
          items: ["Stripe", "Cloudinary", "Postman", "Docker", "Vercel", "Render"],
        },
      ],

      journeyIntro:
        "A look at how the build moved from planning the architecture to shipping a tested, deployed store.",
      journey: [
        {
          icon: "fi fi-rr-sitemap",
          title: "Planning & Architecture",
          subtitle:
            "Translated the approved UI/UX designs into a technical plan — data models, API routes, and which pages needed server-side data fetching.",
          duration: "1 - 2 days",
        },
        {
          icon: "fi fi-rr-database",
          title: "Database & Schema Design",
          subtitle:
            "Designed Mongoose schemas for Products, Orders, and Users, with indexes on the fields the storefront actually filters by.",
          duration: "2 - 3 days",
        },
        {
          icon: "fi fi-rr-server",
          title: "API Development",
          subtitle:
            "Built the Express API with JWT auth, validated endpoints, and role-based access for customers and admins.",
          duration: "5 - 7 days",
        },
        {
          icon: "fi fi-rr-browser",
          title: "Storefront Build",
          subtitle:
            "Turned the Figma screens into React pages, wiring the catalog, cart, and variant selection to live API data.",
          duration: "7 - 10 days",
        },
        {
          icon: "fi fi-rr-credit-card",
          title: "Payments & Integrations",
          subtitle:
            "Integrated Stripe Checkout, Cloudinary image delivery, and Nodemailer order-status emails.",
          duration: "3 - 4 days",
        },
        {
          icon: "fi fi-rr-rocket-lunge",
          title: "Testing & Deployment",
          subtitle:
            "Tested endpoints in Postman, containerized with Docker, and deployed the client to Vercel and the API to Render.",
          duration: "2 - 3 days",
        },
      ],

      interactiveFeatures: [
        "Variant-based product catalog (fabric, finish, size) with live stock tracking",
        "Admin dashboard for products, orders, and inventory — no code required",
        "Order-status emails triggered automatically through Nodemailer",
        "Guest checkout with Stripe — no forced signup before shipping cost",
        "JWT auth with role-based access (customer vs admin)",
        "Wishlist and recently-viewed products, persisted per user",
      ],

      apiIntro:
        "RESTful endpoints grouped by resource, with authentication and role checks applied at the route level.",
      apiRoutes: [
        {
          method: "POST",
          path: "/api/auth/register",
          note: "Create account, hash password with bcrypt",
        },
        {
          method: "POST",
          path: "/api/auth/login",
          note: "Verify credentials, issue access and refresh tokens",
        },
        {
          method: "GET",
          path: "/api/products",
          note: "List products with category, price, and variant filters",
        },
        {
          method: "POST",
          path: "/api/orders",
          note: "Create the order and a Stripe Checkout session",
        },
        {
          method: "PATCH",
          path: "/api/orders/:id/status",
          note: "Admin only: update order status and notify the customer",
        },
      ],

      dataModelIntro:
        "Four core collections. Variants live inside Product rather than as a separate collection, since they're always read together with the parent product.",
      dataModel: [
        {
          name: "User",
          fields: ["name", "email", "passwordHash", "role", "wishlist[]"],
        },
        {
          name: "Product",
          fields: ["title", "category", "basePrice", "variants[]", "images[]"],
        },
        {
          name: "Order",
          fields: ["user", "items[]", "shippingAddress", "status", "stripeSessionId"],
        },
        {
          name: "Review",
          fields: ["product", "user", "rating", "comment"],
        },
      ],

      performance: [
        "Added indexes on category and price fields, cutting filtered catalog queries from ~500ms to ~70ms",
        "Code-split the admin dashboard from the customer storefront bundle, so shoppers never download admin-only JavaScript",
        "Cached the product list response for a short TTL, since the catalog changes far less often than it's viewed",
      ],
      security: [
        "Passwords hashed with bcrypt; access tokens short-lived, refresh tokens kept in httpOnly cookies",
        "express-rate-limit on login and checkout routes to blunt brute-force and bot traffic",
        "express-validator on every mutating endpoint, rejecting malformed input before it reaches the database",
        "No card data ever touches the app's database — Stripe Checkout handles the entire payment surface",
      ],

      learningsTitle: "Takeaways",
      learnings: [
        "A flexible variant schema avoids a painful migration the first time a client asks for a new option",
        "An admin panel is its own UX project — it needs to be simpler than the storefront, not just functional",
        "Guest checkout isn't a minor detail — it directly affects whether people finish buying",
      ],
    },
  },

  // ============================================================
  // p2 — FitPulse (UI/UX design only)  |  client: c2
  // ============================================================
  {
    id: "p2",
    slug: "fitpulse-smart-fitness-tracking-app",
    title: "FitPulse – Smart Fitness Tracking App",
    description:
      "A mobile-first fitness companion that turns workouts, nutrition and recovery data into simple daily goals, so beginners stay consistent without feeling overwhelmed.",

    finalDesign: {
      description:
        "A motivating, easy-to-scan mobile interface that brings workout planning, progress tracking and daily goals together in one calm yet energetic experience.",
      tools: [figma, illustrator],
      coverImage: { src: pic("fitpulse-1"), alt: "FitPulse app home screen preview" },
      images: shots("fitpulse", [
        "FitPulse app home screen preview",
        "Goal-based onboarding screens",
        "Workout detail and rest timer screen",
        "Weekly progress and streak screen",
        "Nutrition logging screen",
        "Dark mode screens overview",
      ]),
    },

    clientIntro:
      "Feedback from the founder on how the redesigned experience improved onboarding, daily engagement and early user retention.",
    client: {
      id: "c2",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      name: "Sarah Mitchell",
      position: "Founder, FitPulse",
      feedback: [
        {
          rating: 5.0,
          comment:
            "The app feels effortless to use. Our beta users finished onboarding in under two minutes, and early retention was far better than we expected.",
        },
      ],
    },

    design: {
      tags: ["UI/UX Design", "Mobile App"],
      caseStudyLink: "#",

      overview: {
        title: "Project Overview",
        description:
          "Designed an end-to-end fitness app experience where users log workouts, track nutrition and review weekly progress in just a few taps, wrapped in a motivating but calm visual tone.",
      },

      problems: [
        "Existing fitness apps buried the daily workout behind several menus",
        "Progress charts were data-heavy and hard for beginners to interpret",
        "Users dropped off in the first week because onboarding felt like a long form",
      ],
      solutions: [
        "Placed today's workout front and center on a single-card home screen",
        "Turned raw stats into weekly streaks and plain-language progress summaries",
        "Replaced the long signup form with a 4-step, goal-based onboarding",
      ],

      journeyIntro:
        "From understanding why people quit fitness apps to testing a polished prototype, here is how the FitPulse experience took shape.",
      journey: [
        {
          icon: "fi fi-rr-users-alt",
          title: "Discovery",
          subtitle:
            "Interviewed casual gym-goers and beginners to understand why they abandon fitness apps within the first few weeks.",
          duration: "1 - 3 days",
        },
        {
          icon: "fi fi-rr-sitemap",
          title: "User Flows",
          subtitle:
            "Mapped onboarding, workout logging and weekly review flows to cut the number of taps needed for core actions.",
          duration: "2 - 3 days",
        },
        {
          icon: "fi fi-rr-pencil-ruler",
          title: "Wireframing",
          subtitle:
            "Sketched low-fidelity screens to test the one-card home layout and bottom navigation before adding any visual style.",
          duration: "3 - 4 days",
        },
        {
          icon: "fi fi-rr-palette",
          title: "Visual Identity",
          subtitle:
            "Built an energetic orange-and-charcoal identity with bold type and motivating illustrations.",
          duration: "2 - 4 days",
        },
        {
          icon: "fi fi-rr-layers",
          title: "UI Design",
          subtitle:
            "Designed high-fidelity iOS and Android screens, including dark mode and a reusable chart component set.",
          duration: "5 - 7 days",
        },
        {
          icon: "fi fi-rr-comment-check",
          title: "Usability Testing",
          subtitle:
            "Tested a clickable prototype with eight users and refined onboarding and the progress tab based on their feedback.",
          duration: "2 - 3 days",
        },
      ],

      interactiveFeatures: [
        "Swipeable workout cards with a built-in rest timer",
        "Animated weekly streak tracker",
        "Dark mode with automatic theme switching",
      ],

      colors: {
        description:
          "An energetic orange paired with calm slate neutrals to motivate users while keeping text and charts highly readable.",
        shades: { primary: palette.orange, secondary: palette.slate },
        others: [
          { name: "Placeholder", code: "#9CA3AF" },
          { name: "Background", code: "#FFFAF5" },
          { name: "Foreground", code: "#1C1917" },
        ],
        dark: [
          { name: "Background", code: "#0F0F0F" },
          { name: "Surface", code: "#1A1A1A" },
          { name: "Elevated", code: "#242424" },
          { name: "Border", code: "#333333" },
          { name: "Muted", code: "#4D4D4D" },
          { name: "Foreground", code: "#F5F5F4" },
        ],
      },

      spacing: spacing8pt,

      typographyIntro:
        "Rounded, friendly headings paired with a clean body font to keep numbers and instructions easy to read at a glance.",
      typography: [
        { fontName: "Poppins", usedFor: "Title", weights: ["Medium", "Semi Bold", "Bold"] },
        { fontName: "Inter", usedFor: "Body", weights: ["Regular", "Medium", "Semi Bold"] },
      ],

      learningsTitle: "What I learned from this project",
      learnings: [
        "Beginners need one clear next action, not a dashboard full of options",
        "Streaks and small wins motivate more than raw performance numbers",
        "Short onboarding tied to a personal goal dramatically reduces early drop-off",
      ],
    },
  },

  // ============================================================
  // p3 — MediQueue (development only)  |  client: c3
  // ============================================================
  {
    id: "p3",
    slug: "mediqueue-hospital-appointment-and-queue-system",
    title: "MediQueue – Hospital Appointment & Queue System",
    description:
      "A hospital appointment and live queue platform that lets patients book doctors online, track their turn from home, and helps front-desk staff run the day from one dashboard.",

    finalDesign: {
      description:
        "The deployed platform: a clean patient booking flow, a live queue display, and a staff dashboard built for busy hospital front desks.",
      tools: [],
      coverImage: { src: pic("mediqueue-1"), alt: "MediQueue booking dashboard preview" },
      images: shots("mediqueue", [
        "MediQueue booking dashboard preview",
        "Doctor directory and search page",
        "Appointment slot selection screen",
        "Live queue tracking screen",
        "Front-desk staff dashboard",
        "Daily report and analytics page",
      ]),
    },

    clientIntro:
      "Feedback from the hospital's operations head on how the system changed waiting-room traffic and front-desk workload.",
    client: {
      id: "c3",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      name: "Rafiq Hasan",
      position: "Operations Head, CityCare Hospital",
      feedback: [
        {
          rating: 4.9,
          comment:
            "Patients no longer crowd the waiting hall. They check their turn on their phone, and our front desk finally has a calm, organized day.",
        },
      ],
    },

    development: {
      tags: ["Full Stack Development", "Healthcare System"],
      description:
        "A real-time appointment and queue system for a multi-department hospital: slot-based booking, live token tracking over WebSockets, online payments, and a staff dashboard with daily reporting.",
      liveUrl: "#",
      githubUrl: "",

      overview: {
        title: "Project Overview",
        description:
          "Built a full stack hospital platform where patients book verified time slots, pay consultation fees online and follow their queue position live, while staff call patients, manage doctor schedules and review daily numbers from a single dashboard.",
      },

      problems: [
        "Patients waited hours at the hospital with no idea when their turn would come",
        "The front desk booked appointments on paper, causing frequent double-bookings",
        "Doctors had varying shifts and leave days that were hard to keep in sync",
        "Staff had no quick way to see how many patients were waiting per department",
      ],
      solutions: [
        "Built a real-time queue with Socket.IO so patients see their live position and estimated wait",
        "Added slot-based booking with a unique constraint on doctor and time, making double-booking impossible",
        "Created a flexible schedule model supporting weekly shifts, breaks and one-off leave days",
        "Gave staff a live department dashboard with queue counts and average wait times",
      ],

      stackIntro:
        "A relational database for strict booking rules and WebSockets for the live queue — each choice mapped to a real hospital problem.",
      stack: [
        {
          title: "Frontend",
          items: ["Next.js", "React", "Tailwind CSS", "Zustand", "React Hook Form"],
        },
        {
          title: "Backend",
          items: ["Node.js", "Express.js", "JWT", "Socket.IO", "Nodemailer"],
        },
        { title: "Database", items: ["PostgreSQL", "Prisma"] },
        {
          title: "Tools & Services",
          items: ["SSLCommerz", "Postman", "Docker", "Vercel", "Railway"],
        },
      ],

      journeyIntro:
        "How the system moved from mapping hospital workflows to a tested, live deployment.",
      journey: [
        {
          icon: "fi fi-rr-sitemap",
          title: "Planning & Architecture",
          subtitle:
            "Mapped the patient, doctor and front-desk workflows and turned them into a clear module and API plan.",
          duration: "2 - 3 days",
        },
        {
          icon: "fi fi-rr-database",
          title: "Database & Schema Design",
          subtitle:
            "Modeled doctors, schedules, appointments and queue tokens in PostgreSQL with constraints that prevent overlapping bookings.",
          duration: "2 - 4 days",
        },
        {
          icon: "fi fi-rr-server",
          title: "API Development",
          subtitle:
            "Built the Express API with JWT auth, role-based access and validated booking endpoints.",
          duration: "6 - 8 days",
        },
        {
          icon: "fi fi-rr-browser",
          title: "Web App Build",
          subtitle:
            "Created the patient booking flow, doctor directory and staff dashboard in Next.js with live data.",
          duration: "8 - 10 days",
        },
        {
          icon: "fi fi-rr-bell",
          title: "Realtime & Payments",
          subtitle:
            "Added the Socket.IO live queue, appointment reminders by email, and SSLCommerz payment for consultation fees.",
          duration: "4 - 5 days",
        },
        {
          icon: "fi fi-rr-rocket-lunge",
          title: "Testing & Deployment",
          subtitle:
            "Load-tested the queue, verified endpoints in Postman, and deployed the web app to Vercel and the API to Railway.",
          duration: "2 - 3 days",
        },
      ],

      interactiveFeatures: [
        "Live queue position and estimated waiting time for every patient",
        "Slot-based booking that blocks double-booking at the database level",
        "Doctor schedule manager with shifts, breaks and leave days",
        "Online consultation payment with SSLCommerz",
        "Staff dashboard with per-department queue counts",
        "Automatic appointment reminder emails",
      ],

      apiIntro:
        "Resource-based REST endpoints plus a WebSocket channel for queue updates, protected by role checks.",
      apiRoutes: [
        { method: "POST", path: "/api/auth/login", note: "Verify credentials and issue a JWT" },
        { method: "GET", path: "/api/doctors", note: "List doctors with department and availability filters" },
        { method: "POST", path: "/api/appointments", note: "Reserve a slot and start the payment session" },
        { method: "PATCH", path: "/api/queue/:id/next", note: "Staff only: call the next patient and broadcast the update" },
        { method: "GET", path: "/api/reports/daily", note: "Admin only: appointments, wait times and revenue for the day" },
      ],

      dataModelIntro:
        "Four core tables. A unique index on doctor and slot time guarantees that two patients can never hold the same slot.",
      dataModel: [
        { name: "User", fields: ["name", "phone", "passwordHash", "role"] },
        { name: "Doctor", fields: ["user", "department", "schedule[]", "fee"] },
        { name: "Appointment", fields: ["patient", "doctor", "slotTime", "status", "paymentRef"] },
        { name: "QueueEntry", fields: ["appointment", "token", "position", "calledAt"] },
      ],

      performance: [
        "Added a composite index on doctor and slot time, cutting availability lookups from ~300ms to ~25ms",
        "Throttled queue broadcasts to one update per second per department to keep WebSocket traffic light",
        "Server-rendered the doctor directory with revalidation so the first load stays fast on slow mobile networks",
      ],
      security: [
        "Role-based access for patients, doctors, staff and admins enforced in middleware",
        "Phone OTP verification before the first booking to block fake appointments",
        "Sensitive patient fields masked in logs, with an audit trail for record access",
        "Rate limiting on OTP and login endpoints to stop brute-force attempts",
      ],

      learningsTitle: "Takeaways",
      learnings: [
        "Enforce critical rules like double-booking in the database, not just in the UI",
        "A live queue only works if the update frequency is throttled and predictable",
        "Staff tools need to be faster than paper, or they simply won't be used",
      ],
    },
  },

  // ============================================================
  // p4 — BrewNest (design + development)  |  client: c4
  // ============================================================
  {
    id: "p4",
    slug: "brewnest-specialty-coffee-subscription-store",
    title: "BrewNest – Specialty Coffee Subscription Store",
    description:
      "A specialty coffee store with a guided bean quiz and a flexible subscription system, designed and built to make ordering fresh coffee as pleasant as drinking it.",

    finalDesign: {
      description:
        "A warm, editorial storefront that guides customers from discovering beans to managing recurring deliveries with almost no friction.",
      tools: [figma, photoshop],
      coverImage: { src: pic("brewnest-1"), alt: "BrewNest storefront homepage preview" },
      images: shots("brewnest", [
        "BrewNest storefront homepage preview",
        "Coffee taste quiz screens",
        "Product page with flavor wheel",
        "Subscription plan selection",
        "Subscription manager dashboard",
        "Mobile checkout screens",
      ]),
    },

    clientIntro:
      "Feedback from the marketing director on how the new store experience improved subscriptions, repeat orders and customer support load.",
    client: {
      id: "c4",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      name: "Emily Johansson",
      position: "Marketing Director, Nordic Roast Co.",
      feedback: [
        {
          rating: 4.8,
          comment:
            "Our subscribers can now pause or swap beans without emailing us. Support tickets dropped and the whole store feels premium.",
        },
      ],
    },

    design: {
      tags: ["UI/UX Design", "Ecommerce platform"],
      caseStudyLink: "#",

      overview: {
        title: "Project Overview",
        description:
          "Designed a coffee subscription experience that helps customers find the right beans through a short quiz, understand flavor at a glance, and manage deliveries on their own.",
      },

      problems: [
        "Subscription setup felt complicated, with too many options shown at once",
        "Product pages didn't communicate roast level, flavor notes or brewing method clearly",
        "Customers couldn't easily pause, skip or change a subscription",
      ],
      solutions: [
        "Created a 3-step coffee quiz that recommends beans and a delivery frequency",
        "Designed flavor-wheel and roast-scale visuals for every product page",
        "Built a self-serve subscription manager with pause, skip and swap in one tap",
      ],

      journeyIntro:
        "From understanding how people choose coffee to refining a premium subscription flow, here is the design process behind BrewNest.",
      journey: [
        {
          icon: "fi fi-rr-users-alt",
          title: "Discovery",
          subtitle:
            "Interviewed coffee lovers and existing subscribers to learn how they choose beans and why they cancel subscriptions.",
          duration: "1 - 3 days",
        },
        {
          icon: "fi fi-rr-sitemap",
          title: "Information Architecture",
          subtitle:
            "Structured the catalog by roast, origin and brew method, and mapped the quiz and subscription flows.",
          duration: "2 - 3 days",
        },
        {
          icon: "fi fi-rr-pencil-ruler",
          title: "Wireframing",
          subtitle:
            "Wireframed product pages and the quiz to test how much detail shoppers actually want before buying.",
          duration: "3 - 4 days",
        },
        {
          icon: "fi fi-rr-palette",
          title: "Visual Identity",
          subtitle:
            "Developed a warm, editorial look with earthy tones, rich photography and a refined serif headline style.",
          duration: "2 - 4 days",
        },
        {
          icon: "fi fi-rr-layers",
          title: "UI Design",
          subtitle:
            "Produced high-fidelity desktop and mobile screens, including the quiz, product page and subscription manager.",
          duration: "5 - 7 days",
        },
        {
          icon: "fi fi-rr-comment-check",
          title: "Usability Testing",
          subtitle:
            "Tested the quiz and plan management with real subscribers and simplified the wording of every plan option.",
          duration: "2 - 3 days",
        },
      ],

      interactiveFeatures: [
        "3-step coffee taste quiz with instant recommendations",
        "Interactive flavor wheel on every product page",
        "One-tap pause, skip and swap for subscriptions",
      ],

      colors: {
        description:
          "Warm amber and stone tones inspired by roasted beans and paper packaging, balanced with soft neutrals for a calm, premium feel.",
        shades: { primary: palette.amber, secondary: palette.stone },
        others: [
          { name: "Placeholder", code: "#A8A29E" },
          { name: "Background", code: "#FAF7F2" },
          { name: "Foreground", code: "#1C1917" },
        ],
        dark: [
          { name: "Background", code: "#14110F" },
          { name: "Surface", code: "#1E1A17" },
          { name: "Elevated", code: "#28231F" },
          { name: "Border", code: "#3A332D" },
          { name: "Muted", code: "#57504A" },
          { name: "Foreground", code: "#F5EFE6" },
        ],
      },

      spacing: spacing8pt,

      typographyIntro:
        "An elegant serif for headlines gives the brand character, while a clean sans-serif keeps product details and checkout easy to read.",
      typography: [
        { fontName: "Playfair Display", usedFor: "Title", weights: ["Regular", "Medium", "Semi Bold", "Bold"] },
        { fontName: "DM Sans", usedFor: "Body", weights: ["Regular", "Medium", "Bold"] },
      ],

      learningsTitle: "What I learned from this project",
      learnings: [
        "Visual taste cues like roast scales help people choose faster than long descriptions",
        "Letting customers control their subscription builds trust and reduces cancellations",
        "A short guided quiz converts better than a large product grid for first-time buyers",
      ],
    },

    development: {
      tags: ["Full Stack Development", "Subscription Commerce"],
      description:
        "The engineering behind BrewNest: recurring billing with Stripe, a flexible subscription engine, stock reservation for small-batch roasts, and an admin panel the marketing team uses to launch limited drops.",
      liveUrl: "#",
      githubUrl: "",

      overview: {
        title: "Project Overview",
        description:
          "Built the BrewNest store end to end: a Next.js storefront, a Node/Express API with Stripe subscriptions and webhooks, and an admin dashboard where the team schedules coffee drops and monitors subscribers.",
      },

      problems: [
        "Recurring orders required reliable billing and graceful handling of failed payments",
        "Subscribers needed to change plans mid-cycle without opening a support ticket",
        "Small-batch roasts sold out unpredictably, causing overselling",
        "The marketing team wanted to launch limited drops without developer help",
      ],
      solutions: [
        "Used Stripe Billing with webhook handlers for renewals, retries and cancellations",
        "Exposed plan-change endpoints that pause, skip or swap beans and update the next delivery date",
        "Reserved stock at checkout for a short window so the last bags can't be sold twice",
        "Built an admin panel with scheduled product drops and one-click inventory updates",
      ],

      stackIntro:
        "Each tool here supports a part of the subscription lifecycle, from first order to renewal.",
      stack: [
        {
          title: "Frontend",
          items: ["Next.js", "React", "Tailwind CSS", "Framer Motion", "React Hook Form"],
        },
        {
          title: "Backend",
          items: ["Node.js", "Express.js", "JWT", "Stripe Webhooks", "Nodemailer"],
        },
        { title: "Database", items: ["MongoDB", "Mongoose"] },
        {
          title: "Tools & Services",
          items: ["Stripe Billing", "Cloudinary", "Postman", "Docker", "Vercel", "Render"],
        },
      ],

      journeyIntro:
        "How the build progressed from subscription logic to a tested, deployed store.",
      journey: [
        {
          icon: "fi fi-rr-sitemap",
          title: "Planning & Architecture",
          subtitle:
            "Defined the subscription lifecycle, order states and webhook events before writing any code.",
          duration: "1 - 2 days",
        },
        {
          icon: "fi fi-rr-database",
          title: "Database & Schema Design",
          subtitle:
            "Modeled products, subscriptions, orders and users with indexes for the queries the dashboard runs most.",
          duration: "2 - 3 days",
        },
        {
          icon: "fi fi-rr-server",
          title: "API Development",
          subtitle:
            "Built authenticated endpoints for the catalog, orders and subscription management with strict validation.",
          duration: "5 - 7 days",
        },
        {
          icon: "fi fi-rr-browser",
          title: "Storefront Build",
          subtitle:
            "Turned the approved designs into Next.js pages including the coffee quiz, product pages and account area.",
          duration: "7 - 9 days",
        },
        {
          icon: "fi fi-rr-credit-card",
          title: "Billing & Integrations",
          subtitle:
            "Connected Stripe Billing, Cloudinary and automated emails for renewals, shipping and failed payments.",
          duration: "3 - 5 days",
        },
        {
          icon: "fi fi-rr-rocket-lunge",
          title: "Testing & Deployment",
          subtitle:
            "Replayed webhook events in test mode, tested edge cases in Postman and deployed to Vercel and Render.",
          duration: "2 - 3 days",
        },
      ],

      interactiveFeatures: [
        "Stripe-powered subscriptions with automatic renewals and retries",
        "Self-serve pause, skip and swap for every subscriber",
        "Short stock reservation at checkout to prevent overselling",
        "Scheduled limited-edition drops from the admin panel",
        "Order and renewal emails sent through Nodemailer",
        "Role-based access for customers and admins",
      ],

      apiIntro:
        "REST endpoints grouped by resource, with Stripe webhooks keeping subscription state in sync.",
      apiRoutes: [
        { method: "GET", path: "/api/products", note: "List beans with roast, origin and availability filters" },
        { method: "POST", path: "/api/subscriptions", note: "Create a subscription and open a Stripe session" },
        { method: "PATCH", path: "/api/subscriptions/:id", note: "Pause, skip or swap beans for the next delivery" },
        { method: "POST", path: "/api/webhooks/stripe", note: "Handle renewals, failed payments and cancellations" },
        { method: "POST", path: "/api/admin/drops", note: "Admin only: schedule a limited product drop" },
      ],

      dataModelIntro:
        "Four core collections. Subscription state mirrors Stripe, so the webhook is the single source of truth for billing.",
      dataModel: [
        { name: "User", fields: ["name", "email", "passwordHash", "role", "address"] },
        { name: "Product", fields: ["title", "roast", "origin", "price", "stock", "images[]"] },
        { name: "Subscription", fields: ["user", "product", "interval", "nextDelivery", "status", "stripeSubId"] },
        { name: "Order", fields: ["user", "items[]", "shippingAddress", "status", "stripeSessionId"] },
      ],

      performance: [
        "Indexed roast, origin and price fields, bringing filtered catalog queries from ~420ms to ~60ms",
        "Optimized all product photos through Cloudinary with responsive sizes and lazy loading",
        "Cached the catalog response briefly since products change far less often than they are viewed",
      ],
      security: [
        "Verified every Stripe webhook signature before touching subscription data",
        "Passwords hashed with bcrypt; refresh tokens stored in httpOnly cookies",
        "Rate limiting and input validation on all account and checkout endpoints",
        "No card data stored in the app — Stripe handles the entire payment surface",
      ],

      learningsTitle: "Takeaways",
      learnings: [
        "Treat the payment provider's webhook as the source of truth for subscription state",
        "Self-serve plan management is the biggest lever for reducing support tickets",
        "Reserving stock for a few minutes at checkout solves most overselling problems",
      ],
    },
  },

  // ============================================================
  // p5 — LearnLoop (design + development, opens on development)  |  client: c5
  // ============================================================
  {
    id: "p5",
    slug: "learnloop-online-learning-platform",
    primaryView: "development",
    title: "LearnLoop – Online Learning Platform",
    description:
      "An online learning platform where instructors build video courses, students learn at their own pace, and progress, quizzes and certificates are handled automatically.",

    finalDesign: {
      description:
        "A focused, distraction-free learning interface that keeps lessons, progress and next steps clear on every device.",
      tools: [figma, illustrator],
      coverImage: { src: pic("learnloop-1"), alt: "LearnLoop course dashboard preview" },
      images: shots("learnloop", [
        "LearnLoop course dashboard preview",
        "Course catalog and search page",
        "Video lesson player screen",
        "Quiz and result screen",
        "Instructor course builder",
        "Student certificate page",
      ]),
    },

    clientIntro:
      "Feedback from the academy's CEO on how the platform supported instructors, students and their first live course batch.",
    client: {
      id: "c5",
      image: "https://randomuser.me/api/portraits/men/75.jpg",
      name: "Tanvir Ahmed",
      position: "CEO, SkillBridge Academy",
      feedback: [
        {
          rating: 4.7,
          comment:
            "Instructors upload courses on their own and students resume lessons anywhere. The platform handled our first live batch without a single hiccup.",
        },
      ],
    },

    design: {
      tags: ["UI/UX Design", "EdTech Platform"],
      caseStudyLink: "#",

      overview: {
        title: "Project Overview",
        description:
          "Designed a learning experience that keeps students focused on the lesson, makes progress visible, and gives instructors a simple way to structure and publish courses.",
      },

      problems: [
        "Course pages mixed lessons, resources and ads, making it hard to stay focused",
        "Students could not tell how far they had come or what to study next",
        "Instructors found course creation tools confusing and time-consuming",
      ],
      solutions: [
        "Designed a distraction-free player with a collapsible lesson sidebar",
        "Added clear progress bars, completion badges and a 'continue learning' shortcut",
        "Created a drag-and-drop course builder that mirrors how instructors think about sections",
      ],

      journeyIntro:
        "The path from understanding learner behavior to designing a calm, focused learning platform.",
      journey: [
        {
          icon: "fi fi-rr-users-alt",
          title: "Discovery",
          subtitle:
            "Interviewed students and instructors to find where learning platforms break focus and slow down course creation.",
          duration: "2 - 3 days",
        },
        {
          icon: "fi fi-rr-sitemap",
          title: "Information Architecture",
          subtitle:
            "Organized courses into sections, lessons and quizzes, and mapped the learner and instructor journeys.",
          duration: "2 - 3 days",
        },
        {
          icon: "fi fi-rr-pencil-ruler",
          title: "Wireframing",
          subtitle:
            "Wireframed the lesson player and course builder to test layout options before choosing a visual style.",
          duration: "3 - 5 days",
        },
        {
          icon: "fi fi-rr-palette",
          title: "Visual Identity",
          subtitle:
            "Chose a calm blue and violet palette with friendly illustrations to keep the learning mood approachable.",
          duration: "2 - 4 days",
        },
        {
          icon: "fi fi-rr-layers",
          title: "UI Design",
          subtitle:
            "Designed responsive screens for students and instructors, including quizzes, certificates and dark mode.",
          duration: "6 - 8 days",
        },
        {
          icon: "fi fi-rr-comment-check",
          title: "Usability Testing",
          subtitle:
            "Tested the prototype with students and two instructors, then simplified the course builder steps.",
          duration: "2 - 3 days",
        },
      ],

      interactiveFeatures: [
        "Distraction-free video player with collapsible lesson list",
        "Progress tracking with a one-tap 'continue learning' button",
        "Drag-and-drop course builder for instructors",
      ],

      colors: {
        description:
          "Calm blue and violet tones that support concentration, with strong contrast for text-heavy lessons and quiz content.",
        shades: { primary: palette.blue, secondary: palette.violet },
        others: [
          { name: "Placeholder", code: "#9CA3AF" },
          { name: "Background", code: "#F8FAFC" },
          { name: "Foreground", code: "#0F172A" },
        ],
        dark: [
          { name: "Background", code: "#0B1020" },
          { name: "Surface", code: "#121A2E" },
          { name: "Elevated", code: "#1A2540" },
          { name: "Border", code: "#26334F" },
          { name: "Muted", code: "#3B4A6B" },
          { name: "Foreground", code: "#E6EAF5" },
        ],
      },

      spacing: spacing8pt,

      typographyIntro:
        "A modern geometric headline font with a highly readable body font for long lessons and quiz questions.",
      typography: [
        { fontName: "Plus Jakarta Sans", usedFor: "Title", weights: ["Medium", "Semi Bold", "Bold"] },
        { fontName: "Inter", usedFor: "Body", weights: ["Regular", "Medium", "Semi Bold"] },
      ],

      learningsTitle: "What I learned from this project",
      learnings: [
        "Removing visual noise around the video improves lesson completion",
        "Visible progress is the strongest motivator for self-paced learners",
        "Instructor tools deserve the same design care as the student experience",
      ],
    },

    development: {
      tags: ["Full Stack Development", "Learning Management System"],
      description:
        "The engineering behind LearnLoop: adaptive video streaming, a course builder API, server-side progress tracking, automated quizzes and certificates, and secure payments for course enrollment.",
      liveUrl: "#",
      githubUrl: "",

      overview: {
        title: "Project Overview",
        description:
          "Built a complete LMS with a React front end, a Node/Express API, MongoDB storage and an FFmpeg video pipeline, so instructors publish courses on their own and students learn smoothly even on slower connections.",
      },

      problems: [
        "Video lectures buffered badly on the slower connections many students use",
        "Instructors had no simple way to upload and structure course content",
        "Students lost their place when switching between devices",
        "Quiz grading and certificates were being handled manually",
      ],
      solutions: [
        "Transcoded uploads into multiple resolutions with FFmpeg and served adaptive HLS streams",
        "Built a drag-and-drop course builder API supporting sections, lessons and quizzes",
        "Saved lesson progress on the server every few seconds so learners resume anywhere",
        "Automated quiz grading and PDF certificate generation on course completion",
      ],

      stackIntro:
        "The stack is built around video delivery and progress tracking — the two things learners notice most.",
      stack: [
        {
          title: "Frontend",
          items: ["React", "Redux Toolkit", "Tailwind CSS", "React Router", "Video.js"],
        },
        {
          title: "Backend",
          items: ["Node.js", "Express.js", "JWT", "Multer", "FFmpeg"],
        },
        { title: "Database", items: ["MongoDB", "Mongoose", "Redis"] },
        {
          title: "Tools & Services",
          items: ["SSLCommerz", "AWS S3", "Postman", "Docker", "Vercel", "Render"],
        },
      ],

      journeyIntro:
        "How the platform grew from a course data model into a tested, production-ready LMS.",
      journey: [
        {
          icon: "fi fi-rr-sitemap",
          title: "Planning & Architecture",
          subtitle:
            "Defined roles, the course structure and the video pipeline, then planned the API around them.",
          duration: "2 - 3 days",
        },
        {
          icon: "fi fi-rr-database",
          title: "Database & Schema Design",
          subtitle:
            "Designed schemas for courses, enrollments, quizzes and progress with indexes for dashboard queries.",
          duration: "2 - 3 days",
        },
        {
          icon: "fi fi-rr-server",
          title: "API Development",
          subtitle:
            "Built the course, enrollment and progress APIs with JWT auth and instructor/student permissions.",
          duration: "6 - 8 days",
        },
        {
          icon: "fi fi-rr-browser",
          title: "Learning App Build",
          subtitle:
            "Implemented the lesson player, course catalog, quizzes and instructor builder in React.",
          duration: "8 - 10 days",
        },
        {
          icon: "fi fi-rr-credit-card",
          title: "Video & Payments",
          subtitle:
            "Added the FFmpeg transcoding queue, S3 storage and SSLCommerz payment for course enrollment.",
          duration: "4 - 6 days",
        },
        {
          icon: "fi fi-rr-rocket-lunge",
          title: "Testing & Deployment",
          subtitle:
            "Tested the full learner journey, containerized the API with Docker and deployed to Vercel and Render.",
          duration: "2 - 3 days",
        },
      ],

      interactiveFeatures: [
        "Adaptive HLS video streaming for slow and fast connections",
        "Cross-device progress that resumes exactly where the learner stopped",
        "Instructor course builder with drag-and-drop sections and lessons",
        "Auto-graded quizzes with instant feedback",
        "PDF certificate generated on course completion",
        "Online enrollment payments through SSLCommerz",
      ],

      apiIntro:
        "REST endpoints for courses, enrollments and progress, with instructor and student roles checked at the route level.",
      apiRoutes: [
        { method: "POST", path: "/api/auth/login", note: "Verify credentials and issue access tokens" },
        { method: "GET", path: "/api/courses", note: "List courses with category, level and price filters" },
        { method: "POST", path: "/api/courses/:id/enroll", note: "Create an enrollment and start the payment session" },
        { method: "PUT", path: "/api/lessons/:id/progress", note: "Save the learner's playback position and completion" },
        { method: "POST", path: "/api/quizzes/:id/submit", note: "Grade answers and update course completion" },
      ],

      dataModelIntro:
        "Four core collections. Sections and lessons are embedded in Course because they are always loaded with it.",
      dataModel: [
        { name: "User", fields: ["name", "email", "passwordHash", "role"] },
        { name: "Course", fields: ["title", "instructor", "price", "sections[]", "level"] },
        { name: "Enrollment", fields: ["user", "course", "progress", "completedAt", "paymentRef"] },
        { name: "Quiz", fields: ["course", "questions[]", "passMark", "attempts[]"] },
      ],

      performance: [
        "Adaptive HLS streams cut buffering on slower connections and reduced average start time to about a second",
        "Cached course catalog and public course pages in Redis to take pressure off MongoDB",
        "Debounced progress saves so the API receives one update every few seconds, not on every tick",
      ],
      security: [
        "Signed, time-limited video URLs so paid lessons can't be shared as public links",
        "Role-based permissions separating students, instructors and admins",
        "Passwords hashed with bcrypt and short-lived JWT access tokens",
        "Rate limiting and validation on authentication, upload and quiz submission endpoints",
      ],

      learningsTitle: "Takeaways",
      learnings: [
        "Video delivery is the product — adaptive streaming matters more than any other feature",
        "Saving progress on the server is what makes multi-device learning feel seamless",
        "Automating grading and certificates removes the biggest manual burden from instructors",
      ],
    },
  },

  // ============================================================
  // p6 — FinSage (UI/UX design only)  |  client: c6
  // ============================================================
  {
    id: "p6",
    slug: "finsage-personal-finance-dashboard",
    title: "FinSage – Personal Finance Dashboard",
    description:
      "A personal finance dashboard that turns spending, budgets and savings goals into a single clear financial health score, so money feels easier to understand and less stressful.",

    finalDesign: {
      description:
        "A trustworthy, data-clear dashboard that makes complex personal finance simple enough to understand in seconds.",
      tools: [figma, illustrator],
      coverImage: { src: pic("finsage-1"), alt: "FinSage dashboard overview preview" },
      images: shots("finsage", [
        "FinSage dashboard overview preview",
        "Financial health score breakdown",
        "Spending categories and trends",
        "Budget planner screen",
        "Savings goals tracker",
        "Mobile app and dark mode screens",
      ]),
    },

    clientIntro:
      "Feedback from the product manager on how the redesigned dashboard improved clarity, trust and daily engagement.",
    client: {
      id: "c6",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      name: "Priya Sharma",
      position: "Product Manager, Finlytics",
      feedback: [
        {
          rating: 4.6,
          comment:
            "The dashboard makes money feel less stressful. Testers understood their financial health score at a glance, which was our biggest goal.",
        },
      ],
    },

    design: {
      tags: ["UI/UX Design", "Fintech Dashboard"],
      caseStudyLink: "#",

      overview: {
        title: "Project Overview",
        description:
          "Designed a finance dashboard for everyday users, simplifying reports, budgets and goals into clear visuals backed by visible security and privacy cues.",
      },

      problems: [
        "Spending reports were cluttered with too many charts and numbers",
        "Setting a budget required manual calculation and guesswork",
        "Sensitive financial data made users anxious when trust cues were missing",
      ],
      solutions: [
        "Introduced a single financial health score with expandable breakdowns",
        "Added auto-suggested budgets based on the last three months of spending",
        "Surfaced security badges, privacy controls and biometric lock throughout the experience",
      ],

      journeyIntro:
        "How a dense financial product was simplified into a clear and trustworthy dashboard.",
      journey: [
        {
          icon: "fi fi-rr-users-alt",
          title: "Discovery",
          subtitle:
            "Interviewed young professionals about how they track money today and what makes finance apps feel stressful.",
          duration: "2 - 3 days",
        },
        {
          icon: "fi fi-rr-sitemap",
          title: "Information Architecture",
          subtitle:
            "Grouped accounts, budgets, goals and insights into a clear navigation model with a score-first overview.",
          duration: "2 - 3 days",
        },
        {
          icon: "fi fi-rr-pencil-ruler",
          title: "Wireframing",
          subtitle:
            "Tested several dashboard layouts to find the right balance between summary and detail.",
          duration: "3 - 5 days",
        },
        {
          icon: "fi fi-rr-palette",
          title: "Visual Identity",
          subtitle:
            "Created a fresh green-based identity that signals growth and trust, paired with calm neutral tones.",
          duration: "2 - 4 days",
        },
        {
          icon: "fi fi-rr-layers",
          title: "UI Design",
          subtitle:
            "Designed responsive dashboard screens with a reusable chart system, cards and light and dark themes.",
          duration: "6 - 8 days",
        },
        {
          icon: "fi fi-rr-comment-check",
          title: "Usability Testing",
          subtitle:
            "Ran sessions to confirm users understood the health score and could set a budget in under a minute.",
          duration: "2 - 3 days",
        },
      ],

      interactiveFeatures: [
        "Spending charts with drill-down by category",
        "Savings goal tracker with progress animations",
        "Light and dark dashboard themes",
      ],

      colors: {
        description:
          "Emerald green communicates growth and stability, supported by slate neutrals that keep dense data readable.",
        shades: { primary: palette.emerald, secondary: palette.slate },
        others: [
          { name: "Placeholder", code: "#94A3B8" },
          { name: "Background", code: "#F7FAF9" },
          { name: "Foreground", code: "#0B1210" },
        ],
        dark: [
          { name: "Background", code: "#0A0F0D" },
          { name: "Surface", code: "#121A17" },
          { name: "Elevated", code: "#1A2420" },
          { name: "Border", code: "#26332D" },
          { name: "Muted", code: "#3A4A42" },
          { name: "Foreground", code: "#E3EFE9" },
        ],
      },

      spacing: spacing8pt,

      typographyIntro:
        "A confident geometric headline font combined with a neutral body font that keeps figures and tables easy to scan.",
      typography: [
        { fontName: "Manrope", usedFor: "Title", weights: ["Medium", "Semi Bold", "Bold"] },
        { fontName: "Inter", usedFor: "Body", weights: ["Regular", "Medium", "Semi Bold"] },
      ],

      learningsTitle: "What I learned from this project",
      learnings: [
        "One clear summary number lowers anxiety more than ten detailed charts",
        "Visible security cues are part of the interface, not just a back-end concern",
        "Auto-suggested defaults make budgeting feel achievable instead of tedious",
      ],
    },
  },

  // ============================================================
  // p7 — TableTalk (development only)  |  client: c7
  // ============================================================
  {
    id: "p7",
    slug: "tabletalk-restaurant-reservation-and-order-system",
    title: "TableTalk – Restaurant Reservation & Order System",
    description:
      "A restaurant platform that combines online table reservations, a live kitchen order screen and multi-branch reporting, so service runs smoothly even on the busiest nights.",

    finalDesign: {
      description:
        "The deployed system: an online booking widget for guests and a real-time operations dashboard for floor, kitchen and owners.",
      tools: [],
      coverImage: { src: pic("tabletalk-1"), alt: "TableTalk reservation dashboard preview" },
      images: shots("tabletalk", [
        "TableTalk reservation dashboard preview",
        "Online table booking widget",
        "Floor plan and table status screen",
        "Kitchen order display",
        "Multi-branch sales report",
        "Guest confirmation email and SMS",
      ]),
    },

    clientIntro:
      "Feedback from the restaurant owner on how the system improved service speed, bookings and visibility across branches.",
    client: {
      id: "c7",
      image: "https://randomuser.me/api/portraits/men/46.jpg",
      name: "Lucas Fernández",
      position: "Owner, La Mesa Group",
      feedback: [
        {
          rating: 4.9,
          comment:
            "Reservations, kitchen orders and branch reports finally live in one place. Weekend service runs far smoother than before.",
        },
      ],
    },

    development: {
      tags: ["Full Stack Development", "Restaurant Tech"],
      description:
        "A real-time restaurant system with online reservations, deposits for peak slots, a kitchen display powered by WebSockets, and a reporting dashboard for owners with multiple branches.",
      liveUrl: "#",
      githubUrl: "",

      overview: {
        title: "Project Overview",
        description:
          "Built a full stack platform for a three-branch restaurant group: guests book tables online, floor staff manage seating on a live floor plan, the kitchen receives orders instantly, and the owner reviews sales per branch.",
      },

      problems: [
        "Phone reservations caused missed bookings during the dinner rush",
        "No-shows left tables empty with no way to recover the revenue",
        "Kitchen and floor staff relied on handwritten order slips",
        "The owner managed three branches with no combined view of sales",
      ],
      solutions: [
        "Built an online booking widget with live table availability per branch",
        "Added Stripe deposits for peak slots and SMS reminders to cut no-shows",
        "Created a kitchen display system that receives orders over WebSockets in real time",
        "Delivered a multi-branch dashboard with per-branch revenue, covers and peak hours",
      ],

      stackIntro:
        "Real-time updates and reliable bookings drove every technical choice in this build.",
      stack: [
        {
          title: "Frontend",
          items: ["React", "Redux Toolkit", "Tailwind CSS", "TanStack Query", "React Hook Form"],
        },
        {
          title: "Backend",
          items: ["Node.js", "Express.js", "JWT", "Socket.IO", "Nodemailer"],
        },
        { title: "Database", items: ["PostgreSQL", "Prisma", "Redis"] },
        {
          title: "Tools & Services",
          items: ["Stripe", "Twilio", "Postman", "Docker", "Vercel", "Render"],
        },
      ],

      journeyIntro:
        "From observing a real restaurant service to deploying a tested, live system.",
      journey: [
        {
          icon: "fi fi-rr-sitemap",
          title: "Planning & Architecture",
          subtitle:
            "Shadowed a busy service to map the guest, floor and kitchen workflows, then planned the system around them.",
          duration: "2 - 3 days",
        },
        {
          icon: "fi fi-rr-database",
          title: "Database & Schema Design",
          subtitle:
            "Modeled branches, tables, reservations and orders with constraints that prevent overlapping bookings.",
          duration: "2 - 3 days",
        },
        {
          icon: "fi fi-rr-server",
          title: "API Development",
          subtitle:
            "Built the Express API with JWT auth, staff roles and validated reservation and order endpoints.",
          duration: "6 - 8 days",
        },
        {
          icon: "fi fi-rr-browser",
          title: "Dashboard & Widget Build",
          subtitle:
            "Created the booking widget, floor plan view, kitchen display and owner dashboard in React.",
          duration: "8 - 10 days",
        },
        {
          icon: "fi fi-rr-credit-card",
          title: "Payments & Notifications",
          subtitle:
            "Integrated Stripe deposits, Twilio SMS reminders and confirmation emails.",
          duration: "3 - 4 days",
        },
        {
          icon: "fi fi-rr-rocket-lunge",
          title: "Testing & Deployment",
          subtitle:
            "Simulated a full dinner rush in testing, then deployed the client to Vercel and the API to Render.",
          duration: "2 - 3 days",
        },
      ],

      interactiveFeatures: [
        "Live table availability and online booking per branch",
        "Deposit payments for peak-time reservations",
        "Interactive floor plan with real-time table status",
        "Kitchen display that receives new orders instantly",
        "SMS and email reminders for every reservation",
        "Multi-branch sales and covers dashboard",
      ],

      apiIntro:
        "REST endpoints for reservations and orders, plus WebSocket events for floor and kitchen screens.",
      apiRoutes: [
        { method: "POST", path: "/api/auth/login", note: "Verify staff credentials and issue tokens" },
        { method: "GET", path: "/api/branches/:id/availability", note: "Return open tables for a date, time and party size" },
        { method: "POST", path: "/api/reservations", note: "Create a reservation and an optional deposit session" },
        { method: "POST", path: "/api/orders", note: "Send a new order to the kitchen display" },
        { method: "GET", path: "/api/reports/summary", note: "Owner only: revenue, covers and peak hours by branch" },
      ],

      dataModelIntro:
        "Four core tables, with reservations and orders always scoped to a branch to keep multi-branch data cleanly separated.",
      dataModel: [
        { name: "Branch", fields: ["name", "address", "openingHours", "tables[]"] },
        { name: "Reservation", fields: ["branch", "table", "guestName", "partySize", "time", "depositStatus"] },
        { name: "Order", fields: ["branch", "table", "items[]", "status", "total"] },
        { name: "Staff", fields: ["name", "email", "passwordHash", "role", "branch"] },
      ],

      performance: [
        "Cached the availability calculation in Redis, cutting booking widget response time from ~350ms to ~40ms",
        "Sent only order deltas over WebSockets so the kitchen display stays responsive during peak hours",
        "Added database indexes on branch and time fields used by reports",
      ],
      security: [
        "Role-based access separating owners, managers, floor staff and kitchen screens",
        "Branch-level data scoping so staff only see their own location",
        "Rate limiting and validation on all public booking endpoints to stop spam reservations",
        "No card data stored — Stripe handles deposits entirely",
      ],

      learningsTitle: "Takeaways",
      learnings: [
        "Spending time in the restaurant revealed requirements no brief would have mentioned",
        "Deposits and reminders reduce no-shows far more than any scheduling logic",
        "Kitchen screens must be fast and glanceable, not just feature-complete",
      ],
    },
  },

  // ============================================================
  // p8 — WanderWay (UI/UX design only)  |  client: c8
  // ============================================================
  {
    id: "p8",
    slug: "wanderway-collaborative-travel-planning-app",
    title: "WanderWay – Collaborative Travel Planning App",
    description:
      "A travel planning app that brings flights, stays, activities and group decisions into one shared timeline, so planning a trip with friends finally feels organized.",

    finalDesign: {
      description:
        "A bright, welcoming interface that turns scattered trip details into one clear, shareable itinerary available even offline.",
      tools: [figma, photoshop],
      coverImage: { src: pic("wanderway-1"), alt: "WanderWay trip timeline preview" },
      images: shots("wanderway", [
        "WanderWay trip timeline preview",
        "Destination discovery screen",
        "Drag-and-drop day planner",
        "Group itinerary voting screen",
        "Offline tickets and maps screen",
        "Trip summary and sharing screen",
      ]),
    },

    clientIntro:
      "Feedback from the co-founder on how the prototype shaped the product vision and impressed early travelers and investors.",
    client: {
      id: "c8",
      image: "https://randomuser.me/api/portraits/women/26.jpg",
      name: "Aisha Rahman",
      position: "Co-founder, Wanderlux Travel",
      feedback: [
        {
          rating: 4.9,
          comment:
            "The planner turned our messy group chats into one clear itinerary. Investors loved the prototype, and so did our first travelers.",
        },
      ],
    },

    design: {
      tags: ["UI/UX Design", "Mobile App"],
      caseStudyLink: "#",

      overview: {
        title: "Project Overview",
        description:
          "Designed a collaborative trip planner where friends can combine bookings, vote on activities and carry their entire itinerary offline while they travel.",
      },

      problems: [
        "Trip planning meant juggling tabs, notes, screenshots and chat threads",
        "Groups struggled to agree on a shared itinerary",
        "Travelers lost access to tickets and maps when the signal was weak abroad",
      ],
      solutions: [
        "Built a single timeline view that merges flights, stays and activities",
        "Added shared itineraries with voting and comments for every activity",
        "Designed offline-ready trip cards with saved maps, tickets and addresses",
      ],

      journeyIntro:
        "How a scattered planning process became a single collaborative travel experience.",
      journey: [
        {
          icon: "fi fi-rr-users-alt",
          title: "Discovery",
          subtitle:
            "Interviewed frequent travelers and group organizers to find the hardest parts of planning a trip together.",
          duration: "2 - 3 days",
        },
        {
          icon: "fi fi-rr-sitemap",
          title: "Information Architecture",
          subtitle:
            "Structured trips into days, bookings and activities and mapped how groups propose, vote and confirm.",
          duration: "2 - 3 days",
        },
        {
          icon: "fi fi-rr-pencil-ruler",
          title: "Wireframing",
          subtitle:
            "Explored timeline and map-first layouts to find the clearest way to show a multi-day itinerary.",
          duration: "3 - 5 days",
        },
        {
          icon: "fi fi-rr-palette",
          title: "Visual Identity",
          subtitle:
            "Designed a bright sky-blue identity with warm orange accents and travel-inspired imagery.",
          duration: "2 - 4 days",
        },
        {
          icon: "fi fi-rr-layers",
          title: "UI Design",
          subtitle:
            "Produced high-fidelity screens for planning, voting, offline access and trip sharing.",
          duration: "5 - 7 days",
        },
        {
          icon: "fi fi-rr-comment-check",
          title: "Usability Testing",
          subtitle:
            "Tested the prototype with three travel groups and refined the voting flow and offline indicators.",
          duration: "2 - 3 days",
        },
      ],

      interactiveFeatures: [
        "Drag-and-drop day planner",
        "Live trip chat with itinerary voting",
        "Offline mode with saved tickets and maps",
      ],

      colors: {
        description:
          "Fresh sky blue evokes open horizons, while warm orange accents highlight key actions and add a sense of adventure.",
        shades: { primary: palette.sky, secondary: palette.orange },
        others: [
          { name: "Placeholder", code: "#9CA3AF" },
          { name: "Background", code: "#F5FAFF" },
          { name: "Foreground", code: "#0B1620" },
        ],
        dark: [
          { name: "Background", code: "#0A121A" },
          { name: "Surface", code: "#111C27" },
          { name: "Elevated", code: "#182736" },
          { name: "Border", code: "#243649" },
          { name: "Muted", code: "#3A506A" },
          { name: "Foreground", code: "#E3EEF8" },
        ],
      },

      spacing: spacing8pt,

      typographyIntro:
        "Rounded, approachable headings paired with a friendly body font to keep itineraries easy to read on the go.",
      typography: [
        { fontName: "Outfit", usedFor: "Title", weights: ["Medium", "Semi Bold", "Bold"] },
        { fontName: "Nunito Sans", usedFor: "Body", weights: ["Regular", "SemiBold", "Bold"] },
      ],

      learningsTitle: "What I learned from this project",
      learnings: [
        "Group travel is mostly a coordination problem, not a booking problem",
        "Offline access is a core feature for travel apps, not an extra",
        "A single timeline beats separate tabs for flights, stays and activities",
      ],
    },
  },

  // ============================================================
  // p9 — LogiTrack (development only)  |  client: c9
  // ============================================================
  {
    id: "p9",
    slug: "logitrack-fleet-and-delivery-tracking-dashboard",
    title: "LogiTrack – Fleet & Delivery Tracking Dashboard",
    description:
      "A logistics dashboard that tracks drivers live, assigns deliveries automatically and gives customers a public tracking link, so dispatch teams spend less time on phone calls.",

    finalDesign: {
      description:
        "The deployed platform: a live dispatch map for operations teams and a simple tracking page for customers.",
      tools: [],
      coverImage: { src: pic("logitrack-1"), alt: "LogiTrack live dispatch map preview" },
      images: shots("logitrack", [
        "LogiTrack live dispatch map preview",
        "Delivery list and assignment board",
        "Driver profile and status screen",
        "Public customer tracking page",
        "Analytics and delivery performance report",
        "Driver mobile web view",
      ]),
    },

    clientIntro:
      "Feedback from the CTO on how the platform changed dispatch operations and reduced customer support calls.",
    client: {
      id: "c9",
      image: "https://randomuser.me/api/portraits/men/52.jpg",
      name: "Daniel Okafor",
      position: "CTO, SwiftHaul Logistics",
      feedback: [
        {
          rating: 4.8,
          comment:
            "We can see every driver on a live map and customers stop calling to ask where their parcel is. It changed how our dispatch team works.",
        },
      ],
    },

    development: {
      tags: ["Full Stack Development", "Logistics Platform"],
      description:
        "A real-time fleet tracking and delivery management system with live GPS streaming, rule-based auto-assignment, public tracking links and operational analytics.",
      liveUrl: "#",
      githubUrl: "",

      overview: {
        title: "Project Overview",
        description:
          "Built a logistics platform where dispatchers watch drivers move on a live map, deliveries are assigned by zone and workload, and customers follow their parcel through a shareable tracking page.",
      },

      problems: [
        "Dispatchers called drivers by phone to learn their location",
        "Delivery assignment was done manually in spreadsheets",
        "Customers had no tracking link, flooding support with 'where is my order' calls",
        "Driver apps drained batteries with constant GPS polling",
      ],
      solutions: [
        "Streamed driver GPS over WebSockets and plotted live positions on a map",
        "Built rule-based auto-assignment by delivery zone, vehicle load and driver availability",
        "Generated public tracking links with live status and ETA for every delivery",
        "Used adaptive location intervals — frequent when moving, sparse when idle",
      ],

      stackIntro:
        "The stack is tuned for streaming location data efficiently and keeping the dispatch view fast.",
      stack: [
        {
          title: "Frontend",
          items: ["React", "Redux Toolkit", "Tailwind CSS", "Leaflet", "Recharts"],
        },
        {
          title: "Backend",
          items: ["Node.js", "Express.js", "JWT", "Socket.IO", "BullMQ"],
        },
        { title: "Database", items: ["MongoDB", "Mongoose", "Redis"] },
        {
          title: "Tools & Services",
          items: ["OpenStreetMap", "Postman", "Docker", "GitHub Actions", "AWS EC2"],
        },
      ],

      journeyIntro:
        "How the platform went from dispatch workflow research to a tested, production deployment.",
      journey: [
        {
          icon: "fi fi-rr-sitemap",
          title: "Planning & Architecture",
          subtitle:
            "Mapped dispatcher, driver and customer workflows, then planned the real-time architecture and API.",
          duration: "2 - 3 days",
        },
        {
          icon: "fi fi-rr-database",
          title: "Database & Schema Design",
          subtitle:
            "Designed schemas for drivers, deliveries and location logs with geospatial indexes for zone queries.",
          duration: "2 - 4 days",
        },
        {
          icon: "fi fi-rr-server",
          title: "API Development",
          subtitle:
            "Built the Express API with JWT auth, role-based access and a job queue for assignment and notifications.",
          duration: "6 - 8 days",
        },
        {
          icon: "fi fi-rr-browser",
          title: "Dashboard Build",
          subtitle:
            "Created the live dispatch map, delivery board and analytics views in React with Leaflet.",
          duration: "8 - 10 days",
        },
        {
          icon: "fi fi-rr-bell",
          title: "Realtime & Tracking",
          subtitle:
            "Implemented WebSocket streaming for driver locations and the public customer tracking page.",
          duration: "4 - 5 days",
        },
        {
          icon: "fi fi-rr-rocket-lunge",
          title: "Testing & Deployment",
          subtitle:
            "Simulated hundreds of moving drivers for load testing, then shipped with Docker and GitHub Actions to AWS.",
          duration: "3 - 4 days",
        },
      ],

      interactiveFeatures: [
        "Live driver map with real-time location updates",
        "Rule-based auto-assignment by zone and workload",
        "Public tracking link with status and ETA",
        "Drag-and-drop manual reassignment board",
        "Delivery performance analytics and exports",
        "Role-based access for admins, dispatchers and drivers",
      ],

      apiIntro:
        "REST endpoints for deliveries and tracking, with a WebSocket channel for live location events.",
      apiRoutes: [
        { method: "POST", path: "/api/auth/login", note: "Verify credentials and issue access tokens" },
        { method: "GET", path: "/api/deliveries", note: "List deliveries with status, zone and date filters" },
        { method: "POST", path: "/api/deliveries", note: "Create a delivery and queue it for assignment" },
        { method: "PATCH", path: "/api/deliveries/:id/assign", note: "Dispatcher only: assign or reassign a driver" },
        { method: "GET", path: "/api/track/:code", note: "Public: return delivery status, ETA and driver position" },
      ],

      dataModelIntro:
        "Four core collections. Location logs are stored separately so the high-volume GPS data never slows down delivery queries.",
      dataModel: [
        { name: "User", fields: ["name", "email", "passwordHash", "role"] },
        { name: "Driver", fields: ["user", "vehicle", "zone", "status", "lastLocation"] },
        { name: "Delivery", fields: ["customer", "driver", "pickup", "dropoff", "status", "eta", "trackingCode"] },
        { name: "LocationLog", fields: ["driver", "coords", "speed", "recordedAt"] },
      ],

      performance: [
        "Added geospatial indexes on driver location, cutting nearest-driver lookups from ~400ms to ~30ms",
        "Batched location writes through a Redis buffer to reduce database load from constant GPS updates",
        "Used adaptive GPS intervals on the driver side, noticeably extending phone battery life",
      ],
      security: [
        "Role-based permissions for admins, dispatchers and drivers",
        "Tracking links use random, non-guessable codes and expose no personal data",
        "Rate limiting on public tracking and authentication endpoints",
        "Location data automatically archived after a retention period",
      ],

      learningsTitle: "Takeaways",
      learnings: [
        "High-volume GPS data needs its own storage strategy from day one",
        "Customer-facing tracking pages remove an entire category of support calls",
        "Auto-assignment rules should be simple and explainable so dispatchers trust them",
      ],
    },
  },

  // ============================================================
  // p10 — KartBD (design + development)  |  client: c10
  // ============================================================
  {
    id: "p10",
    slug: "kartbd-multi-vendor-marketplace",
    title: "KartBD – Multi-vendor Marketplace",
    description:
      "A multi-vendor marketplace where local sellers open branded stores, shoppers buy from many sellers in a single checkout, and every order is paid and tracked with ease.",

    finalDesign: {
      description:
        "A vibrant, trust-focused marketplace interface that keeps every seller's store consistent while making shopping and checkout effortless.",
      tools: [figma, illustrator, photoshop],
      coverImage: { src: pic("kartbd-1"), alt: "KartBD marketplace homepage preview" },
      images: shots("kartbd", [
        "KartBD marketplace homepage preview",
        "Seller store template page",
        "Product listing and filters",
        "Cart grouped by seller",
        "Seller dashboard overview",
        "Mobile checkout and payment screens",
      ]),
    },

    clientIntro:
      "Feedback from the head of growth on how the marketplace supported fast seller onboarding and smooth multi-seller checkout.",
    client: {
      id: "c10",
      image: "https://randomuser.me/api/portraits/women/12.jpg",
      name: "Nusrat Jahan",
      position: "Head of Growth, Bazaarly",
      feedback: [
        {
          rating: 4.8,
          comment:
            "Hundreds of sellers onboarded in weeks, and the checkout handles every payment method our customers expect. Exactly what a marketplace needs.",
        },
      ],
    },

    design: {
      tags: ["UI/UX Design", "Marketplace"],
      caseStudyLink: "#",

      overview: {
        title: "Project Overview",
        description:
          "Designed a marketplace experience that keeps seller stores consistent, groups carts by seller with clear delivery costs, and gets new sellers selling in minutes.",
      },

      problems: [
        "Seller storefronts looked inconsistent, hurting buyer trust",
        "Shoppers abandoned carts when they couldn't compare delivery from multiple sellers",
        "Seller onboarding was long and discouraged new merchants",
      ],
      solutions: [
        "Created a flexible store template system that keeps sellers on-brand but consistent",
        "Grouped cart items by seller with transparent per-seller delivery costs",
        "Cut seller onboarding to a guided five-minute checklist",
      ],

      journeyIntro:
        "How the marketplace was shaped around both sides of the platform: shoppers and sellers.",
      journey: [
        {
          icon: "fi fi-rr-users-alt",
          title: "Discovery",
          subtitle:
            "Interviewed local sellers and online shoppers to understand trust, delivery and payment concerns on both sides.",
          duration: "2 - 3 days",
        },
        {
          icon: "fi fi-rr-sitemap",
          title: "Information Architecture",
          subtitle:
            "Mapped shopper, seller and admin flows and structured categories for a catalog with thousands of products.",
          duration: "2 - 4 days",
        },
        {
          icon: "fi fi-rr-pencil-ruler",
          title: "Wireframing",
          subtitle:
            "Wireframed store templates, the multi-seller cart and the seller onboarding checklist.",
          duration: "3 - 5 days",
        },
        {
          icon: "fi fi-rr-palette",
          title: "Visual Identity",
          subtitle:
            "Built a lively green and amber identity with clear badges for verified sellers and fast delivery.",
          duration: "2 - 4 days",
        },
        {
          icon: "fi fi-rr-layers",
          title: "UI Design",
          subtitle:
            "Designed responsive shopper and seller interfaces with a reusable component library.",
          duration: "6 - 8 days",
        },
        {
          icon: "fi fi-rr-comment-check",
          title: "Usability Testing",
          subtitle:
            "Tested checkout with shoppers and onboarding with new sellers, then simplified several form steps.",
          duration: "2 - 3 days",
        },
      ],

      interactiveFeatures: [
        "Customizable seller store templates",
        "Cart grouped by seller with live delivery costs",
        "Guided seller onboarding checklist with progress",
      ],

      colors: {
        description:
          "A lively green communicates freshness and trust, balanced with warm amber highlights for offers and calls to action.",
        shades: { primary: palette.green, secondary: palette.amber },
        others: [
          { name: "Placeholder", code: "#9CA3AF" },
          { name: "Background", code: "#F9FBF9" },
          { name: "Foreground", code: "#0E1510" },
        ],
        dark: [
          { name: "Background", code: "#0B100C" },
          { name: "Surface", code: "#131A14" },
          { name: "Elevated", code: "#1B241C" },
          { name: "Border", code: "#273328" },
          { name: "Muted", code: "#3C4D3E" },
          { name: "Foreground", code: "#E5F0E6" },
        ],
      },

      spacing: spacing8pt,

      typographyIntro:
        "A friendly, bold headline font paired with a reliable body font that stays readable across product grids, forms and dashboards.",
      typography: [
        { fontName: "Poppins", usedFor: "Title", weights: ["Medium", "Semi Bold", "Bold"] },
        { fontName: "Roboto", usedFor: "Body", weights: ["Regular", "Medium", "Bold"] },
      ],

      learningsTitle: "What I learned from this project",
      learnings: [
        "A marketplace is two products in one: the shopper experience and the seller experience",
        "Transparent delivery costs per seller reduce cart abandonment",
        "Short, guided onboarding is the best way to grow the seller base quickly",
      ],
    },

    development: {
      tags: ["Full Stack Development", "Multi-vendor Marketplace"],
      description:
        "The engineering behind KartBD: per-seller sub-orders, commission and payout tracking, local payment methods, bilingual product search and a dashboard for every seller.",
      liveUrl: "#",
      githubUrl: "",

      overview: {
        title: "Project Overview",
        description:
          "Built a multi-vendor marketplace with a React storefront, a Node/Express API and MongoDB, where one checkout is split into per-seller orders and each seller manages products, orders and earnings from their own dashboard.",
      },

      problems: [
        "Orders contained items from several sellers, each needing separate fulfillment and payouts",
        "Customers expected mobile wallets and cash on delivery alongside cards",
        "Search needed to handle both Bangla and English product names",
        "Sellers needed their own dashboards with strictly limited access",
      ],
      solutions: [
        "Split each checkout into per-seller sub-orders with independent statuses and commission tracking",
        "Integrated SSLCommerz for cards and mobile wallets, plus a cash-on-delivery option",
        "Added text indexes with synonym mapping so Bangla and English names find the same products",
        "Built a seller dashboard backed by role-scoped API access",
      ],

      stackIntro:
        "Each tool supports one of the marketplace's trickiest parts: splitting orders, local payments and bilingual search.",
      stack: [
        {
          title: "Frontend",
          items: ["React", "Redux Toolkit", "Tailwind CSS", "React Router", "React Hook Form"],
        },
        {
          title: "Backend",
          items: ["Node.js", "Express.js", "JWT", "Multer", "Nodemailer"],
        },
        { title: "Database", items: ["MongoDB", "Mongoose", "Redis"] },
        {
          title: "Tools & Services",
          items: ["SSLCommerz", "Cloudinary", "Postman", "Docker", "Vercel", "Render"],
        },
      ],

      journeyIntro:
        "How the marketplace moved from the multi-vendor data model to a tested, deployed platform.",
      journey: [
        {
          icon: "fi fi-rr-sitemap",
          title: "Planning & Architecture",
          subtitle:
            "Defined shopper, seller and admin roles and planned how orders, commissions and payouts would flow.",
          duration: "2 - 3 days",
        },
        {
          icon: "fi fi-rr-database",
          title: "Database & Schema Design",
          subtitle:
            "Modeled vendors, products and orders with sub-orders embedded so each seller sees only their own items.",
          duration: "2 - 4 days",
        },
        {
          icon: "fi fi-rr-server",
          title: "API Development",
          subtitle:
            "Built the Express API with JWT auth, vendor-scoped permissions and validated order endpoints.",
          duration: "6 - 8 days",
        },
        {
          icon: "fi fi-rr-browser",
          title: "Storefront & Seller App",
          subtitle:
            "Implemented the shopper storefront and the seller dashboard in React from the approved designs.",
          duration: "9 - 12 days",
        },
        {
          icon: "fi fi-rr-credit-card",
          title: "Payments & Integrations",
          subtitle:
            "Connected SSLCommerz, Cloudinary image delivery and automated order and payout emails.",
          duration: "3 - 5 days",
        },
        {
          icon: "fi fi-rr-rocket-lunge",
          title: "Testing & Deployment",
          subtitle:
            "Tested multi-seller checkout scenarios in Postman, containerized the API and deployed to Vercel and Render.",
          duration: "2 - 3 days",
        },
      ],

      interactiveFeatures: [
        "Multi-seller cart split into independent sub-orders",
        "Cards, mobile wallets and cash on delivery at checkout",
        "Bilingual Bangla and English product search",
        "Seller dashboard for products, orders and earnings",
        "Automatic commission calculation and payout tracking",
        "Verified seller badges and product reviews",
      ],

      apiIntro:
        "REST endpoints grouped by resource, with shopper, vendor and admin permissions enforced at the route level.",
      apiRoutes: [
        { method: "POST", path: "/api/auth/register", note: "Create a shopper or seller account" },
        { method: "GET", path: "/api/products?q=", note: "Search products in Bangla or English with filters" },
        { method: "POST", path: "/api/orders", note: "Split the cart into per-seller sub-orders and start payment" },
        { method: "PATCH", path: "/api/vendor/orders/:id", note: "Vendor only: update fulfillment status for their sub-order" },
        { method: "POST", path: "/api/payments/ipn", note: "Verify the gateway callback and confirm the payment" },
      ],

      dataModelIntro:
        "Four core collections. Sub-orders live inside Order so a shopper sees one purchase while each seller sees only their share.",
      dataModel: [
        { name: "User", fields: ["name", "email", "passwordHash", "role", "addresses[]"] },
        { name: "Vendor", fields: ["owner", "storeName", "commissionRate", "payoutBalance", "verified"] },
        { name: "Product", fields: ["vendor", "title", "titleBn", "price", "stock", "images[]"] },
        { name: "Order", fields: ["buyer", "subOrders[]", "paymentStatus", "paymentMethod", "total"] },
      ],

      performance: [
        "Added compound indexes on vendor, category and price, cutting listing queries from ~450ms to ~65ms",
        "Cached trending and category pages in Redis to keep the homepage fast under traffic spikes",
        "Delivered all product images through Cloudinary with responsive sizes and lazy loading",
      ],
      security: [
        "Vendor-scoped queries so a seller can never read or edit another seller's data",
        "Payment confirmations verified server-side with the gateway before any order is marked paid",
        "Passwords hashed with bcrypt and short-lived JWTs with refresh tokens in httpOnly cookies",
        "Rate limiting and validation on authentication, upload and checkout endpoints",
      ],

      learningsTitle: "Takeaways",
      learnings: [
        "Design the sub-order model first — payouts, returns and reporting all depend on it",
        "Supporting local payment habits like cash on delivery directly affects conversion",
        "Bilingual search needs planning from the schema stage, not as a late patch",
      ],
    },
  },
];

// views + merged tags jure dey (ProjectCard top level `tags` ei theke pay)
export const projectsData = rawProjects.map(withProjectMeta);

export default projectsData;