import { MERNStackWorkflow, UIUXWorkflow } from "../assets/assets";
import SwitchBTN from "../components/SwitchBTN";
import FadeUp from "../components/motions/FadeUp";
import FadeLeft from "../components/motions/FadeLeft";
import FadeRight from "../components/motions/FadeRight";
import WorkflowCard from "../components/workFlow/WorkflowCard";

// URL: ?workflow=ui-ux-design  ba  ?workflow=web-development
// Notun workflow lagle shudhu ekhane ekta entry add korlei switch button o ashe jabe
const WORKFLOWS = {
  "ui-ux-design": {
    label: "UI UX Design",
    icon: "fi fi-rr-website-design",
    title: "My UI/UX Design Process",
    description:
      "I'm a UI/UX and Product Designer who creates user-centered websites that balance great design with real business goals.",
    steps: UIUXWorkflow,
  },
  "web-development": {
    label: "Web Development",
    icon: "fi fi-rr-code-window",
    title: "My Web Development Process",
    description:
      "I build fast, scalable full-stack websites with the MERN stack, taking every project from database design to a polished, deployed product.",
    steps: MERNStackWorkflow,
  },
};

const DEFAULT_WORKFLOW = "ui-ux-design";

// URL e ulta-palta value dile (?workflow=abc) default workflow dekhabe
const getActiveKey = (value) =>
  Object.hasOwn(WORKFLOWS, value) ? value : DEFAULT_WORKFLOW;

/** @param {{ searchParams: Promise<{ workflow?: string }> }} props */
export async function generateMetadata({ searchParams }) {
  const { workflow } = await searchParams;
  const { title, description } = WORKFLOWS[getActiveKey(workflow)];
  return { title, description };
}

/** @param {{ searchParams: Promise<{ workflow?: string }> }} props */
export default async function Page({ searchParams }) {
  const { workflow } = await searchParams;
  const activeKey = getActiveKey(workflow);
  const active = WORKFLOWS[activeKey];

  return (
    <section>
      <div className="flex items-center justify-between gap-space-4">
        <div>
          <FadeLeft>
            <h1 className="font-primary text-size-xl font-semibold">
              {active.title}
            </h1>
          </FadeLeft>
          <FadeLeft delay={0.1}>
            <p className="font-medium text-size-base text-placeholder_2 dark:text-placeholder mt-space-2">
              {active.description}
            </p>
          </FadeLeft>
        </div>

        {/* workflow switch: Link based, tai page server e render hoy */}
        <FadeRight
          delay={0.1}
          className="p-space-3 bg-secondary-50 flex flex-col gap-space-3 dark:bg-secondary-500/10 rounded-lg"
        >
          {Object.entries(WORKFLOWS).map(([key, { label, icon }]) => (
            <SwitchBTN
              key={key}
              text={label}
              icon={icon}
              href={`?workflow=${key}`}
              isActive={key === activeKey}
            />
          ))}
        </FadeRight>
      </div>

      <div className="h-0.5 w-full rounded-full opacity-5 bg-placeholder mt-space-7 mb-space-7"></div>

      <div className="flex flex-col gap-space-6">
        {(active.steps ?? []).map((item) => (
          // key te workflow er nam dewa hoyeche, jate switch korle entrance animation abar cholay
          <FadeUp key={`${activeKey}-${item.id}`}>
            <WorkflowCard
              phaseNumber={item.phaseNumber}
              phaseLabel={item.phaseLabel}
              icon={item.icon}
              title={item.title}
              tagline={item.tagline}
              description={item.description}
              points={item.points ?? []}
            />
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
