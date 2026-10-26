import Link from "next/link";
import React from "react";

const ServiceCard = ({
  icon = "fi fi-rr-apps",
  title = "UI / UX Design",
  process = ["research", "wireframe", "prototype"],
  description = "I design user-centered products — research, wireframes, and polished prototypes — that balance a delightful experience with the business goals behind it.",
  tags = ["Figma", "Wireframing", "Prototyping", "Design Systems"],
  buttonText = "View Workflow",
  href = "/workflow?workflow=ui-ux-design",
}) => {
  return (
    <article
      className="
        group relative w-full overflow-hidden rounded-3xl h-full

        /* =========================
           LIGHT MODE
        ========================== */
        border border-[#D6EEF0]
        bg-secondary-50/50

        /* =========================
           DARK MODE
        ========================== */
        dark:border-white/[0.07]
        dark:bg-[#0B1117]

        /* =========================
           TRANSITION
        ========================== */
        transition-all duration-500
        ease-[cubic-bezier(0.22,1,0.36,1)]

        hover:-translate-y-1

        /* Light hover */
        hover:border-cyan-300

        /* Dark hover */
        dark:hover:border-cyan-400/25
      "
    >
      {/* =====================================
          Ambient Glow
      ====================================== */}
      <div
        className="
          pointer-events-none
          absolute
          -right-20
          -top-20
          size-48
          rounded-full

          /* Light */
          bg-cyan-300/12
          blur-3xl

          /* Dark */
          dark:bg-cyan-400/[0.07]

          transition-all
          duration-700
          group-hover:scale-125
          group-hover:bg-cyan-300/18
          dark:group-hover:bg-cyan-400/12
        "
      />

      {/* Secondary glow */}
      <div
        className="
          pointer-events-none
          absolute
          -bottom-16
          -left-16
          size-36
          rounded-full
          bg-cyan-200/12
          blur-3xl
          opacity-0
          transition-all
          duration-700
          group-hover:opacity-100
          dark:bg-transparent
        "
      />

      <div className="relative z-10 p-7 sm:p-8 flex flex-col justify-between h-full">
        {/* =====================================
            HEADER
        ====================================== */}
        <div>
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div
              className="
              relative
              flex size-14 shrink-0
              items-center justify-center
              overflow-hidden
              rounded-2xl

              border border-cyan-200
              text-cyan-600
              shadow-[0_6px_18px_rgba(6,182,212,0.10)]

              dark:border-cyan-400/15
              dark:bg-cyan-400/6
              dark:text-cyan-400
              dark:shadow-none

              transition-all duration-500
              group-hover:scale-105
              group-hover:rotate-1

              group-hover:border-cyan-300
              group-hover:shadow-[0_10px_25px_rgba(6,182,212,0.16)]

              dark:group-hover:border-cyan-400/30
              dark:group-hover:bg-cyan-400/10
              dark:group-hover:shadow-[0_0_25px_rgba(34,211,238,0.10)]
            "
            >
              {/* Icon glow */}
              <span
                className="
                pointer-events-none
                absolute
                inset-0
                bg-cyan-400/6
                opacity-0
                blur-xl
                transition-opacity
                duration-300
                group-hover:opacity-100
              "
              />

              <i className={`${icon} relative z-10 text-[23px]`} />
            </div>

            {/* Title + Process */}
            <div className="min-w-0">
              <h3
                className="
                font-primary
                text-size-lg
                font-semibold
                leading-tight
                tracking-[-0.02em]
                text-foreground
                dark:text-foreground
              "
              >
                {title}
              </h3>

              {/* Process */}
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {process.map((item, index) => (
                  <React.Fragment key={item}>
                    <span
                      className="
                      font-mono
                      text-size-xs_2
                      font-medium
                      capitalize
                      tracking-[0.03em]

                      text-cyan-700
                      dark:text-cyan-400/80
                    "
                    >
                      {item}
                    </span>

                    {index < process.length - 1 && (
                      <i
                        className="
                        fi fi-rr-arrow-small-right
                        flex
                        text-[13px]

                        text-cyan-500/70
                        dark:text-cyan-400/50

                        transition-all
                        duration-300

                        group-hover:text-cyan-600
                        dark:group-hover:text-cyan-400
                      "
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* =====================================
            DESCRIPTION
        ====================================== */}
          <p
            className="
            mt-7
            max-w-155
            text-size-sm
            leading-7
            tracking-wide

            text-slate-600
            dark:text-slate-300
          "
          >
            {description}
          </p>
        </div>
        {/* =====================================
            TAGS
        ====================================== */}
        <div>
          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <span
                key={tag}
                style={{ animationDelay: `${i * 120}ms` }}
                className="
        rounded-lg border border-cyan-100 bg-white/80
        px-3 py-1.5
        font-primary text-[11px] font-medium tracking-wide text-slate-600
        shadow-[0_2px_8px_rgba(15,118,110,0.04)]
        transition-all duration-300

        group-hover:animate-tag-wave
        motion-reduce:group-hover:animate-none

        hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700

        dark:border-white/8 dark:bg-white/2.5 dark:text-slate-300 dark:shadow-none
        dark:hover:border-cyan-400/15 dark:hover:bg-cyan-400/[0.035] dark:hover:text-slate-200
      "
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA */}
          <Link
            href={href}
            aria-label={`View ${title} workflow`}
            className="
    mt-7
    inline-flex
    items-center
    gap-2.5

    font-primary
    text-size-sm
    font-semibold

    text-slate-800
    dark:text-foreground

    transition-all
    duration-300

    group-hover:gap-3.5
  "
          >
            <span
              className="
      opacity-80
      transition-opacity
      duration-300
      group-hover:opacity-100
      dark:opacity-40
    "
            >
              {buttonText}
            </span>

            <span
              className="
      flex
      size-7
      items-center
      justify-center
      rounded-full
      group

      border border-cyan-200
      bg-cyan-50
      text-cyan-700

      transition-all
      duration-300

      group-hover:border-cyan-300
      group-hover:bg-cyan-100
      group-hover:shadow-[0_5px_15px_rgba(6,182,212,0.12)]

      dark:border-white/10
      dark:bg-white/[0.035]
      dark:text-cyan-400

      dark:group-hover:border-cyan-400/20
      dark:group-hover:bg-cyan-400/8
      dark:group-hover:shadow-none
    "
            >
              <i
                aria-hidden="true"
                className="
        fi fi-rr-arrow-small-right
        text-[13px]
        transition-transform
        duration-300
        group-hover:translate-x-0.5
      "
              />
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ServiceCard;
