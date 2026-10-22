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
import { buildMetadata } from "../utils/buildMetadata";
import JsonLd from "../components/JsonLd";
import { projectsPageSchema } from "../utils/schema";
import Carousel from "../components/Carousel";

export async function generateMetadata({ searchParams }) {
  const { project: slug } = await searchParams;
  const selected = projectsData.find((p) => p.slug === slug);

  // /projects?project=slug e jodi oi project er detail dekhay,
  // tahole canonical oi project er nijer page e jabe (duplicate hobe na)
  if (selected) {
    return buildMetadata({
      title: selected.title,
      description: selected.description,
      path: `/projects/${selected.slug}`,
    });
  }

  return buildMetadata({
    title: "Projects",
    description:
      "Explore my UI/UX design and MERN stack development projects. See real-world apps built with MongoDB, Express, React, and Node.js, from design to deployment.",
    path: "/projects",
  });
}

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

    console.log(selectedProject)

  return (
    <>
      <JsonLd data={projectsPageSchema(projectsData)} />
      <section className="min-w-full space-y-space-7">
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between mb-space-7 gap-space-4">
            <div>
              <FadeLeft>
                <h1 className="font-primary text-size-xl font-semibold">
                  All Projects
                </h1>
              </FadeLeft>
              <FadeLeft delay={0.1}>
                <p className="text-size-base text-placeholder_2 dark:text-placeholder mt-space-2">
                  Real projects built to solve real problems, from the first
                  idea to the final launch
                </p>
              </FadeLeft>
            </div>
            <FadeRight className="flex items-center gap-space-3 p-space-3 rounded-lg bg-secondary-50 *:w-40 dark:bg-secondary-500/5">
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

          {filteredProjects.length > 0 && (
            <Carousel resetKey={activeCategory} label="projects">
              {filteredProjects.map((project, index) => {
                const { title, tags = [], slug } = project;

                const image =
                  project?.finalDesign?.coverImage?.src ||
                  project?.finalDesign?.images?.[0]?.src ||
                  "/placeholder.jpg";

                return (
                  <ProjectCard
                    key={project.id || slug}
                    image={image}
                    title={title || "No title"}
                    tags={tags}
                    slug={slug}
                    index={index}
                    priority={index < 2}
                    selectHref={`?category=${encodeURIComponent(
                      activeCategory,
                    )}&project=${encodeURIComponent(slug)}`}
                    isSelected={selectedProject?.slug === slug}
                  />
                );
              })}
            </Carousel>
          )}
        </div>

        {/* project thakle divider + details dekhabe, na thakle "coming soon" (clients page er moto) */}
        {filteredProjects.length > 0 ? (
          <>
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
                  <p className="font-primary text-size-md font-medium tracking-wide text-placeholder_2/80 dark:text-placeholder/80">
                    Select a project to see details
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-secondary-50 dark:bg-background rounded-2xl min-h-70 flex items-center justify-center flex-col text-placeholder_2 dark:text-placeholder">
            <i className="fi fi-rr-layout-fluid text-7xl opacity-50"></i>
            <h2 className="font-primary text-size-md font-medium tracking-wide mt-space-4">
              Projects coming soon
            </h2>
            <p className="mt-1.5 text-center text-placeholder_2/80 dark:text-placeholder/60">
              I’m currently building out my project showcase, and your idea
              could be the first one featured here. Let’s work together to
              create something great.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
