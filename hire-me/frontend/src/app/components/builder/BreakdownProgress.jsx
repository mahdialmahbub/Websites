/**
 * BreakdownProgress
 * One row of a score breakdown: a title, its score, and a progress bar that is
 * filled to `score`% of the bar's width.
 *
 * USAGE
 *   import BreakdownProgress from "@/components/BreakdownProgress";
 *   <BreakdownProgress title="Clarity" score={85} />
 *
 * PROPS        type    default   description
 * ---------------------------------------------------------------------------
 * title        string  "Score"   Label shown next to the score
 * score        number  0         Number from 0 to 100. Out-of-range values are
 *                                clamped; anything that is not a number
 *                                (string, null, NaN...) falls back to the default
 * className    string  ""       Extra classes for the outer card (margin, width...)
 */

const MIN_SCORE = 0;
const MAX_SCORE = 100;
const DEFAULT_SCORE = 0;

// Accepts real numbers only, and keeps them between MIN_SCORE and MAX_SCORE.
const sanitizeScore = (value) =>
  typeof value === "number" && Number.isFinite(value)
    ? Math.min(Math.max(value, MIN_SCORE), MAX_SCORE)
    : DEFAULT_SCORE;

const BreakdownProgress = ({
  title = "Score",
  score = DEFAULT_SCORE,
  className = "",
}) => {
  const value = sanitizeScore(score);

  return (
    <div
      className={`px-[clamp(0.75rem,calc(0.376vw+0.662rem),1rem)] py-[clamp(0.5rem,calc(0.376vw+0.412rem),0.75rem)] rounded-lg bg-white border border-neutral-500/5 shadow-[0_1px_2px_rgba(0,0,0,0.10)] ${className}`}
    >
      <div className="flex items-center justify-between mb-space-3">
        <p className="font-semibold text-[clamp(0.75rem,calc(0.188vw+0.706rem),0.875rem)]">
          {title}
        </p>
        <span className="font-primary font-semibold text-violet-500 text-[clamp(0.875rem,calc(0.188vw+0.831rem),1rem)]">
          {value}%
        </span>
      </div>

      {/* Progress: the inner span's width is `value`% of this track */}
      <div
        role="progressbar"
        aria-label={title}
        aria-valuemin={MIN_SCORE}
        aria-valuemax={MAX_SCORE}
        aria-valuenow={value}
        className="rounded-full w-full bg-violet-500/5 h-1 overflow-hidden"
      >
        <span
          className="block h-full rounded-full bg-violet-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

export default BreakdownProgress;
