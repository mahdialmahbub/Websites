import Link from "next/link";
import { categoryPath, templatePath } from "@/lib/catalog";
import TemplateThumb from "./TemplateThumb";

// One card for every place a template is shown. The design is TemplateCard's.
//
// "Active" look (colour thumbnail + title, description and buttons visible) is pure CSS, driven by a
// `data-active="true"` ancestor that has the `group/slide` class:
//  - inside the carousel: the <li className="group/slide" data-active="true|false"> wrapper does it
//    (leave `alwaysActive` off) and the width comes from the carousel's --card-w variable.
//  - everywhere else (listing / category pages): pass `alwaysActive`. The card then becomes its own
//    `group/slide` with data-active="true", has its own fluid width, and everything is visible, which
//    also keeps the title / category / preview links visible (and crawlable) in the plain HTML.
//
// Two ways to use "Use This":
//  - link mode (default): links to the builder.
//  - select mode: pass `onSelect`; "Use This" selects the template instead and the page keeps the choice.
//    `selected` marks the chosen card. Preview opens in a new tab so the form is not lost.
//    (`onSelect` is a function, so only pass it from a client component.)
//
// No "use client" here: with no `onSelect` it renders on the server, so the listing pages stay plain HTML.

/**
 * @typedef {Object} TemplateCardTemplate
 * @property {string} slug - Used for the preview link, the builder link and the select callback.
 * @property {string} name - Template name (title link + thumbnail alt).
 * @property {string} [description] - Short text, clamped to 2 lines.
 * @property {{ slug: string, name: string }} [category] - Shows the category link at the top right.
 */

/**
 * @typedef {Object} TemplateCardProps
 * @property {TemplateCardTemplate} template - The template to show.
 * @property {boolean} [alwaysActive=false] - Use outside the carousel: colour thumbnail and all details always visible, with its own width.
 * @property {boolean} [recommended=false] - Shows the "Recommended" badge at the top left.
 * @property {boolean} [selected=false] - Marks this card as the chosen one (select mode).
 * @property {(slug: string) => void} [onSelect] - Turns "Use This" into a select button (select mode).
 * @property {string} [color] - Accent colour passed to the thumbnail.
 */

const REVEAL =
  "invisible opacity-0 transition-[opacity,translate,visibility] duration-300 motion-reduce:transition-none " +
  "group-data-[active=true]/slide:visible group-data-[active=true]/slide:translate-y-0 group-data-[active=true]/slide:opacity-100";

const FOCUS =
  "outline-none focus-visible:ring-[3px] focus-visible:ring-indigo-300";

const CARD =
  "relative aspect-210/297 overflow-hidden rounded-[clamp(0.625rem,calc(0.727vw+0.455rem),1rem)] border bg-white transition-[border-color,box-shadow] duration-300";

const WIDTH_IN_CAROUSEL = "w-(--card-w)";
const WIDTH_STANDALONE =
  "group/slide w-[clamp(13.125rem,calc(4.242vw+12.131rem),15.3125rem)]";

function EyeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 5 5L20 7" />
    </svg>
  );
}

/** @param {TemplateCardProps} props */
export default function TemplateCard({
  template,
  alwaysActive = false,
  recommended = false,
  selected = false,
  onSelect,
  color,
}) {
  const { slug, name, description, category } = template;
  const selectMode = typeof onSelect === "function";

  // select mode keeps the page (and the form on it), so preview opens in a new tab
  const newTab = selectMode ? { target: "_blank", rel: "noopener" } : {};

  return (
    <article
      data-active={alwaysActive ? "true" : undefined}
      className={`${CARD} ${alwaysActive ? WIDTH_STANDALONE : WIDTH_IN_CAROUSEL} ${
        selected
          ? "border-indigo-500 ring-2 ring-indigo-500"
          : "border-neutral-500/10 shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
      }`}
    >
      {/* black & white until the card is the active one (or the chosen one) */}
      <TemplateThumb
        slug={slug}
        name={name}
        color={color}
        className={`absolute inset-0 transition-[filter] duration-300 motion-reduce:transition-none group-data-[active=true]/slide:grayscale-0 ${selected ? "" : "grayscale"}`}
      />

      {recommended && (
        <span className="absolute left-2.5 top-2.5 z-10 rounded-sm bg-indigo-600/90 px-space-3 py-space-2 font-primary text-[12px] font-semibold text-white backdrop-blur-xs sm:rounded-lg">
          Recommended
        </span>
      )}

      {category && (
        <Link
          href={categoryPath(category.slug)}
          className={`absolute right-2.5 top-2.5 z-10 rounded-sm bg-violet-900/60 px-space-3 py-space-2 font-primary text-[12px] font-semibold text-violet-50 backdrop-blur-xs hover:bg-violet-900/80 sm:rounded-lg ${REVEAL}`}
        >
          {category.name}
        </Link>
      )}

      <div
        className={`absolute bottom-2 left-2 right-2 z-10 translate-y-2 rounded-lg bg-linear-to-b from-black/50 to-black p-2.5 text-neutral-50 shadow-[0_0_4px_rgba(0,0,0,1)] ${REVEAL}`}
      >
        <h3 className="mb-space-1 font-primary text-[clamp(0.875rem,calc(0.242vw+0.818rem),1rem)] font-semibold">
          <Link href={templatePath(slug)} className="hover:underline" {...newTab}>
            {name}
          </Link>
        </h3>

        {description && (
          <p className="mb-space-3 line-clamp-2 w-full text-[12px] opacity-80">
            {description}
          </p>
        )}

        <div className="flex items-stretch gap-2.5">
          <Link
            href={templatePath(slug)}
            aria-label={`Preview the ${name} template`}
            className={`inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-blue-500 transition-colors hover:bg-blue-500/20 ${FOCUS}`}
            {...newTab}
          >
            <EyeIcon />
          </Link>

          {selectMode ? (
            <button
              type="button"
              aria-pressed={selected}
              aria-label={`${selected ? "Selected:" : "Select the"} ${name} template`}
              onClick={() => onSelect(slug)}
              className={`inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg px-3 text-[14px] font-medium transition-colors ${FOCUS} ${
                selected
                  ? "bg-indigo-500 text-white"
                  : "text-indigo-400 hover:bg-indigo-400/15"
              }`}
            >
              {selected && <CheckIcon />}
              {selected ? "Selected" : "Use This"}
            </button>
          ) : (
            // /builder is for people, not for search results
            <Link
              href={`/builder?template=${encodeURIComponent(slug)}`}
              rel="nofollow"
              aria-label={`Use the ${name} template`}
              className={`inline-flex h-9 flex-1 items-center justify-center rounded-lg px-3 text-[14px] font-medium text-indigo-400 transition-colors hover:bg-indigo-400/15 ${FOCUS}`}
            >
              Use This
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
