import Image from "next/image";

/**
 * @typedef {Object} Testimonial
 * @property {string | import("next/image").StaticImageData} [image] Avatar image (URL or static import). Falls back to the first letter of `name`.
 * @property {string} name Reviewer's name.
 * @property {string} [handle] Role / handle shown under the name (e.g. "Marketing Lead").
 * @property {string} text The testimonial quote.
 * @property {number} [rating] Star rating from 0 to 5. Stars are hidden when omitted.
 */

const MAX_RATING = 5;

const QUOTE_PATH =
  "M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z";

const STAR_PATH =
  "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 00-.363 1.118l1.287 3.957c.3.921-.755 1.688-1.538 1.118l-3.367-2.445a1 1 0 00-1.176 0l-3.367 2.445c-.783.57-1.838-.197-1.538-1.118l1.287-3.957a1 1 0 00-.363-1.118L2.075 9.385c-.784-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.958z";

const CARD_CLASSES = [
  "flex h-full min-w-[clamp(18.75rem,15.1136rem+18.1818vw,28.75rem)] flex-col gap-5 rounded-xl border p-[clamp(1.5rem,1.3182rem+0.9091vw,2rem)]",
  "border-black/10 bg-white shadow-sm shadow-secondary2/10 hover:border-secondary2/30",
  "dark:border-white/10 dark:bg-[#0E1020]",
  "transition-[transform,box-shadow,border] duration-300",
  "hover:-translate-y-1 hover:shadow-xl hover:shadow-secondary2/25",
  "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
].join(" ");

const AVATAR_CLASSES =
  "size-10 md:size-12 shrink-0 rounded-full object-cover ring-1 ring-black/10 dark:ring-white/10 ";

const Avatar = ({ image, name }) =>
  image ? (
    <Image
      className={AVATAR_CLASSES}
      height={48}
      width={48}
      src={image}
      alt={name}
    />
  ) : (
    <span
      aria-hidden="true"
      className={`${AVATAR_CLASSES} grid place-items-center bg-secondary2/10 font-semibold text-secondary2`}
    >
      {name?.charAt(0).toUpperCase()}
    </span>
  );

const QuoteIcon = () => (
  <svg
    className="size-6 fill-secondary2/25 dark:fill-secondary2/50"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d={QUOTE_PATH} />
  </svg>
);

const Stars = ({ rating }) => (
  <div
    className="flex items-center gap-0.5"
    role="img"
    aria-label={`Rated ${rating} out of ${MAX_RATING} stars`}
  >
    {Array.from({ length: MAX_RATING }, (_, i) => (
      <svg
        key={i}
        className={`size-3.5 md:size-4 ${
          i < rating
            ? "fill-amber-400"
            : "fill-neutral-300 dark:fill-neutral-600"
        }`}
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path d={STAR_PATH} />
      </svg>
    ))}
  </div>
);

/**
 * @param {{ card: Testimonial }} props
 */
const TestimonialCard = ({ card }) => {
  const { image, name, handle, text, rating } = card;

  // Clamp to 0–5 so a bad value can't break the layout (and `rating: 0` never renders a stray "0").
  const stars =
    typeof rating === "number"
      ? Math.min(MAX_RATING, Math.max(0, Math.round(rating)))
      : 0;

  return (
    <figure className={CARD_CLASSES}>
      <figcaption className="flex items-center gap-3">
        <Avatar image={image} name={name} />

        <div className="min-w-0 flex-1">
          <p className="truncate text-[clamp(0.875rem,0.8295rem+0.2273vw,1rem)] font-medium leading-tight text-black dark:text-white">
            {name}
          </p>
          {handle && (
            <p className="mt-0.5 truncate text-medium leading-tight text-neutral-500 dark:text-neutral-400">
              {handle}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-end justify-between gap-1 self-stretch">
          <QuoteIcon />
          {stars > 0 && <Stars rating={stars} />}
        </div>
      </figcaption>

      <blockquote className="text-[clamp(1rem,0.9545rem+0.2273vw,1.125rem)] leading-snug text-black dark:text-white">
        {text}
      </blockquote>
    </figure>
  );
};

export default TestimonialCard;
