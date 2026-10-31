"use client";

import { Suspense, useRef, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector, useStore } from "react-redux";
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
import TemplatePickerModal from "../components/builder/TemplatePickerModal";
import ColorPickerModal from "../components/builder/ColorPickerModal";
import ShareModal from "../components/builder/ShareModal";
import { icons } from "../../../assets/iconCollection";
import { validateAll, validateSection } from "@/resume/validation";
import { markAttempted, resetBuilder } from "@/store/builder/builderSlice";
import { useBuilderEntry } from "@/store/builder/useBuilderEntry";
import { useGenerate } from "@/store/builder/useGenerate";
import { useGetMeQuery } from "@/store/api/authApi";
import { leftForLogin, shareClosed } from "@/store/flow/flowSlice";
import { rememberPendingReview } from "@/lib/pendingReview";
import { useRouter } from "next/navigation";
import { getTemplate } from "@/resume/templates/registry";
import { useDownloadResume } from "@/resume/engine/useDownloadResume";
import useConfirm from "../components/ConfirmProvider";
import ConfirmModal from "../components/ConfirmModal";

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

function BuilderScreen() {
  const dispatch = useDispatch();
  const store = useStore();
  const formRef = useRef(null);
  const [activeField, setActiveField] = useState(BUILDER_STEPS[0].id);
  const [showScore, setShowScore] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(null); // "template" | "color" | null
  const entry = useBuilderEntry(); // /builder?template=... | ?new=1 | ?resume=<id>
  const hydrated = useSelector((state) => state.builder.hydrated);
  const confirm = useConfirm();
  const saveStatus = useSelector((state) => state.builder.status);
  const saveError = useSelector((state) => state.builder.error);

  // Generate -> share dialog; Download PDF = the browser prints the same pages as the preview.
  const {
    generate,
    isGenerating,
    error: generateError,
    clearError,
  } = useGenerate();
  const [shareResult, setShareResult] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const router = useRouter();
  const { data: user } = useGetMeQuery();

  // The share dialog closed: the rest of the flow (benefits for guests, review, redirect) takes over.
  const handleShareClosed = () => {
    setShareOpen(false);
    const resumeId = shareResult?.resume?.id;
    if (resumeId) dispatch(shareClosed({ resumeId, isGuest: !user }));
  };

  // A guest pressed Login inside the share dialog: the review waits until they are logged in.
  const handleShareLogin = () => {
    rememberPendingReview(shareResult?.resume?.id);
    setShareOpen(false);
    dispatch(leftForLogin());
    router.push("/login");
  };

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

  // After the error messages are on screen, put the keyboard focus on the first wrong field.
  const focusFirstError = () =>
    requestAnimationFrame(() =>
      formRef.current?.querySelector('[aria-invalid="true"]')?.focus(),
    );

  const {
    downloadResume,
    downloadPortal,
    isDownloading,
    error: downloadError,
  } = useDownloadResume();

  const handleDownload = () => {
    const { content, design } = store.getState().builder;
    downloadResume({
      template: getTemplate(design.templateId),
      data: content,
      color: design.color,
    });
  };

  const handleNext = async () => {
    const { content } = store.getState().builder;

    // A step with a mistake does not let you go on; the messages tell what to fix.
    if (
      Object.keys(validateSection(currentStep.id, content[currentStep.id]))
        .length > 0
    ) {
      dispatch(markAttempted(currentStep.id));
      focusFirstError();
      return;
    }

    if (nextStep) {
      goToStep(nextStep.id);
      return;
    }

    // Last step ("Generate"): everything must be valid first. If an earlier step has a mistake, go there.
    const problems = validateAll(content);
    const firstBadStep = BUILDER_STEPS.find((step) => problems[step.id]);
    if (firstBadStep) {
      dispatch(markAttempted(firstBadStep.id));
      goToStep(firstBadStep.id);
      focusFirstError();
      return;
    }

    // Generate: save, validate on the server, create the share link, open the share dialog.
    const result = await generate();
    if (result) {
      setShareResult(result);
      setShareOpen(true);
    }
  };

  const handleReset = async () => {
    const ok = await confirm({
      title: "Start over?",
      message:
        "Start over with a blank resume? Your previously saved resume is not deleted.",
      confirmText: "Start over",
      danger: true,
    });
    if (!ok) return;

    dispatch(resetBuilder());
    setActiveField(BUILDER_STEPS[0].id);
  };

  const toggleScore = () => setShowScore((value) => !value);

  return (
    <main className="px-[clamp(1rem,calc(6.009vw-0.409rem),5rem)] gap-[clamp(0.5rem,calc(1.221vw+0.526rem),1rem)] py-[clamp(1rem,calc(3.380vw+1.208rem),0.5rem)] flex flex-col max-w-300 min-w-[320px] mx-auto w-full relative">
      {/* Header */}
      <div className="flex items-center justify-between md:sticky top-0 z-10 md:bg-white md:px-3 md:py-3 rounded-[clamp(0.5rem,calc(0.939vw+0.28rem),1.125rem)] md:shadow-sm">
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
            icon={showScore ? "fi fi-rr-eye" : "fi fi-rr-hard-disk-scan"}
            aria-pressed={showScore}
            onClick={toggleScore}
            className="bg-violet-500/5 text-violet-500 hover:bg-violet-500/10"
          >
            {showScore ? "Preview" : "ATS Score"}
          </Button>
          <Button
            variant="secondary"
            icon="fi fi-rr-file-download"
            onClick={handleDownload}
            disabled={isDownloading}
            className="bg-green-500/5 text-green-500 hover:bg-green-500/10"
          >
            {isDownloading ? "Preparing PDF..." : "Download PDF"}
          </Button>
        </div>
      </div>

      {/* Two equal columns from md up (form | preview / ATS). Stacked below md. */}
      <div className="flex max-md:flex-col gap-5.5 md:items-start">
        {/* builder (left column) */}
        <section className="w-full min-w-0 md:flex-1 md:basis-0">
          {/* form */}
          <div className="w-full rounded-[clamp(0.5rem,calc(0.939vw+0.28rem),1.125rem)] border border-neutral-500/10 shadow-[0_6px_8px_rgba(2,6,23,0.10)] bg-white p-[clamp(0.8125rem,calc(0.657vw+0.658rem),1.25rem)] pt-[clamp(0.25rem,calc(0.188vw+0.206rem),0.375rem)] relative overflow-hidden">
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
              <div className="flex items-center gap-space-2 ">
                <Button
                  variant="secondary"
                  className="text-blue-500 bg-blue-500/5 hover:bg-blue-500/10"
                  icon={icons.templete}
                  onClick={() => setPickerOpen("template")}
                >
                  <span className="hidden sm:inline">Template</span>
                </Button>
                <Button
                  variant="secondary"
                  className="text-violet-500 bg-violet-500/5 hover:bg-violet-500/10 border-violet-500/5"
                  icon={icons.color}
                  onClick={() => setPickerOpen("color")}
                >
                  <span className="hidden sm:inline">Color</span>
                </Button>
              </div>
              <Button
                variant="text"
                icon={icons.reset}
                onClick={handleReset}
                className="text-red-300 hover:text-red-500 max-sm:w-11"
              >
                <span className="hidden sm:inline">Reset</span>
              </Button>
            </div>

            <div
              ref={formRef}
              className="flex flex-col gap-[clamp(1.25rem,calc(1.127vw+0.986rem),2rem)]"
            >
              {/* title and subtitle — change with the active step */}
              <FormHeader title={title} subtitle={subtitle} />
              {/* the form of the active step (rendered after the saved draft was read from the browser) */}
              {entry.isError ? (
                <p
                  role="alert"
                  className="rounded-lg bg-red-500/5 p-4 text-red-600"
                >
                  We could not open that resume. It may have been deleted.{" "}
                  <Link
                    href="/builder?new=1"
                    className="font-semibold underline"
                  >
                    Start a new one
                  </Link>
                </p>
              ) : hydrated && !entry.isLoading ? (
                <StepForm />
              ) : (
                <p
                  className="py-10 text-center text-neutral-500/70"
                  role="status"
                >
                  Loading your resume…
                </p>
              )}

              {saveStatus === "saving" || saveStatus === "saved" ? (
                <div className="flex justify-end -mb-space-4">
                  <span
                    className={`${saveStatus === "saving" ? "text-neutral-500/70" : "text-green-500"} `}
                  >
                    {saveStatus === "saving" ? "Saving…" : "Saved to Draft"}
                  </span>
                </div>
              ) : (
                ""
              )}
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
                  loading={isGenerating}
                  disabled={isGenerating}
                >
                  {nextStep
                    ? nextStep.title
                    : isGenerating
                      ? "Generating…"
                      : FINAL_ACTION_LABEL}
                </Button>
              </div>

              {generateError && !nextStep && (
                <p
                  role="alert"
                  className="mt-3 rounded-md bg-red-500/5 p-3 text-small text-red-600"
                >
                  {generateError}{" "}
                  <button
                    type="button"
                    className="font-semibold underline"
                    onClick={clearError}
                  >
                    Dismiss
                  </button>
                </p>
              )}
            </div>
          </div>
        </section>

        {/* preview / ATS (right column) */}
        <PreviewandScore
          activeSection={activeField}
          showScore={showScore}
          onToggleScore={toggleScore}
          onDownload={handleDownload}
        />
      </div>

      {saveStatus === "conflict" ||
        (saveStatus === "error" && (
          <ConfirmModal
            error={saveError || "Could not save."}
            message={saveError || "Could not save."}
            onConfirm={() => window.location.reload()}
            confirmText="Reload"
            cancelText="Close"
          />
        ))}

      <TemplatePickerModal
        open={pickerOpen === "template"}
        onClose={() => setPickerOpen(null)}
      />
      <ColorPickerModal
        open={pickerOpen === "color"}
        onClose={() => setPickerOpen(null)}
      />
      <ShareModal
        open={shareOpen}
        onClose={handleShareClosed}
        result={shareResult}
        onDownload={handleDownload}
        isDownloading={isDownloading}
        onLogin={handleShareLogin}
      />
      {downloadPortal}
    </main>
  );
}

// useSearchParams() (inside useBuilderEntry) needs a Suspense boundary so the page can still be prerendered.
const BuilderPage = () => (
  <Suspense fallback={null}>
    <BuilderScreen />
  </Suspense>
);

export default BuilderPage;
