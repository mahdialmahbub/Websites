import { getDefaultView, getProjectViews } from "../../utils/projectViews";
import { ProjectViewSwitcher } from "./ProjectViewClient";
import { DesignView, DevelopmentView } from "./ProjectViews";

// Notun view add korle (VIEW_META te entry dewar pore) ekhane tar component boshao
const VIEW_COMPONENTS = {
  design: DesignView,
  development: DevelopmentView,
};

/**
 * Ekta project er details. Project e design / development / dui-i thakte pare,
 * dui view thakle hero te onno view te jawar button ashe.
 * Server component, tai [slug]/page.jsx ar projects/page.jsx dui jaygay-i kaj kore.
 *
 * @param {{
 *   project: import("../../utils/projectViews").Project,
 *   initialView?: "design" | "development",
 * }} props
 */
export default function ProjectDetails({ project, initialView }) {
  if (!project) return null;

  const views = getProjectViews(project);
  if (!views.length) return null;

  // prottek view er content server e render hoy, client switcher shudhu show/hide kore
  const panels = Object.fromEntries(
    views.map((key) => {
      const View = VIEW_COMPONENTS[key];
      return [
        key,
        // eslint-disable-next-line react/jsx-key
        <View 
          project={project}
          data={project[key]}
          switchTo={views.find((other) => other !== key)}
        />,
      ];
    }),
  );

  return (
    // key = project.id: /projects page e onno project select korle view abar default e reset hoy
    <ProjectViewSwitcher
      key={project.slug}
      views={views}
      initialView={getDefaultView(project, initialView)}
      panels={panels}
    />
  );
}
