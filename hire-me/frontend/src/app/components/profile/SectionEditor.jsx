'use client';

import { createItem } from '../../../../store/builder/builderModel';
import FieldControl from './FormFields';

/**
 * Edit form for ONE profile section, generated from the schema (resume/schema/resumeSchema.js),
 * so it always has exactly the same fields as the resume form.
 *
 * @param {{ section: object, value: any, onChange: (value: any) => void, errors: Record<string,string> }} props
 */
export default function SectionEditor({ section, value, onChange, errors }) {
  // one group of fields (personal information)
  if (section.kind === 'object') {
    return (
      <div className="flex flex-col gap-4">
        {section.fields.map((field) => (
          <FieldControl key={field.name} field={field} value={value?.[field.name]} error={errors[field.name]} record={value}
            onChange={(next) => onChange({ ...value, [field.name]: next })} />
        ))}
      </div>
    );
  }

  // one text box (summary) or a list of words (skills)
  if (section.kind === 'text' || section.kind === 'tags') {
    const field = section.kind === 'tags' ? { ...section.fields[0], maxTags: section.maxTags, maxTagLength: section.maxTagLength } : section.fields[0];
    return <FieldControl field={field} value={value} onChange={onChange} error={errors[section.kind === 'text' ? 'value' : 'tags']} />;
  }

  // repeatable entries (experience, education ...)
  const entries = value ?? [];
  const update = (index, patch) => onChange(entries.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)));

  return (
    <div className="flex flex-col gap-5">
      {errors._ ? <p role="alert" className="text-small text-red-500">{errors._}</p> : null}

      {entries.map((entry, index) => (
        <fieldset key={entry.id} className="flex flex-col gap-4 rounded-xl border border-neutral-500/10 p-4 shadow-[0_1px_4px_rgba(2,6,23,0.10)]">
          <legend className="px-2 text-small font-semibold text-neutral-500">
            {section.itemLabel} {index + 1}
          </legend>

          {section.fields.map((field) => (
            <FieldControl key={field.name} field={field} value={entry[field.name]} error={errors[`${index}.${field.name}`]} record={entry}
              onChange={(next) => {
                const patch = { [field.name]: next };
                // ticking "currently working / studying" clears the end date
                if (field.type === 'checkbox' && next) patch.endDate = '';
                update(index, patch);
              }} />
          ))}

          <button type="button" onClick={() => onChange(entries.filter((_, i) => i !== index))} className="self-start rounded-lg px-3 py-1.5 text-small text-red-500 hover:bg-red-500/5">
            Remove this {section.itemLabel.toLowerCase()}
          </button>
        </fieldset>
      ))}

      <button type="button" disabled={entries.length >= section.maxItems} onClick={() => onChange([...entries, createItem(section.id)])}
        className="rounded-xl bg-green-500/5 px-4 py-3 text-small font-medium text-green-500 hover:bg-green-500/10 disabled:opacity-40">
        + Add {entries.length > 0 ? 'another ' : ''}{section.itemLabel.toLowerCase()}
      </button>
    </div>
  );
}
