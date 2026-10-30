import React from "react";
import Link from "next/link";

// Fluid values: choto value = 375px screen, boro value = 1440px screen (1rem = 16px)
// clamp(min, calc(intercept + slope * vw), max): min shobshomoy choto, max shobshomoy boro.
const CLASS_NAME =
  "rounded-full bg-primary-300/10 inline-flex w-fit items-center gap-2.5 whitespace-nowrap p-space-2 border  border-primary-300/20 text-[clamp(0.8125rem,calc(0.282vw+0.746rem),1rem)] font-primary text-neutral-950 font-semibold";

const Content = () => (
  <>
    {/* Icon */}
    <span className="flex shrink-0 items-center justify-center size-[clamp(1.75rem,calc(1.315vw+1.442rem),2.625rem)] bg-primary-300 shadow-[inset_-2px_-2px_3px_rgba(0,0,0,0.30),inset_3px_3px_3px_rgba(255,255,255,0.40)] rounded-full">
      <i aria-hidden="true" className="fi fi-rr-plus text-[clamp(0.625rem,calc(0.563vw+0.493rem),1rem)] text-neutral-50"></i>
    </span>
    Create Resume
  </>
);

/** The "Create Resume" pill. With `href` it is a link (it goes to the create page); without, a plain button for the caller to handle. */
const ResumeBTN = ({ href, onClick }) =>
  href ? (
    <Link href={href} className={CLASS_NAME}>
      <Content />
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={CLASS_NAME}>
      <Content />
    </button>
  );

export default ResumeBTN;
