import React from "react";
import Link from "next/link";
import SearchBar from "../SearchBar";

const SectionHeader = ({
  title,
  subtitle,
  type = "withBTN",
  searchValue,
  onSearchChange,
  viewMoreHref = "#",
  backgroundImage,
}) => {
  return (
    <>
      {/* =========================================
          WITH BUTTON
      ========================================== */}
      {type === "withBTN" && (
        <div
          className="
            mb-space-7
            flex items-center justify-between gap-4
          "
        >
          {/* Title */}
          <div className="min-w-0">
            <h2
              className="
                font-primary
                text-size-h4
                font-semibold
                leading-tight
                tracking-[-0.02em]
              "
            >
              {title}
            </h2>

            {/* Small accent line */}
            <div className="mt-2 h-0.5 w-8 rounded-full bg-secondary" />
          </div>

          {/* View More */}
          <Link
            href={viewMoreHref}
            className="
              group
              flex shrink-0 items-center gap-1.5
              rounded-full
              border border-secondary/20
              px-3.5 py-2
              font-primary
              text-size-h6
              font-medium
              text-placeholder_3
              transition-all duration-300
              hover:border-secondary/40
              hover:bg-secondary/10
              hover:text-foreground
            "
          >
            <span>View More</span>

            <i
              className="
                fi fi-rr-arrow-small-right
                text-[14px]
                transition-transform duration-300
                group-hover:translate-x-1
              "
            />
          </Link>
        </div>
      )}

      {/* =========================================
          WITH SUBTITLE
      ========================================== */}
      {type === "withSubtitle" && (
        <div
          className="
            mb-space-9
            mx-auto
            flex max-w-[700px]
            flex-col items-center
            justify-center
            text-center
          "
        >
          {/* Accent */}
          <span
            className="
              mb-3
              h-1
              w-8
              rounded-full
              bg-secondary
            "
          />

          <h2
            className="
              font-primary
              text-size-h2
              font-semibold
              leading-[1.1]
              tracking-[-0.03em]
            "
          >
            {title}
          </h2>

          {subtitle && (
            <p
              className="
                mt-space-3
                max-w-[620px]
                font-primary
                text-size-h5
                font-medium
                leading-relaxed
                text-placeholder_3
              "
            >
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* =========================================
          PRODUCT
      ========================================== */}
      {type === "product" && (
        <section
          className="
            relative
            mb-space-7
            min-h-[140px]
            overflow-hidden
            rounded-[24px]
            border border-white/10
          "
        >
          {/* Background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: backgroundImage
                ? `url(${backgroundImage})`
                : "url('/images/product-header.jpg')",
            }}
          />

          {/* Dark gradient overlay */}
          <div
            className="
              absolute inset-0
              bg-gradient-to-r
              from-black/90
              via-black/65
              to-black/20
            "
          />

          {/* Content */}
          <div
            className="
              relative z-10
              flex min-h-[140px]
              flex-col
              items-start
              justify-center
              gap-5
              px-space-6
              py-space-5
              sm:flex-row
              sm:items-center
              sm:justify-between
              sm:px-space-8
              lg:px-space-11
            "
          >
            {/* Heading */}
            <div className="min-w-0">
              <span
                className="
                  mb-2
                  block
                  font-primary
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-secondary
                "
              >
                Explore Collection
              </span>

              <h2
                className="
                  font-primary
                  text-size-h3
                  font-semibold
                  capitalize
                  leading-tight
                  tracking-[-0.025em]
                  text-white
                "
              >
                {title}
              </h2>
            </div>

            {/* Search */}
            {onSearchChange && (
              <div className="w-full shrink-0 sm:w-[320px] lg:w-[400px]">
                <SearchBar
                  placeholder="Search for anything tech..."
                  value={searchValue}
                  onChange={onSearchChange}
                />
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default SectionHeader;