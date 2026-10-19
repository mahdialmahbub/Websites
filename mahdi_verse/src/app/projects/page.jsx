import Link from "next/link";
import projectsData from "../assets/projects/projects";
import FadeRight from "../components/motions/FadeRight";
import FadeLeft from "../components/motions/FadeLeft";
import SwitchBTN from "../components/SwitchBTN";
import ProjectCard from "../components/ProjectCard";
import ProjectDetails from "../components/project/ProjectDetails";
import ScrollToDetails from "../components/ScrollToDetails";
import {
  VIEW_META,
  matchesCategory,
  withProjectMeta,
} from "../utils/projectViews";

const ICON = "fi fi-rr-browser";

// VIEW_META theke auto toiri hobe, tai label kokhono mismatch hobe na
const categories = [
  { label: "All", icon: ICON },
  ...Object.values(VIEW_META).map(({ category }) => ({
    label: category,
    icon: ICON,
  })),
];

const normalize = (str = "") => str.toLowerCase().replace(/[^a-z0-9]/g, "");

export default async function Page({ searchParams }) {
  const params = await searchParams;
  const activeCategory = params?.category || "All";
  const projectSlugFromUrl = params?.project || null;

  const projects = projectsData.map(withProjectMeta);

  const filteredProjects = projects.filter((project) =>
    matchesCategory(project, activeCategory),
  );

  const selectedProject =
    projectsData.find((p) => String(p.slug) === String(projectSlugFromUrl)) ||
    null;

  return (
    <section className="min-w-full space-y-space-7">
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-space-7">
          <FadeLeft className="font-primary text-size-xl font-semibold">
            All Projects
          </FadeLeft>
          <FadeRight className="flex items-center gap-space-3 p-space-3 rounded-lg bg-secondary-50 *:w-50 dark:bg-secondary-500/5">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                href={`?category=${encodeURIComponent(cat.label)}`}
                scroll={false}
              >
                <SwitchBTN
                  icon={cat.icon}
                  text={cat.label}
                  isActive={activeCategory === cat.label}
                />
              </Link>
            ))}
          </FadeRight>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="flex gap-6 overflow-x-auto p-1">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                selectHref={`?category=${encodeURIComponent(activeCategory)}&project=${project.slug}`}
              />
            ))}
          </div>
        ) : (
          <p className="font-medium text-size-base text-placeholder_2 py-space-6">
            No projects found in this category.
          </p>
        )}
      </div>

      <div className="w-full h-0.5 rounded-full opacity-5 bg-placeholder"></div>

      <div id="project-details">
        {selectedProject ? (
          <>
            <ScrollToDetails
              key={selectedProject.slug}
              targetId="project-details"
            />
            <ProjectDetails project={selectedProject} />
          </>
        ) : (
          <div className="bg-secondary-50 dark:bg-background rounded-2xl min-h-25 flex items-center justify-center">
            <p className="font-primary font-semibold text-size-sm text-placeholder_2 dark:text-placeholder/80">
              Select a project to see details
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
