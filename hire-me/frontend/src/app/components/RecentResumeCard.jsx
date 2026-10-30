import Image from "next/image";
import { icons } from "../../../assets/iconCollection";
import { Button } from "./Button";

/* -------------------------------------------------------------------------- */
/*  Style constants (responsive values, reused/long Tailwind classes)         */
/* -------------------------------------------------------------------------- */
const CARD_SHADOW = "shadow-[0_-1px_10px_rgba(0,0,0,0.20)]";
const PANEL_PADDING = "p-[clamp(0.75rem,calc(0.485vw+0.636rem),1rem)]";
const TITLE_SIZE = "text-[clamp(1rem,calc(0.242vw+0.943rem),1.125rem)]";
const BADGE_SPACING = "mb-[clamp(0.75rem,calc(0.485vw+0.636rem),1rem)]";
const ACTIONS_GAP = "gap-[clamp(0.375rem,calc(0.485vw+0.261rem),0.625rem)]";
const OVERLAY_LABEL_OFFSET = "mt-[clamp(3rem,calc(0.97vw+2.773rem),3.5rem)]";

const ICON_BUTTON = "flex-1 min-w-0";

/**
 * A saved resume: preview, meta info and actions.
 *
 * @param {Object}   props
 * @param {React.ReactNode} [props.thumbnail] The live preview (<ResumeThumb />). Falls back to a sample image.
 * @param {string}   [props.title]        Resume title
 * @param {string}   [props.subtitle]     Short line, clamped to 2 lines (template, last updated ...)
 * @param {number|null} [props.atsScore]  0-100, shown as a badge
 * @param {string}   [props.statusLabel]  "Draft" / "Generated"
 * @param {boolean}  [props.shared]       Has a public share link
 * @param {boolean}  [props.busy]         An action on this card is running: the buttons are disabled
 * @param {Function} [props.onPreview]    "View Preview" (the hover overlay)
 * @param {Function} [props.onEdit] [props.onDelete] [props.onDownload] [props.onDuplicate] [props.onCopyLink]
 */
const RecentResumeCard = ({
  thumbnail,
  title = "Marketing Manager",
  subtitle = "A creative graphic designer with over 5 ...",
  atsScore = null,
  statusLabel,
  shared = false,
  busy = false,
  onPreview,
  onDelete,
  onDownload,
  onDuplicate,
  onCopyLink,
  onEdit,
}) => {
  return (
    <article
      aria-busy={busy}
      className={`group relative aspect-210/340 overflow-hidden rounded-md border border-violet-500/5 bg-white w-[clamp(13rem,calc(4.848vw+15.739rem),17rem)] ${CARD_SHADOW}`}
    >
      {/* Thumbnail */}
      {thumbnail ?? (
        <Image className="h-auto w-full object-cover" src="/preview.jpg" alt={`${title} resume preview`} width={310} height={440} />
      )}

      {/* Hover overlay: the preview */}
      <button
        type="button"
        onClick={onPreview}
        aria-label={`View a larger preview of ${title}`}
        className="absolute inset-x-0 top-0 hidden aspect-210/297 cursor-pointer bg-black/40 group-hover:flex group-focus-within:flex"
      >
        <span className={`mx-auto text-center font-bold tracking-wide text-neutral-50 ${OVERLAY_LABEL_OFFSET}`}>
          <i className={`${icons.preview} text-2xl mb-1.5`} aria-hidden="true" />
          View Preview
        </span>
      </button>

      {/* Info panel */}
      <div className={`absolute bottom-0 z-10 w-full rounded-md bg-white ${PANEL_PADDING} ${CARD_SHADOW}`}>
        <h4 className={`mb-1.5 truncate font-primary font-semibold ${TITLE_SIZE}`} title={title}>
          {title}
        </h4>

        <p className="mb-2.5 line-clamp-2 text-caption sm:text-small">{subtitle}</p>

        {/* Badges: ATS score, state, shared */}
        <div className={`flex flex-wrap items-center gap-space-1 ${BADGE_SPACING}`}>
          {atsScore !== null && (
            <span className="flex items-center gap-space-1 rounded-full bg-violet-500/5 px-space-3 py-1.5 text-nowrap font-primary text-[10px] font-medium text-violet-500/80">
              <i className={icons.resume} aria-hidden="true" />
              ATS {atsScore}/100
            </span>
          )}
          {statusLabel && (
            <span className="rounded-full bg-neutral-500/5 px-space-3 py-1.5 text-nowrap font-primary text-[10px] font-medium text-neutral-500">{statusLabel}</span>
          )}
          {shared && (
            <span className="rounded-full bg-green-500/5 px-space-3 py-1.5 text-nowrap font-primary text-[10px] font-medium text-green-500">Shared</span>
          )}
        </div>

        {/* Actions */}
        <div className={`mb-1.5 flex items-center ${ACTIONS_GAP}`}>
          <Button variant="secondary" icon={icons.delete} aria-label={`Delete ${title}`} disabled={busy} onClick={onDelete} className={`${ICON_BUTTON} bg-red-500/5 text-red-500 hover:bg-red-500/10`} />
          <Button variant="secondary" icon={icons.fileDownload} aria-label={`Download ${title}`} disabled={busy} onClick={onDownload} className={`${ICON_BUTTON} bg-green-500/5 text-green-500 hover:bg-green-500/10`} />
          <Button variant="secondary" icon="fi fi-rr-copy-alt" aria-label={`Duplicate ${title}`} disabled={busy} onClick={onDuplicate} className={`${ICON_BUTTON} bg-violet-500/5 text-violet-500 hover:bg-violet-500/10`} />
          <Button variant="secondary" icon={icons.link} aria-label={`Copy share link of ${title}`} disabled={busy} onClick={onCopyLink} className={`${ICON_BUTTON} bg-blue-500/5 text-blue-500 hover:bg-blue-500/10`} />
        </div>
        <Button variant="secondary" disabled={busy} onClick={onEdit} aria-label={`Edit ${title}`} className="w-full bg-primary-200/5 text-primary-200 hover:bg-primary-200/10">
          Edit
        </Button>
      </div>
    </article>
  );
};

export default RecentResumeCard;
