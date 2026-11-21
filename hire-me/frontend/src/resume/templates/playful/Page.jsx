import { prettyUrl } from '../../lib/format';
import { Icon } from './blocks';

/**
 * ONE page. First page: big header (name, social links, coloured contact band, round photo).
 * Other pages: a small running header. Every page: confetti strip at the bottom.
 * The two columns have data-column and fill the remaining height; their widths never change between pages.
 */

const has = (value) => String(value ?? '').trim() !== '';

const SHAPES = {
  o: <circle r="4" />,
  s: <rect width="8" height="8" />,
  z: <path d="M0 8 L4 0 L8 8 L12 0" />,
  l: <path d="M0 0 V9 H9" />,
  u: <path d="M0 0 A6 6 0 0 0 12 0" />,
  c: <path d="M0 0 A5 5 0 0 1 10 0" />,
};

// [shape, x, y, tone, rotation]  tone: a = accent, p = soft accent, t = text, m = muted
const TOP = [
  ['o', 58, 16, 'a', 0], ['z', 120, 12, 'm', -15], ['l', 208, 12, 't', 20], ['c', 262, 20, 'a', 0],
  ['o', 350, 14, 'p', 0], ['s', 424, 10, 'a', 25], ['z', 470, 28, 't', 10], ['u', 566, 12, 'p', 0],
  ['l', 618, 44, 'm', 30], ['o', 652, 26, 't', 0], ['s', 738, 16, 'a', 15], ['z', 764, 62, 'p', -20],
  ['o', 28, 100, 'm', 0], ['c', 330, 104, 'a', 0], ['u', 470, 98, 'm', 0], ['z', 690, 98, 'a', 10],
  ['s', 746, 104, 'm', 0], ['o', 560, 84, 'p', 0],
];
const BOTTOM = [
  ['o', 64, 14, 'a', 0], ['c', 116, 34, 'p', 0], ['o', 178, 18, 'm', 0], ['s', 222, 44, 't', 20],
  ['u', 280, 66, 'a', 0], ['l', 330, 24, 'm', -10], ['z', 380, 58, 'p', 10], ['o', 436, 14, 't', 0],
  ['c', 470, 48, 'm', 0], ['s', 520, 28, 'a', 30], ['z', 580, 60, 't', 0], ['o', 640, 20, 'a', 0],
  ['l', 690, 62, 'm', 20], ['u', 736, 32, 't', 0], ['s', 40, 62, 'm', 10], ['z', 22, 38, 't', 0],
  ['o', 760, 72, 'a', 0], ['c', 600, 14, 'p', 0],
];

function Confetti({ items, height, className }) {
  return (
    <svg className={`rpl-confetti ${className}`} viewBox={`0 0 794 ${height}`} width="100%" height={height} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {items.map(([shape, x, y, tone, rotation], index) => (
        <g key={index} className={`rpl-k-${tone}`} transform={`translate(${x} ${y}) rotate(${rotation})`}>
          {SHAPES[shape]}
        </g>
      ))}
    </svg>
  );
}

export default function Page({ pageIndex, data, sidebar, main }) {
  const p = data.personalInformation ?? {};
  const name = p.fullName ?? '';
  const first = pageIndex === 0;
  const social = [p.linkedin, p.website].filter(has);

  return (
    <div className="rpl-page overflow-hidden">
      {first ? (
        <header className="rpl-head">
          <div className="rpl-head-top">
            <Confetti items={TOP} height={118} className="rpl-confetti-top" />
            <div className="rpl-ident">
              <h1 className="rpl-name">{name}</h1>
              {has(p.professionalTitle) ? <p className="rpl-title">{p.professionalTitle}</p> : null}
            </div>
            {social.length > 0 ? (
              <ul className="rpl-social">
                {social.map((url) => (
                  <li key={url}>
                    <span className="rpl-dot">
                      <Icon name="web" size={10} />
                    </span>
                    {prettyUrl(url)}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="rpl-band">
            <ul className="rpl-band-list">
              {has(p.location) ? (
                <li>
                  <span className="rpl-ring">
                    <Icon name="pin" />
                  </span>
                  <span>{p.location}</span>
                </li>
              ) : null}
            </ul>
            <div />
            <ul className="rpl-band-list">
              {has(p.email) ? (
                <li>
                  <span className="rpl-ring">
                    <Icon name="email" />
                  </span>
                  <span>{p.email}</span>
                </li>
              ) : null}
              {has(p.phone) ? (
                <li>
                  <span className="rpl-ring">
                    <Icon name="phone" />
                  </span>
                  <span>{p.phone}</span>
                </li>
              ) : null}
            </ul>
          </div>

          {p.photo?.url ? <img className="rpl-photo" src={p.photo.url} alt="" /> : null}
        </header>
      ) : (
        <div className="rpl-running">{name}</div>
      )}

      <div className="rpl-cols">
        <div className="rpl-main" data-column="main">
          {main}
        </div>
        <div className="rpl-side" data-column="sidebar">
          {sidebar}
        </div>
      </div>

      <div className="rpl-foot">
        <Confetti items={BOTTOM} height={86} className="rpl-confetti-bottom" />
      </div>
    </div>
  );
}
