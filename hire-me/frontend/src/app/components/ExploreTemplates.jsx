"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useGetBuilderTemplatesQuery } from "@/store/api/catalogApi";
import TemplateCard from "./templates/TemplateCard";
import TemplateCarousel from "./templates/TemplateCarousel";

// One carousel for every page.
//  - Without props (my-resume): loads the builder templates itself, first 10, links to the builder.
//  - With `templates` (create-resume): shows exactly that list, in that order, and works as a picker
//    (`selectedSlug` + `onSelect`), with `recommendedSlugs` flagged as recommended.
const DEFAULT_LIMIT = 10;

export default function ExploreTemplates({
  templates: provided,
  limit = DEFAULT_LIMIT,
  recommendedSlugs,
  selectedSlug,
  onSelect,
  startAt = 1,
  resetKey, // change it to send the carousel back to its start (e.g. when the order changed)
  showViewAll = true,
  label = "Resume templates",
  color, // resume colour, so the previews match what the builder will show
  bleed = true, // true: cancel the page's side padding (full-width pages). false: stay inside the box (dialogs)
}) {
  // the query is skipped when the page passes its own list
  const { data } = useGetBuilderTemplatesQuery(undefined, { skip: Boolean(provided) });
  const source = provided ?? data;

  const { items, categories } = useMemo(() => {
    const list = (source ?? []).slice(0, limit);
    const recommended = new Set(recommendedSlugs ?? []);

    // filter pills come from the templates themselves (unique categories, in order of appearance)
    const seen = new Map();
    for (const t of list) {
      if (t.category && !seen.has(t.category.slug)) {
        seen.set(t.category.slug, { slug: t.category.slug, name: t.category.name });
      }
    }

    return {
      categories: [...seen.values()],
      items: list.map((t) => {
        const isRecommended = recommended.has(t.slug);
        return {
          key: t.slug,
          category: t.category?.slug ?? null,
          recommended: isRecommended,
          node: (
            <TemplateCard
              template={t}
              recommended={isRecommended}
              selected={t.slug === selectedSlug}
              onSelect={onSelect}
              color={color}
            />
          ),
        };
      }),
    };
  }, [source, limit, recommendedSlugs, selectedSlug, onSelect, color]);

  if (items.length === 0) return null;

  return (
    <section aria-label={label} className="flex flex-col items-center *:min-w-[320px] *:max-w-300">
      {/* On pages the wrapper cancels the page's side padding, so the cards run edge to edge like on the home page. */}
      <div className={bleed ? "w-[calc(100%+2*var(--page-pad))] [--page-pad:clamp(1.5rem,calc(2.254vw+0.972rem),3rem)]" : "w-full"}>
        <TemplateCarousel key={resetKey} categories={categories} items={items} startAt={startAt} padded={false} />
      </div>

      {showViewAll && (
        <Link
          href="/templates"
          className="mt-[clamp(1.5rem,calc(1.127vw+1.236rem),2.25rem)] inline-flex h-11 items-center justify-center rounded-lg bg-violet-500/5 px-4 text-small font-medium text-violet-500 hover:bg-violet-500/10"
        >
          View all templates
        </Link>
      )}
    </section>
  );
}
