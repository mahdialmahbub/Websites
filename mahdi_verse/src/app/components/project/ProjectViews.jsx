import {
  ApiRoutesSection,
  ColorsSection,
  DataModelSection,
  FeedbackSection,
  FinalDesignSection,
  JourneySection,
  ListPanel,
  ProblemsSolutions,
  ProjectCTA,
  ProjectHero,
  ProjectOverview,
  SpacingSection,
  StackSection,
  TypographySection,
} from "./ProjectSections";

/**
 * @typedef {{
 *   project: import("../../utils/projectViews").Project,
 *   data: Record<string, any>,
 *   switchTo?: string,
 * }} ViewProps
 */

/**
 * UI/UX Design view. data = project.design
 * @param {ViewProps} props
 */
export function DesignView({ project, data, switchTo }) {
  return (
    <div className="space-y-space-11 p-space-6 bg-secondary-50 dark:bg-background rounded-2xl">
      <ProjectHero
        project={project}
        view="design"
        data={data}
        switchTo={switchTo}
      />
      <ProjectOverview overview={data.overview} />
      <ProblemsSolutions problems={data.problems} solutions={data.solutions} />
      <JourneySection intro={data.journeyIntro} steps={data.journey} />
      <ListPanel
        title="Interactive Features"
        items={data.interactiveFeatures}
        tone="info"
      />
      <ColorsSection colors={data.colors} />
      <SpacingSection spacing={data.spacing} />
      <TypographySection intro={data.typographyIntro} fonts={data.typography} />
      <FinalDesignSection
        title={project.title}
        finalDesign={project.finalDesign}
        showTools
      />
      <FeedbackSection intro={project.clientIntro} client={project.client} />
      <ListPanel
        title={data.learningsTitle ?? "What I learned from this project"}
        items={data.learnings}
        tone="brand"
      />
      <ProjectCTA />
    </div>
  );
}

/**
 * Full stack Development view. data = project.development
 * @param {ViewProps} props
 */
export function DevelopmentView({ project, data, switchTo }) {
  return (
    <div className="space-y-space-10 p-space-6 bg-secondary-50 dark:bg-background rounded-2xl">
      <ProjectHero
        project={project}
        view="development"
        data={data}
        switchTo={switchTo}
      />
      <ProjectOverview overview={data.overview} />
      <ProblemsSolutions problems={data.problems} solutions={data.solutions} />
      <StackSection intro={data.stackIntro} stack={data.stack} />
      <JourneySection
        label="Build Journey"
        intro={data.journeyIntro}
        steps={data.journey}
      />
      <ListPanel
        title="Interactive Features"
        items={data.interactiveFeatures}
        tone="info"
      />
      <ApiRoutesSection intro={data.apiIntro} routes={data.apiRoutes} />
      <DataModelSection
        intro={data.dataModelIntro}
        collections={data.dataModel}
      />
      <ListPanel
        title="Performance"
        items={data.performance}
        tone="info"
        icon="fi fi-rr-dashboard"
      />
      <ListPanel
        title="Security"
        items={data.security}
        tone="success"
        icon="fi fi-rr-shield-check"
      />
      <FinalDesignSection
        title={project.title}
        finalDesign={project.finalDesign}
      />
      <FeedbackSection intro={project.clientIntro} client={project.client} />
      <ListPanel
        title={data.learningsTitle ?? "Takeaways"}
        items={data.learnings}
        tone="brand"
      />
      <ProjectCTA />
    </div>
  );
}
