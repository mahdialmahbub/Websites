export default function TrendCard({
  title = "Price Trends",
  changePercent = 12.5,
  comparisonLabel = "vs Last year",
  data = [20, 45, 70, 55, 40, 30, 45, 60, 50, 65, 80, 72, 85],
  color
}) {
  const width = 700;
  const height = 200;
  const padding = 10;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
    const y =
      height - padding - ((val - min) / range) * (height - padding * 2);
    return [x, y];
  });

  function buildSmoothPath(pts) {
    if (pts.length < 2) return "";
    let d = `M ${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const [x0, y0] = pts[i];
      const [x1, y1] = pts[i + 1];
      const mx = (x0 + x1) / 2;
      d += ` C ${mx},${y0} ${mx},${y1} ${x1},${y1}`;
    }
    return d;
  }

  const linePath = buildSmoothPath(points);
  const lastPoint = points[points.length - 1];
  const areaPath = `${linePath} L ${lastPoint[0]},${height} L ${points[0][0]},${height} Z`;

  const isPositive = changePercent >= 0;
  const accent = color ? color : "#e74cdc";

  return (
    <div className="bg-[#0b1120] border border-white/5 p-6 w-79.5 shadow-[inset_4px_4px_10px_rgba(255,255,255,0.10),inset_-4px_-4px_10px_rgba(0,0,0,0.25)]">
      <h3 className="text-background text-[18px] font-semibold">{title}</h3>

      <div className="flex items-baseline gap-1 ">
        <span
          className="text-[32px] font-semibold"
          style={{ color: accent }}
        >
          {isPositive ? "+" : ""}
          {changePercent}%
        </span>
      </div>

      <p className="text-placeholder text-[12px] font-semibold">{comparisonLabel}</p>

      <div className="mt-1">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
              <stop offset="100%" stopColor={accent} stopOpacity="0" />
            </linearGradient>
            <filter id="trendGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path d={areaPath} fill="url(#trendFill)" />

          <path
            d={linePath}
            fill="none"
            stroke={accent}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#trendGlow)"
          />

          <circle
            cx={lastPoint[0]}
            cy={lastPoint[1]}
            r="6"
            fill={accent}
            filter="url(#trendGlow)"
          />
          <circle
            cx={lastPoint[0]}
            cy={lastPoint[1]}
            r="9"
            fill="none"
            stroke={accent}
            strokeOpacity="0.35"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
}
