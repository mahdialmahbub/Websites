import Link from "next/link";
import { listingPath } from "@/lib/catalog";

const BASE = "inline-flex size-10 items-center justify-center rounded-lg border text-[15px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4F46E5]";

/** Plain links to ?page=N so every page of the list can be crawled. Renders nothing for a single page. */
export default function Pagination({ page, totalPages, category }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Template pages" className="flex flex-wrap items-center justify-center gap-2">
      {page > 1 && (
        <Link href={listingPath({ category, page: page - 1 })} rel="prev" aria-label="Previous page" className={`${BASE} border-neutral-500/10 hover:bg-neutral-500/5`}>
          <i className="fi fi-rr-arrow-small-left" aria-hidden="true" />
        </Link>
      )}
      {pages.map((n) => (
        <Link
          key={n}
          href={listingPath({ category, page: n })}
          aria-label={`Page ${n}`}
          aria-current={n === page ? "page" : undefined}
          className={`${BASE} ${n === page ? "border-transparent bg-[#4F46E5] text-primary-50" : "border-neutral-500/10 hover:bg-neutral-500/5"}`}
        >
          {n}
        </Link>
      ))}
      {page < totalPages && (
        <Link href={listingPath({ category, page: page + 1 })} rel="next" aria-label="Next page" className={`${BASE} border-neutral-500/10 hover:bg-neutral-500/5`}>
          <i className="fi fi-rr-arrow-small-right" aria-hidden="true" />
        </Link>
      )}
    </nav>
  );
}
