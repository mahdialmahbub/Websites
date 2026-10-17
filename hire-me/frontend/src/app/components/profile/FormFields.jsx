'use client';

import { useId, useState } from 'react';
import { useUploadPhotoMutation } from '../../../../store/api/uploadApi';

/*
 * Plain, dependency-free form controls used by the profile edit page.
 * They are styled with your Tailwind tokens. To use your own <Input> / <Textarea> components instead, change
 * ONLY this file: every control receives { field, value, onChange, error } and nothing else.
 */

const controlClass = (invalid) =>
  `w-full rounded-lg border bg-white px-3 py-2 outline-none transition focus:ring-2 focus:ring-blue-500/30 disabled:bg-neutral-500/5 disabled:text-neutral-500/50 ${
    invalid ? 'border-red-500' : 'border-neutral-500/15'
  }`;

/** Label + control + hint + error message, wired together for screen readers. */
function Field({ id, field, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-small font-medium text-neutral-500">
        {field.label}
        {field.required ? <span className="text-red-500"> *</span> : null}
      </label>
      {children}
      {field.hint && !error ? <p className="text-caption text-neutral-500/60">{field.hint}</p> : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-caption text-red-500">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function TagsInput({ id, field, value, onChange, error }) {
  const [draft, setDraft] = useState('');
  const tags = value ?? [];
  const max = field.maxTagLength ?? 50;

  const add = (text) => {
    const incoming = String(text)
      .split(',')
      .map((tag) => tag.trim().slice(0, max))
      .filter(Boolean)
      .filter((tag) => !tags.some((existing) => existing.toLowerCase() === tag.toLowerCase()));
    if (incoming.length > 0) onChange([...tags, ...incoming]);
    setDraft('');
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          id={id}
          value={draft}
          placeholder={field.placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={controlClass(Boolean(error))}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ',') {
              event.preventDefault();
              add(draft);
            }
          }}
          onBlur={() => draft.trim() && add(draft)}
        />
        <button type="button" onClick={() => add(draft)} className="rounded-lg bg-green-500/5 px-4 text-small font-medium text-green-500 hover:bg-green-500/10">
          Add
        </button>
      </div>
      {tags.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li key={tag} className="flex items-center gap-1 rounded-full bg-blue-500/5 py-1 pl-3 pr-1 text-small text-blue-500">
              {tag}
              <button type="button" aria-label={`Remove ${tag}`} onClick={() => onChange(tags.filter((item) => item !== tag))} className="flex size-5 items-center justify-center rounded-full hover:bg-blue-500/10">
                <i className="fi fi-rr-cross-small" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function PhotoInput({ id, value, onChange, error }) {
  const [uploadPhoto, { isLoading }] = useUploadPhotoMutation();
  const [problem, setProblem] = useState('');

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = ''; // allow choosing the same file again
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return setProblem('Use a JPG, PNG or WebP image');
    if (file.size > 3 * 1024 * 1024) return setProblem('The image must be smaller than 3 MB');
    setProblem('');
    try {
      onChange(await uploadPhoto(file).unwrap()); // { url, publicId }
    } catch (err) {
      setProblem(err?.message ?? 'Upload failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center gap-4">
      {value?.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value.url} alt="Your photo" width={80} height={80} className="size-20 rounded-full object-cover" />
      ) : (
        <div className="flex size-20 items-center justify-center rounded-full bg-neutral-500/5 text-neutral-500/40">
          <i className="fi fi-rr-user text-3xl" />
        </div>
      )}
      <div className="flex flex-col gap-1">
        <div className="flex gap-2">
          <label htmlFor={id} className="cursor-pointer rounded-lg bg-blue-500/5 px-4 py-2 text-small font-medium text-blue-500 hover:bg-blue-500/10">
            {isLoading ? 'Uploading...' : value?.url ? 'Change photo' : 'Upload photo'}
          </label>
          {value?.url ? (
            <button type="button" onClick={() => onChange(null)} className="rounded-lg px-4 py-2 text-small text-red-500 hover:bg-red-500/5">
              Remove
            </button>
          ) : null}
        </div>
        <input id={id} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={handleFile} disabled={isLoading} />
        <p className="text-caption text-neutral-500/60">JPG, PNG or WebP, up to 3 MB</p>
        {problem || error ? <p role="alert" className="text-caption text-red-500">{problem || error}</p> : null}
      </div>
    </div>
  );
}

/**
 * One control for one schema field.
 * @param {{ field: object, value: any, onChange: (value: any) => void, error?: string, record?: object }} props
 *   record = the whole entry (needed for "disabled when currently working")
 */
export default function FieldControl({ field, value, onChange, error, record = {} }) {
  const id = useId();
  const disabled = Boolean(field.disabledWhen && record[field.disabledWhen]);
  const common = {
    id,
    disabled,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? `${id}-error` : undefined,
    className: controlClass(Boolean(error)),
  };

  if (field.type === 'checkbox') {
    return (
      <label className="flex items-center gap-2 text-small text-neutral-500">
        <input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} />
        {field.label}
      </label>
    );
  }

  let control;
  if (field.type === 'textarea') {
    control = (
      <>
        <textarea {...common} rows={5} value={value ?? ''} maxLength={field.max} placeholder={field.placeholder} onChange={(event) => onChange(event.target.value)} />
        {field.max ? <span className="self-end text-caption text-neutral-500/50">{(value ?? '').length} / {field.max}</span> : null}
      </>
    );
  } else if (field.type === 'select') {
    control = (
      <select {...common} value={value ?? ''} onChange={(event) => onChange(event.target.value)}>
        <option value="">Select...</option>
        {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    );
  } else if (field.type === 'tags') {
    control = <TagsInput id={id} field={field} value={value} onChange={onChange} error={error} />;
  } else if (field.type === 'photo') {
    control = <PhotoInput id={id} value={value} onChange={onChange} error={error} />;
  } else {
    const htmlType = { email: 'email', date: 'date' }[field.type] ?? 'text';
    control = (
      <input {...common} type={htmlType} inputMode={field.type === 'phone' ? 'tel' : undefined} autoComplete={field.type === 'email' ? 'email' : undefined} value={value ?? ''} maxLength={field.max} placeholder={field.placeholder} onChange={(event) => onChange(event.target.value)} />
    );
  }

  return <Field id={id} field={field} error={field.type === 'tags' || field.type === 'photo' ? null : error}>{control}</Field>;
}
