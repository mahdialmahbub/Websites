import React from "react";
import Button from "../components/Button";
import Image from "next/image";
import { assets } from "../assets/assets";
import FadeLeft from "../components/motions/FadeLeft";
import FadeRight from "../components/motions/FadeRight";
import FadeUp from "../components/motions/FadeUp";
import ServiceCard from "../components/about/ServiceCard";
import TechStack from "../components/about/TechStack";
import ContactCTA from "../components/about/CTA";
import IntroVideoButton from "../components/IntroVideoButton";
import StatsSection from "../components/StateSection";
import { buildMetadata } from "../utils/buildMetadata";
import JsonLd from "../components/JsonLd";
import { profilePageSchema } from "../utils/schema";
import Chips from "../components/Chips";

export const metadata = buildMetadata({
  title: "About",
  description:
    "Hi, I’m Mahdi, a UI UX Designer, MERN & Next.js Developer. I build fast, accessible, SEO-friendly websites that follow best practices and bring you more leads.",
  path: "/about",
});

/* ---------------------------------- DATA ---------------------------------- */

const heroPoints = [
  "Expect a response within 24 hours",
  "I’m happy to sign an NDA upon request.",
  "One point of contact, from first idea to launch day.",
];

// Problem vs. my way
const comparison = [
  {
    key: "usual",
    glyph: "✕",
    title: "Hiring a designer and developer separately",
    points: [
      "Your vision gets lost between design and development",
      "Endless back-and-forth just to explain the same requirements",
      "Designs that look great in Figma but don't work as expected",
      "Extra costs, duplicated effort, and unnecessary revisions",
      "Delayed launches caused by miscommunication and hand-offs",
      "When something goes wrong, neither person owns the full process",
    ],
  },
  {
    key: "mine",
    glyph: "✓",
    title: "Working with me from design to development",
    points: [
      "One person owns your project from the first idea to launch",
      "Your design vision stays consistent throughout development",
      "Designs are built with real-world functionality in mind",
      "Fewer hand-offs mean less wasted time and smoother revisions",
      "Performance, accessibility, and SEO considered from the start",
      "One point of contact, clear accountability, and fewer surprises",
    ],
  },
];

const comparisonStyle = {
  usual: "border border-dashed border-red-500/30 bg-red-500/5",
  mine: "border border-secondary-500 bg-secondary-500/10",
};

// Existing "why I chose these paths" cards
const aboutMeContent = [
  {
    icon: "fi fi-rr-website-design",
    title: "UI UX Design",
    process: ["Research", "Wireframe", "Prototype"],
    description:
      "I chose UI UX design because I enjoy understanding how people think, what they need, and what makes a digital experience feel simple and intuitive. It gives me the freedom to turn ideas and problems into meaningful experiences that people enjoy using.",
    tags: ["Figma", "User Research", "Wireframing", "Design Systems"],
    btnText: "How I Design",
    workflowHref: "/workflow?workflow=ui-ux-design",
  },
  {
    icon: "fi fi-rr-code-window",
    title: "MERN Stack Development",
    process: ["React", "Node", "MongoDB"],
    description:
      "I chose MERN development because I wanted to go beyond designing interfaces and actually bring those ideas to life. Building with JavaScript across the stack lets me turn thoughtful designs into fast, functional, and scalable products.",
    tags: ["React", "Next.js", "Redux", "Node.js", "MongoDB"],
    btnText: "How I Build",
    workflowHref: "/workflow?workflow=web-development",
  },
];

// How I work (a real sequence, so numbered)
const steps = [
  {
    title: "Research",
    text: "I study your business, your users and your competitors first, so every decision is based on real user behavior, not guesswork.",
  },
  {
    title: "Plan the structure",
    text: "Your site structure is mapped out carefully before I design a single screen.",
  },
  {
    title: "Wireframe and prototype",
    text: "Simple wireframes grow into a fully tested prototype you can try before anything is built.",
  },
  {
    title: "Design responsive from day one",
    text: "Every design works beautifully on phones, tablets and desktops.",
  },
  {
    title: "Build",
    text: "Once the design is approved, I build it myself with the MERN stack and Next.js.",
  },
  {
    title: "Check, then hand over",
    text: "SEO, speed, responsiveness and bugs are all checked before you get the site.",
  },
];

// What MERN + Next.js means for the business
const benefits = [
  {
    icon: "fi fi-rr-bolt",
    title: "Faster, smoother",
    text: "Visitors stay instead of leaving for a competitor.",
  },
  {
    icon: "fi fi-rr-search",
    title: "Found on Google",
    text: "Good SEO means Google finds and ranks your site, bringing visitors without paying for every click.",
  },
  {
    icon: "fi fi-rr-users",
    title: "Visitors become customers",
    text: "A well-structured, user-centered site turns more visitors into real leads and paying customers.",
  },
];

const handoverChecks = ["SEO", "Speed", "Responsiveness", "Bugs"];

const afterLaunch = [
  "No new freelancer to chase every time you want an update",
  "An honest view of what’s helping or hurting your website and business",
  "Clear recommendations on what’s actually worth doing next",
];

/* ------------------------------- COMPONENTS ------------------------------- */

/**
 * Heading block used above each section of the About page.
 * @param {{ title: string, description?: string }} props
 */
const SectionHeading = ({ title, description }) => (
  <div className="mb-space-7 max-w-2xl">
    <FadeLeft
      as="h2"
      className="text-size-xl font-semibold leading-tight tracking-[-0.035em]"
    >
      {title}
    </FadeLeft>
    {description && (
      <FadeLeft
        as="p"
        delay={0.1}
        className="mt-space-4 text-size-md text-placeholder"
      >
        {description}
      </FadeLeft>
    )}
  </div>
);

/* ---------------------------------- PAGE ---------------------------------- */

const page = () => {
  return (
    <>
      <JsonLd data={profilePageSchema()} />
      <section className="min-w-full space-y-space-12">
        {/* ------------------------------ HERO ------------------------------ */}
        <div className="overflow-hidden w-full bg-foreground dark:bg-background flex items-center gap-space-8 rounded-xl p-space-7 relative">
          <div className="w-full">
            <div>
              <FadeLeft
                as="h1"
                className="font-primary font-semibold text-size-2xl mb-space-4 text-background dark:text-foreground"
              >
                Your website, designed and built by one person
              </FadeLeft>
              <FadeLeft
                as="p"
                delay={0.1}
                className="text-size-md text-placeholder max-w-162.5 w-full"
              >
                Starting a business is exciting. Building the website usually
                isn’t. I’m a UI UX Designer and MERN Stack Developer in one, so
                you never have to hire two people for one website.
              </FadeLeft>
              <FadeLeft
                delay={0.2}
                className="flex flex-col gap-space-4 mt-space-7 mb-space-7"
              >
                {heroPoints.map((item, i) => (
                  <FadeLeft
                    key={i}
                    delay={i * 0.08}
                    className="flex items-center gap-1.5"
                  >
                    <Image
                      alt=""
                      width={22}
                      height={22}
                      src={assets.CheckBox}
                    />
                    <p className="text-size-md text-placeholder">{item}</p>
                  </FadeLeft>
                ))}
              </FadeLeft>
            </div>
            <FadeLeft delay={0.3} className="flex items-center gap-space-4">
              <IntroVideoButton />
              <Button
                text={"Download Resume"}
                leftIcon
                icon="fi fi-sr-file-download"
              />
            </FadeLeft>
          </div>
          <FadeRight delay={0.2} className="relative">
            <div className="box after:blur-[20px]">
              <i className="fi fi-rr-website-design absolute top-1 left-1 transform -translate-x-1/2 -translate-y-1/2 z-20 text-secondary-500/10 text-[86px]"></i>
              <i className="fi fi-rr-code-window absolute -bottom-20 left-1 transform -translate-x-1/2 -translate-y-1/2 z-20 text-secondary-500/10 text-[86px]"></i>
              <Image
                alt="Mahdi working on UI UX design and web development"
                src={assets.about}
                width={600}
                height={400}
                priority
                className="relative z-30"
              />
            </div>
          </FadeRight>

          {/* scroll */}
          <div className="absolute bottom-space-7 left-[50%] right-[50%] opacity-20">
            <div className="flex flex-col items-center font-bold font-primary gap-space-1 text-secondary-200 animate-pulse">
              <div className="w-2 h-6 bg-secondary-500 rounded-full"></div>
              Scroll
            </div>
          </div>
        </div>

        <StatsSection />

        {/* ------------------- WHY ONE PERSON (problem / fix) ------------------- */}
        <div>
          <SectionHeading
            title="Two people, one website? There’s an easier way"
            description="Most new business owners hire a designer and a developer separately. I trained in both, deliberately, to solve exactly that."
          />
          <div className="grid gap-space-6 grid-cols-2">
            {comparison.map((item, i) => (
              <FadeUp
                key={item.key}
                delay={i * 0.15}
                className={`rounded-xl p-space-7 ${comparisonStyle[item.key]}`}
              >
                <h3 className="mb-space-6 text-size-lg font-semibold">
                  {item.title}
                </h3>
                <ul className="space-y-space-4">
                  {item.points.map((point) => (
                    <li key={point} className="flex gap-space-4 text-size-md">
                      <span
                        aria-hidden="true"
                        className={
                          item.key === "mine"
                            ? "font-bold text-secondary-500"
                            : "text-red-500"
                        }
                      >
                        {item.glyph}
                      </span>
                      <span
                        className={
                          item.key === "usual"
                            ? "dark:text-placeholder text-placeholder_2"
                            : ""
                        }
                      >
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </FadeUp>
            ))}
          </div>
        </div>

        {/* ------------------------ WHY I CHOSE THESE PATHS ------------------------ */}
        <div>
          <SectionHeading title="Why I chose these paths" />
          <div className="grid gap-space-6 grid-cols-2">
            {aboutMeContent.map((item, i) => (
              <FadeUp key={item.title} delay={i * 0.2}>
                <ServiceCard
                  description={item.description}
                  process={item.process}
                  title={item.title}
                  buttonText={item.btnText}
                  icon={item.icon}
                  tags={item.tags}
                  href={item.workflowHref}
                />
              </FadeUp>
            ))}
          </div>
        </div>

        {/* ------------------------- TECH STACK + BENEFITS ------------------------- */}
        <TechStack />

        <div>
          <SectionHeading
            title="What MERN and Next.js mean for your business"
            description="It isn’t a tech buzzword. Your website loads faster, feels genuinely professional, and is SEO-optimized from the ground up."
          />
          <div className="grid grid-cols-3 gap-0 divide-x divide-secondary-500/20 mt-space-10">
            {benefits.map((item, i) => (
              <FadeUp
                key={item.title}
                delay={i * 0.1}
                className="px-space-7 first:pl-0 last:pr-0"
              >
                <i
                  className={`${item.icon} mb-space-4 block text-size-2xl text-secondary-500`}
                />
                <h3 className="text-size-lg font-semibold">{item.title}</h3>
                <p className="mt-space-1 text-size-md text-placeholder">
                  {item.text}
                </p>
              </FadeUp>
            ))}
          </div>
        </div>

        {/* --------------------------- HANDOVER + AFTER --------------------------- */}
        <FadeUp className="grid gap-space-8 rounded-xl bg-foreground p-space-7 dark:bg-background grid-cols-2">
          <div>
            <h2 className="font-primary text-size-xl font-semibold text-background dark:text-foreground">
              Checked before it’s handed over
            </h2>
            <p className="mt-space-4 text-size-md text-placeholder">
              You get a website that’s ready to work for your business from day
              one, not one you’ll need to fix later.
            </p>
            <div className="mt-space-6 flex flex-wrap gap-space-4">
              {handoverChecks.map((check) => (
                <Chips key={check} text={check} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-primary text-size-lg font-semibold text-background dark:text-foreground">
              And after launch
            </h3>
            <ul className="mt-space-4 space-y-space-4">
              {afterLaunch.map((item) => (
                <li
                  key={item}
                  className="flex gap-space-4 text-size-md text-placeholder"
                >
                  <span aria-hidden="true" className="text-secondary-500">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </FadeUp>

        {/* -------------------------------- PROMISE -------------------------------- */}
        <FadeUp className="mx-auto max-w-3xl flex items-center gap-space-8 rounded-xl bg-foreground p-space-7 dark:bg-background w-full">
          <Image
            alt="Mahdi's Image"
            src={"/profile.jpg"}
            width={160}
            height={160}
            className="rounded-lg"
          />
          <blockquote className="font-primary text-size-xl font-semibold leading-snug tracking-[-0.02em] text-white">
            I treat every project like it’s my own, working within your budget
            and never cutting corners on quality or detail.
          </blockquote>
        </FadeUp>

        <ContactCTA />
      </section>
    </>
  );
};

export default page;
