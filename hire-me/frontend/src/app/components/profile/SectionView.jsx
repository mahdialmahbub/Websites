import { formatDate } from '../../../../resume/lib/format';
import { textToBullets } from '../../../../resume/lib/textToBullets';
import { isFieldEmpty } from '../../../../store/builder/builderModel';

/** How one field's value is shown (read only). Every schema field is shown, empty ones as "Not added". */
function Value({ field, value }) {
  if (isFieldEmpty(value) && field.type !== 'checkbox') return <span className="text-neutral-500/40">Not added</span>;
  if (field.type === 'checkbox') return <span>{value ? 'Yes' : 'No'}</span>;
  if (field.type === 'date') return <span>{formatDate(value)}</span>;
  if (field.type === 'tags') return <span className="flex flex-wrap gap-1.5">{value.map((tag) => <span key={tag} className="rounded-full bg-blue-500/5 px-2.5 py-0.5 text-small text-blue-500">{tag}</span>)}</span>;
  if (field.type === 'photo') {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={value.url} alt="Your photo" width={64} height={64} className="size-16 rounded-full object-cover" />;
  }
  if (field.type === 'textarea') {
    return <ul className="list-disc pl-5">{textToBullets(value).map((line, index) => <li key={index}>{line}</li>)}</ul>;
  }
  return <span className="wrap-break-word">{value}</span>;
}

function Fields({ fields, record }) {
  return (
    <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
      {fields.map((field) => (
        <div key={field.name} className={field.type === 'textarea' || field.type === 'tags' ? 'sm:col-span-2' : undefined}>
          <dt className="text-caption uppercase tracking-wide text-neutral-500/60">{field.label}</dt>
          <dd className="text-small text-neutral-500"><Value field={field} value={record?.[field.name]} /></dd>
        </div>
      ))}
    </dl>
  );
}

/** Read-only view of one section, generated from the schema. */
export default function SectionView({ section, value }) {
  if (section.kind === 'object') return <Fields fields={section.fields} record={value} />;
  if (section.kind === 'text') return <Value field={{ type: 'textarea' }} value={value} />;
  if (section.kind === 'tags') return <Value field={{ type: 'tags' }} value={value} />;

  return (
    <ul className="flex flex-col gap-4">
      {(value ?? []).map((entry, index) => (
        <li key={entry.id ?? index} className="rounded-xl bg-neutral-500/5 p-4">
          <p className="mb-3 font-semibold text-neutral-500">
            {[entry[section.titleField], entry[section.subtitleField]].filter(Boolean).join(' - ') || `${section.itemLabel} ${index + 1}`}
          </p>
          <Fields fields={section.fields} record={entry} />
        </li>
      ))}
    </ul>
  );
}
