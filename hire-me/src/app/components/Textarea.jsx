'use client';

import { forwardRef, useEffect, useId, useRef } from 'react';

const SIZE_STYLES = {
  sm: 'text-sm px-3 py-2 min-h-[84px] rounded-md',
  md: 'text-sm px-3.5 py-2.5 min-h-[112px] rounded-lg',
};

// `info` intentionally keeps the neutral border — only the helper text/icon
// turn blue, matching the reference (error/success/warning color the field
// itself; info stays quiet and just annotates it).
const VALIDATION_BORDER = {
  default: 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20',
  success: 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20',
  error: 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20',
  warning: 'border-amber-500 focus:border-amber-500 focus:ring-amber-500/20',
  info: 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20',
};

const HELPER_TEXT_COLOR = {
  default: 'text-slate-500',
  success: 'text-emerald-600',
  error: 'text-rose-600',
  warning: 'text-amber-600',
  info: 'text-blue-600',
};

function ValidationIcon({ validation, className }) {
  const common = { className, viewBox: '0 0 20 20', fill: 'currentColor', 'aria-hidden': true };
  if (validation === 'success') {
    return (
      <svg {...common}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
        />
      </svg>
    );
  }
  if (validation === 'error') {
    return (
      <svg {...common}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
        />
      </svg>
    );
  }
  if (validation === 'warning') {
    return (
      <svg {...common}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.485 2.495c.673-1.165 2.357-1.165 3.03 0l6.28 10.875c.673 1.167-.17 2.63-1.516 2.63H3.72c-1.347 0-2.189-1.463-1.515-2.63L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 8a1 1 0 100-2 1 1 0 000 2z"
        />
      </svg>
    );
  }
  if (validation === 'info') {
    return (
      <svg {...common}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.25a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.46-2.066A1.75 1.75 0 009.253 9H9z"
        />
      </svg>
    );
  }
  return null;
}

/**
 * All-purpose Textarea with label, validation states and helper text.
 *
 * @example
 * <Textarea
 *   label="Email"
 *   placeholder="you@company.com"
 *   validation="error"
 *   helperText="Please check this field."
 * />
 *
 * @param {Object} props
 * @param {'sm'|'md'} [props.size='md']
 * @param {'default'|'success'|'error'|'warning'|'info'} [props.validation='default']
 * @param {string} [props.label]
 * @param {boolean} [props.showLabel=true] - keep the label for screen readers even when hidden visually
 * @param {string} [props.helperText] - message below the field, colored to match `validation`
 * @param {boolean} [props.required=false]
 * @param {boolean} [props.disabled=false]
 * @param {React.ReactNode} [props.icon] - optional icon in the top-right corner
 * @param {boolean} [props.autoResize=false] - grows the textarea to fit its content instead of scrolling
 * @param {string} [props.className]
 */
const Textarea = forwardRef(function Textarea(
  {
    label,
    showLabel = true,
    size = 'md',
    validation = 'default',
    helperText,
    required = false,
    disabled = false,
    icon = null,
    autoResize = false,
    id,
    className = '',
    onInput,
    value,
    ...rest
  },
  ref
) {
  const generatedId = useId();
  const textareaId = id || generatedId;
  const helperId = helperText ? `${textareaId}-helper` : undefined;

  const innerRef = useRef(null);
  const setRefs = (node) => {
    innerRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  const resize = (node) => {
    if (!node) return;
    node.style.height = 'auto';
    node.style.height = `${node.scrollHeight}px`;
  };

  useEffect(() => {
    if (autoResize) resize(innerRef.current);
  }, [autoResize, value]);

  const handleInput = (e) => {
    if (autoResize) resize(e.target);
    onInput?.(e);
  };

  const base =
    'w-full border bg-white text-slate-900 placeholder:text-slate-400 transition-colors duration-150 ' +
    'focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400 ' +
    (autoResize ? 'resize-none overflow-hidden ' : 'resize-y ');

  const classes = [base, SIZE_STYLES[size], VALIDATION_BORDER[validation], icon ? 'pr-9' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div>
      {label && showLabel && (
        <label htmlFor={textareaId} className="mb-1.5 block text-sm font-medium text-slate-900">
          {label}
          {required && <span className="ml-0.5 text-rose-500">*</span>}
        </label>
      )}

      <div className="relative">
        <textarea
          {...rest}
          ref={setRefs}
          id={textareaId}
          value={value}
          disabled={disabled}
          required={required}
          aria-invalid={validation === 'error' || undefined}
          aria-describedby={helperId}
          aria-label={!showLabel ? label : undefined}
          onInput={handleInput}
          className={classes}
        />
        {icon && (
          <span className="pointer-events-none absolute right-2.5 top-2.5 text-slate-400">{icon}</span>
        )}
      </div>

      {helperText && (
        <p id={helperId} className={`mt-1.5 flex items-center gap-1 text-xs ${HELPER_TEXT_COLOR[validation]}`}>
          <ValidationIcon validation={validation} className="h-3.5 w-3.5 shrink-0" />
          {helperText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
