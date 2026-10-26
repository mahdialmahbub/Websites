
import React from "react";
import FadeUp from "../motions/FadeUp";

const techStack = [
  {
    name: "Figma",
    dot: "bg-[#A259FF]",
  },
  {
    name: "React",
    dot: "bg-[#61DAFB]",
  },
  {
    name: "Next.js",
    dot: "bg-white",
  },
  {
    name: "Redux",
    dot: "bg-[#764ABC]",
  },
  {
    name: "Node.js",
    dot: "bg-[#68A063]",
  },
  {
    name: "MongoDB",
    dot: "bg-[#47A248]",
  },
  {
    name: "Tailwind CSS",
    dot: "bg-[#38BDF8]",
  },
  {
    name: "JavaScript",
    dot: "bg-[#F7DF1E]",
  },
];

const TechStack = () => {
  return (
    <section className="w-full">
      <FadeUp
        className="
          group
          relative
          overflow-hidden
          rounded-[22px]
          border border-secondary-500/20
          dark:border-white/6
          px-6
          py-5
          transition-all
          duration-500
          ease-[cubic-bezier(0.22,1,0.36,1)]
          hover:border-cyan-400/12
        "
      >
        {/* Subtle ambient glow */}
        <div
          className="
            pointer-events-none
            absolute
            -left-16
            -top-20
            size-40
            rounded-full
            bg-cyan-400/3.5
            blur-3xl
            transition-all
            duration-500
            group-hover:bg-cyan-400/6
          "
        />

        <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          {/* Left Content */}
          <div className="shrink-0">
            <div
              className="
                flex
                items-center
                gap-2
                font-mono
                text-size-xs
                font-medium
                tracking-[0.08em]
                text-cyan-400/70
              "
            ></div>

            <h3
              className="
                mt-1.5
                max-w-45
                text-size-lg
                font-semibold
                leading-5
                tracking-[-0.01em] text-nowrap
                
              "
            >
              Tools & tech I use daily
            </h3>
          </div>

          {/* Tech Items */}
          <div
            className="
              flex
              flex-wrap
              items-center
              justify-start
              gap-2
              md:justify-end
            "
          >
            {techStack.map((tech, i) => (
              <FadeUp as="span" delay={i * 0.1}
                key={tech.name}
                className="
                  group/item
                  inline-flex
                  items-center
                  gap-2
                  rounded-lg
                  border border-secondary-500/30
                  dark:border-white/8
                  bg-white/2.5
                  px-2.5
                  py-1.5
                  text-size-xs
                  font-medium text-slate-900
                  dark:text-slate-300
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]
                  transition-all
                  duration-300
                  ease-[cubic-bezier(0.22,1,0.36,1)]
                  hover:-translate-y-0.5 hover:border-secondary-500/40
                  dark:hover:border-white/[0.14] hover:bg-secondary-500/5
                  dark:hover:bg-white/5
                  hover:text-foreground
                "
              >
                {/* Color dot */}
                <span
                  className={`
                    size-1.5
                    shrink-0
                    rounded-full
                    ${tech.dot}
                    shadow-[0_0_8px_currentColor]
                    transition-transform
                    duration-300
                    group-hover/item:scale-125
                  `}
                />

                <span className="whitespace-nowrap">{tech.name}</span>
              </FadeUp>
            ))}
          </div>
        </div>
      </FadeUp>
    </section>
  );
};

export default TechStack;