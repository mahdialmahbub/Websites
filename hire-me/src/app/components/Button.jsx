'use client';

import { forwardRef } from 'react';
import Link from 'next/link';

/**
 * Variant → color/emphasis. Add a key here to introduce a new theme —
 * every variant automatically gets hover / active / focus-ring / disabled
 * handling from the shared classes below, so you never edit those.
 */
const VARIANT_STYLES = {
  primary:
    'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 focus-visible:ring-indigo-500',
  secondary:
    'bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300 focus-visible:ring-slate-400',
  outline:
    'bg-transparent text-indigo-600 border border-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 focus-visible:ring-indigo-500',
  ghost:
    'bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200 focus-visible:ring-slate-400',
  success:
    'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 focus-visible:ring-emerald-500',
  danger:
    'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 focus-visible:ring-rose-500',
  warning:
    'bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700 focus-visible:ring-amber-400',
};

const SIZE_STYLES = {
  sm: 'h-8 px-3 text-sm gap-1.5 rounded-md',
  md: 'h-10 px-4 text-sm gap-2 rounded-lg',
  lg: 'h-12 px-6 text-base gap-2.5 rounded-lg',
};

const ICON_ONLY_SIZE = {
  sm: 'h-8 w-8 p-0 rounded-md',
  md: 'h-10 w-10 p-0 rounded-lg',
  lg: 'h-12 w-12 p-0 rounded-lg',
};

const SPINNER_SIZE = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

function Spinner({ className }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

/**
 * All-purpose Button.
 *
 * @example
 * <Button variant="primary" size="lg" icon={<ArrowRight size={18} />} iconPosition="right">
 *   Get started
 * </Button>
 *
 * @param {Object} props
 * @param {'primary'|'secondary'|'outline'|'ghost'|'success'|'danger'|'warning'} [props.variant='primary']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {React.ReactNode} [props.icon] - icon element, e.g. <ArrowRight size={16} />
 * @param {'left'|'right'} [props.iconPosition='left'] - which side the icon sits on
 * @param {boolean} [props.iconOnly=false] - render a square icon-only button (no visible label)
 * @param {boolean} [props.loading=false] - shows a spinner and disables the button
 * @param {string} [props.loadingText] - text shown next to the spinner (defaults to children)
 * @param {boolean} [props.disabled=false]
 * @param {boolean} [props.fullWidth=false]
 * @param {string} [props.href] - if set, renders as a Next.js <Link> styled as this button
 * @param {'button'|'submit'|'reset'} [props.type='button']
 * @param {string} [props.className] - extra classes, merged in last so they can override defaults
 */
const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    icon = null,
    iconPosition = 'left',
    iconOnly = false,
    loading = false,
    loadingText,
    disabled = false,
    fullWidth = false,
    href,
    type = 'button',
    className = '',
    ...rest
  },
  ref
) {
  const isDisabled = disabled || loading;

  if (process.env.NODE_ENV !== 'production' && iconOnly && !icon) {
    console.warn('Button: `iconOnly` is set but no `icon` prop was provided.');
  }

  const base =
    'inline-flex items-center justify-center font-medium transition-colors duration-150 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
    'disabled:opacity-50 disabled:pointer-events-none select-none';

  const sizeClass = iconOnly ? ICON_ONLY_SIZE[size] : SIZE_STYLES[size];
  const widthClass = fullWidth ? 'w-full' : '';

  const classes = [base, VARIANT_STYLES[variant], sizeClass, widthClass, className]
    .filter(Boolean)
    .join(' ');

  // If iconOnly and children is plain text, reuse it as the accessible name
  // (it's not shown visually, but screen readers still need a label).
  const autoAriaLabel = iconOnly && typeof children === 'string' ? children : undefined;

  const content = loading ? (
    <>
      <Spinner className={SPINNER_SIZE[size]} />
      {!iconOnly && <span>{loadingText ?? children}</span>}
    </>
  ) : iconOnly ? (
    icon
  ) : (
    <>
      {icon && iconPosition === 'left' && icon}
      {children}
      {icon && iconPosition === 'right' && icon}
    </>
  );

  // href + not disabled → render as a Next.js Link styled like a button.
  // href + disabled → fall through to a real disabled <button> instead,
  // since a disabled link can't reliably block navigation/keyboard use.
  if (href && !isDisabled) {
    return (
      <Link
        {...rest}
        ref={ref}
        href={href}
        aria-busy={loading || undefined}
        aria-label={rest['aria-label'] || autoAriaLabel}
        className={classes}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      aria-label={rest['aria-label'] || autoAriaLabel}
      className={classes}
    >
      {content}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
