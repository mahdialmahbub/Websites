'use client';

import { forwardRef, useEffect, useId, useRef } from 'react';

const SIZE_STYLES = {
  sm: { wrapper: 'h-4 w-4', radius: 'rounded', icon: 'p-0.5', text: 'text-sm' },
  md: { wrapper: 'h-5 w-5', radius: 'rounded-md', icon: 'p-[3px]', text: 'text-sm' },
};

// `error` swaps the whole color scheme (border/fill/ring) to rose — the
// checkbox equivalent of Textarea's `validation="error"`. No success /
// warning / info variants exist for this component in the reference.
const BOX_STYLES = {
  default:
    'border-neutral-300 peer-hover:border-neutral-400 ' +
    'peer-checked:border-indigo-600 peer-checked:bg-indigo-600 ' +
    'peer-indeterminate:border-indigo-600 peer-indeterminate:bg-indigo-600 ' +
    'peer-focus-visible:ring-indigo-500/30 ' +
    'peer-disabled:border-neutral-200 peer-disabled:bg-neutral-100',
  error:
    'border-rose-500 peer-hover:border-rose-600 ' +
    'peer-checked:border-rose-600 peer-checked:bg-rose-600 ' +
    'peer-indeterminate:border-rose-600 peer-indeterminate:bg-rose-600 ' +
    'peer-focus-visible:ring-rose-500/30 ' +
    'peer-disabled:border-neutral-200 peer-disabled:bg-neutral-100',
};

function CheckIcon({ className }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" className={className} aria-hidden="true">
      <path d="M2.5 6.3l2.2 2.2 4.8-4.8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DashIcon({ className }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" className={className} aria-hidden="true">
      <path d="M2.5 6h7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

/**
 * All-purpose Checkbox with an optional label, indeterminate state and
 * error styling. Renders a real native <input type="checkbox"> — visually
 * hidden but fully clickable and keyboard-operable — plus a styled
 * indicator driven by CSS peer states, so hover/checked/focus need no
 * extra React state.
 *
 * @example
 * <Checkbox label="Accept terms" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
 * <Checkbox label="Select all" indeterminate />
 *
 * @param {Object} props
 * @param {'sm'|'md'} [props.size='md']
 * @param {boolean} [props.indeterminate=false] - set via the DOM property (not a real HTML attribute)
 * @param {boolean} [props.error=false] - red color scheme for validation errors
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.label] - optional label text next to the box; omit and pass `aria-label` for a label-less checkbox
 * @param {string} [props.className] - extra classes on the outer <label>
 */
const Checkbox = forwardRef(function Checkbox(
  { size = 'md', indeterminate = false, error = false, disabled = false, label, id, className = '', ...rest },
  ref
) {
  const generatedId = useId();
  const inputId = id || generatedId;

  const innerRef = useRef(null);
  const setRefs = (node) => {
    innerRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const sizes = SIZE_STYLES[size];

  return (
    <label
      htmlFor={inputId}
      className={[
        'inline-flex items-center gap-2',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className={`relative inline-flex shrink-0 ${sizes.wrapper}`}>
        <input
          {...rest}
          ref={setRefs}
          id={inputId}
          type="checkbox"
          disabled={disabled}
          className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        />
        <span
          className={`pointer-events-none absolute inset-0 border bg-white transition-colors duration-150 peer-focus-visible:ring-4 ${sizes.radius} ${BOX_STYLES[error ? 'error' : 'default']}`}
        />
        <CheckIcon
          className={`pointer-events-none absolute inset-0 hidden h-full w-full text-white peer-checked:block peer-indeterminate:hidden ${sizes.icon}`}
        />
        <DashIcon
          className={`pointer-events-none absolute inset-0 hidden h-full w-full text-white peer-indeterminate:block ${sizes.icon}`}
        />
      </span>
      {label && <span className={`text-neutral-900 ${sizes.text}`}>{label}</span>}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
