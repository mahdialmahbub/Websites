import React from "react";

/**
 * One rule-based suggestion: what to do, and how many ATS points it is worth.
 * Same look as the Suggestion card (orange), without the "improved version" box.
 */
export default function AtsSuggestionCard({ title, suggestion, points }) {
  return (
    <li className="relative flex items-start gap-space-2 overflow-hidden rounded-[clamp(0.5rem,calc(0.376vw+0.412rem),0.75rem)] bg-orange-500/5 px-[clamp(0.75rem,calc(0.376vw+0.662rem),1rem)] py-space-3">
      <div className="flex size-9.5 shrink-0 items-center justify-center rounded-lg border border-orange-500/5 bg-orange-500/5 text-body text-orange-500/60 max-sm:hidden">
        <i className="fi fi-rr-lightbulb-exclamation" aria-hidden="true"></i>
      </div>
      <div className="w-full">
        <div className="flex items-start justify-between gap-2">
          <h4 className="mb-space-1 font-primary text-[clamp(0.875rem,calc(0.188vw+0.831rem),1rem)] font-semibold">{title}</h4>
          <span className="shrink-0 rounded-full bg-green-500/5 px-2 py-0.5 text-[12px] font-semibold text-green-600" title="ATS points this can add">
            +{points}
          </span>
        </div>
        <p className="text-[clamp(0.75rem,calc(0.188vw+0.706rem),0.875rem)] text-neutral-500">{suggestion}</p>
      </div>
    </li>
  );
}
