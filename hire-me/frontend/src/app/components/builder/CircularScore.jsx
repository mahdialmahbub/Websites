/**
 * CircularScore
 * Gauge-style circular progress (open at the bottom) with a number in the
 * center and a label badge underneath. Built with SVG + inline styles only,
 * so it needs no Tailwind, no CSS file, no hooks and no extra package.
 * Works in both Server and Client components.
 *
 * USAGE
 *   import CircularScore from "@/components/CircularScore";
 *   <CircularScore value={98} label="Excellent" />
 *
 * PROPS            type     default      description
 * ---------------------------------------------------------------------------
 * value            number   98           Number shown in the center
 * progress         number   -            Arc fill 0-100. Omit it and `value` is used
 * label            string   "Excellent"  Badge text. Pass "" to hide the badge
 * suffix           string   "%"          Text after the number
 * size             number   140          Width & height in px (text scales with it)
 * strokeWidth      number   10           Arc thickness in px
 * sweepAngle       number   270          Arc length in degrees (1-360)
 * progressColor    string   "#40B58A"    Filled arc color
 * trackColor       string   "#ECEEF0"    Unfilled arc color
 * valueColor       string   "#1F6B54"    Center number color
 * labelColor       string   "#2F8F6F"    Badge text color
 * labelBgColor     string   "#E8F5EF"    Badge background color
 * animate          boolean  true         Grow the arc from 0 on first paint
 * duration         number   900          Animation length in ms
 * className/style  -        -            Applied to the wrapper <div>
 * ...rest          -        -            Any other prop (id, data-*, aria-*) goes to the wrapper
 */

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

const toNumber = (n, fallback = 0) => {
  const num = Number(n);
  return Number.isFinite(num) ? num : fallback;
};

// The arc grows from empty on first paint (CSS keyframes), and later changes
// of `value` glide with a transition. Both are off for prefers-reduced-motion.
const ANIMATION_CSS = `
@keyframes cscore-grow {
  from { stroke-dashoffset: var(--cscore-arc); }
}
.cscore-animated {
  animation: cscore-grow var(--cscore-duration) cubic-bezier(0.22, 1, 0.36, 1);
  transition: stroke-dashoffset var(--cscore-duration) cubic-bezier(0.22, 1, 0.36, 1);
}
@media (prefers-reduced-motion: reduce) {
  .cscore-animated {
    animation: none;
    transition: none;
  }
}
`;

export default function CircularScore({
  value = 98,
  progress,
  label = "Excellent",
  suffix = "%",
  size = 140,
  strokeWidth = 10,
  sweepAngle = 270,
  progressColor = "#40B58A",
  trackColor = "#ECEEF0",
  valueColor = "#1F6B54",
  labelColor = "#2F8F6F",
  labelBgColor = "#E8F5EF",
  animate = true,
  duration = 900,
  className,
  style,
  ...rest
}) {
  // Arc fill (0-100). `progress` wins if given, otherwise `value` drives it.
  const percent = clamp(toNumber(progress ?? value), 0, 100);

  // Geometry
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const sweep = clamp(toNumber(sweepAngle, 270), 1, 360);
  const arcLength = (circumference * sweep) / 360;
  const rotation = 90 + (360 - sweep) / 2; // keeps the opening centered at the bottom

  const circleProps = {
    cx: center,
    cy: center,
    r: radius,
    fill: "none",
    strokeWidth,
    strokeLinecap: "round",
    strokeDasharray: `${arcLength} ${circumference}`,
    transform: `rotate(${rotation} ${center} ${center})`,
  };

  return (
    <div
      role="progressbar"
      aria-label="Score"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(percent)}
      aria-valuetext={`${value}${suffix}${label ? `, ${label}` : ""}`}
      className={className}
      style={{
        position: "relative",
        display: "inline-block",
        width: size,
        height: size,
        flexShrink: 0,
        ...style,
      }}
      {...rest}
    >
      {animate && <style>{ANIMATION_CSS}</style>}

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ display: "block" }}
        aria-hidden="true"
      >
        {/* Track */}
        <circle {...circleProps} stroke={trackColor} />

        {/* Progress */}
        <circle
          {...circleProps}
          className={animate ? "cscore-animated" : undefined}
          stroke={progressColor}
          strokeDashoffset={arcLength * (1 - percent / 100)}
          style={{
            opacity: percent > 0 ? 1 : 0, // no round-cap dot at 0
            "--cscore-arc": arcLength,
            "--cscore-duration": `${duration}ms`,
          }}
        />
      </svg>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: label ? size * 0.1 : 0,
        }}
      >
        <span
          style={{
            fontSize: size * 0.22,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: valueColor,
          }}
        >
          {value}
          {suffix}
        </span>

        {label ? (
          <span
            style={{
              marginTop: size * 0.07,
              padding: `${size * 0.03}px ${size * 0.1}px`,
              borderRadius: 999,
              background: labelBgColor,
              color: labelColor,
              fontSize: size * 0.09,
              fontWeight: 600,
              lineHeight: 1.2,
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}
