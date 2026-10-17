"use client";

import Image from "next/image";
import { useState } from "react";

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";

/**
 * User photo, or the initials when there is no photo / it fails to load.
 * @param {{ user: { name?: string, image?: string }, className?: string, width, height, alt, sizes, priority }} props
 */
const Avatar = ({
  user,
  className = "size-10 text-sm",
  width,
  height,
  alt,
  sizes,
  priority = false,
}) => {
  const [failed, setFailed] = useState(false);
  // Keep only the field your backend actually sends (image / avatar / picture)
  const src = user.image || user.avatarUrl || user.picture;

  if (src && !failed) {
    return (
      // Plain <img>: provider photos (Google, LinkedIn) come from many hosts,
      // so next/image would need every host in next.config.
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className={`shrink-0 object-cover ${className}`}
        sizes={sizes}
        priority={priority}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center size-[48px] rounded-sm justify-center bg-primary-300 font-semibold text-background ${className}`}
    >
      {getInitials(user.name)}
    </span>
  );
};

export default Avatar;
