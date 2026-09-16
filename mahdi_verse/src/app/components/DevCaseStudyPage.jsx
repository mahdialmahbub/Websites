/* eslint-disable react/jsx-no-comment-textnodes */
"use client";

// DevCaseStudyPage.jsx
// Reusable case-study detail page for MERN-stack projects — devCaseStudyData.js theke
// je kono ekta project object pass korle full page render hobe.
//
// Real project e use korar niyom:
//   import { devCaseStudyData } from "@/data/devCaseStudyData";
//   <DevCaseStudyPage project={devCaseStudyData.find(p => p.slug === params.slug)} />
//
// Ekhon preview er jonno FurneiStyle er data default hisebe bosano ache,
// jate prop na dile o page ta full content soho render hoy.
//
// journeyIconMap step.title dekhe lucide icon pick kore (Flaticon uicons na thakleo
// preview e render hoy). Real site e jodi Flaticon CDN already loaded thake,
// চাইলে <i className={step.icon} /> diye direct flaticon class-o use kora jabe.

import React, { useEffect, useRef, useState } from "react";
import {
  Gift,
  ExternalLink,
  Rocket,
  Database,
  Server,
  CreditCard,
  LayoutDashboard,
  Compass,
  Star,
  ShoppingCart,
  KeyRound,
  Mail,
  Heart,
  Layers,
  Zap,
  ShieldCheck,
  ArrowRight,
  Image as ImageIcon,
  Quote,
  ArrowLeft,
} from "lucide-react";

// ---------- Demo data (FurneiStyle) — replace with a real prop in production ----------
const defaultProject = {
  category: "Full Stack Development",
  tags: ["MERN Stack", "E-commerce Platform", "REST API"],
  title: "FurneiStyle",
  subtitle: "Full-Stack Furniture E-commerce Platform",
  role: "Full-Stack Developer — designed the database, built the REST API, and implemented the storefront and admin panel in React.",
  description:
    "The engineering build behind FurneiStyle — the same marketplace covered in the UI/UX case study, now from the other side: schema design, API architecture, payments, and an admin dashboard the client runs without ever opening the codebase.",
  links: { liveDemo: "#", github: "#" },
  overview: {
    description:
      "Took the FurneiStyle design from Figma to a deployed store: a MongoDB schema built for products with dozens of variants, a Node/Express API handling auth and orders, and a React storefront wired to Stripe for checkout — plus an admin panel so the client can add products and track orders without writing a line of code.",
  },
  problemsIntro:
    "Building the store was the easy part — building it so a non-technical furniture business could run it day to day was the real challenge.",
  problems: [
    "Furniture has real variants — fabric, finish, and size all change the price, and a flat product schema couldn't represent that cleanly",
    "Product pages are image-heavy, and early builds took 4+ seconds to load the full catalog",
    "The client needed to add new arrivals and update stock daily, with zero interest in touching code",
    "Checkout was frequently abandoned when users were forced to create an account before seeing the shipping cost",
  ],
  solutions: [
    "Modeled products with a nested variants array — each with its own SKU, price delta, and stock count — instead of duplicating products per option",
    "Served images through Cloudinary with responsive srcsets and lazy-loading below the fold, dropping catalog load to roughly 600ms",
    "Built a custom admin dashboard with drag-and-drop image upload and inline stock editing, so adding a product takes under two minutes",
    "Added guest checkout that shows shipping cost upfront, only asking for an account after the order is placed",
  ],
  techStackIntro: "Every tool here solved something specific in this build, not just a line for the resume.",
  techStack: {
    frontend: ["React", "Redux Toolkit", "Tailwind CSS", "React Router", "React Hook Form"],
    backend: ["Node.js", "Express.js", "JWT", "Multer", "Nodemailer"],
    database: ["MongoDB", "Mongoose"],
    toolsAndServices: ["Stripe", "Cloudinary", "Postman", "Docker", "Vercel", "Render"],
  },
  projectJourneyIntro: "From schema sketch to a deployed store — how the build actually went, stage by stage.",
  projectJourney: [
    {
      title: "Planning & Architecture",
      subtitle:
        "Translated the approved UI/UX designs into a technical plan — data model, API routes, and which pages needed server data versus client-side fetching.",
      duration: "2 - 3 days",
    },
    {
      title: "Database & Schema Design",
      subtitle:
        "Designed Mongoose schemas for Products, Orders, and Users, with indexes on the fields the storefront actually filters and sorts by.",
      duration: "3 - 4 days",
    },
    {
      title: "Backend & API Development",
      subtitle:
        "Built REST endpoints for auth, catalog, cart, and orders, with centralized error handling and validation middleware so bad requests never reach the database layer.",
      duration: "7 - 9 days",
    },
    {
      title: "Payments & Auth",
      subtitle:
        "Integrated Stripe for checkout and JWT-based auth with refresh tokens, keeping card data entirely on Stripe's side and out of the app's own database.",
      duration: "3 - 4 days",
    },
    {
      title: "Frontend Development",
      subtitle:
        "Built the storefront and the admin dashboard in React, sharing one component library between both so styling never drifted apart.",
      duration: "8 - 10 days",
    },
    {
      title: "Testing & Deployment",
      subtitle:
        "Covered the core API routes with Postman test collections, containerized the backend, and deployed frontend and backend separately behind environment-based configs.",
      duration: "3 - 4 days",
    },
  ],
  keyFeatures: [
    "Variant-based product catalog (fabric, finish, size) with live stock tracking",
    "Guest checkout with Stripe — no forced signup before seeing shipping cost",
    "Admin dashboard for products, orders, and inventory — no code required",
    "JWT auth with role-based access (customer vs admin)",
    "Order-status emails triggered automatically through Nodemailer",
    "Wishlist and recently-viewed products, persisted per account",
  ],
  architecture: {
    description:
      "A layered Express setup — thin routes, controllers for request/response, services for business logic — so the checkout flow could be unit-tested without spinning up the whole server.",
    apiEndpoints: [
      { method: "POST", route: "/api/auth/register", description: "Create account, hash password with bcrypt" },
      { method: "POST", route: "/api/auth/login", description: "Issue access token + httpOnly refresh cookie" },
      { method: "GET", route: "/api/products", description: "Paginated, filterable product catalog" },
      { method: "POST", route: "/api/orders/checkout", description: "Create Stripe session, reserve stock" },
      { method: "PATCH", route: "/api/admin/products/:id", description: "Admin-only product and stock update" },
    ],
  },
  databaseSchema: {
    description:
      "Four core collections. Variants live inside Product rather than as a separate collection, since they're always read together with the parent product.",
    models: [
      { name: "User", fields: ["name", "email", "passwordHash", "role", "wishlist[]"] },
      { name: "Product", fields: ["title", "category", "basePrice", "variants[]", "images[]"] },
      { name: "Order", fields: ["user", "items[]", "shippingAddress", "status", "stripeSessionId"] },
      { name: "Review", fields: ["product", "user", "rating", "comment"] },
    ],
  },
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
  finalProduct: {
    description:
      "A store that looks like the original Figma designs, stays fast on an average connection, and the client's team runs entirely from the admin panel.",
    tools: ["VS Code", "Postman", "MongoDB Compass", "Docker"],
    images: [
      { src: "/dev-projects/FurneiStyle/1.jpg", alt: "FurneiStyle admin dashboard preview" },
      { src: "/dev-projects/FurneiStyle/2.jpg", alt: "Product variant management preview" },
      { src: "/dev-projects/FurneiStyle/3.jpg", alt: "Checkout flow preview" },
      { src: "/dev-projects/FurneiStyle/4.jpg", alt: "Order tracking preview" },
    ],
  },
  clientIntro: "What the client noticed after the store went live and their team started running it day to day.",
  client: {
    image: "/clients/devClientImages/Farhan_Kabir.jpg",
    name: "Farhan Kabir",
    position: "Owner, FurneiStyle",
    rating: 5.0,
    comment:
      "We add a new product and it's live in two minutes. Nobody on our team touches code, and we still update the store ourselves every week.",
  },
  learnings: [
    "A flexible variant schema up front avoids a painful migration the first time a client asks for a new option",
    "An admin panel is its own UX project — it needs to be simpler than the storefront, not just functional",
    "Guest checkout isn't a minor detail — it directly affects whether people finish buying",
  ],
};

// ---------- Small helpers ----------

const journeyIconMap = {
  "Planning & Architecture": Compass,
  "Database & Schema Design": Database,
  "Backend & API Development": Server,
  "Payments & Auth": CreditCard,
  "Frontend Development": LayoutDashboard,
  "Testing & Deployment": Rocket,
};

const featureIcons = [Layers, ShoppingCart, LayoutDashboard, KeyRound, Mail, Heart];

const methodColors = {
  GET: "#7DD3FC",
  POST: "#C9B3F9",
  PATCH: "#FCD08A",
  PUT: "#FCD08A",
  DELETE: "#FCA5A5",
};

const stackLabels = {
  frontend: "Frontend",
  backend: "Backend",
  database: "Database",
  toolsAndServices: "Tools & Services",
};

function Reveal({ children, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`dcs-fade ${visible ? "dcs-visible" : ""} ${className}`}>
      {children}
    </div>
  );
}

function Eyebrow({ children }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="w-8 h-px" style={{ background: "var(--violet)" }} />
      <span className="font-mono-brand text-xs tracking-widest uppercase" style={{ color: "var(--violet)" }}>
        {children}
      </span>
    </div>
  );
}

function ImgBlock({ src, alt, className = "", Icon = ImageIcon }) {
  const [errored, setErrored] = useState(false);
  if (errored || !src) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ background: "linear-gradient(135deg, rgba(107,51,201,0.10), rgba(79,70,229,0.10))" }}
      >
        <Icon className="w-7 h-7" style={{ color: "var(--muted)" }} />
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setErrored(true)} />;
}

function Pill({ children }) {
  return (
    <span
      className="font-mono-brand text-xs px-3 py-1 rounded-full border"
      style={{ borderColor: "var(--line)", color: "var(--muted)" }}
    >
      {children}
    </span>
  );
}

// ---------- Main component ----------

export default function DevCaseStudyPage({ project = defaultProject }) {
  const p = project;

  return (
    <div className="dcs-root font-body" style={{ background: "var(--paper)", color: "var(--ink)" }}>
      <style>{`
        .dcs-root {
          --ink: #0B0F19; --paper: #F8FAFC; --violet: #6B33C9; --violet-deep: #2E1160;
          --indigo: #4F46E5; --line: #DCE2ED; --muted: #5B6472;
          --term-bg: #0D0D14; --term-surface: #16161F; --term-border: #2C2C3E; --term-fg: #E2E4F0;
        }
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-body { font-family: 'IBM Plex Sans', sans-serif; }
        .font-mono-brand { font-family: 'IBM Plex Mono', monospace; }
        .dcs-fade { opacity: 0; transform: translateY(16px); transition: opacity .7s ease, transform .7s ease; }
        .dcs-fade.dcs-visible { opacity: 1; transform: translateY(0); }
        .dcs-cursor { display:inline-block; width:8px; height:1em; background: var(--violet); margin-left:3px; vertical-align:-3px; animation: dcsBlink 1s steps(1) infinite; }
        @keyframes dcsBlink { 50% { opacity: 0; } }
        .dcs-card { transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease; }
        .dcs-card:hover { transform: translateY(-3px); border-color: var(--violet); box-shadow: 0 12px 24px -16px rgba(107,51,201,0.35); }
        .dcs-grid-bg {
          background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px);
          background-size: 36px 36px;
        }
        @media (prefers-reduced-motion: reduce) {
          .dcs-fade { opacity: 1 !important; transform: none !important; transition: none !important; }
          .dcs-cursor { animation: none; }
          .dcs-card:hover { transform: none; }
        }
        .dcs-focus:focus-visible { outline: 2px solid var(--violet); outline-offset: 3px; }
      `}</style>

      {/* ---------- Hero ---------- */}
      <header className="relative overflow-hidden border-b" style={{ borderColor: "var(--line)" }}>
        <div
          className="absolute inset-0 dcs-grid-bg"
          style={{
            opacity: 0.5,
            maskImage: "linear-gradient(to bottom, black, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28">
          <a href="#" className="dcs-focus inline-flex items-center gap-2 text-sm font-body mb-10" style={{ color: "var(--muted)" }}>
            <ArrowLeft className="w-4 h-4" /> Back to projects
          </a>

          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span
              className="font-mono-brand text-xs tracking-widest uppercase px-3 py-1 rounded-full"
              style={{ background: "var(--violet)", color: "#fff" }}
            >
              {p.category}
            </span>
            <span className="font-mono-brand text-xs" style={{ color: "var(--muted)" }}>
              Companion build to the UI/UX case study
            </span>
          </div>

          <h1 className="font-display font-semibold text-4xl md:text-6xl leading-tight mb-2">
            {p.title}
            <span className="dcs-cursor" aria-hidden="true" />
          </h1>
          <p className="font-display text-lg md:text-2xl mb-6" style={{ color: "var(--indigo)" }}>
            {p.subtitle}
          </p>

          <p className="font-body text-base md:text-lg leading-relaxed max-w-2xl mb-8" style={{ color: "var(--muted)" }}>
            {p.description}
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            {p.tags.map((tag) => (
              <Pill key={tag}>{tag}</Pill>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <a
              href={p.links.liveDemo}
              className="dcs-focus inline-flex items-center gap-2 px-5 py-3 rounded-lg font-body font-medium text-sm"
              style={{ background: "var(--ink)", color: "#fff" }}
            >
              View live site <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href={p.links.github}
              className="dcs-focus inline-flex items-center gap-2 px-5 py-3 rounded-lg font-body font-medium text-sm border"
              style={{ borderColor: "var(--line)" }}
            >
              <Gift className="w-4 h-4" /> View source
            </a>
          </div>

          <div className="mt-12 pt-6 border-t font-body text-sm" style={{ borderColor: "var(--line)" }}>
            <span style={{ color: "var(--muted)" }}>Role — </span>
            {p.role}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6">
        {/* ---------- Overview ---------- */}
        <section className="py-16 md:py-24">
          <Reveal>
            <Eyebrow>Overview</Eyebrow>
            <p className="font-display text-2xl md:text-3xl leading-snug max-w-3xl">{p.overview.description}</p>
          </Reveal>
        </section>

        {/* ---------- Problem / Solution ---------- */}
        <section className="py-16 md:py-24 border-t" style={{ borderColor: "var(--line)" }}>
          <Reveal>
            <Eyebrow>Problem → Solution</Eyebrow>
            <p className="font-body text-base md:text-lg mb-10 max-w-2xl" style={{ color: "var(--muted)" }}>
              {p.problemsIntro}
            </p>
          </Reveal>
          <div className="space-y-6">
            {p.problems.map((problem, i) => (
              <Reveal key={i}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-stretch">
                  <div className="dcs-card p-5 md:p-6 rounded-xl border" style={{ borderColor: "var(--line)" }}>
                    <span className="font-mono-brand text-xs tracking-widest uppercase" style={{ color: "var(--muted)" }}>
                      Problem
                    </span>
                    <p className="font-body text-sm md:text-base mt-2 leading-relaxed">{problem}</p>
                  </div>
                  <div
                    className="dcs-card p-5 md:p-6 rounded-xl border-2"
                    style={{ borderColor: "var(--violet)", background: "rgba(107,51,201,0.04)" }}
                  >
                    <span className="font-mono-brand text-xs tracking-widest uppercase" style={{ color: "var(--violet)" }}>
                      Solution
                    </span>
                    <p className="font-body text-sm md:text-base mt-2 leading-relaxed">{p.solutions[i]}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------- Tech Stack ---------- */}
        <section className="py-16 md:py-24 border-t" style={{ borderColor: "var(--line)" }}>
          <Reveal>
            <Eyebrow>Stack</Eyebrow>
            <p className="font-body text-base md:text-lg mb-10 max-w-2xl" style={{ color: "var(--muted)" }}>
              {p.techStackIntro}
            </p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Object.entries(p.techStack).map(([group, items]) => (
              <Reveal key={group}>
                <div className="p-5 md:p-6 rounded-xl border h-full" style={{ borderColor: "var(--line)" }}>
                  <span className="font-mono-brand text-xs tracking-widest uppercase" style={{ color: "var(--indigo)" }}>
                    {stackLabels[group] || group}
                  </span>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {items.map((item) => (
                      <Pill key={item}>{item}</Pill>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------- Development Journey ---------- */}
        <section className="py-16 md:py-24 border-t" style={{ borderColor: "var(--line)" }}>
          <Reveal>
            <Eyebrow>Build timeline</Eyebrow>
            <p className="font-body text-base md:text-lg mb-12 max-w-2xl" style={{ color: "var(--muted)" }}>
              {p.projectJourneyIntro}
            </p>
          </Reveal>
          <div className="relative">
            <div className="absolute left-5 top-2 bottom-2 w-px" style={{ background: "var(--line)" }} />
            <div className="space-y-10">
              {p.projectJourney.map((step, i) => {
                const Icon = journeyIconMap[step.title] || Compass;
                return (
                  <Reveal key={i}>
                    <div className="relative pl-16">
                      <div
                        className="absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center border-2"
                        style={{ borderColor: "var(--violet)", background: "var(--paper)" }}
                      >
                        <Icon className="w-4 h-4" style={{ color: "var(--violet)" }} />
                      </div>
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
                        <h3 className="font-display font-semibold text-lg md:text-xl">{step.title}</h3>
                        <span className="font-mono-brand text-xs" style={{ color: "var(--muted)" }}>
                          {step.duration}
                        </span>
                      </div>
                      <p className="font-body text-sm md:text-base leading-relaxed max-w-2xl" style={{ color: "var(--muted)" }}>
                        {step.subtitle}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------- Key Features ---------- */}
        <section className="py-16 md:py-24 border-t" style={{ borderColor: "var(--line)" }}>
          <Reveal>
            <Eyebrow>Features</Eyebrow>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {p.keyFeatures.map((feature, i) => {
              const Icon = featureIcons[i % featureIcons.length];
              return (
                <Reveal key={i}>
                  <div className="dcs-card flex items-start gap-4 p-5 rounded-xl border h-full" style={{ borderColor: "var(--line)" }}>
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: "rgba(107,51,201,0.10)" }}
                    >
                      <Icon className="w-4 h-4" style={{ color: "var(--violet)" }} />
                    </div>
                    <p className="font-body text-sm md:text-base leading-relaxed pt-1">{feature}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* ---------- Architecture / API ---------- */}
        <section className="py-16 md:py-24 border-t" style={{ borderColor: "var(--line)" }}>
          <Reveal>
            <Eyebrow>Architecture</Eyebrow>
            <p className="font-body text-base md:text-lg mb-10 max-w-2xl" style={{ color: "var(--muted)" }}>
              {p.architecture.description}
            </p>
          </Reveal>
          <Reveal>
            <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--term-border)" }}>
              <div className="flex items-center gap-2 px-4 py-3" style={{ background: "var(--term-surface)" }}>
                <span className="w-3 h-3 rounded-full" style={{ background: "#FCA5A5" }} />
                <span className="w-3 h-3 rounded-full" style={{ background: "#FCD08A" }} />
                <span className="w-3 h-3 rounded-full" style={{ background: "#86EFAC" }} />
                <span className="font-mono-brand text-xs ml-3" style={{ color: "var(--term-fg)", opacity: 0.6 }}>
                  api / routes
                </span>
              </div>
              <div className="p-4 md:p-6 font-mono-brand text-xs md:text-sm" style={{ background: "var(--term-bg)" }}>
                {p.architecture.apiEndpoints.map((ep, i) => (
                  <div
                    key={i}
                    className="flex flex-wrap items-start gap-x-3 gap-y-1 py-2.5 border-b last:border-b-0"
                    style={{ borderColor: "var(--term-border)" }}
                  >
                    <span className="font-semibold w-14 shrink-0" style={{ color: methodColors[ep.method] || "#E2E4F0" }}>
                      {ep.method}
                    </span>
                    <span className="shrink-0" style={{ color: "var(--term-fg)" }}>
                      {ep.route}
                    </span>
                    <span style={{ color: "var(--term-fg)", opacity: 0.6 }}>// {ep.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* ---------- Database Schema ---------- */}
        <section className="py-16 md:py-24 border-t" style={{ borderColor: "var(--line)" }}>
          <Reveal>
            <Eyebrow>Data model</Eyebrow>
            <p className="font-body text-base md:text-lg mb-10 max-w-2xl" style={{ color: "var(--muted)" }}>
              {p.databaseSchema.description}
            </p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {p.databaseSchema.models.map((model) => (
              <Reveal key={model.name}>
                <div className="rounded-xl border overflow-hidden h-full" style={{ borderColor: "var(--line)" }}>
                  <div
                    className="px-4 py-2.5 font-mono-brand text-xs tracking-widest uppercase"
                    style={{ background: "var(--violet-deep)", color: "#fff" }}
                  >
                    {model.name}
                  </div>
                  <div className="p-4 flex flex-wrap gap-2">
                    {model.fields.map((field) => (
                      <span
                        key={field}
                        className="font-mono-brand text-xs px-2.5 py-1 rounded"
                        style={{ background: "rgba(79,70,229,0.08)", color: "var(--indigo)" }}
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------- Performance & Security ---------- */}
        <section className="py-16 md:py-24 border-t" style={{ borderColor: "var(--line)" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
            <Reveal>
              <Eyebrow>Performance</Eyebrow>
              <ul className="space-y-4">
                {p.performance.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <Zap className="w-4 h-4 shrink-0 mt-1" style={{ color: "var(--violet)" }} />
                    <span className="font-body text-sm md:text-base leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal>
              <Eyebrow>Security</Eyebrow>
              <ul className="space-y-4">
                {p.security.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <ShieldCheck className="w-4 h-4 shrink-0 mt-1" style={{ color: "var(--indigo)" }} />
                    <span className="font-body text-sm md:text-base leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* ---------- Final Product Gallery ---------- */}
        <section className="py-16 md:py-24 border-t" style={{ borderColor: "var(--line)" }}>
          <Reveal>
            <Eyebrow>Final product</Eyebrow>
            <p className="font-body text-base md:text-lg mb-10 max-w-2xl" style={{ color: "var(--muted)" }}>
              {p.finalProduct.description}
            </p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {p.finalProduct.images.map((img, i) => (
              <Reveal key={img.src} className={i === 0 ? "sm:col-span-2" : ""}>
                <ImgBlock
                  src={img.src}
                  alt={img.alt}
                  className={`w-full rounded-xl border ${i === 0 ? "aspect-video" : "aspect-square"}`}
                />
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono-brand text-xs tracking-widest uppercase mr-2" style={{ color: "var(--muted)" }}>
                Built with
              </span>
              {p.finalProduct.tools.map((tool) => (
                <Pill key={tool}>{tool}</Pill>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ---------- Client Feedback ---------- */}
        <section className="py-16 md:py-24 border-t" style={{ borderColor: "var(--line)" }}>
          <Reveal>
            <Eyebrow>Feedback</Eyebrow>
            <p className="font-body text-base md:text-lg mb-10 max-w-2xl" style={{ color: "var(--muted)" }}>
              {p.clientIntro}
            </p>
          </Reveal>
          <Reveal>
            <div className="rounded-xl border p-6 md:p-10" style={{ borderColor: "var(--line)" }}>
              <Quote className="w-8 h-8 mb-4" style={{ color: "var(--violet)" }} />
              <p className="font-display text-xl md:text-2xl leading-snug mb-6">&ldquo;{p.client.comment}&rdquo;</p>
              <div className="flex items-center gap-4">
                <ImgBlock src={p.client.image} alt={p.client.name} className="w-12 h-12 rounded-full border" Icon={Star} />
                <div>
                  <div className="font-body font-semibold text-sm">{p.client.name}</div>
                  <div className="font-body text-sm" style={{ color: "var(--muted)" }}>
                    {p.client.position}
                  </div>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4"
                      style={{
                        color: "var(--violet)",
                        fill: i < Math.round(p.client.rating) ? "var(--violet)" : "none",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ---------- Learnings ---------- */}
        <section className="py-16 md:py-24 border-t" style={{ borderColor: "var(--line)" }}>
          <Reveal>
            <Eyebrow>Takeaways</Eyebrow>
          </Reveal>
          <div className="space-y-5">
            {p.learnings.map((learning, i) => (
              <Reveal key={i}>
                <div className="flex gap-4">
                  <span className="font-mono-brand text-sm shrink-0" style={{ color: "var(--violet)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-body text-sm md:text-base leading-relaxed">{learning}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </main>

      {/* ---------- Closing CTA ---------- */}
      <footer className="border-t" style={{ borderColor: "var(--line)", background: "var(--ink)" }}>
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-24 text-center">
          <Reveal>
            <h2 className="font-display font-semibold text-2xl md:text-4xl mb-4" style={{ color: "#fff" }}>
              Have a build like this in mind?
            </h2>
            <p className="font-body text-sm md:text-base mb-8 max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.6)" }}>
              I design and build the full thing — interface, database, and everything in between.
            </p>
            <a
              href="#contact"
              className="dcs-focus inline-flex items-center gap-2 px-6 py-3 rounded-lg font-body font-medium text-sm"
              style={{ background: "var(--violet)", color: "#fff" }}
            >
              Start a conversation <ArrowRight className="w-4 h-4" />
            </a>
          </Reveal>
        </div>
      </footer>
    </div>
  );
}
