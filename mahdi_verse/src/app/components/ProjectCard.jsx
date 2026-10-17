import Image from "next/image";
import Link from "next/link";
import React from "react";
import Chips from "./Chips";
import Button from "./Button";
import slugify from "../utils/slugify";

// onSelect (function) er bodole selectHref (string) use hocche,
// karon server component e function prop/onClick pass kora jay na
const ProjectCard = ({ project, selectHref, index = 0 }) => {
  const { title, tags, slug } = project;
  const image =
    project?.finalDesign?.coverImage?.src ||
    project?.finalDesign?.images?.[0]?.src ||
    "/placeholder.jpg";

  const detailsHref = `/projects/${slug || slugify(title)}`;
  // selectHref dile in-page select (e.g. ?project=slug), na hole details page e jabe
  const targetHref = selectHref || detailsHref;

  return (
    <div
      style={{ animationDelay: `${Math.min(index * 70, 420)}ms` }}
      className="animate-fade-up w-87.5 rounded-2xl border border-secondary-500/20 shadow-[0_2px_6px_rgba(34,211,238,0.2)] overflow-hidden group"
    >
      <div className="relative w-full h-45 overflow-hidden bg-secondary-50 dark:bg-secondary-500/10">
        {/* shimmer pechone thake, image load hole oita uporey eshe dheke dey */}
        <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,#e5e7eb,45%,#f3f4f6,55%,#e5e7eb)] bg-size-[200%_100%]" />
        <Image
          alt={title}
          src={image}
          width={300}
          height={160}
          className="relative w-full h-45 object-cover group-hover:scale-110 transition-all duration-200"
        />
      </div>

      <div className="p-space-4 space-y-space-5 bg-background">
        <Link href={targetHref} scroll={false}>
          <h2 className="font-semibold text-size-md cursor-pointer hover:text-primary-500 transition-colors duration-200">
            {title}
          </h2>
        </Link>

        <div className="flex flex-wrap gap-space-3 mt-space-4">
          {tags.map((item, i) => (
            <Chips varient="small" key={i} text={item} />
          ))}
        </div>

        <div className="flex w-full">
          <div className="flex-1">
            <Button text="Preview" varient="text" className="block w-full" />
          </div>

          <Link href={targetHref} scroll={false} className="flex flex-1">
            <Button text="Details" varient="text" className="block w-full" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;