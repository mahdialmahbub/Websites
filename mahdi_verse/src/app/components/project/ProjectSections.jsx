import Image from "next/image";
import Link from "next/link";
import { VIEW_META } from "../../utils/projectViews";
import { HeroGallery, ViewToggleButton } from "./ProjectViewClient";
import Chips from "../Chips";
import Button from "../Button";
import ProjectImageGallery from "./ProjectImageGallery";
import TypographyCard from "./TypographyCard";
import ScrollThanksBanner from "./ScrollThanksBanner";
import FeedbackCard from "./FeedbackCard";
import ProjectGallery from "./ProjectGallery";

// "Have a project idea?" button er link. apnar contact page er route diye din
const CONTACT_HREF = "/contact";

const card = "rounded-2xl bg-secondary-50 dark:bg-secondary-500/5";
const chip =
  "rounded-full bg-secondary-500/10 px-space-3 py-1 text-xs font-medium text-secondary-500";
const subHeading = "font-primary text-[20px] font-semibold";

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
    dotCover: "bg-[#E30000]/10",
    dot: "bg-[#E30000]",
    icon: "fi fi-rr-problem-solving",
  },
  success: {
    box: "bg-[#00E300]/5",
    border: "border-[#00E300]/10",
    iconColor: "text-[#00E300]",
    dotCover: "bg-[#00E300]/10",
    dot: "bg-[#00E300]",
    icon: "fi fi-rr-lightbulb-on",
  },
  info: {
    box: "bg-[#22D3EE]/5",
    border: "border-[#22D3EE]/10",
    iconColor: "text-[#22D3EE]",
    dotCover: "bg-[#22D3EE]/10",
    dot: "bg-[#22D3EE]",
    icon: "fi fi-rr-interactive",
  },
  brand: {
    box: "bg-[#6C63FF]/5",
    border: "border-[#6C63FF]/10",
    iconColor: "text-[#6C63FF]",
    dotCover: "bg-[#6C63FF]/10",
    dot: "bg-[#6C63FF]",
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

// hex dekhe bujhe nei background halka na dark, jate upor-er text porar moto thake (6 digit hex dhore)
const isLight = (hex = "#000000") => {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
};

const isExternal = (href = "") => /^https?:\/\//.test(href);

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

/** @param {{ label: string, children?: React.ReactNode }} props */
export function SectionIntro({ label, children }) {
  return (
    <div className="space-y-space-2">
      <h4 className="font-primary text-size-lg font-semibold">{label}</h4>
      {children && (
        <p
          className={`max-w-3xl text-size-base text-placeholder_2 dark:text-placeholder/80 leading-6.25`}
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
 * }} props
 */
export function ListPanel({ title, items = [], tone = "info", icon }) {
  if (!items.length) return null;
  const t = TONES[tone];

  return (
    <section
      className={`relative overflow-hidden rounded-2xl p-space-6 ${t.box} border ${t.border} shadow-[0_1px_4px_rgba(16,24,40,0.10),0_1px_4px_rgba(248,250,252,1)] dark:shadow-none`}
    >
      <h3 className={`mb-space-4 ${subHeading} ${t.text}`}>{title}</h3>
      <ul className="space-y-space-2 pr-space-10">
        {items.map((item) => (
          <li key={item} className={`flex items-start gap-2.5 text-size-base`}>
            <span
              className={`size-3 mt-1 ${t.dotCover} rounded-full flex items-center justify-center`}
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
      <i
        aria-hidden="true"
        className={`${icon ?? t.icon} pointer-events-none absolute right-0 bottom-0 text-[100px] opacity-15 ${t.iconColor}`}
      />
    </section>
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
        <span className="font-mono text-xs text-slate-400">{title}</span>
      </div>
      <div className="p-space-5">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

/**
 * Top tag bar + switch button + title + description + CTA + image gallery.
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
    <header className="flex items-center gap-[18px] ">
      <div className="w-full">
        <h2 className="font-primary text-size-2xl font-semibold">
          {project.title}
        </h2>
        {description && (
          <p className="max-w-xl text-size-base text-placeholder_2 dark:text-placeholder/80 font-medium mt-space-3">
            {description}
          </p>
        )}
        <ul className="flex flex-wrap gap-2.5 mt-space-5">
          {tags.map((item, i) => (
            <Chips varient="small" key={i} text={item} />
          ))}
        </ul>
        <div className="flex flex-wrap gap-space-2 mt-space-7">
          {ctas
            .filter((cta) => cta.href)
            .map((cta) => (
              <Link key={cta.label} href={cta.href}>
                <Button text={cta.label} />
              </Link>
            ))}

          {switchTo && (
            <ViewToggleButton
              to={switchTo}
              label={VIEW_META[switchTo].switchLabel}
            />
          )}
        </div>
      </div>
      <div className="mr-space-3">
        <ProjectImageGallery images={project.finalDesign?.images} />
      </div>
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
    <section className="space-y-space-2">
      <h3 className={subHeading}>{overview.title ?? "Project Overview"}</h3>
      <p className="max-w-4xl text-size-base text-placeholder_2 dark:text-placeholder/80 leading-6.25">
        {overview.description}
      </p>
    </section>
  );
}

/** @param {{ problems?: string[], solutions?: string[] }} props */
export function ProblemsSolutions({ problems, solutions }) {
  return (
    <div className="space-y-space-6">
      <ListPanel title="Problems" items={problems} tone="danger" />
      <ListPanel title="Solutions" items={solutions} tone="success" />
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
      <SectionIntro label={label}>{intro}</SectionIntro>
      <ol className="grid gap-space-6 grid-cols-3 p-space-5">
        {steps.map((step) => (
          <li
            key={step.title}
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
          </li>
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
      <div className="flex flex-wrap items-start justify-between gap-space-6">
        <SectionIntro label="Final Design">{description}</SectionIntro>

        {showTools && tools.length > 0 && (
          <div className="space-y-space-2">
            <p className="text-size-sm font-semibold">Tools used</p>

            <ul className="flex flex-wrap gap-space-3">
              {tools
                .filter((tool) => tool.logo)
                .map((tool) => (
                  <li key={tool.name} title={tool.name}>
                    <Image
                      src={tool.logo}
                      alt={`${tool.name} logo`}
                      width={28}
                      height={28}
                    />
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>

      {/* Interactive Project Gallery */}
      {galleryImages.length > 0 && <ProjectGallery images={galleryImages} />}
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
    <section className="space-y-space-7 pb-space-5">
      <SectionIntro label="Feedback">{intro}</SectionIntro>

      <div className="mx-auto max-w-3xl space-y-space-3">
        {feedback.map((item, index) => (
          <FeedbackCard
            key={item.id ?? `${item.comment}-${index}`}
            client={client}
            feedback={item}
          />
        ))}
      </div>
    </section>
  );
}
/** Sobar shesh e "Thank you for scrolling" box. */
export function ProjectCTA() {
  return (
    <section>
      <ScrollThanksBanner />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Design-only sections                                                */
/* ------------------------------------------------------------------ */

/** @param {{ label?: string, colors: NamedColor[] }} props */
function SwatchRow({ label, colors }) {
  return (
    <div className="space-y-space-3">
      {label && <h4 className={subHeading}>{label}</h4>}

      <ul className="flex *:flex-1 rounded-full">
        {colors.map(({ name, code }, index) => (
          <li key={name} className="space-y-space-2 text-center">
            <span
              className={`flex h-[74px] items-center justify-center border border-black/10 ${
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
    </div>
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
    <section className="space-y-space-10">
      <SectionIntro label="Colors">{description}</SectionIntro>

      <div className="flex flex-wrap justify-center gap-space-10">
        {Object.entries(shades).map(([name, list]) => (
          <figure key={name} className="flex flex-col items-center gap-7.5">
            <ul className="flex">
              {list.map((hex) => (
                <li
                  key={hex}
                  title={hex}
                  style={{ backgroundColor: hex }}
                  className="ml-[-40px] size-[80px] rounded-full border-2 border-background first:ml-0 "
                />
              ))}
            </ul>
            <figcaption className="text-xs font-medium capitalize">
              <Chips text={name} varient={"small"} />
            </figcaption>
          </figure>
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
    <section className="space-y-space-7">
      <SectionIntro label="Spacing">{spacing.description}</SectionIntro>
      <ul className="grid gap-x-space-10 gap-y-space-3 sm:grid-cols-2 lg:grid-cols-3">
        {spacing.scale.map(({ name, value }) => (
          <li
            key={name}
            className="flex items-center justify-between gap-space-3 border-b border-secondary-500/15 pb-space-2 text-size-sm"
          >
            <span className="font-medium text-secondary-500">{name}</span>
            <span className="flex items-center gap-space-3">
              <span
                aria-hidden="true"
                className="h-2 rounded-full bg-secondary-500/40"
                style={{ width: Math.min(value, 120) }}
              />
              {value} px
            </span>
          </li>
        ))}
      </ul>
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
      <SectionIntro label="Typography">{intro}</SectionIntro>
      <ul className="grid gap-space-6 md:grid-cols-2">
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
      </ul>
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
      <SectionIntro label="Stack">{intro}</SectionIntro>

      <div className="grid gap-7 grid-cols-2">
        {stack.map(({ title, items }) => (
          <div
            key={title}
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
              <h2 className="text-size-lg font-bold tracking-tight uppercase">
                {title}
              </h2>
            </div>

            {/* Technology Items */}
            <ul className="mt-6.5 flex flex-wrap gap-space-3">
              {items.map((item) => (
                <li key={item}>
                  <Chips text={item} />
                </li>
              ))}
            </ul>
          </div>
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
    <section className="space-y-space-8">
      <SectionIntro label="API Routes">{intro}</SectionIntro>
      <Terminal title="api / routes">
        <ul className="space-y-space-3 font-mono text-xs">
          {routes.map(({ method, path, note }) => (
            <li
              key={`${method}-${path}`}
              className="grid gap-x-space-3 gap-y-1 sm:grid-cols-[4rem_15rem_1fr]"
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
    </section>
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
    <section className="space-y-space-8">
      <SectionIntro label="Data model">{intro}</SectionIntro>
      <div className="grid gap-space-6 sm:grid-cols-2">
        {collections.map(({ name, fields = [] }) => (
          <Terminal key={name} title={name}>
            <ul className="flex flex-wrap gap-space-3">
              {fields.map((field) => (
                <li
                  key={field}
                  className="rounded-full bg-white/10 px-space-3 py-1 font-mono text-xs"
                >
                  {field}
                </li>
              ))}
            </ul>
          </Terminal>
        ))}
      </div>
    </section>
  );
}
