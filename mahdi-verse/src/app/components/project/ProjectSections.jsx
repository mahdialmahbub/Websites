import Image from "next/image";
import Link from "next/link";
import { VIEW_META } from "../../utils/projectViews";
import { ViewToggleButton } from "./ProjectViewClient";
import Chips from "../Chips";
import Button from "../Button";
import ProjectImageGallery from "./ProjectImageGallery";
import TypographyCard from "./TypographyCard";
import ScrollThanksBanner from "./ScrollThanksBanner";
import FeedbackCard from "./FeedbackCard";
import ProjectGallery from "./ProjectGallery";

import FadeUp from "../motions/FadeUp";
import FadeLeft from "../motions/FadeLeft";
import FadeRight from "../motions/FadeRight";
import ProjectCard from "../ProjectCard";
import Carousel from "../Carousel";
import projectsData from "../../assets/projects/projects";
import ScoreRing from "./ScoreRing";
import PagePreviewViewer from "./PagePreviewViewer";

const subHeading = "font-primary text-[20px] font-semibold";

/* ------------------------------------------------------------------ */
/* Motion settings                                                     */
/* ------------------------------------------------------------------ */

/**
 * Pura page-er animation ekhan theke tune kora jay.
 * Default (28px / 0.7s) theke ektu chhoto + druto — jate subtle lage.
 */
const REVEAL = { distance: 20, duration: 0.6 };

/**
 * Grid item gulor jonno halka stagger (max 0.14s), jate boring o na lage,
 * abar ekshathe "pop" korei na ashe.
 */
const stagger = (index, step = 0.07) => (index % 3) * step;

/**
 * @typedef {{ icon: string, title: string, subtitle: string, duration: string }} JourneyStep
 * @typedef {{ name: string, code: string }} NamedColor
 * @typedef {{ src: string, alt?: string }} ProjectImage
 */

const TONES = {
  danger: {
    box: "bg-[#E30000]/5",
    border: "border-[#E30000]/10",
    iconColor: "text-[#E30000]",
    text: "text-[#E30000]",
    dotCover: "bg-[#E30000]/10",
    dot: "bg-[#E30000]",
    icon: "fi fi-rr-problem-solving",
  },
  success: {
    box: "bg-[#00E300]/5",
    border: "border-[#00E300]/10",
    iconColor: "text-[#00E300]",
    text: "text-[#00E300]",
    dotCover: "bg-[#00E300]/10",
    dot: "bg-[#00E300]",
    icon: "fi fi-rr-lightbulb-on",
  },
  info: {
    box: "bg-[#22D3EE]/5",
    border: "border-[#22D3EE]/10",
    iconColor: "text-[#22D3EE]",
    text: "text-[#22D3EE]",
    dotCover: "bg-[#22D3EE]/10",
    dot: "bg-[#22D3EE]",
    icon: "fi fi-rr-interactive",
  },
  brand: {
    box: "bg-[#6C63FF]/5",
    border: "border-[#6C63FF]/10",
    iconColor: "text-[#6C63FF]",
    text: "text-[#6C63FF]",
    dotCover: "bg-[#6C63FF]/10",
    dot: "bg-[#6C63FF]",
    icon: "fi fi-rr-lesson",
  },
  performance: {
    box: "bg-[#2563EB]/5",
    border: "border-[#2563EB]/10",
    iconColor: "text-[#2563EB]",
    text: "text-[#2563EB]",
    dotCover: "bg-[#2563EB]/10",
    dot: "bg-[#2563EB]",
    icon: "fi fi-rr-lesson",
  },
};

const METHOD_COLORS = {
  GET: "text-emerald-400",
  POST: "text-amber-400",
  PUT: "text-sky-400",
  PATCH: "text-sky-400",
  DELETE: "text-red-400",
};

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

/** @param {{ label: string, children?: React.ReactNode }} props */
function SectionIntro({ label, children }) {
  return (
    <div className="space-y-space-2">
      <h3 className="font-primary text-size-lg font-semibold">{label}</h3>
      {children && (
        <p
          className={` text-size-base text-placeholder_2 dark:text-placeholder/80 leading-6.25`}
        >
          {children}
        </p>
      )}
    </div>
  );
}

/**
 * Tinted bullet box: Problems, Solutions, Features, Learnings shob eita diye.
 *
 * @param {{
 *   title: string,
 *   items?: string[],
 *   tone?: "danger" | "success" | "info" | "brand",
 *   icon?: string,
 *   delay?: number,
 *   links?: { label: string, href?: string }[],
 *   linksTitle?: string,
 * }} props
 */
export function ListPanel({
  title,
  items = [],
  tone = "info",
  icon,
  delay = 0,
  links = [],
  linksTitle = "Check live performance",
}) {
  const validLinks = (links ?? []).filter((link) => link.href);

  if (!items.length && !validLinks.length) return null;
  const t = TONES[tone];

  return (
    <FadeUp
      as="section"
      {...REVEAL}
      delay={delay}
      className={`relative overflow-hidden rounded-2xl p-space-6 ${t.box} border ${t.border} shadow-[0_1px_4px_rgba(16,24,40,0.10),0_1px_4px_rgba(248,250,252,1)] dark:shadow-none`}
    >
      <h3 className={`mb-space-4 ${subHeading} ${t.text}`}>{title}</h3>

      {items.length > 0 && (
        <ul className="space-y-2.5 max-w-175">
          {items.map((item) => (
            <li
              key={item}
              className={`flex items-start gap-2.5 text-size-base max-w-175`}
            >
              <span
                className={`size-3 mt-1.25 ${t.dotCover} rounded-full flex items-center justify-center`}
                aria-hidden="true"
              >
                <span
                  className={`size-1.5 rounded-full ${t.dot}`}
                  aria-hidden="true"
                />
              </span>
              {item}
            </li>
          ))}
        </ul>
      )}

      {/* Live links (jemon Lighthouse / PageSpeed report) */}
      {validLinks.length > 0 && (
        <div className="relative mt-space-6 space-y-space-3">
          <p className="text-size-base font-semibold">{linksTitle}</p>
          <div className="flex flex-wrap gap-space-2">
            {validLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button text={link.label} />
              </Link>
            ))}
          </div>
        </div>
      )}

      <i
        aria-hidden="true"
        className={`${icon ?? t.icon} pointer-events-none absolute right-0 bottom-0 text-[100px] opacity-10 ${t.iconColor}`}
      />
    </FadeUp>
  );
}

/** @param {{ title: string, className?: string, children: React.ReactNode }} props */
function Terminal({ title, className = "", children }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl bg-slate-900 text-slate-200 ${className}`}
    >
      <div className="flex items-center gap-space-3 border-b border-white/10 px-space-5 py-space-3">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="block size-3 rounded-full bg-red-400" />
          <span className="block size-3 rounded-full bg-amber-400" />
          <span className="block size-3 rounded-full bg-emerald-400" />
        </span>
        <span className="text-size-sm text-placeholder_2">{title}</span>
      </div>
      <div className="p-space-5 text-size-sm">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

/**
 * Top tag bar + switch button + title + description + CTA + image gallery.
 *
 * Text bam dik theke (FadeRight), gallery dan dik theke (FadeLeft) eshe
 * majhkhane milbe — pair kora layout-e ei combo-ta best.
 *
 * @param {{
 *   project: import("../../utils/projectViews").Project,
 *   view: "design" | "development",
 *   data: Record<string, any>,
 *   switchTo?: string,
 * }} props
 */
export function ProjectHero({ project, view, data, switchTo }) {
  const tags = data.tags ?? [];
  const description = data.description ?? project.description;

  const ctas =
    view === "development"
      ? [
          { label: "Live Preview", href: data.liveUrl },
          { label: "Source Code", href: data.githubUrl },
        ]
      : [{ label: "Case Study", href: data.caseStudyLink }];

  return (
    <header className="flex items-center gap-4.5 ">
      <FadeRight {...REVEAL} className="w-full">
        <h2 className="font-primary text-size-2xl font-semibold">
          {project.title}
        </h2>
        {description && (
          <p className="max-w-175 text-size-base text-placeholder_2 dark:text-placeholder/80 mt-space-3">
            {description}
          </p>
        )}
        <div className="flex flex-wrap gap-2.5 mt-space-5">
          {tags.map((item, i) => (
            <Chips varient="small" key={i} text={item} />
          ))}
        </div>
        <div className="flex flex-wrap gap-space-2 mt-space-6">
          {ctas
            .filter((cta) => cta.href)
            .map((cta) => {
              const isExternal = cta.href.startsWith("http");

              return (
                <Link
                  key={cta.label}
                  href={cta.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                >
                  <Button text={cta.label} />
                </Link>
              );
            })}

          {switchTo && (
            <ViewToggleButton
              to={switchTo}
              label={VIEW_META[switchTo].switchLabel}
            />
          )}
        </div>
      </FadeRight>
      <FadeLeft {...REVEAL} delay={0.12} className="mr-space-3">
        <ProjectImageGallery images={project.finalDesign?.images} />
      </FadeLeft>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Shared sections (design + development)                              */
/* ------------------------------------------------------------------ */

/** @param {{ overview?: { title?: string, description: string } }} props */
export function ProjectOverview({ overview }) {
  if (!overview) return null;

  return (
    <FadeUp as="section" {...REVEAL} className="space-y-space-2">
      <h3 className={subHeading}>{overview.title ?? "Project Overview"}</h3>
      <p className="max-w-4xl text-size-base text-placeholder_2 dark:text-placeholder/80 leading-6.25">
        {overview.description}
      </p>
    </FadeUp>
  );
}

/** @param {{ problems?: string[], solutions?: string[] }} props */
export function ProblemsSolutions({ problems, solutions }) {
  return (
    <div className="gap-space-6 flex flex-col xl:flex-row *:flex-1">
      <ListPanel title="Problems" items={problems} tone="danger" />
      <ListPanel
        title="Solutions"
        items={solutions}
        tone="success"
        delay={0.1}
      />
    </div>
  );
}

/**
 * @param {{ label?: string, intro?: string, steps?: JourneyStep[] }} props
 */
export function JourneySection({
  label = "Project Journey",
  intro,
  steps = [],
}) {
  if (!steps.length) return null;

  return (
    <section className="space-y-space-7">
      <FadeUp {...REVEAL}>
        <SectionIntro label={label}>{intro}</SectionIntro>
      </FadeUp>
      <ol className="grid gap-space-6 grid-cols-2 xl:grid-cols-3">
        {steps.map((step, index) => (
          <FadeUp
            as="li"
            key={step.title}
            {...REVEAL}
            delay={stagger(index)}
            className={`p-space-4 rounded-xl border border-primary-500/10 flex flex-col justify-between bg-primary-500/5`}
          >
            <div>
              <div className="flex items-center gap-2.5">
                <span className="rounded-full bg-primary-500/10 flex items-center justify-center size-7">
                  <i
                    className={`${step.icon} text-primary-500 text-size-sm`}
                    aria-hidden="true"
                  />
                </span>

                <h4 className="font-primary text-size-base font-semibold">
                  {step.title}
                </h4>
              </div>
              <p className="text-size-base text-placeholder_2 dark:text-placeholder/80 mt-2.5 mb-space-4">
                {step.subtitle}
              </p>
            </div>
            <Chips varient={"small"} text={step.duration} fullWidth />
          </FadeUp>
        ))}
      </ol>
    </section>
  );
}

/**
 * @param {{ title: string, finalDesign?: Record<string, any>, showTools?: boolean }} props
 */

export function FinalDesignSection({ title, finalDesign, showTools = false }) {
  const { description, tools = [], images = [] } = finalDesign ?? {};

  // Ensure every image has useful alt text
  const galleryImages = images.map((img, index) => ({
    ...img,
    alt:
      img.alt || `${title || "Project"} final design screenshot ${index + 1}`,
  }));

  return (
    <section className="space-y-space-6">
      {/* Section Intro + Tools */}
      <FadeUp
        {...REVEAL}
        className="flex items-start justify-between gap-space-8"
      >
        <SectionIntro label="Final Design">{description}</SectionIntro>

        {showTools && tools.length > 0 && (
          <div className="space-y-space-3 flex-1">
            <p className="text-size-base font-semibold">Tools used</p>

            <ul className="flex flex-wrap gap-space-3">
              {tools
                .filter((tool) => tool.logo)
                .map((tool) => (
                  <li key={tool.name} title={tool.name}>
                    <Image
                      src={tool.logo}
                      alt={`${tool.name} logo`}
                      width={32}
                      height={32}
                    />
                  </li>
                ))}
            </ul>
          </div>
        )}
      </FadeUp>

      {/* Interactive Project Gallery — boro element, tai amount kom */}
      {galleryImages.length > 0 && (
        <FadeUp {...REVEAL} delay={0.1} amount={0.1}>
          <ProjectGallery images={galleryImages} />
        </FadeUp>
      )}
    </section>
  );
}

/**
 * @param {{
 *   title?: string,
 *   pagePreviews?: {
 *     label?: string,
 *     description?: string,
 *     pages?: { name: string, desktop?: any, tablet?: any, mobile?: any }[],
 *   },
 * }} props
 */
export function PagePreviewSection({ title, pagePreviews }) {
  const { label = "Full Pages", description, pages = [] } = pagePreviews ?? {};

  const validPages = pages.filter(
    (p) => p?.desktop || p?.tablet || p?.mobile,
  );
  if (!validPages.length) return null;

  return (
    <section className="space-y-space-7">
      <div>
        <div className="flex flex-wrap items-start justify-between gap-space-4">
          <SectionIntro label={label}>{description}</SectionIntro>
          <Chips
            varient="small"
            text={`${validPages.length} ${validPages.length === 1 ? "page" : "pages"}`}
          />
        </div>
      </div>

      <div>
        <PagePreviewViewer pages={validPages} title={title} />
      </div>
    </section>
  );
}

/**
 * @param {{
 *   intro?: string,
 *   client?: {
 *     name: string,
 *     position?: string,
 *     image?: string,
 *     feedback?: { rating?: number, comment: string }[],
 *   },
 * }} props
 */
export function FeedbackSection({ intro, client }) {
  const feedback = client?.feedback ?? [];

  if (!client || !feedback.length) return null;

  return (
    <section className="space-y-space-7">
      <FadeUp {...REVEAL}>
        <SectionIntro label="Feedback">{intro}</SectionIntro>
      </FadeUp>

      <div className="mx-auto max-w-3xl space-y-space-3">
        {feedback.map((item, index) => (
          <FadeUp key={item.id ?? `${item.comment}-${index}`} {...REVEAL}>
            <FeedbackCard client={client} feedback={item} />
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
/** Sobar shesh e "Thank you for scrolling" box. (ScrollThanksBanner nijer animation handle kore, tai ekhane wrap kora hoyni) */
export function ProjectCTA({ caseStudyLink }) {
  return (
    <section>
      <ScrollThanksBanner caseStudyLink={caseStudyLink} />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Design-only sections                                                */
/* ------------------------------------------------------------------ */

/** @param {{ label?: string, colors: NamedColor[] }} props */
function SwatchRow({ label, colors }) {
  return (
    <FadeUp {...REVEAL} className="space-y-space-3">
      {label && <h4 className={subHeading}>{label}</h4>}

      <ul className="flex *:flex-1 rounded-full">
        {colors.map(({ name, code }, index) => (
          <li key={name} className="space-y-space-2 text-center">
            <span
              className={`flex h-18.5 items-center justify-center border border-black/10 ${
                index === 0
                  ? "rounded-l-full"
                  : index === colors.length - 1
                    ? "rounded-r-full"
                    : ""
              }`}
              style={{ backgroundColor: code }}
            >
              <Chips text={code} varient="small" code />
            </span>

            <span className="text-size-sm font-medium">{name}</span>
          </li>
        ))}
      </ul>
    </FadeUp>
  );
}

/**
 * @param {{ colors?: {
 *   description?: string,
 *   shades?: Record<string, string[]>,
 *   others?: NamedColor[],
 *   dark?: NamedColor[],
 * } }} props
 */
export function ColorsSection({ colors }) {
  if (!colors) return null;
  const { description, shades = {}, others = [], dark = [] } = colors;

  return (
    <section className="space-y-space-10 ">
      <FadeUp {...REVEAL}>
        <SectionIntro label="Colors">{description}</SectionIntro>
      </FadeUp>

      <div className="flex flex-wrap justify-center gap-space-10">
        {Object.entries(shades).map(([name, list], index) => (
          <FadeUp
            as="figure"
            key={name}
            {...REVEAL}
            delay={stagger(index)}
            className="flex flex-col items-center gap-7.5"
          >
            <ul className="flex">
              {list.map((hex) => (
                <li
                  key={hex}
                  title={hex}
                  style={{ backgroundColor: hex }}
                  className="ml-[-40px] size-[80px] rounded-full border-2 border-secondary-50 dark:border-background first:ml-0 "
                />
              ))}
            </ul>
            <figcaption className="text-xs font-medium capitalize">
              <Chips text={name} varient={"small"} />
            </figcaption>
          </FadeUp>
        ))}
      </div>

      {others.length > 0 && <SwatchRow colors={others} />}
      {dark.length > 0 && <SwatchRow label="Dark mode" colors={dark} />}
    </section>
  );
}

/**
 * @param {{ spacing?: {
 *   description?: string,
 *   scale?: { name: string, value: number }[],
 * } }} props
 */
export function SpacingSection({ spacing }) {
  if (!spacing?.scale?.length) return null;

  return (
    <FadeUp as="section" {...REVEAL} amount={0.15} className="space-y-space-7">
      <SectionIntro label="Spacing">{spacing.description}</SectionIntro>
      <ul className="grid gap-x-space-10 gap-y-space-3 sm:grid-cols-2 lg:grid-cols-3">
        {spacing.scale.map(({ name, value }) => (
          <li
            key={name}
            className="flex items-center justify-between gap-space-3 border-b border-secondary-500/15 pb-space-2 text-size-sm"
          >
            <span className="font-medium text-secondary-500 dark:text-secondary-700">
              {name}
            </span>
            <span className="flex items-center gap-space-3">
              <span
                aria-hidden="true"
                className="h-2 rounded-full bg-secondary-500/40 dark:text-secondary-700/40"
                style={{ width: Math.min(value, 120) }}
              />
              {value} px
            </span>
          </li>
        ))}
      </ul>
    </FadeUp>
  );
}

/**
 * @param {{ rounded?: {
 *   description?: string,
 *   scale?: { name: string, value: number, unit?: "px" | "%" }[],
 * } }} props
 */
export function RoundedSection({ rounded }) {
  if (!rounded?.scale?.length) return null;

  return (
    <FadeUp as="section" {...REVEAL} amount={0.15} className="space-y-space-7">
      <SectionIntro label="Rounded">{rounded.description}</SectionIntro>

      <ul className="grid gap-x-space-10 gap-y-space-3 sm:grid-cols-2 lg:grid-cols-3">
        {rounded.scale.map(({ name, value, unit = "px" }) => {
          // % radius (circle) hole preview square hobe, na hole circle ta oval dekhabe
          const isSquare = unit === "%";

          return (
            <li
              key={name}
              className="flex items-center justify-between gap-space-3 border-b border-secondary-500/15 pb-space-2 text-size-sm"
            >
              <span className="font-medium text-secondary-500 dark:text-secondary-700">
                {name}
              </span>

              <span className="flex items-center gap-space-3">
                {/* Fixed-width wrapper, jate sob row er alignment ek thake */}
                <span
                  aria-hidden="true"
                  className="flex h-9 w-14 items-center justify-center"
                >
                  <span
                    className={`block h-9 border-2 border-secondary-500/40 bg-secondary-500/15 ${
                      isSquare ? "w-9" : "w-14"
                    }`}
                    style={{ borderRadius: `${value}${unit}` }}
                  />
                </span>
                {value} {unit}
              </span>
            </li>
          );
        })}
      </ul>
    </FadeUp>
  );
}

/**
 * @param {{ fontSize?: {
 *   description?: string,
 *   device?: string,
 *   sampleText?: string,
 *   scale?: { name: string, value: number }[],
 * } }} props
 */
export function FontSizeSection({ fontSize }) {
  if (!fontSize?.scale?.length) return null;

  const {
    description,
    device,
    sampleText = "Design that feels simple",
    scale,
  } = fontSize;

  return (
    <FadeUp as="section" {...REVEAL} amount={0.15} className="space-y-space-7">
      <div className="flex flex-wrap items-start justify-between gap-space-4">
        <SectionIntro label="Font size">{description}</SectionIntro>
        {device && <Chips varient="small" text={device} />}
      </div>

      <ul>
        {scale.map(({ name, value }) => (
          <li
            key={name}
            className="grid items-center gap-x-space-6 gap-y-space-2 border-b border-secondary-500/15 py-space-4 text-size-sm sm:grid-cols-[9rem_1fr_4rem]"
          >
            <span className="font-medium text-secondary-500 dark:text-secondary-700">
              {name}
            </span>

            {/* Sample text oi font size-e. boro size hole truncate hobe, wrap korbe na */}
            <span
              aria-hidden="true"
              className="min-w-0 truncate font-primary font-semibold leading-tight"
              style={{ fontSize: value }}
            >
              {sampleText}
            </span>

            <span className="sm:text-right">{value} px</span>
          </li>
        ))}
      </ul>
    </FadeUp>
  );
}

/* ------------------------------------------------------------------ */
/* Lighthouse scores                                                   */
/* ------------------------------------------------------------------ */

const MAIN_SCORE = { key: "performance", label: "Performance" };

const OTHER_SCORES = [
  { key: "accessibility", label: "Accessibility" },
  { key: "bestPractices", label: "Best Practices" },
  { key: "seo", label: "SEO" },
];

const DEVICE_ICONS = {
  desktop: "fi fi-rr-screen",
  mobile: "fi fi-rr-mobile-button",
};

const LEGEND = [
  { color: "#0CCE6B", range: "90 – 100", label: "Perfect" },
  { color: "#FFA400", range: "50 – 89", label: "Needs improvement" },
  { color: "#FF4E42", range: "0 – 49", label: "Poor" },
];

/** Lighthouse standard: 90+ green, 50-89 orange, 0-49 red */
function scoreColor(score) {
  if (score >= 90) return "#0CCE6B";
  if (score >= 50) return "#FFA400";
  return "#FF4E42";
}

/**
 * @param {{ performanceScores?: {
 *   description?: string,
 *   testedOn?: string,
 *   reports?: {
 *     device: string,
 *     summary?: string,
 *     scores: { performance: number, accessibility: number, bestPractices: number, seo: number },
 *     agentic?: string,
 *     href?: string,
 *   }[],
 * } }} props
 */
export function PerformanceScoresSection({ performanceScores }) {
  const { description, testedOn, reports = [] } = performanceScores ?? {};
  if (!reports.length) return null;

  return (
    <section className="space-y-space-7">
      <FadeUp {...REVEAL}>
        <SectionIntro label="Lighthouse Scores">{description}</SectionIntro>
      </FadeUp>

      <div className="grid gap-space-6 lg:grid-cols-2">
        {reports.map(
          ({ device, summary, scores = {}, agentic, href }, index) => {
            const mainScore = scores[MAIN_SCORE.key];
            const mainColor = scoreColor(mainScore ?? 0);

            const available = [MAIN_SCORE, ...OTHER_SCORES].filter(
              ({ key }) => scores[key] != null,
            );
            const allGreen =
              available.length > 0 &&
              available.every(({ key }) => scores[key] >= 90);

            const tags = [
              "Lighthouse",
              "PageSpeed Insights",
              agentic && `Agentic Browsing ${agentic}`,
              testedOn && `Tested ${testedOn}`,
            ].filter(Boolean);

            return (
              <FadeUp
                key={device}
                {...REVEAL}
                delay={stagger(index)}
                className="h-full"
              >
                <article
                  className="
                    group relative h-full w-full overflow-hidden rounded-3xl

                    border border-[#D6EEF0]
                    bg-background/70

                    dark:border-white/[0.07]
                    dark:bg-[#0B1117]

                    transition-all duration-500
                    ease-[cubic-bezier(0.22,1,0.36,1)]

                    hover:-translate-y-1
                    hover:border-cyan-300
                    dark:hover:border-cyan-400/25
                  "
                >
                  {/* Ambient glow */}
                  <div
                    aria-hidden="true"
                    className="
                      pointer-events-none absolute -right-20 -top-20
                      size-48 rounded-full
                      bg-cyan-300/12 blur-3xl
                      dark:bg-cyan-400/[0.07]
                      transition-all duration-700
                      group-hover:scale-125 group-hover:bg-cyan-300/18
                      dark:group-hover:bg-cyan-400/12
                    "
                  />
                  <div
                    aria-hidden="true"
                    className="
                      pointer-events-none absolute -bottom-16 -left-16
                      size-36 rounded-full
                      bg-cyan-200/12 blur-3xl opacity-0
                      transition-all duration-700
                      group-hover:opacity-100
                      dark:bg-transparent
                    "
                  />

                  <div className="relative z-10 flex h-full flex-col justify-between gap-space-7 p-8">
                    {/* ---------- Header ---------- */}
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-space-3">
                        <div className="flex items-center gap-4">
                          <div
                            className="
                              relative flex size-14 shrink-0 items-center justify-center
                              overflow-hidden rounded-2xl
                              border border-cyan-200 text-cyan-600
                              shadow-[0_6px_18px_rgba(6,182,212,0.10)]
                              dark:border-cyan-400/15 dark:bg-cyan-400/6
                              dark:text-cyan-400 dark:shadow-none
                              transition-all duration-500
                              group-hover:rotate-1 group-hover:scale-105
                              group-hover:border-cyan-300
                              group-hover:shadow-[0_10px_25px_rgba(6,182,212,0.16)]
                              dark:group-hover:border-cyan-400/30
                              dark:group-hover:bg-cyan-400/10
                              dark:group-hover:shadow-[0_0_25px_rgba(34,211,238,0.10)]
                            "
                          >
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute inset-0 bg-cyan-400/6 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100"
                            />
                            <i
                              aria-hidden="true"
                              className={`${DEVICE_ICONS[device.toLowerCase()] ?? "fi fi-rr-browser"} relative z-10 text-[23px]`}
                            />
                          </div>

                          <div className="min-w-0">
                            <h4 className="font-primary text-size-lg font-semibold leading-tight tracking-[-0.02em] text-foreground">
                              {device}
                            </h4>
                            <p className="mt-2 font-mono text-size-xs_2 font-medium capitalize tracking-[0.03em] text-cyan-700 dark:text-cyan-400/80">
                              Google PageSpeed Insights
                            </p>
                          </div>
                        </div>

                        {allGreen && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0CCE6B]/20 bg-[#0CCE6B]/10 px-space-3 py-1 text-size-sm font-medium text-[#0CCE6B]">
                            <span
                              aria-hidden="true"
                              className="size-1.5 rounded-full bg-[#0CCE6B]"
                            />
                            All scores in Perfect
                          </span>
                        )}
                      </div>

                      {summary && (
                        <p className="mt-7 max-w-155 text-size-sm leading-7 tracking-wide text-slate-600 dark:text-slate-300">
                          {summary}
                        </p>
                      )}
                    </div>

                    {/* ---------- Score rings ---------- */}
                    <div className="rounded-2xl border border-cyan-100 bg-white/60 p-space-5 dark:border-white/8 dark:bg-white/2.5">
                      <div className="flex items-center gap-space-7">
                        {mainScore != null && (
                          <div className="relative shrink-0">
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute inset-0 rounded-full opacity-25 blur-2xl"
                              style={{ backgroundColor: mainColor }}
                            />
                            <ul className="relative">
                              <ScoreRing
                                score={mainScore}
                                label={MAIN_SCORE.label}
                                color={mainColor}
                                size={136}
                                strokeWidth={9}
                                featured
                              />
                            </ul>
                          </div>
                        )}

                        <span
                          aria-hidden="true"
                          className="hidden h-24 w-px shrink-0 bg-cyan-200/60 dark:bg-white/10 sm:block"
                        />

                        <ul className="flex w-full flex-wrap flex-1 gap-space-5 items-center justify-center">
                          {OTHER_SCORES.filter(
                            ({ key }) => scores[key] != null,
                          ).map(({ key, label }) => (
                            <ScoreRing
                              key={key}
                              score={scores[key]}
                              label={label}
                              color={scoreColor(scores[key])}
                              size={72}
                              strokeWidth={6}
                            />
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* ---------- Tags + CTA ---------- */}
                    <div>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, i) => (
                          <span
                            key={tag}
                            style={{ animationDelay: `${i * 120}ms` }}
                            className="
                              rounded-lg border border-cyan-100 bg-white/80
                              px-3 py-1.5
                              font-primary text-[11px] font-medium tracking-wide text-slate-600
                              shadow-[0_2px_8px_rgba(15,118,110,0.04)]
                              transition-all duration-300
                              group-hover:animate-tag-wave
                              motion-reduce:group-hover:animate-none
                              hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700
                              dark:border-white/8 dark:bg-white/2.5 dark:text-slate-300 dark:shadow-none
                              dark:hover:border-cyan-400/15 dark:hover:bg-cyan-400/[0.035] dark:hover:text-slate-200
                            "
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {href && (
                        <Link
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Check live ${device} performance report`}
                          className="
                            group/cta mt-7 inline-flex items-center gap-2.5
                            font-primary text-size-sm font-semibold
                            text-slate-800 dark:text-foreground
                            transition-all duration-300
                            group-hover:gap-3.5
                          "
                        >
                          <span className="opacity-80 transition-opacity duration-300 group-hover/cta:opacity-100 dark:opacity-40">
                            Check live {device.toLowerCase()} performance
                          </span>

                          <span
                            className="
                              flex size-7 items-center justify-center rounded-full
                              border border-cyan-200 bg-cyan-50 text-cyan-700
                              transition-all duration-300
                              group-hover/cta:border-cyan-300 group-hover/cta:bg-cyan-100
                              group-hover/cta:shadow-[0_5px_15px_rgba(6,182,212,0.12)]
                              dark:border-white/10 dark:bg-white/[0.035] dark:text-cyan-400
                              dark:group-hover/cta:border-cyan-400/20
                              dark:group-hover/cta:bg-cyan-400/8
                              dark:group-hover/cta:shadow-none
                            "
                          >
                            <i
                              aria-hidden="true"
                              className="fi fi-rr-arrow-small-right text-[13px] transition-transform duration-300 group-hover/cta:translate-x-0.5"
                            />
                          </span>
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              </FadeUp>
            );
          },
        )}
      </div>

      {/* Legend */}
      <FadeUp {...REVEAL} delay={0.1}>
        <ul className="flex flex-wrap items-center justify-center gap-x-space-6 gap-y-space-2 text-size-sm text-placeholder_2 dark:text-placeholder/80">
          {LEGEND.map(({ color, range, label }) => (
            <li key={range} className="flex items-center gap-space-2">
              <span
                aria-hidden="true"
                className="size-2.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="font-medium">{range}</span>
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </FadeUp>
    </section>
  );
}

/**
 * @param {{
 *   intro?: string,
 *   fonts?: { fontName: string, usedFor: string, weights?: string[] }[],
 * }} props
 */
export function TypographySection({ intro, fonts = [] }) {
  if (!fonts.length) return null;

  return (
    <section className="space-y-space-7">
      <FadeUp {...REVEAL}>
        <SectionIntro label="Typography">{intro}</SectionIntro>
      </FadeUp>
      {/* TypographyCard nijei <li> render kore, tai card-e na diye pura grid-ta ek shathe animate kora hoyeche */}
      <FadeUp
        as="ul"
        {...REVEAL}
        delay={0.08}
        amount={0.15}
        className="grid gap-space-6 md:grid-cols-2"
      >
        {fonts.map(({ fontName, usedFor, weights = [] }) => {
          const fontFamily = `"${fontName}", sans-serif`;
          return (
            <TypographyCard
              usedFor={usedFor}
              weights={weights}
              key={fontName}
              fontName={fontName}
            />
          );
        })}
      </FadeUp>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Development-only sections                                           */
/* ------------------------------------------------------------------ */

/**
 * @param {{ intro?: string, stack?: { title: string, items: string[] }[] }} props
 */

export function StackSection({ intro, stack = [] }) {
  if (!stack.length) return null;

  return (
    <section className="space-y-space-7">
      <FadeUp {...REVEAL}>
        <SectionIntro label="Stack">{intro}</SectionIntro>
      </FadeUp>

      <div className="grid gap-7 grid-cols-2">
        {stack.map(({ title, items }, index) => (
          <FadeUp
            key={title}
            {...REVEAL}
            delay={stagger(index)}
            className="
              w-full rounded-2xl
              border-2 border-secondary-500
              bg-secondary-50
              dark:bg-secondary-900/10
              dark:border-secondary-500/20
              shadow-[4px_4px_0px_rgba(34,211,238,1)]
              dark:shadow-[4px_4px_0px_rgba(34,211,238,0.2)]
              p-space-7
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
              <h4 className="text-size-lg font-medium opacity-60 tracking-wider uppercase">
                {title}
              </h4>
            </div>

            {/* Technology Items */}
            <ul className="mt-6.5 flex flex-wrap gap-space-3">
              {items.map((item) => (
                <li key={item}>
                  <Chips text={item} />
                </li>
              ))}
            </ul>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
/**
 * @param {{
 *   intro?: string,
 *   routes?: { method: string, path: string, note?: string }[],
 * }} props
 */
export function ApiRoutesSection({ intro, routes = [] }) {
  if (!routes.length) return null;

  return (
    <FadeUp as="section" {...REVEAL} amount={0.15} className="space-y-space-7">
      <SectionIntro label="API Routes">{intro}</SectionIntro>
      <Terminal title="api / routes">
        <ul className="space-y-space-3 font-mono">
          {routes.map(({ method, path, note }) => (
            <li
              key={`${method}-${path}`}
              className="grid gap-x-space-3 gap-y-1 grid-cols-[4rem_15rem_1fr]"
            >
              <span
                className={`font-semibold ${METHOD_COLORS[method] ?? "text-slate-300"}`}
              >
                {method}
              </span>
              <span>{path}</span>
              {note && <span className="text-slate-500">{`// ${note}`}</span>}
            </li>
          ))}
        </ul>
      </Terminal>
    </FadeUp>
  );
}

/**
 * @param {{
 *   intro?: string,
 *   collections?: { name: string, fields: string[] }[],
 * }} props
 */
export function DataModelSection({ intro, collections = [] }) {
  if (!collections.length) return null;

  return (
    <section className="space-y-space-7">
      <FadeUp {...REVEAL}>
        <SectionIntro label="Data model">{intro}</SectionIntro>
      </FadeUp>
      <div className="grid gap-space-6 grid-cols-2">
        {collections.map(({ name, fields = [] }, index) => (
          <FadeUp key={name} {...REVEAL} delay={stagger(index)}>
            <Terminal title={name} className="h-full">
              <ul className="flex flex-wrap gap-space-3">
                {fields.map((field) => (
                  <Chips key={field} text={field} varient={"small"} code />
                ))}
              </ul>
            </Terminal>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

/**
 * Every project except the one being viewed (no category filter).
 * Starts with the projects after the current one and wraps around,
 * so each project page shows the "next" project first.
 * @param {string} currentSlug
 */
function getOtherProjects(currentSlug) {
  const index = projectsData.findIndex(
    (project) => project.slug === currentSlug,
  );
  if (index === -1) return projectsData;

  return [...projectsData.slice(index + 1), ...projectsData.slice(0, index)];
}

/**
 * "Other Projects" section for the bottom of a project details page.
 * Shows every project except the one currently open.
 *
 * @param {{ currentSlug: string, className?: string }} props
 */
export function OtherProjects({ currentSlug, className = "" }) {
  const projects = getOtherProjects(currentSlug);
  if (projects.length === 0) return null;

  return (
    <section aria-labelledby="other-projects-heading" className={className}>
      <FadeUp {...REVEAL}>
        <SectionIntro label="Other Projects">
          More of my UI UX design and full stack development work.
        </SectionIntro>
      </FadeUp>
      <div className="mt-space-6">
        {projects.length > 0 && (
          <Carousel resetKey={currentSlug} label="projects">
            {projects.map((project, index) => {
              const { title, tags = [], slug } = project;

              const image =
                project?.finalDesign?.coverImage?.src ||
                project?.finalDesign?.images?.[0]?.src ||
                "/placeholder.jpg";

              return (
                <ProjectCard
                  key={project.id || slug}
                  image={image}
                  title={title || "No title"}
                  tags={tags}
                  slug={slug}
                  index={index}
                />
              );
            })}
          </Carousel>
        )}
      </div>
    </section>
  );
}
