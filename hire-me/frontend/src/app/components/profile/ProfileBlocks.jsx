import React from "react";
import { ProfileIcon } from "./ProfileIcon";

/* -------------------------------------------------------------------------- */
/*  SectionCard — profile page er prottek section er container                 */
/*                                                                             */
/*  <SectionCard title="Work experience" count={2}> ... </SectionCard>         */
/* -------------------------------------------------------------------------- */

/**
 * @typedef {Object} SectionCardProps
 * @property {string} title - Section er heading
 * @property {string} [description] - Heading er niche choto explanation
 * @property {number} [count] - Item koyta (0 hole dekhabe na)
 * @property {React.ReactNode} [action] - Header er dan dike kono button/link
 * @property {string} [className] - Extra Tailwind classes
 * @property {React.ReactNode} children
 */

/** @param {SectionCardProps} props */
export const SectionCard = ({
  title,
  description,
  count,
  action,
  className = "",
  children,
}) => (
  <section
    className={`rounded-xl border border-neutral-500/10 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05)] ${className}`}
  >
    <header className="flex items-start justify-between gap-4 border-b border-neutral-500/10 px-[clamp(0.75rem,calc(1.127vw+0.486rem),1.5rem)] py-[clamp(0.75rem,calc(1.127vw+0.486rem),1.5rem)]">
      <div className="min-w-0">
        <h2 className="flex items-center gap-2 font-primary text-[18px] font-semibold">
          {title}
          {count > 0 && (
            <span className="rounded-full bg-neutral-500/10 size-7 text-caption font-medium leading-none text-neutral-500 flex items-center justify-center">
              {count}
            </span>
          )}
        </h2>
        {description && (
          <p className="mt-1 text-small text-neutral-400">{description}</p>
        )}
      </div>
      {action}
    </header>

    <div className="p-[clamp(0.75rem,calc(1.127vw+0.486rem),1.5rem)]">
      {children}
    </div>
  </section>
);

/* -------------------------------------------------------------------------- */
/*  InfoItem — icon + label + value (optional link)                            */
/*  Always <dl> er bhitore use korte hobe.                                     */
/* -------------------------------------------------------------------------- */

/**
 * @typedef {Object} InfoItemProps
 * @property {string} label - Field er naam (e.g. "Email")
 * @property {string} [value] - Field er value. Khali hole "—" dekhabe
 * @property {import("./ProfileIcon").ProfileIconName} [icon] - Left er icon
 * @property {string} [href] - Thakle value ta link hobe (mailto:, tel:, https://)
 * @property {boolean} [external=false] - true hole link notun tab e khulbe
 */

/** @param {InfoItemProps} props */
export const InfoItem = ({ label, value, icon, href, external = false }) => {
  let content;

  if (!value) {
    content = <span className="text-body text-neutral-300">—</span>;
  } else if (href) {
    content = (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="group/link inline-flex items-center gap-1.5 break-all text-small sm:text-body font-medium transition-colors hover:text-violet-500"
      >
        {value}
        {external && (
          <span className="grid size-5 shrink-0 place-items-center rounded-full bg-violet-500/5 text-violet-500/70 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5">
            <ProfileIcon name="arrowUpRight" size={12} />
          </span>
        )}
      </a>
    );
  } else {
    content = (
      <p className="text-small sm:text-body font-medium wrap-break-word">
        {value}
      </p>
    );
  }

  return (
    <div className="flex min-w-0 items-start gap-3">
      {icon && (
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/5 text-[18px] text-violet-500/80">
          <ProfileIcon name={icon} />
        </span>
      )}
      <div className="min-w-0">
        <dt className="text-caption sm:text-small text-neutral-400">{label}</dt>
        <dd className="mt-0.5">{content}</dd>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  ChipList — skills, languages, technologies                                 */
/* -------------------------------------------------------------------------- */

/**
 * @typedef {Object} ChipListProps
 * @property {string[]} items - Chip er text er list
 * @property {string} [emptyText="Not added yet"] - List khali hole ki dekhabe
 */

/** @param {ChipListProps} props */
export const ChipList = ({ items = [], emptyText = "Not added yet" }) => {
  if (items.length === 0) {
    return <p className="text-small text-neutral-400">{emptyText}</p>;
  }

  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className="rounded-full bg-violet-500/8 px-3 py-1.5 text-small font-medium leading-none text-violet-600"
        >
          {item}
        </li>
      ))}
    </ul>
  );
};
