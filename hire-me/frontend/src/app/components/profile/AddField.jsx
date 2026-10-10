import React from "react";
import Link from "next/link";
import { ProfileIcon } from "./ProfileIcon";

/**
 * Dashed "add" row — list er shesh e boshe.
 * `href` dile Link hobe (notun page e niye jabe), na dile button (onClick use korte hobe).
 *
 * Note: Server Component theke onClick pass kora jay na. Server theke use korle `href` use koro,
 * ar modal/form khulte chaile Client Component theke use koro.
 *
 * @typedef {Object} AddFieldProps
 * @property {string} [title="Add"] - Button er text (e.g. "Add work experience")
 * @property {string} [href] - Thakle Link hishebe render hobe
 * @property {() => void} [onClick] - Button click handler (href na thakle)
 * @property {string} [className] - Extra Tailwind classes
 */

/** @param {AddFieldProps} props */
const AddField = ({ title = "Add", href, onClick, className = "" }) => {
  const classes = `flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-violet-500/30 bg-violet-500/2 px-4 py-3 text-small sm:text-body font-medium text-violet-500 transition-colors hover:border-violet-500/50 hover:bg-violet-500/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40 ${className}`;

  const content = (
    <>
      <ProfileIcon name="plus" size="1.1em" />
      {title}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {content}
    </button>
  );
};

export default AddField;
