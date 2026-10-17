"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "../components/Button";
import FormHeader from "../components/builder/FormHeader";
import PersonalInformation from "../components/builder/PersonalInformation";
import ProfessionalSummary from "../components/builder/ProfessionalSummary";
import Experience from "../components/builder/Experience";
import Education from "../components/builder/Education";
import Project from "../components/builder/Project";
import Skill from "../components/builder/Skill";
import Language from "../components/builder/Language";
import Reference from "../components/builder/Reference";
import PreviewandScore from "../components/builder/PreviewandScore";
import { icons } from "../../../assets/iconCollection";
import ColorPalettePicker from '../components/builder/ColorPalettePicker';
import GenerateModal from '../components/builder/GenerateModal';
import { useGenerate } from '@/store/builder/useGenerate';

/**
 * Single source of truth for the builder flow.
 *
 *  - The ORDER of this array is the order of the steps.
 *  - id        -> value kept in the `activeField` state
 *  - title     -> form heading and the Back / Next button labels
 *  - subtitle  -> short description under the heading
 *  - Component -> the form rendered for that step
 *
 * To add, remove or reorder a step you only touch this list.
 */
const BUILDER_STEPS = [
  {
    id: "personalInformation",
    title: "Personal Information",
    subtitle: "Tell employers who you are and how they can reach you",
    Component: PersonalInformation,
  },
  {
    id: "professionalSummary",
    title: "Professional Summary",
    subtitle: "Sum up your experience, strengths and goals in a few lines",
    Component: ProfessionalSummary,
  },
  {
    id: "workExperience",
    title: "Work Experience",
    subtitle: "Show where you’ve worked and what you achieved in each role",
    Component: Experience,
  },
  {
    id: "education",
    title: "Education",
    subtitle: "Add your academic background and qualifications",
    Component: Education,
  },
  {
    id: "projects",
    title: "Projects",
    subtitle: "Present the work you’ve done and the impact you’ve made",
    Component: Project,
  },
  {
    id: "skills",
    title: "Skills",
    subtitle: "Highlight the tools and strengths that set you apart",
    Component: Skill,
  },
  {
    id: "languages",
    title: "Languages",
    subtitle: "List the languages you speak and your level in each",
    Component: Language,
  },
  {
    id: "references",
    title: "References",
    subtitle: "Add people who can vouch for your work and character",
    Component: Reference,
  },
];

// Label of the primary button on the very last step.
const FINAL_ACTION_LABEL = "Generate";

const BuilderPage = () => {
  const [activeField, setActiveField] = useState(BUILDER_STEPS[0].id);
  const [modalOpen, setModalOpen] = useState(true);

  // Everything below is derived from `activeField` — no extra state needed.
  const currentIndex = Math.max(
    BUILDER_STEPS.findIndex((step) => step.id === activeField),
    0,
  );
  const currentStep = BUILDER_STEPS[currentIndex];
  const prevStep = currentIndex > 0 ? BUILDER_STEPS[currentIndex - 1] : null;
  const nextStep = BUILDER_STEPS[currentIndex + 1] ?? null;

  const { Component: StepForm, title, subtitle } = currentStep;
  const progress = ((currentIndex + 1) / BUILDER_STEPS.length) * 100;

  const goToStep = (id) => {
    setActiveField(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    if (prevStep) goToStep(prevStep.id);
  };

  const handleNext = () => {
    if (nextStep) {
      goToStep(nextStep.id);
      return;
    }

    // Last step ("Generate") — hook your resume generation logic in here.
  };

  return (
    <main className="px-[clamp(1rem,calc(6.009vw-0.409rem),5rem)] gap-[clamp(0.8125rem,calc(1.221vw+0.526rem),1.625rem)] py-[clamp(2rem,calc(3.380vw+1.208rem),4.25rem)] flex flex-col max-w-300 min-w-[320px] mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="h-11 flex items-center gap-[clamp(0.375rem,calc(0.188vw+0.331rem),0.5rem)] text-[clamp(0.8125rem,calc(0.282vw+0.746rem),1rem)] font-primary font-medium text-neutral-500"
        >
          <i className="fi fi-rr-arrow-small-left text-[clamp(1rem,calc(0.563vw+0.868rem),1.375rem)]"></i>
          Back to home
        </Link>
        <div className="hidden md:flex items-center gap-3.25">
          <Button
            variant="secondary"
            icon="fi fi-rr-hard-disk-scan"
            className="bg-violet-500/5 text-violet-500 hover:bg-violet-500/10"
          >
            ATS Score
          </Button>
          <Button
            variant="secondary"
            icon="fi fi-rr-file-download"
            className="bg-green-500/5 text-green-500 hover:bg-green-500/10"
          >
            Download
          </Button>
        </div>
      </div>

      <div className="flex max-md:flex-col gap-5.5 max-md:items-center md:items-start ">
        {/* builder */}
        <section className="flex gap-5.5 max-md:flex-col max-md:items-center md:items-start w-full">
          {/* form */}
          <div className="max-w-130 w-full rounded-[clamp(0.5rem,calc(0.939vw+0.28rem),1.125rem)] border border-neutral-500/10 shadow-[0_6px_8px_rgba(2,6,23,0.10)] bg-white p-[clamp(0.8125rem,calc(0.657vw+0.658rem),1.25rem)] pt-[clamp(0.25rem,calc(0.188vw+0.206rem),0.375rem)] relative overflow-hidden">
            {/* Progress */}
            <div
              role="progressbar"
              aria-label="Form progress"
              aria-valuemin={1}
              aria-valuemax={BUILDER_STEPS.length}
              aria-valuenow={currentIndex + 1}
              aria-valuetext={`Step ${currentIndex + 1} of ${BUILDER_STEPS.length}`}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[clamp(0.25rem,calc(0.188vw+0.206rem),0.375rem)] bg-green-500/10"
            >
              <span
                className="block h-full bg-green-500 rounded-full transition-[width] duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></span>
            </div>

            {/* form toolbar */}
            <div className="flex items-center justify-between border-b border-neutral-500/10 py-[clamp(0.5rem,calc(0.751vw+0.324rem),1rem)]">
              <div className="flex items-center gap-space-2 mb-[clamp(0.8125rem,calc(0.282vw+0.746rem),1rem)]">
                <Button
                  variant="secondary"
                  className="text-blue-500 bg-blue-500/5 hover:bg-blue-500/10"
                  icon={icons.templete}
                >
                  Template
                </Button>
                <Button
                  variant="secondary"
                  className="text-violet-500 bg-violet-500/5 hover:bg-violet-500/10"
                  icon={icons.color}
                >
                  Color
                </Button>
              </div>
              <Button
                variant="text"
                icon={icons.reset}
                className="text-red-300 hover:text-red-500"
              >
                Reset
              </Button>
            </div>

            <div className="flex flex-col gap-[clamp(1.25rem,calc(1.127vw+0.986rem),2rem)]">
              {/* title and subtitle — change with the active step */}
              <FormHeader title={title} subtitle={subtitle} />

              {/* the form of the active step */}
              <StepForm />

              {/* step navigation */}
              <div className="flex items-center *:flex-1 gap-[clamp(1rem,calc(0.939vw+0.780rem),1.625rem)]">
                {prevStep && (
                  <Button variant="text" icon={icons.left} onClick={handleBack}>
                    {prevStep.title}
                  </Button>
                )}

                <Button
                  variant="secondary"
                  iconPosition="right"
                  icon={icons.right}
                  onClick={handleNext}
                >
                  {nextStep ? nextStep.title : FINAL_ACTION_LABEL}
                </Button>
              </div>
            </div>
          </div>
        </section>
        <PreviewandScore />
      </div>
      <GenerateModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </main>
  );
};

export default BuilderPage;
