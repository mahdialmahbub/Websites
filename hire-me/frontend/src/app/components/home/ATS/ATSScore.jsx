"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./ATSScore.module.css";

/*
  Lines marked  FIX   = layout alignment fixes.
  Lines marked  ANIM  = data-flow animation + icon ring (all motion is CSS, see the module).
*/

/*
  Keep the four `key` values as they are: they pick each card's colour,
  icon and grid position. Change title, value and description freely.
*/
export const DEFAULT_METRICS = [
  {
    key: "keyword",
    title: "Keyword Match",
    value: 90,
    description:
      "Your resume matches well with the required keywords in the job description.",
  },
  {
    key: "skills",
    title: "Skills Match",
    value: 80,
    description:
      "Your skills align closely with the job requirements and expectations.",
  },
  {
    key: "experience",
    title: "Experience Relevance",
    value: 75,
    description:
      "Your experience is relevant and adds strong value to the role you’re applying for.",
  },
  {
    key: "content",
    title: "Content Quality",
    value: 70,
    description:
      "Well-structured content with achievement and measurable impact.",
  },
];

/*
  Per-card colour + grid position (2x2 layout). Full class strings are written out
  so Tailwind can see them. At 1100px+ the position classes are reset by
  `min-[1100px]:col-auto row-auto` on the card itself.
  FIX: justify-self keeps the capped-width cards tight to the centre lane in 2x2
  (left column -> end, right column -> start) and centred in their track at 1100px+.
*/
const CARD_THEME = {
  keyword:
    "col-start-1 row-start-1 justify-self-end min-[1100px]:justify-self-center [--c:var(--violet)] [--c-dim:var(--violet-dim)]",
  skills:
    "col-start-1 row-start-2 justify-self-end min-[1100px]:justify-self-center [--c:var(--amber)] [--c-dim:var(--amber-dim)]",
  experience:
    "col-start-3 row-start-2 justify-self-start min-[1100px]:justify-self-center [--c:var(--azure)] [--c-dim:var(--azure-dim)]",
  content:
    "col-start-3 row-start-1 justify-self-start min-[1100px]:justify-self-center [--c:var(--emerald)] [--c-dim:var(--emerald-dim)]",
};

/*
  ANIM: points added to the hub score when each card's data arrives, in ORDER
  (purple, orange, blue, green). The final ATS score is simply their sum.
  CHANGE THE SCORE HERE: [30, 25, 23, 20] -> 98%
*/
export const SCORE_STEPS = [30, 25, 23, 20];

/* ANIM: colour of each hub glow layer, in ORDER (purple, orange, blue, green). */
const HUB_GLOW = {
  keyword: "var(--violet)",
  skills: "var(--amber)",
  experience: "var(--azure)",
  content: "var(--emerald)",
};

const HUB_LABEL =
  "text-[clamp(16px,2.2vw,22px)] font-medium leading-[1.2] text-[color:var(--muted)]";

// Shared wrapper so every icon gets the same size / stroke styling.
function Svg({ children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[52%] w-[52%] fill-none stroke-current stroke-[1.8]"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

const ICONS = {
  keyword: "fi fi-rr-search",
  skills: "fi fi-rr-briefcase",
  experience: "fi fi-rr-document",
  content: "fi fi-rr-trophy-star",
};

const ORDER = ["keyword", "skills", "experience", "content"];
const WIDE_QUERY = "(min-width: 1100px)";
/*
  ===== HUB CONNECTOR (the plug at the end of each wire) — SIZE =====
  The look (colours, shine, shadow, glow, corner radius) is in ATSScore.module.css,
  in the "CONNECTOR STYLE" block.
*/
const PLUG = {
  position: "bottom", // "bottom" = plugs under the hub card | "sides" = on its left/right edges (old look)
  length: 14, // px along the wire: how far the plug sticks out of the hub
  thickness: 10, // px across the wire
};
const STUB = PLUG.length;

// Polyline with rounded corners. The radius shrinks on short segments.
function roundedPath(points, radius) {
  const p = points.filter(
    (pt, i) =>
      i === 0 ||
      Math.hypot(pt[0] - points[i - 1][0], pt[1] - points[i - 1][1]) > 0.5,
  );
  let d = `M${p[0][0]} ${p[0][1]}`;
  for (let i = 1; i < p.length - 1; i++) {
    const a = p[i - 1];
    const b = p[i];
    const c = p[i + 1];
    const l1 = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const l2 = Math.hypot(c[0] - b[0], c[1] - b[1]);
    const r = Math.min(radius, l1 / 2, l2 / 2);
    const p1 = [
      b[0] + ((a[0] - b[0]) / l1) * r,
      b[1] + ((a[1] - b[1]) / l1) * r,
    ];
    const p2 = [
      b[0] + ((c[0] - b[0]) / l2) * r,
      b[1] + ((c[1] - b[1]) / l2) * r,
    ];
    d += ` L${p1[0]} ${p1[1]} Q${b[0]} ${b[1]} ${p2[0]} ${p2[1]}`;
  }
  const e = p[p.length - 1];
  return `${d} L${e[0]} ${e[1]}`;
}

export default function ATSScore({
  scoreSteps = SCORE_STEPS, // ANIM: points each card adds; their sum is the final score
  metrics = DEFAULT_METRICS,
  title = "Smart Score. Stronger Impression.",
  subtitle = "Get an AI-powered breakdown of your resume’s effectiveness and create a resume that gets you noticed",
}) {
  // ANIM: running totals for the count-up (e.g. 30, 55, 78, 98)
  const totals = scoreSteps.reduce(
    (acc, step) => [...acc, acc[acc.length - 1] + step],
    [0],
  );
  const score = totals[totals.length - 1];

  const sectionRef = useRef(null); // ANIM: for the off-screen pause
  const boardRef = useRef(null);
  const hubRef = useRef(null);
  const cardRefs = useRef({});
  const [wires, setWires] = useState({ w: 0, h: 0, items: [] });

  const compute = useCallback(() => {
    const board = boardRef.current;
    const hub = hubRef.current;
    if (!board || !hub) return;

    /*
      ANIM: measure with offset* (layout position) instead of getBoundingClientRect.
      The cards and the hub now scale during the animation, and getBoundingClientRect
      includes transforms, which would shift the wires if a resize landed mid-pulse.
      The board is `relative`, so it is the offsetParent of both the hub and the cards.
    */
    const box = (el) => {
      const l = el.offsetLeft;
      const t = el.offsetTop;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      return { l, r: l + w, t, b: t + h, cx: l + w / 2, cy: t + h / 2 };
    };

    const H = box(hub);
    const els = cardRefs.current;
    if (ORDER.some((k) => !els[k])) return;
    const colorOf = (key) =>
      getComputedStyle(els[key]).getPropertyValue("--c").trim();

    const items = [];

    const wide = window.matchMedia(WIDE_QUERY).matches;

    if (wide && PLUG.position === "bottom") {
      /*
        One row, plugs UNDER the hub: each wire drops from the hub's bottom edge,
        runs sideways in its own lane, then drops onto the top of its card.
        Outer cards use the shallow lane and inner cards the deep lane, so the
        wires never cross. Plug order left -> right = card order.
      */
      const spacing = 28;
      const th = Math.min(PLUG.thickness, spacing - 2);
      ORDER.forEach((key, i) => {
        const c = box(els[key]);
        const x = H.cx + (i - 1.5) * spacing;
        const inner = key === "skills" || key === "experience";
        const laneY = Math.max(
          H.b + STUB + 10,
          H.b + (c.t - H.b) * (inner ? 0.7 : 0.38),
        );
        items.push({
          key,
          color: colorOf(key),
          d: roundedPath(
            [
              [x, H.b + STUB],
              [x, laneY],
              [c.cx, laneY],
              [c.cx, c.t],
            ],
            18,
          ),
          stub: { x: x - th / 2, y: H.b, w: th, h: STUB },
          dot: { x: c.cx, y: c.t },
        });
      });
    } else if (wide) {
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
          stub: {
            x: Math.min(edge, sx),
            y: k.y - PLUG.thickness / 2,
            w: STUB,
            h: PLUG.thickness,
          },
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
      const th = Math.min(PLUG.thickness, s - 2); // never wider than the gap between wires

      ORDER.forEach((key) => {
        const c = box(els[key]);
        const x = xs[key];
        const ex = side[key] < 0 ? c.r : c.l;
        items.push({
          key,
          color: colorOf(key),
          d: roundedPath(
            [
              [x, H.b + STUB],
              [x, c.cy],
              [ex, c.cy],
            ],
            18,
          ),
          stub: { x: x - th / 2, y: H.b, w: th, h: STUB },
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
    if (document.fonts && document.fonts.ready)
      document.fonts.ready.then(queue);
    queue();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", queue);
      mq.removeEventListener("change", queue);
    };
  }, [compute]);

  /*
    ANIM: pause every animation while the section is off-screen.
    Writes a data attribute through the ref (no state, so no re-render);
    the CSS module does the actual pausing.
  */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        el.dataset.active = entry.isIntersecting ? "true" : "false";
      },
      { rootMargin: "80px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      /* ANIM: animations only start once the wires exist, so everything begins in the same frame */
      data-ready={wires.items.length > 0 ? "true" : "false"}
      className={`${styles.section} w-full bg-(--bg) px-4 py-[clamp(40px,7vw,88px)] font-(family-name:--body) text-(--fg) antialiased scheme-dark`}
      aria-labelledby="ats-score-title"
    >
      <div className="mx-auto flex min-w-75 max-w-250 flex-col items-center">
        <header className="mb-[clamp(32px,6vw,64px)] text-center">
          <h2
            className="font-(family-name:--display) text-[clamp(22px,5.2vw,38px)] font-bold leading-h2 text-balance bg-[linear-gradient(90deg,#a855f7_0%,#d8b4fe_28%,#f4f4f5_50%,#a7f3d0_74%,#34d399_100%)] bg-clip-text text-transparent"
            id="ats-score-title"
          >
            {title}
          </h2>
          <p className="mx-auto mt-[clamp(0.6rem,calc(0.376vw+0.412rem),0.75rem)] max-w-175 text-[clamp(0.875rem,calc(0.563vw+0.743rem),1.25rem)] leading-normal text-(--muted) text-balance">
            {subtitle}
          </p>
        </header>

        <div
          className="relative flex w-full flex-col items-center gap-[clamp(26px,4vw,34px)] min-[1100px]:gap-20"
          ref={boardRef}
        >
          {/* ANIM: `relative` + styles.hub (pulse) + the 4 glow layers below */}
          <div
            className={`${styles.hub} relative w-[clamp(200px,52%,300px)] rounded-lg border-5 border-solid border-transparent px-4 py-[clamp(20px,3.4vw,34px)] text-center shadow-[0_12px_40px_rgba(0,0,0,0.55)] [background:linear-gradient(var(--hub),var(--hub))_padding-box,linear-gradient(to_bottom,rgb(110_110_115/30%),rgb(110_110_115/15%))_border-box]`}
            ref={hubRef}
          >
            {ORDER.map((k, i) => (
              <span
                key={k}
                aria-hidden="true"
                className={styles.hubLayer}
                style={{ "--i": i, "--c": HUB_GLOW[k] }}
              />
            ))}
            <div className={`${HUB_LABEL} text-[clamp(12px,8vw,16px)]`}>
              ATS Score
            </div>
            {/*
              ANIM: starts at 0%, then adds scoreSteps[i] each time card i's packet arrives (count-up).
              The visible number is drawn by CSS (styles.count) from the animated --ats-n,
              so there is no React state and it stays on the same clock as the wires.
              The sr-only span gives screen readers the final value.
            */}
            <div
              className={`${styles.score} my-[clamp(6px,1.4vw,12px)] font-(family-name:--display) text-[clamp(32px,8vw,44px)] font-bold leading-display tabular-nums text-(--score) [text-shadow:0_0_30px_rgba(124,108,245,0.5)]`}
              style={{
                "--score-final": score,
                "--n1": totals[1],
                "--n2": totals[2],
                "--n3": totals[3],
                "--n4": totals[4],
              }}
            >
              <span className="sr-only">{score}%</span>
              <span className={styles.count} aria-hidden="true" />
            </div>
            <div className={`${HUB_LABEL} text-[clamp(8px,8vw,12px)] opacity-50`}>
              Overall Impact
            </div>
          </div>

          {/* FIX: items-stretch so every card in a row has the same height */}
          <div className="grid w-full grid-cols-[minmax(0,275px)_var(--lane)_minmax(0,275px)] items-stretch justify-center gap-y-[clamp(24px,3vw,34px)] min-[1100px]:grid-cols-[repeat(4,minmax(0,275px))] min-[1100px]:justify-between">
            {metrics.map((m) => (
              <article
                key={m.key}
                data-key={m.key}
                /* FIX: w-full so justify-self never shrinks the card to its content; max-w keeps the 220px cap */
                /* ANIM: `relative` (for the ::after glow) + styles.card, --i = firing order */
                className={`${styles.card} ${CARD_THEME[m.key]} relative flex w-full min-w-0 max-w-[220px] flex-col items-center rounded-[clamp(12px,3vw,16px)] border-[1.5px] border-solid border-[color-mix(in_srgb,var(--c)_75%,transparent)] bg-(--panel) px-[clamp(12px,2.2vw,24px)] pb-[clamp(20px,3vw,30px)] pt-[clamp(20px,3vw,32px)] text-center [box-shadow:0_0_0_4px_color-mix(in_srgb,var(--c)_9%,transparent),0_0_32px_color-mix(in_srgb,var(--c)_26%,transparent)] min-[1100px]:col-auto min-[1100px]:row-auto`}
                style={{ "--i": ORDER.indexOf(m.key) }}
                ref={(el) => {
                  if (el) cardRefs.current[m.key] = el;
                }}
              >
                {/*
                  ANIM: same outer size and radius as before. The old 2px border is now the
                  wrapper's padding; the spinning conic ring + dim border are drawn by styles.ring.
                */}
                <div
                  className={`${styles.ring} relative grid aspect-square w-[clamp(48px,7vw,68px)] place-items-center overflow-hidden rounded-[clamp(8px,1.8vw,12px)] p-0.5 text-(--c)`}
                  aria-hidden="true"
                >
                  <div className="relative z-10 grid place-items-center place-self-stretch rounded-[calc(clamp(8px,1.8vw,12px)-2px)] bg-[color-mix(in_srgb,var(--c)_10%,#0d0d0d)]">
                    <i className={`${ICONS[m.key]} text-[clamp(1.2rem,calc(0.682vw+0.864rem),2.3rem)]`}></i>
                  </div>
                </div>
                {/* FIX: min-h = 2 lines, so a 2-line title ("Experience Relevance") no longer pushes its % and bar down */}
                <h3 className="mt-[clamp(10px,2vw,12px)] flex min-h-[2.5em] items-center justify-center text-[clamp(14px,2.2vw,18px)] font-semibold leading-tight text-white text-balance">
                  {m.title}
                </h3>
                <div className="mb-[clamp(8px,1.6vw,14px)] mt-[clamp(16px,2vw,22px)] font-(family-name:--display) text-[clamp(20px,5vw,28px)] font-bold leading-none tabular-nums text-(--c)">
                  {m.value}%
                </div>
                <div
                  className="h-[clamp(6px,2vw,9px)] w-full overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--c)_12%,#151515)]"
                  role="progressbar"
                  aria-label={m.title}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={m.value}
                >
                  <i
                    className={`${styles.fill} block h-full w-(--v) origin-left rounded-full bg-[linear-gradient(90deg,var(--c-dim),var(--c))]`}
                    style={{ "--v": `${m.value}%` }}
                  />
                </div>
                <p className="mt-[clamp(12px,2vw,16px)] text-[clamp(11.5px,1.5vw,14.5px)] leading-[1.4] text-(--muted) text-pretty">
                  {m.description}
                </p>
              </article>
            ))}
          </div>

          <svg
            className="pointer-events-none absolute inset-0 z-2 h-full w-full overflow-visible"
            viewBox={`0 0 ${wires.w} ${wires.h}`}
            aria-hidden="true"
            focusable="false"
          >
            {wires.items.map((w) => (
              /* ANIM: --c = wire colour, --i = firing order. Every overlay below reuses this wire's own path `d`. */
              <g
                key={w.key}
                style={{ "--c": w.color, "--i": ORDER.indexOf(w.key) }}
              >
                {/* the wire itself (unchanged) */}
                <path
                  className="fill-none stroke-3 opacity-40"
                  d={w.d}
                  stroke={w.color}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* ANIM: brighter pipe while the packet is on it */}
                <path className={styles.lit} d={w.d} pathLength="1" />
                {/* ANIM: comet trail (soft halo + core) */}
                <path
                  className={`${styles.trail} ${styles.halo}`}
                  d={w.d}
                  pathLength="1"
                />
                <path className={styles.trail} d={w.d} pathLength="1" />
                {/* card-side dot (unchanged look) + ripple */}
                <circle
                  className={`${styles.dot}`}
                  cx={w.dot.x}
                  cy={w.dot.y}
                  r="6"
                  fill={w.color}
                />
                <circle
                  className={styles.ripple}
                  cx={w.dot.x}
                  cy={w.dot.y}
                  r="6"
                />
                {/* ANIM: the packet (soft halo + core), travels card -> hub */}
                <path
                  className={`${styles.head} ${styles.halo}`}
                  d={w.d}
                  pathLength="1"
                />
                <path className={styles.head} d={w.d} pathLength="1" />
                {/* ANIM: ripple at the hub port on arrival */}
                <circle
                  className={styles.portRing}
                  cx={w.stub.x + w.stub.w / 2}
                  cy={w.stub.y + w.stub.h / 2}
                  r="6"
                />
              </g>
            ))}
          </svg>

          {/* ANIM: hub connector plugs. Plain elements (not SVG) so the whole look is editable in CSS. */}
          {wires.items.map((w) => (
            <span
              key={w.key}
              aria-hidden="true"
              className={styles.plug}
              data-orient={w.stub.w > w.stub.h ? "h" : "v"}
              style={{
                left: w.stub.x,
                top: w.stub.y,
                width: w.stub.w,
                height: w.stub.h,
                "--c": w.color,
                "--i": ORDER.indexOf(w.key),
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
