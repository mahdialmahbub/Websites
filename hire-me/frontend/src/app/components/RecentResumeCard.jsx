import Image from "next/image";
import { icons } from "../../../assets/iconCollection";
import { Button } from "./Button";

/* -------------------------------------------------------------------------- */
/*  Style constants (responsive values, reused/long Tailwind classes)         */
/* -------------------------------------------------------------------------- */
const CARD_SHADOW = "shadow-[0_-1px_10px_rgba(0,0,0,0.20)]";
const PANEL_PADDING = "p-[clamp(0.75rem,calc(0.485vw+0.636rem),1rem)]";
const TITLE_SIZE = "text-[clamp(1rem,calc(0.242vw+0.943rem),1.125rem)]";
const BADGE_SPACING = "mb-[clamp(1.25rem,calc(0.485vw+1.136rem),1.5rem)]";
const ACTIONS_GAP = "gap-[clamp(0.625rem,calc(0.727vw+0.455rem),1rem)]";
const OVERLAY_LABEL_OFFSET = "mt-[clamp(3.625rem,calc(0.97vw+3.398rem),4.125rem)]";

/**
 * Card that shows a recently created resume with preview, meta info and actions.
 *
 * @param {Object}   props
 * @param {string}   [props.preview]    Thumbnail image URL
 * @param {string}   [props.title]      Resume title
 * @param {string}   [props.subtitle]   Short description (clamped to 2 lines)
 * @param {number}   [props.page]       Number of pages
 * @param {Function} [props.onDelete]   Called when delete button is clicked
 * @param {Function} [props.onDownload] Called when download button is clicked
 * @param {Function} [props.onEdit]     Called when edit button is clicked
 */
const RecentResumeCard = ({
  preview = "/preview.jpg",
  title = "Marketing Manager",
  subtitle = "A creative graphic designer with over 5 ...",
  page = 1,
  onDelete,
  onDownload,
  onEdit,
}) => {
  return (
    <article
      className={`group relative aspect-210/297 overflow-hidden rounded-md border border-violet-500/5 w-[clamp(13rem,calc(4.848vw+15.739rem),17rem)] ${CARD_SHADOW}`}
    >
      {/* Thumbnail */}
      <Image
        className="h-full w-full object-cover"
        src={preview}
        alt={`${title} resume preview`}
        width={310}
        height={440}
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 hidden bg-black/40 group-hover:flex group-focus-within:flex">
        <span
          className={`mx-auto text-center font-bold tracking-wide text-neutral-50 ${OVERLAY_LABEL_OFFSET}`}
        >
          <i className={`${icons.preview} text-2xl mb-1.5`} />
          View Preview
        </span>
      </div>

      {/* Info panel */}
      <div
        className={`absolute bottom-0 z-10 w-full rounded-md bg-white ${PANEL_PADDING} ${CARD_SHADOW}`}
      >
        <h4 className={`mb-[6px] font-primary font-semibold ${TITLE_SIZE}`}>
          {title}
        </h4>

        <p className="mb-[12px] line-clamp-2 text-caption sm:text-small">
          {subtitle}
        </p>

        {/* Page count badge */}
        <span
          className={`flex items-center gap-space-1 rounded-full bg-violet-500/5 px-space-3 py-1.5 text-nowrap font-primary text-[10px] font-medium text-violet-500/80 max-w-max ${BADGE_SPACING}`}
        >
          <i className={icons.resume} />
          {page} {page === 1 ? "Page" : "Pages"}
        </span>

        {/* Actions */}
        <div className={`flex items-center ${ACTIONS_GAP}`}>
          <Button
            variant="secondary"
            icon={icons.delete}
            aria-label="Delete resume"
            onClick={onDelete}
            className="bg-red-500/5 text-red-500 hover:bg-red-500/10"
          />
          <Button
            variant="secondary"
            icon={icons.fileDownload}
            aria-label="Download resume"
            onClick={onDownload}
            className="bg-green-500/5 text-green-500 hover:bg-green-500/10"
          />
          <Button
            variant="secondary"
            onClick={onEdit}
            className="flex-1 bg-primary-200/5 text-primary-200 hover:bg-primary-200/10"
          >
            Edit
          </Button>
        </div>
      </div>
    </article>
  );
};

export default RecentResumeCard;