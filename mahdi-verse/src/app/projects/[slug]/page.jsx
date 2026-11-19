import { notFound } from "next/navigation";
import ProjectDetails from "../../components/project/ProjectDetails";
import BackButton from "../../components/project/BackButton";
import projectsData from "../../assets/projects/projects";
import slugify from "../../utils/slugify";
import { buildMetadata } from "../../utils/buildMetadata";
import JsonLd from "../../components/JsonLd";
import { projectSchema } from "../../utils/schema";

// Shob jaygay ekoi slug logic, jate generateMetadata, generateStaticParams ar page mile thake
const getSlug = (p) => p.slug || slugify(p.title);

// Slug theke project khuje ber kore. Na pele (ba URL encoding vul hole) undefined
function findProject(rawSlug) {
  let slug = rawSlug;
  try {
    slug = decodeURIComponent(rawSlug);
  } catch {
    return undefined;
  }
  return projectsData.find((p) => getSlug(p) === slug);
}

// List e na thaka slug shorashori 404 hobe
export const dynamicParams = false;

export function generateStaticParams() {
  return projectsData.map((p) => ({ slug: getSlug(p) }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = findProject(slug);

  if (!project) return { title: "Project not found" };

  return buildMetadata({
    title: project.title,
    description: project.description,
    path: `/projects/${getSlug(project)}`,
    image: false, // opengraph-image.jsx automatic use hobe
  });
}

export default async function ProjectDetailsPage({ params }) {
  const { slug } = await params;
  const project = findProject(slug);

  if (!project) notFound(); // not-found.jsx dekhabe

  return (
    <>
      <JsonLd data={projectSchema(project)} />
      <section className="min-w-full space-y-space-7">
        <BackButton />
        <ProjectDetails project={project} />
      </section>
    </>
  );
}
