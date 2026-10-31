"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import ExploreTemplates from "../components/ExploreTemplates";
import { useSelectableTemplates } from "../components/builder/useSelectableTemplates";
import { useEnrichedTemplates } from "../components/builder/useEnrichedTemplates";
import { recommendTemplates } from "@/lib/templateRecommendations";
import { DEFAULT_TEMPLATE_ID } from "@/resume/templates/registry";
import { useGetMeQuery } from "@/store/api/authApi";

const TITLE_MAX = 100;
// Wait a moment after the last keystroke before re-ranking, so the carousel does not jump on every letter.
const RECOMMEND_DELAY = 300;

function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

/**
 * "Create a Resume": a title and a template, then the builder opens with both.
 * Nothing is saved yet: the resume is created by the first autosave, once there is something to keep.
 * Open to guests too (this is where a guest lands after generating a resume).
 *
 * The template list is re-ordered by the typed title: matching templates come first and are flagged
 * "Recommended", every other template stays reachable.
 */
const Page = () => {
  const router = useRouter();
  const { data: user } = useGetMeQuery();
  const { options, isLoading, isError, refetch } = useSelectableTemplates();

  const [title, setTitle] = useState("");
  const [picked, setPicked] = useState(null);
  const debouncedTitle = useDebouncedValue(title, RECOMMEND_DELAY);

  const templates = useEnrichedTemplates(options);

  const recommendation = useMemo(
    () => recommendTemplates(debouncedTitle, templates),
    [debouncedTitle, templates],
  );

  // An explicit pick always wins. Until the user picks, the best recommendation (or the default template) is selected.
  const fallback = options.some((option) => option.slug === DEFAULT_TEMPLATE_ID)
    ? DEFAULT_TEMPLATE_ID
    : options[0]?.slug;
  const selected = picked ?? recommendation.topSlug ?? fallback;

  // Start on the best recommendation; without one, on the selected template.
  const startAt = recommendation.hasMatch
    ? 0
    : Math.max(
        0,
        recommendation.ordered.findIndex(
          (template) => template.slug === selected,
        ),
      );
  const resetKey = recommendation.recommendedSlugs.join("|");

  const typed = debouncedTitle.trim();
  const hint = !typed
    ? "Type your resume title and we will recommend matching templates."
    : recommendation.hasMatch
      ? `Recommended for “${typed}”. You can still browse and pick any template.`
      : `No specific match for “${typed}”. Showing all templates.`;

  const create = (event) => {
    event.preventDefault();
    if (!selected) return;
    const query = new URLSearchParams({ template: selected });
    if (title.trim()) query.set("title", title.trim());
    router.push(`/builder?${query}`);
  };

  return (
    <main className="px-[clamp(1.5rem,calc(2.254vw+0.972rem),3rem)] py-[clamp(1.5rem,calc(0.751vw+1.324rem),2rem)] gap-[clamp(2rem,calc(1.502vw+1.648rem),3rem)] md:max-w-200 md:mx-auto min-w-[320px] md:rounded-xl md:border md:border-neutral-500/20 md:my-[32px] overflow-hidden">
      <h1 className="text-[clamp(1.625rem,calc(0.939vw+1.405rem),2.25rem)] font-primary font-semibold mb-[clamp(0.5rem,calc(0.376vw+0.412rem),0.75rem)]">
        Create a Resume
      </h1>
      <p className="text-body mb-space-7 text-neutral-500">
        Enter a title for your resume and pick a template. You can change the
        template later and your content stays.
      </p>

      <form onSubmit={create} noValidate>
        <Input
          label="Resume Title"
          placeholder="Graphic Designer"
          maxLength={TITLE_MAX}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="mb-[clamp(2rem,calc(1.502vw+1.648rem),3rem)]"
          validation={isLoading ? "default" : isError ? "error" : "info"}
          helperText={
            isLoading
              ? "Loading templates…"
              : isError
                ? "We could not load the latest list. Showing the built-in templates."
                : hint
          }
          inputCta={isError ? "Refresh" : undefined}
          onCtaClick={() => refetch()}
        />
        {/* Resume Templete Select */}
        <div className="flex flex-col items-center justify-center w-full">
          <div className="w-full flex flex-col items-center">
            <ExploreTemplates
              templates={recommendation.ordered}
              limit={Infinity}
              recommendedSlugs={recommendation.recommendedSlugs}
              selectedSlug={selected}
              onSelect={setPicked}
              startAt={startAt}
              resetKey={resetKey}
              showViewAll={false}
            />
          </div>

          <div className="flex items-center gap-[clamp(1rem,calc(1.127vw+0.736rem),1.75rem)] mt-[clamp(2rem,calc(1.502vw+1.648rem),3rem)] w-full *:flex-1">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push(user ? "/my-resume" : "/")}
              className="bg-red-500/5 text-red-500 border-red-500/5 hover:bg-red-500/10"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!selected}>
              Create Resume
            </Button>
          </div>
        </div>
      </form>
      <div></div>
    </main>
  );
};

export default Page;
