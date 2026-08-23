"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Chips from "./Chips";
import Button from "./Button";
import slugify from "../utils/slugify";

const ProjectCard = ({ project, onSelect, index = 0 }) => {
  const { title, tags, slug } = project;
  const image =
    project?.finalDesign?.coverImage?.src ||
    project?.finalDesign?.images?.[0]?.src ||
    "/placeholder.jpg";

  const [imgLoaded, setImgLoaded] = useState(false);

  const hasInPageSelect = typeof onSelect === "function";
  const detailsHref = `/projects/${slug || slugify(title)}`; // destructured slug use korlam

  return (
    <div
      style={{ animationDelay: `${Math.min(index * 70, 420)}ms` }}
      className="animate-fade-up w-87.5 rounded-2xl border border-secondary-500/20 shadow-[0_2px_6px_rgba(34,211,238,0.2)] overflow-hidden group"
    >
      <div className="relative w-full h-45 overflow-hidden bg-secondary-50 dark:bg-secondary-500/10">
        {/* image load na hoya porjonto shimmer skeleton dekhabe */}
        {!imgLoaded && (
          <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,#e5e7eb,45%,#f3f4f6,55%,#e5e7eb)] bg-size-[200%_100%]" />
        )}
        <Image
          alt={title}
          src={image}
          width={300}
          height={160}
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-45 object-cover group-hover:scale-110 transition-all duration-200 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      <div className="p-space-4 space-y-space-5 bg-background">
        {hasInPageSelect ? (
          <h2
            onClick={onSelect}
            className="font-semibold text-size-md cursor-pointer hover:text-primary-500 transition-colors transition-all duration-200"
          >
            {title}
          </h2>
        ) : (
          <Link href={detailsHref}>
            <h2 className="font-semibold text-size-md cursor-pointer hover:text-primary-500 transition-colors">
              {title}
            </h2>
          </Link>
        )}

        <div className="flex flex-wrap gap-space-3 mt-space-4">
          {tags.map((item, i) => (
            <Chips varient="small" key={i} text={item} />
          ))}
        </div>

        <div className="flex *:flex-1">
          <Button text={"Preview"} fullWidth={true} varient="text" />

          {hasInPageSelect ? (
            <div onClick={onSelect} className="flex-1 cursor-pointer">
              <Button text={"Details"} fullWidth={true} varient="text" />
            </div>
          ) : (
            <Link href={detailsHref} className="flex-1 cursor-pointer">
              <Button text={"Details"} fullWidth={true} varient="text" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;