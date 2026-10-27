import Link from "next/link";
import ProjectDetails from "../../components/project/ProjectDetails";
import BackButton from "../../components/project/BackButton";
import projectsData from "../../assets/projects/projects";
import slugify from "../../utils/slugify";
import { buildMetadata } from "../../utils/buildMetadata";
import JsonLd from "../../components/JsonLd";
import { projectSchema } from "../../utils/schema";
import { notFound } from "next/navigation";


export async function generateMetadata({ params }) {
  const { slug } = await params
  const project = projectsData.find((p) => (p.slug || slugify(p.title)) === slug);
  if (!project) notFound();

  return buildMetadata({
    title: project.title,
    description: project.description,
    path: `/projects/${slug}`,
    image: false, // ager baniye deya opengraph-image.jsx automatic use hobe
  })
}

// build time e shob project page static generate hobe (bonus, SSR er shathe ekdom kaj kore)
export function generateStaticParams() {
  return projectsData.map((p) => ({ slug: p.slug || slugify(p.title) }));
}

export default async function ProjectDetailsPage({ params }) {
  // Next 14 ar 15+ duitai e await kaj kore
  const { slug } = await params;

  const project = projectsData.find(
    (p) => (p.slug || slugify(p.title)) === slug,
  );

  return (
    <>
      <JsonLd data={projectSchema(project)} />
    <section className="min-w-full space-y-space-7">
      <BackButton />
      {project ? (
        <ProjectDetails project={project} />
      ) : (
        <div className="bg-secondary-50 dark:bg-background rounded-2xl min-h-75 flex flex-col items-center justify-center gap-space-3">
          <p className="font-medium text-size-base text-placeholder_2 dark:text-placeholder/80">
            Project not found.
          </p>
          <Link
            href="/projects"
            className="text-size-sm font-semibold text-secondary-500 hover:underline"
          >
            Back to all projects
          </Link>
        </div>
      )}
    </section>
    </>
  );
}