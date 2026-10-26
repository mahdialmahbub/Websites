import Link from "next/link";
import React from "react";
import Chips from "./Chips";
import slugify from "../utils/slugify";
import CoverImage from "./CoverImage";
import { CARD_BASE, getCardStateClass } from "../utils/cardStyles";

const MAX_VISIBLE_TAGS = 3;

const ProjectCard = ({
  title,
  tags = [],
  slug,
  image,
  selectHref,
  index = 0,
  priority = false,
  headingAs: Heading = "h2",
  isSelected,
}) => {
  const detailsHref = `/projects/${slug || slugify(title)}`;
  const targetHref = selectHref || detailsHref;

  const visibleTags = tags.slice(0, MAX_VISIBLE_TAGS);
  const remainingCount = tags.length - MAX_VISIBLE_TAGS;

  return (
    <Link
      href={targetHref}
      style={{ animationDelay: `${Math.min(index * 70, 420)}ms` }}
      className={`animate-fade-up card-lazy shrink-0 w-80 rounded-2xl max-h-90 overflow-hidden group ${CARD_BASE} ${getCardStateClass(isSelected)}`}
    >
      <div className="relative w-full h-45 overflow-hidden bg-secondary-50 dark:bg-secondary-500/10">
        <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,#e5e7eb,45%,#f3f4f6,55%,#e5e7eb)] bg-size-[200%_100%]" />
        {image && (
          <CoverImage
            src={image}
            alt={image.alt ?? title}
            priority={priority}
            className="aspect-3/2 w-full h-45 group-hover:scale-110 transition-all duration-200"
          />
        )}
      </div>

      <div className="p-space-4 space-y-space-5 h-full">
        <Heading className="font-semibold text-size-md cursor-pointer group-hover:text-primary-500 group-visited:text-primary-700  dark:group-visited:text-primary-200  dark:group-hover:text-primary-500 transition-colors duration-200">
          {title}
        </Heading>

        <div className="flex flex-wrap gap-space-3 ">
          {visibleTags.map((item, i) => (
            <Chips varient="small" key={i} text={item} />
          ))}

          {remainingCount > 0 && (
            <Chips varient="small" text={`+${remainingCount} more`} />
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
