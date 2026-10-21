import Image from "next/image";
import StarRating from "./StarRating";

const FeedbackCard = ({ client, feedback }) => {
  const { image, name, position } = client ?? {};
  const { comment, rating } = feedback ?? {};

  return (
    <figure
      className="
        w-full rounded-2xl
        border-2 border-secondary-500/30
        dark:border-secondary-500/20
        p-space-6 space-y-space-5
      "
    >
      {/* Feedback Comment */}
      <blockquote className="text-size-md">{comment}</blockquote>

      {/* Client Information & Rating */}
      <figcaption
        className="
          flex flex-wrap items-center justify-between
          gap-space-3
          border-t-2 border-placeholder/20
          pt-space-4
        "
      >
        {/* Client Profile */}
        <div className="flex items-center gap-space-3">
          {image && (
            <Image
              src={image}
              alt={`${name || "Client"} profile photo`}
              width={40}
              height={40}
              className="size-10 rounded-full object-cover"
            />
          )}

          <div>
            <div className="flex items-center gap-space-2">
              <h4 className="text-size-sm font-semibold">{name}</h4>

              <i
                aria-hidden="true"
                className="
                  fi fi-rr-arrow-small-right
                  text-size-md
                  transition-transform duration-200
                "
              />
            </div>

            {position && (
              <p
                className="
                  text-xs
                  text-placeholder_2
                  dark:text-placeholder/80
                "
              >
                {position}
              </p>
            )}
          </div>
        </div>

        {/* Star Rating */}
        {rating != null && (
          <div
            className="flex items-center gap-space-2 text-size-sm font-medium"
            role="img"
            aria-label={`Rated ${rating} out of 5`}
          >
            <StarRating size={18} rating={rating} />
          </div>
        )}
      </figcaption>
    </figure>
  );
};

export default FeedbackCard;
