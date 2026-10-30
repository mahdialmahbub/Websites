"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Inter, Poppins } from "next/font/google";
import styles from "./ATSScore.module.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

/*
  Keep the four `key` values as they are: they pick each card's colour,
  icon and grid position. Change title, value and description freely.
*/
export const DEFAULT_METRICS = [
  {
    key: "keyword",
    title: "Keyword Match",
    value: 90,
    description: "Your resume matches well with the required keywords in the job description.",
  },
  {
    key: "skills",
    title: "Skills Match",
    value: 80,
    description: "Your skills align closely with the job requirements and expectations.",
  },
  {
    key: "experience",
    title: "Experience Relevance",
    value: 75,
    description: "Your experience is relevant and adds strong value to the role you’re applying for.",
  },
  {
    key: "content",
    title: "Content Quality",
    value: 70,
    description: "Well-structured content with achievement and measurable impact.",
  },
];

const ICONS = {
  keyword: (
    <svg viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.5-4.5" />
    </svg>
  ),
  skills: (
    <svg viewBox="0 0 24 24">
      <rect x="3" y="7" width="18" height="13" rx="2.5" />
      <path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7" />
      <path d="M3 13h18" />
      <path d="M10.5 13v1.5h3V13" />
    </svg>
  ),
  experience: (
    <svg viewBox="0 0 24 24">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6" />
      <path d="M9 17h4" />
    </svg>
  ),
  content: (
    <svg viewBox="0 0 24 24">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
    </svg>
  ),
};

const ORDER = ["keyword", "skills", "experience", "content"];
const WIDE_QUERY = "(min-width: 1100px)";
const STUB = 10;

// Polyline with rounded corners. The radius shrinks on short segments.
function roundedPath(points, radius) {
  const p = points.filter(
    (pt, i) => i === 0 || Math.hypot(pt[0] - points[i - 1][0], pt[1] - points[i - 1][1]) > 0.5
  );
  let d = `M${p[0][0]} ${p[0][1]}`;
  for (let i = 1; i < p.length - 1; i++) {
    const a = p[i - 1];
    const b = p[i];
    const c = p[i + 1];
    const l1 = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const l2 = Math.hypot(c[0] - b[0], c[1] - b[1]);
    const r = Math.min(radius, l1 / 2, l2 / 2);
    const p1 = [b[0] + ((a[0] - b[0]) / l1) * r, b[1] + ((a[1] - b[1]) / l1) * r];
    const p2 = [b[0] + ((c[0] - b[0]) / l2) * r, b[1] + ((c[1] - b[1]) / l2) * r];
    d += ` L${p1[0]} ${p1[1]} Q${b[0]} ${b[1]} ${p2[0]} ${p2[1]}`;
  }
  const e = p[p.length - 1];
  return `${d} L${e[0]} ${e[1]}`;
}

export default function ATSScore({
  score = 85,
  metrics = DEFAULT_METRICS,
  title = "Smart Score. Stronger Impression.",
  subtitle = "Get an AI-powered breakdown of your resume’s effectiveness and create a resume that gets you noticed",
}) {
  const boardRef = useRef(null);
  const hubRef = useRef(null);
  const cardRefs = useRef({});
  const [wires, setWires] = useState({ w: 0, h: 0, items: [] });

  const compute = useCallback(() => {
    const board = boardRef.current;
    const hub = hubRef.current;
    if (!board || !hub) return;

    const bRect = board.getBoundingClientRect();
    const box = (el) => {
      const r = el.getBoundingClientRect();
      return {
        l: r.left - bRect.left,
        r: r.right - bRect.left,
        t: r.top - bRect.top,
        b: r.bottom - bRect.top,
        cx: (r.left + r.right) / 2 - bRect.left,
        cy: (r.top + r.bottom) / 2 - bRect.top,
      };
    };

    const H = box(hub);
    const els = cardRefs.current;
    if (ORDER.some((k) => !els[k])) return;
    const colorOf = (key) => getComputedStyle(els[key]).getPropertyValue("--c").trim();

    const items = [];

    if (window.matchMedia(WIDE_QUERY).matches) {
      // One row: wires leave the hub's sides and drop onto the top of each card.
      const yOuter = H.t + (H.b - H.t) * 0.335;
      const yInner = H.t + (H.b - H.t) * 0.5;
      const cfg = {
        keyword: { side: -1, y: yOuter, inner: false },
        skills: { side: -1, y: yInner, inner: true },
        experience: { side: 1, y: yInner, inner: true },
        content: { side: 1, y: yOuter, inner: false },
      };

      ORDER.forEach((key) => {
        const k = cfg[key];
        const c = box(els[key]);
        const edge = k.side < 0 ? H.l : H.r;
        const sx = edge + k.side * STUB;
        const ox = sx + k.side * 46;
        const beyond = k.side < 0 ? c.cx <= ox : c.cx >= ox;

        const pts = [[sx, k.y]];
        if (k.inner && !beyond) {
          const my = H.b + (c.t - H.b) * 0.35;
          pts.push([ox, k.y], [ox, my], [c.cx, my]);
        } else {
          pts.push([c.cx, k.y]);
        }
        pts.push([c.cx, c.t]);

        items.push({
          key,
          color: colorOf(key),
          d: roundedPath(pts, 18),
          stub: { x: Math.min(edge, sx), y: k.y - 3, w: STUB, h: 6 },
          dot: { x: c.cx, y: c.t },
        });
      });
    } else {
      // 2x2: wires drop from the hub's bottom edge and turn into the card nearest the centre lane.
      const kc = box(els.keyword);
      const cc = box(els.content);
      const lane = cc.l - kc.r;
      const s = Math.max(10, Math.min(38, (lane - 28) / 3));
      const xs = {
        keyword: H.cx - 1.5 * s,
        skills: H.cx - 0.5 * s,
        experience: H.cx + 0.5 * s,
        content: H.cx + 1.5 * s,
      };
      const side = { keyword: -1, skills: -1, experience: 1, content: 1 };

      ORDER.forEach((key) => {
        const c = box(els[key]);
        const x = xs[key];
        const ex = side[key] < 0 ? c.r : c.l;
        items.push({
          key,
          color: colorOf(key),
          d: roundedPath([[x, H.b + STUB], [x, c.cy], [ex, c.cy]], 18),
          stub: { x: x - 3, y: H.b, w: 6, h: STUB },
          dot: { x: ex, y: c.cy },
        });
      });
    }

    setWires({ w: board.clientWidth, h: board.clientHeight, items });
  }, []);

  useEffect(() => {
    let raf = 0;
    const queue = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };

    const mq = window.matchMedia(WIDE_QUERY);
    const ro = new ResizeObserver(queue);
    ro.observe(boardRef.current);
    window.addEventListener("resize", queue);
    mq.addEventListener("change", queue);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(queue);
    queue();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", queue);
      mq.removeEventListener("change", queue);
    };
  }, [compute]);

  return (
    <section
      className={`${poppins.variable} ${inter.variable} ${styles.section}`}
      aria-labelledby="ats-score-title"
    >
      <div className={styles.inner}>
        <header className={styles.head}>
          <h2 className={styles.headline} id="ats-score-title">
            {title}
          </h2>
          <p className={styles.sub}>{subtitle}</p>
        </header>

        <div className={styles.board} ref={boardRef}>
          <div className={styles.hub} ref={hubRef}>
            <div className={styles.hubLabel}>ATS Score</div>
            <div className={styles.hubScore}>{score}%</div>
            <div className={styles.hubLabel}>Overall Impact</div>
          </div>

          <div className={styles.cards}>
            {metrics.map((m) => (
              <article
                key={m.key}
                className={styles.card}
                data-key={m.key}
                ref={(el) => {
                  if (el) cardRefs.current[m.key] = el;
                }}
              >
                <div className={styles.icon} aria-hidden="true">
                  {ICONS[m.key]}
                </div>
                <h3 className={styles.cardTitle}>{m.title}</h3>
                <div className={styles.pct}>{m.value}%</div>
                <div
                  className={styles.bar}
                  role="progressbar"
                  aria-label={m.title}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={m.value}
                >
                  <i style={{ "--v": `${m.value}%` }} />
                </div>
                <p className={styles.desc}>{m.description}</p>
              </article>
            ))}
          </div>

          <svg
            className={styles.wires}
            viewBox={`0 0 ${wires.w} ${wires.h}`}
            aria-hidden="true"
            focusable="false"
          >
            {wires.items.map((w) => (
              <g key={w.key}>
                <rect
                  className={styles.stub}
                  x={w.stub.x}
                  y={w.stub.y}
                  width={w.stub.w}
                  height={w.stub.h}
                  rx="1.5"
                  fill={w.color}
                />
                <path className={styles.wire} d={w.d} stroke={w.color} />
                <circle className={styles.dot} cx={w.dot.x} cy={w.dot.y} r="6" fill={w.color} />
              </g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}
