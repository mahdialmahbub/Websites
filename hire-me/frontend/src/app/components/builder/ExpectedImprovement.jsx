import React from "react";

/**
 * The green box under the suggestions: what gets better when they are applied.
 * The numbers come from the same rules as the score, so "+8" here is exactly what the score will gain.
 */
export default function ExpectedImprovement({ points, fromScore, toScore, benefits }) {
  if (points <= 0) return null;

  return (
    <section aria-label="Expected improvement" className="rounded-[clamp(0.5rem,calc(0.376vw+0.412rem),0.75rem)] border border-green-500/10 bg-green-500/5 p-[clamp(0.75rem,calc(0.376vw+0.662rem),1rem)]">
      <div className="flex items-center gap-space-2">
        <div className="flex size-9.5 items-center justify-center rounded-lg border border-green-500/5 bg-green-500/5 text-body text-green-500/70">
          <i className="fi fi-rr-chart-line-up" aria-hidden="true"></i>
        </div>
        <div>
          <h4 className="font-primary text-[clamp(0.875rem,calc(0.188vw+0.831rem),1rem)] font-semibold text-green-700">
            Expected improvement: +{points} ATS score
          </h4>
          <p className="text-[clamp(0.75rem,calc(0.188vw+0.706rem),0.875rem)] text-green-700/70">
            Your score can go from {fromScore} to {toScore} if you apply these suggestions.
          </p>
        </div>
      </div>
      {benefits.length > 0 && (
        <ul className="mt-[clamp(0.75rem,calc(0.188vw+0.706rem),0.875rem)] flex flex-col gap-[clamp(0.5rem,calc(0.376vw+0.412rem),0.75rem)]">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-center gap-space-2 rounded-[clamp(0.5rem,calc(0.376vw+0.412rem),0.75rem)] bg-white/60 p-space-3 font-primary text-[clamp(0.75rem,calc(0.188vw+0.706rem),0.875rem)] font-semibold text-green-800">
              <i className="fi fi-rr-memo-circle-check text-green-500/70" aria-hidden="true"></i>
              {benefit}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
