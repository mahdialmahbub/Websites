import Link from "next/link";

/**
 * Switch / tab button. 3 vabe kaj kore:
 * 1) `href` dile Link hoy: server page e onClick/useState charai switch kora jay
 * 2) `onClick` dile client side button hoy (keyboard e Enter / Space o kaj kore)
 * 3) kichu na dile shudhu dekhanor jonno, jemon <Link><SwitchBTN /></Link> er bhitore
 *
 * Note: server component theke `onClick` pathano jay na, oikhane `href` use korun.
 *
 * @param {{
 *   text?: string,
 *   isActive?: boolean,
 *   href?: string,
 *   onClick?: (event: React.SyntheticEvent) => void,
 *   icon?: string,
 *   scroll?: boolean,
 * }} props
 */
const SwitchBTN = ({
  text = "Switch",
  isActive = false,
  href,
  onClick,
  icon = "fi fi-rr-code-window",
  scroll = false, // href mode e switch korle page upore jump korbe na
}) => {
  const className = `p-1.5 rounded-md cursor-pointer ${
    isActive ? "switch-btn--active" : "switch-btn--inactive"
  } flex items-center gap-space-1 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-500`;

  const content = (
    <>
      <div className="min-w-space-6 min-h-space-6 flex items-center justify-center bg-secondary-50 dark:bg-secondary-900 rounded-sm switch-icon-shadow overflow-hidden">
        <i
          aria-hidden="true"
          className={` ${icon} text-size-sm ${isActive ? "text-secondary-600 dark:text-secondary-500" : "text-secondary-900 dark:text-secondary-500/60"} `}
        ></i>
      </div>
      {/* h3 chhilo, kintu button er text heading hishebe search engine / screen reader e jawa thik na, tai span */}
      <span
        className={`text-nowrap font-primary font-semibold text-size-sm max-w-max ${isActive ? "text-secondary-50" : "dark:text-secondary-100"}`}
      >
        {text}
      </span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        scroll={scroll}
        aria-current={isActive ? "page" : undefined}
        className={className}
      >
        {content}
      </Link>
    );
  }

  if (onClick) {
    const handleKeyDown = (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onClick(event);
      }
    };

    return (
      <div
        role="button"
        tabIndex={0}
        aria-pressed={isActive}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        className={className}
      >
        {content}
      </div>
    );
  }

  return <div className={className}>{content}</div>;
};

export default SwitchBTN;
