/*  Layout constants — fixed desktop layout, not responsive            */
/* ------------------------------------------------------------------ */

const STAGE_W = 1396;
const CARD_W = 246;
const CARD_H = 305;
const CARD_TOP = 305;
const STAGE_H = CARD_TOP + CARD_H;
const ATS_W = 376;
const ATS_H = 209;

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */

const OVERALL_SCORE = 85;

// wire  -> connector path from the ATS card to the metric card
// port  -> small plug on the ATS card edge (x, y of the rect)
// dotX  -> anchor dot on the top edge of the metric card
const METRICS = [
  {
    id: "keyword",
    title: "Keyword Match",
    value: 90,
    description:
      "Your resume matches well with\nthe required keywords in the\njob description.",
    icon: "fi-rr-search",
    color: "#9333ea",
    rgb: "147, 51, 234",
    barFrom: "#6b2fa3",
    portColor: "#a58bd0",
    wire: "M500 70H139A16 16 0 0 0 123 86V304",
    port: { x: 500, y: 66.5 },
    dotX: 123,
  },
  {
    id: "skills",
    title: "Skills Match",
    value: 80,
    description:
      "Your skills align closely with\nthe job requirements and\nexpectations.",
    icon: "fi-rr-briefcase",
    color: "#e07b00",
    rgb: "224, 123, 0",
    barFrom: "#8a4b08",
    portColor: "#b8946a",
    wire: "M500 104H451A16 16 0 0 0 435 120V223A16 16 0 0 0 451 239H490.33A16 16 0 0 1 506.33 255V304",
    port: { x: 500, y: 100.5 },
    dotX: 506.33,
  },
  {
    id: "experience",
    title: "Experience Relevance",
    value: 75,
    description:
      "Your experience is relevant and\nadds strong value to the role\nyou’re applying for.",
    icon: "fi-rr-document",
    color: "#0a8ad6",
    rgb: "10, 138, 214",
    barFrom: "#0b4f7c",
    portColor: "#6fa5c9",
    wire: "M896 104H945A16 16 0 0 1 961 120V223A16 16 0 0 1 945 239H905.67A16 16 0 0 0 889.67 255V304",
    port: { x: 886, y: 100.5 },
    dotX: 889.67,
  },
  {
    id: "content",
    title: "Content Quality",
    value: 70,
    description:
      "Well-structured content with\nachievement and measurable\nimpact.",
    icon: "fi-rr-trophy-star",
    color: "#16a34a",
    rgb: "22, 163, 74",
    barFrom: "#15703a",
    portColor: "#7fae93",
    wire: "M896 70H1257A16 16 0 0 1 1273 86V304",
    port: { x: 886, y: 66.5 },
    dotX: 1273,
  },
];

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const HEADING_GRADIENT =
  "linear-gradient(90deg, #a24df0 0%, #c692f5 20%, #efe6fb 38%, #ffffff 52%, #e6f6ec 66%, #93dcab 84%, #34c26a 100%)";

const styles = {
  section: {
    boxSizing: "border-box",
    padding: "136px 0 130px",
    background: "#111111",
    textAlign: "center",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  },
  heading: {
    display: "block",
    width: "fit-content",
    margin: "0 auto",
    fontSize: 48,
    lineHeight: "58px",
    fontWeight: 600,
    backgroundImage: HEADING_GRADIENT,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    color: "transparent",
  },
  subheading: {
    maxWidth: 980,
    margin: "18px auto 0",
    fontSize: 20,
    lineHeight: "26px",
    fontWeight: 500,
    color: "#cfcfd6",
  },
  stage: {
    position: "relative",
    width: STAGE_W,
    height: STAGE_H,
    margin: "56px auto 0",
  },

  /* ATS score card */
  atsCard: {
    position: "absolute",
    top: 0,
    left: (STAGE_W - ATS_W) / 2,
    boxSizing: "border-box",
    width: ATS_W,
    height: ATS_H,
    padding: "23px 0 0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "#1b1b1b",
    border: "6px solid #2a2a2a",
    borderRadius: 21,
    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.45)",
  },
  atsText: {
    margin: 0,
    fontSize: 22,
    lineHeight: "27px",
    fontWeight: 500,
    color: "#e5e5e5",
  },
  atsValue: {
    margin: "19px 0 22px",
    fontSize: 56,
    lineHeight: "56px",
    fontWeight: 700,
    color: "#6d62f2",
    textShadow: "0 0 24px rgba(109, 98, 242, 0.45)",
  },

  /* metric cards */
  cards: {
    position: "absolute",
    top: CARD_TOP,
    left: 0,
    width: STAGE_W,
    display: "flex",
    justifyContent: "space-between",
  },
  metricTitle: {
    margin: "11px 0 0",
    fontSize: 19,
    lineHeight: "23px",
    fontWeight: 600,
    color: "#ffffff",
    whiteSpace: "nowrap",
  },
  metricValue: {
    margin: "22px 0 0",
    fontSize: 36,
    lineHeight: "43px",
    fontWeight: 600,
  },
  track: {
    width: 200,
    height: 10,
    margin: "12px 0 0",
    borderRadius: 999,
    overflow: "hidden",
    background: "rgba(255, 255, 255, 0.06)",
  },
  fill: { height: "100%", borderRadius: 999 },
  metricText: {
    margin: "18px 0 0",
    fontSize: 14,
    lineHeight: "17px",
    fontWeight: 400,
    color: "#d4d4d4",
    whiteSpace: "pre-line",
  },

  /* connector overlay */
  wires: {
    position: "absolute",
    top: 0,
    left: 0,
    overflow: "visible",
    pointerEvents: "none",
  },
};

const cardStyle = (m) => ({
  boxSizing: "border-box",
  width: CARD_W,
  height: CARD_H,
  padding: "26px 14px 0",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background: "#0e0e0e",
  border: `2px solid rgba(${m.rgb}, 0.55)`,
  borderRadius: 22,
  boxShadow: `0 0 20px rgba(${m.rgb}, 0.32), inset 0 0 10px rgba(${m.rgb}, 0.12)`,
});

const iconBoxStyle = (m) => ({
  display: "grid",
  placeItems: "center",
  boxSizing: "border-box",
  width: 62,
  height: 62,
  border: `2px solid ${m.color}`,
  borderRadius: 16,
  background: `rgba(${m.rgb}, 0.14)`,
  boxShadow: `0 0 12px rgba(${m.rgb}, 0.25)`,
});

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ATSScore() {
  return (
    <section style={styles.section}>
      {/* Flaticon Uicons — loaded from the CDN */}
      <link rel="stylesheet" href={UICONS_CSS} precedence="default" />

      <h2 style={styles.heading}>Smart Score. Stronger Impression.</h2>
      <p style={styles.subheading}>
        Get an AI-powered breakdown of your resume’s effectiveness and create a
        resume that gets you noticed
      </p>

      <div style={styles.stage}>
        {/* Overall score */}
        <div style={styles.atsCard}>
          <p style={styles.atsText}>ATS Score</p>
          <p style={styles.atsValue}>{OVERALL_SCORE}%</p>
          <p style={styles.atsText}>Overall Impact</p>
        </div>

        {/* Sub-metric cards */}
        <div style={styles.cards}>
          {METRICS.map((m) => (
            <article key={m.id} style={cardStyle(m)}>
              <div style={iconBoxStyle(m)}>
                <i
                  className={`fi ${m.icon}`}
                  style={{ ...iconStyle, color: m.color }}
                  aria-hidden="true"
                />
              </div>

              <h3 style={styles.metricTitle}>{m.title}</h3>
              <p style={{ ...styles.metricValue, color: m.color }}>
                {m.value}%
              </p>

              <div
                role="progressbar"
                aria-label={m.title}
                aria-valuenow={m.value}
                aria-valuemin={0}
                aria-valuemax={100}
                style={styles.track}
              >
                <div
                  style={{
                    ...styles.fill,
                    width: `${m.value}%`,
                    background: `linear-gradient(90deg, ${m.barFrom}, ${m.color})`,
                  }}
                />
              </div>

              <p style={styles.metricText}>{m.description}</p>
            </article>
          ))}
        </div>

        {/* Connector wires, plugs and anchor dots */}
        <svg
          width={STAGE_W}
          height={STAGE_H}
          viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
          fill="none"
          aria-hidden="true"
          style={styles.wires}
        >
          {METRICS.map((m) => (
            <path
              key={`${m.id}-wire`}
              d={m.wire}
              stroke={m.color}
              strokeWidth="3"
              strokeLinecap="round"
            />
          ))}
          {METRICS.map((m) => (
            <rect
              key={`${m.id}-port`}
              x={m.port.x}
              y={m.port.y}
              width="10"
              height="7"
              rx="2"
              fill={m.portColor}
            />
          ))}
          {METRICS.map((m) => (
            <circle
              key={`${m.id}-dot`}
              cx={m.dotX}
              cy={CARD_TOP - 1}
              r="6.5"
              fill={m.color}
            />
          ))}
        </svg>
      </div>
    </section>
  );
}
