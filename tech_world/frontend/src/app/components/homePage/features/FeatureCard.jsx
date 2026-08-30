import Image from "next/image";
import React from "react";

const FeatureCard = ({ img, title, description }) => {
  return (
    <article
      className="
        group
        flex w-full items-center
        gap-space-4
        rounded-[28px]
        border border-secondary/20
      
        p-space-3
        transition-all duration-300 ease-out
        hover:-translate-y-1
        hover:border-secondary/20
        hover:bg-white/4
        hover:shadow-[0_16px_40px_rgba(0,0,0,0.15)]
      "
    >
      {/* Image */}
      <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-[22px] bg-secondary/10 sm:h-36 sm:w-36">
        <Image
          src={img}
          alt={title}
          fill
          sizes="(max-width: 640px) 128px, 144px"
          className="
            object-cover
            transition-transform duration-500 ease-out
            group-hover:scale-105
          "
        />

        {/* Image overlay */}
        <div
          className="
            pointer-events-none absolute inset-0
            bg-gradient-to-br from-black/0 via-black/0 to-black/20
          "
        />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <h3
          className="
            font-primary
            text-size-h4
            font-semibold
            leading-tight
            tracking-[-0.02em]
            text-white
          "
        >
          {title}
        </h3>

        <p
          className="
            mt-space-2
            line-clamp-2
            font-medium
            text-size-h6
            leading-relaxed
            text-placeholder_3
          "
        >
          {description}
        </p>

        {/* Small action */}
        <div
          className="
            mt-space-3
            flex items-center gap-1.5
            text-sm font-semibold
            text-secondary
            transition-all duration-300
            group-hover:gap-2
          "
        >
          <span>Explore</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          >
            <path
              fillRule="evenodd"
              d="M3 10a.75.75 0 0 1 .75-.75h10.19l-3.22-3.22a.75.75 0 1 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H3.75A.75.75 0 0 1 3 10Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </article>
  );
};

export default FeatureCard;
