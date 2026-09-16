import Image from "next/image";
import React from "react";

const TestimonialCard = ({ card }) => {
  const { image, name, handle, text, rating } = card;

  return (
    <article className="group relative flex flex-col gap-4 mx-4 rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-6 shadow-sm shadow-secondary2/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-secondary2/20">
      {/* Decorative quote mark */}
      <svg
        className="absolute top-5 right-5 h-9 w-9 fill-secondary2/10 dark:fill-secondary2/20"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
      </svg>

      {/* Header: avatar, name, verified badge, handle */}
      <div className="flex max-md:flex-col gap-3">
        <Image
          className="size-10 md:size-12 rounded-full ring-2 ring-secondary2/20 object-cover"
          height={48}
          width={48}
          src={image}
          alt={name}
        />
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1">
            <p className="font-medium text-medium md:text-large xl:text-h6 text-black dark:text-white">
              {name}
            </p>
            <svg
              className="mt-0.5 fill-secondary2 shrink-0"
              width="14"
              height="14"
              viewBox="0 0 12 12"
              role="img"
              aria-label="Verified"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z"
              />
            </svg>
          </div>
          <span className="text-neutral-500 dark:text-neutral-400 font-medium text-medium md:text-large">
            {handle}
          </span>
        </div>
      </div>

      {/* Optional star rating — only shows if card.rating exists */}
      {rating && (
        <div
          className="flex items-center gap-0.5"
          role="img"
          aria-label={`Rated ${rating} out of 5 stars`}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`h-4 w-4 ${
                i < rating ? "fill-amber-400" : "fill-neutral-200 dark:fill-neutral-700"
              }`}
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 00-.363 1.118l1.287 3.957c.3.921-.755 1.688-1.538 1.118l-3.367-2.445a1 1 0 00-1.176 0l-3.367 2.445c-.783.57-1.838-.197-1.538-1.118l1.287-3.957a1 1 0 00-.363-1.118L2.075 9.385c-.784-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.958z" />
            </svg>
          ))}
        </div>
      )}

      {/* Testimonial text */}
      <blockquote className="text-black/70 dark:text-white/70 font-semibold text-large md:text-h6 xl:text-h5 leading-relaxed">
        {text}
      </blockquote>
    </article>
  );
};

export default TestimonialCard;