import React from "react";

/* ---------- Single Star (supports full / half / empty fill) ---------- */
function Star({ fillPercent, size = 16 }) {
  const id = React.useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id={id} x1="0" x2="100%" y1="0" y2="0">
          <stop offset={`${fillPercent}%`} stopColor="#1FC0D9" />
          <stop offset={`${fillPercent}%`} stopColor="#6B7280" />
        </linearGradient>
      </defs>
      <path
        d="M12 2.5l2.94 6.32 6.86.86-5.02 4.86 1.32 6.9L12 17.9l-6.1 3.54 1.32-6.9L2.2 9.68l6.86-.86L12 2.5z"
        fill={`url(#${id})`}
      />
    </svg>
  );
}

/* ---------- Rating Row: 5 stars + numeric label ---------- */
export default function StarRating({
  rating = 0,
  max = 5,
  size = 22,
  className,
}) {
  const clamped = Math.min(Math.max(rating, 0), max);

  const stars = Array.from({ length: max }, (_, i) => {
    const diff = clamped - i;
    let percent;
    if (diff >= 1) percent = 100;
    else if (diff > 0)
      percent = Math.round(diff * 100); // handles .5 and any fraction
    else percent = 0;
    return <Star key={i} fillPercent={percent} size={size} />;
  });

  return (
    <div
      className={className}
      style={{ display: "flex", alignItems: "center", gap: 8 }}
    >
      <div style={{ display: "flex", gap: 3 }}>{stars}</div>
      <span className="text-md font-semibold text-secondary-600 flex items-end gap-0.5">
        {clamped.toFixed(1)}
        <span className="text-size-xs_2 font-semibold opacity-60 text-placeholder">
          /5
        </span>
      </span>
    </div>
  );
}
