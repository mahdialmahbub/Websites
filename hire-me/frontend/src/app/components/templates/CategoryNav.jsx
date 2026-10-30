import Link from "next/link";
import { categoryPath } from "@/lib/catalog";

// The look of FilterToggle (rounded pill), but as real links: crawlable, work without JavaScript,
// and the active category lives in the URL.
const PILL = "inline-flex h-9.5 shrink-0 items-center justify-center rounded-full border px-4 font-primary text-[12px] whitespace-nowrap select-none transition-colors duration-150 sm:text-[14px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4F46E5]";
const INACTIVE = "border-[#816FFF]/20 bg-transparent font-medium text-[#6D65E8]/80 hover:border-[#4F46E5]/20 hover:bg-[#4F46E5]/10";
const ACTIVE = "border-transparent bg-[#4F46E5] font-semibold text-primary-50";

export default function CategoryNav({ categories, activeSlug, allHref = "/templates" }) {
  const items = [{ slug: null, name: "All", href: allHref }, ...categories.map((c) => ({ slug: c.slug, name: c.name, href: categoryPath(c.slug) }))];

  return (
    <nav aria-label="Template categories">
      <ul className="flex flex-wrap items-center justify-center gap-space-3">
        {items.map((item) => {
          const active = (item.slug ?? null) === (activeSlug ?? null);
          return (
            <li key={item.slug ?? "all"}>
              <Link href={item.href} aria-current={active ? "page" : undefined} className={`${PILL} ${active ? ACTIVE : INACTIVE}`}>
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
