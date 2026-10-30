import React from "react";
import Link from "next/link";
import HomeHeader from "./HomeHeader";
import { Button } from "../Button";
import { getCategories, getTemplates } from "@/lib/catalog";
import TemplateCarousel from "../templates/TemplateCarousel";
import TemplateCard from "../templates/TemplateCard";

// Horizontal padding lives on the inner blocks (not on <section>), so the carousel can run edge to edge.
const PAD = "px-[clamp(1rem,calc(5.258vw+0.268rem),5rem)]";

const Templetes = async () => {
  // The home page must still open when the API is down: the section then shows only the call to action.
  let categories = [];
  let templates = [];
  try {
    const [allCategories, data] = await Promise.all([
      getCategories(),
      getTemplates({ limit: 10 }),
    ]);
    categories = allCategories;
    templates = data?.templates ?? [];
  } catch {
    // keep the empty lists
  }

  // Cards are rendered on the server (first HTML has every title/description/link),
  // the client carousel only moves and filters them.
  const items = templates.map((template) => ({
    key: template.slug,
    category: template.category?.slug ?? null,
    node: <TemplateCard template={template} />,
  }));

  return (
    <section className="py-[clamp(2rem,calc(6.009vw+0.592rem),6rem)] space-y-[clamp(1.5rem,calc(1.690vw+1.104rem),2.625rem)] flex flex-col items-center justify-center">
      <div className={`w-full ${PAD}`}>
        <HomeHeader
          title={"Choose a Template That Works for You"}
          name={"Professional Templates"}
          bg={"#9333EA"}
          color={"#9333EA"}
        />
      </div>

      {items.length > 0 && (
        <TemplateCarousel
          categories={categories.map(({ slug, name }) => ({ slug, name }))}
          items={items}
          startAt={1}
        />
      )}

      {/* CTA: one row from sm, stacked with a full-width button on mobile */}
      <div className={`flex w-full justify-center ${PAD}`}>
        <div className="rounded-md bg-white shadow-[1px_2px_6px_rgba(147,51,234,0.25)] flex items-center max-sm:w-full max-sm:flex-col max-sm:items-stretch gap-space-3 border-2 border-violet-500/10 px-[clamp(1.125rem,calc(0.376vw+1.037rem),1.375rem)] py-[clamp(0.75rem,calc(0.376vw+0.662rem),1rem)]">
          <div className="flex items-center gap-2.5">
            <span className="size-[clamp(1.625rem,calc(1.315vw+1.317rem),2.5rem)] shrink-0 bg-violet-500/5 border border-violet-500/10 flex items-center justify-center text-[clamp(0.875rem,calc(0.939vw+0.655rem),1.5rem)] text-violet-500/80">
              <i className="fi fi-sc-sparkles"></i>
            </span>
            <div>
              <h3 className="text-[clamp(0.875rem,calc(0.188vw+0.831rem),1rem)] font-primary font-medium mb-space-1">
                Not sure which template to choose?
              </h3>
              <p className="text-[clamp(0.75rem,calc(-0.188vw+0.919rem),0.875rem)] text-[#5C5C61]/80">
                Don’t worry! You can change your template anytime.
              </p>
            </div>
          </div>

          <Link href={"/create-resume"} className="max-sm:w-full">
            <Button
              variant="secondary"
              className="max-sm:w-full text-violet-500 bg-violet-500/5 *:text-[clamp(0.75rem,calc(-0.188vw+0.919rem),0.875rem)]"
            >
              Start Build With AI
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Templetes;
