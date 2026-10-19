import React from "react";

const WorkflowCard = ({
  phaseNumber,
  phaseLabel,
  icon = "fi fi-rr-apps",
  title,
  tagline,
  description,
  points = [],
}) => {
  return (
    <article
      className="
        relative w-full overflow-hidden rounded-3xl

        /* Light */
        border border-[#D6EEF0]
        bg-secondary-50/50

        /* Dark */
        dark:border-white/[0.07]
        dark:bg-[#0B1117]

        /* Shudhu border color transition, kono move/scale nai */
        transition-colors duration-300
        hover:border-cyan-300
        dark:hover:border-cyan-400/25
      "
    >
      {/* Ambient glow (static, hover e kichu hoy na) */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-20
          -top-20
          size-48
          rounded-full
          bg-cyan-300/12
          blur-3xl
          dark:bg-cyan-400/[0.07]
        "
      />

      {/* Phase number watermark (static) */}
      <span
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          right-6
          top-2
          hidden
          select-none
          font-primary
          text-[110px]
          font-bold
          leading-none
          text-cyan-500/[0.07]
          sm:block
          dark:text-cyan-400/[0.05]
        "
      >
        {phaseNumber}
      </span>

      <div className="relative z-10 p-7 sm:p-8">
        {/* =====================================
            HEADER
        ====================================== */}
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div
            className="
              flex size-14 shrink-0
              items-center justify-center
              rounded-2xl

              border border-cyan-200
              text-cyan-600
              shadow-[0_6px_18px_rgba(6,182,212,0.10)]

              dark:border-cyan-400/15
              dark:bg-cyan-400/6
              dark:text-cyan-400
              dark:shadow-none
            "
          >
            <i className={`${icon} text-[23px]`} aria-hidden="true" />
          </div>

          {/* Title + Phase label */}
          <div className="min-w-0">
            <h2
              className="
                font-primary
                text-size-lg
                font-semibold
                leading-tight
                tracking-[-0.02em]
                text-foreground
              "
            >
              {title}
            </h2>

            <p
              className="
                mt-2
                font-mono
                text-size-xs_2
                font-medium
                tracking-[0.03em]
                text-cyan-700
                dark:text-cyan-400/80
              "
            >
              {phaseLabel}
            </p>
          </div>
        </div>

        {/* =====================================
            TAGLINE + DESCRIPTION
        ====================================== */}
        <h3
          className="
            mt-7
            font-primary
            text-size-base
            font-semibold
            text-slate-800
            dark:text-foreground
          "
        >
          {tagline}
        </h3>

        <p
          className="
            mt-2
            max-w-[650px]
            text-size-sm
            leading-6
            text-slate-600
            dark:text-slate-400
          "
        >
          {description}
        </p>

        {/* Divider */}
        <div className="my-6 h-px w-full bg-cyan-100 dark:bg-white/[0.07]" />

        {/* =====================================
            POINTS
            (space-x grid er shathe milena, tai gap)
        ====================================== */}
        <div className="grid grid-cols-1 gap-x-space-6 gap-y-space-7 sm:grid-cols-2 lg:grid-cols-3">
          {points.map((point) => (
            <div key={point.id} className="flex gap-3">
              <span
                className="
                  flex size-6 shrink-0
                  items-center justify-center
                  rounded-md

                  border border-cyan-100
                  bg-cyan-50

                  font-primary
                  text-size-xs
                  font-semibold
                  text-cyan-700

                  dark:border-white/8
                  dark:bg-white/2.5
                  dark:text-cyan-400
                "
              >
                {point.number}
              </span>

              <div className="min-w-0">
                <h4
                  className="
                    mb-1
                    font-primary
                    text-size-base
                    font-semibold
                    text-slate-800
                    dark:text-foreground
                  "
                >
                  {point.title}
                </h4>
                <p
                  className="
                    text-size-sm
                    leading-6
                    text-slate-600
                    dark:text-slate-400
                  "
                >
                  {point.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};

export default WorkflowCard;
