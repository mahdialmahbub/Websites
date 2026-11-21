import { prettyUrl } from '../../lib/format';

/**
 * ONE page: left column (data-column="main") | centre strip | right column (data-column="sidebar").
 * The centre strip is on every page; its content (photo, name, contacts, links) and the sketch icons
 * at the top are drawn on the FIRST page only. On that page the two columns start lower (.rcd-first in the CSS).
 * Column widths never change between pages.
 */

const has = (value) => String(value ?? '').trim() !== '';

// simple line icons, all drawn in a 48 x 48 box
const ICONS = {
  bulb: (
    <>
      <circle cx="24" cy="19" r="11" />
      <path d="M19 31v4h10v-4M20 39h8M22 43h4M24 2v3M8 10l2 2M40 10l-2 2M4 22h3M41 22h3" />
    </>
  ),
  gear: (
    <>
      <circle cx="24" cy="24" r="6" />
      <circle cx="24" cy="24" r="13" strokeDasharray="6 4.5" strokeWidth="5" />
      <circle cx="24" cy="24" r="10" />
    </>
  ),
  pencil: <path d="M8 40l3-9L33 9l7 7L18 38zM28 14l7 7" />,
  monitor: (
    <>
      <rect x="5" y="9" width="38" height="25" rx="2" />
      <path d="M17 41h14M24 34v7" />
    </>
  ),
  cloud: <path d="M13 35a8 8 0 0 1-1-16 11 11 0 0 1 21-3 8.5 8.5 0 0 1 1 19z" />,
  star: <path d="M24 5l5.5 12 13 1.5-9.7 8.8 2.8 12.9L24 33l-11.6 7.2 2.8-12.9L5.5 18.5 18.5 17z" />,
  check: (
    <>
      <circle cx="24" cy="24" r="16" />
      <path d="M15 25l7 7 12-14" />
    </>
  ),
  bubble: (
    <>
      <path d="M7 9h34v22H22l-9 8v-8H7z" />
      <path d="M14 18h20M14 24h12" />
    </>
  ),
  hourglass: <path d="M13 6h22M13 42h22M15 6c0 12 9 14 9 18s-9 6-9 18M33 6c0 12-9 14-9 18s9 6 9 18" />,
  heart: <path d="M24 40S6 28 6 17a9 9 0 0 1 18-2 9 9 0 0 1 18 2c0 11-18 23-18 23z" />,
  camera: (
    <>
      <rect x="5" y="14" width="38" height="26" rx="3" />
      <circle cx="24" cy="27" r="8" />
      <path d="M16 14l3-6h10l3 6" />
    </>
  ),
};

// [icon, x, y, scale, rotation] - the middle (x 300 - 495) is kept free for the photo
const DOODLES = [
  ['bulb', 36, 46, 1.3, 0], ['monitor', 104, 24, 1.4, 0], ['star', 216, 34, 0.9, 10], ['cloud', 246, 110, 1.1, 0],
  ['gear', 40, 140, 1.0, 0], ['pencil', 118, 128, 1.2, -15], ['bubble', 176, 152, 1.0, 0], ['check', 232, 182, 0.8, 0],
  ['hourglass', 66, 196, 0.8, 0],
  ['camera', 520, 26, 1.2, 0], ['heart', 612, 40, 1.0, 10], ['hourglass', 530, 112, 1.0, 0], ['bulb', 598, 120, 0.9, 8],
  ['gear', 690, 112, 1.1, 0], ['star', 744, 176, 0.8, -10], ['monitor', 520, 182, 1.0, 0], ['cloud', 610, 184, 1.0, 0],
  ['pencil', 690, 190, 1.0, 15],
];

function Doodles() {
  return (
    <svg className="rcd-doodles" viewBox="0 0 794 250" width="794" height="250" aria-hidden="true">
      {DOODLES.map(([icon, x, y, scale, rotation], index) => (
        <g key={index} transform={`translate(${x} ${y}) rotate(${rotation} 24 24) scale(${scale})`}>
          {ICONS[icon]}
        </g>
      ))}
      <text x="682" y="52" fontSize="22" letterSpacing="3" className="rcd-doodle-text">WWW</text>
    </svg>
  );
}

function HexBadge({ kind }) {
  return (
    <svg className="rcd-badge" viewBox="0 0 40 46" width="40" height="46" aria-hidden="true">
      <polygon points="20,1.5 38.5,12 38.5,34 20,44.5 1.5,34 1.5,12" />
      {kind === 'in' ? (
        <text x="20" y="29" textAnchor="middle" fontSize="15" fontWeight="700">in</text>
      ) : (
        <g transform="translate(10 13) scale(0.83)" className="rcd-badge-line">
          <circle cx="12" cy="12" r="9" />
          <ellipse cx="12" cy="12" rx="4" ry="9" />
          <path d="M3 12h18" />
        </g>
      )}
    </svg>
  );
}

export default function Page({ pageIndex, data, sidebar, main }) {
  const p = data.personalInformation ?? {};
  const first = pageIndex === 0;
  const hasPhoto = Boolean(p.photo?.url);

  const contacts = [
    has(p.location) && ['Address', p.location],
    has(p.phone) && ['Phone', p.phone],
    has(p.email) && ['Email', p.email],
  ].filter(Boolean);
  const links = [
    has(p.linkedin) && { key: 'linkedin', kind: 'in', value: prettyUrl(p.linkedin) },
    has(p.website) && { key: 'website', kind: 'web', value: prettyUrl(p.website) },
  ].filter(Boolean);

  const className = ['rcd-page', first ? 'rcd-first' : '', first && !hasPhoto ? 'rcd-nophoto' : ''].filter(Boolean).join(' ');

  return (
    <div className={className}>
      <div className="rcd-strip" />
      {first ? <Doodles /> : null}

      <section className="rcd-left" data-column="main">
        {main}
      </section>
      <div className="rcd-mid" />
      <aside className="rcd-right" data-column="sidebar">
        {sidebar}
      </aside>

      {first ? (
        <div className="rcd-center">
          {hasPhoto ? (
            <div className="rcd-hex">
              <img src={p.photo.url} alt="" />
            </div>
          ) : null}
          <h1 className="rcd-name">{p.fullName}</h1>
          {has(p.professionalTitle) ? <p className="rcd-title">{p.professionalTitle}</p> : null}

          {contacts.length > 0 ? <div className="rcd-rule" /> : null}
          {contacts.map(([label, value]) => (
            <div className="rcd-contact" key={label}>
              <span className="rcd-label">{label}:</span>
              <span className="rcd-value">{value}</span>
            </div>
          ))}

          {links.length > 0 ? <div className="rcd-rule rcd-rule-links" /> : null}
          {links.length > 0 ? (
            <div className="rcd-links">
              {links.map((link) => (
                <div className="rcd-link" key={link.key}>
                  <HexBadge kind={link.kind} />
                  <span>{link.value}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
