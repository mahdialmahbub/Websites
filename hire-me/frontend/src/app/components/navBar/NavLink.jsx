"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const normalize = (path = "") => {
  const clean = path.split(/[?#]/)[0];
  if (clean.length > 1) return clean.replace(/\/+$/, "");
  return clean || "/";
};

const isActivePath = (pathname, href, exact) => {
  if (!pathname) return false;

  const current = normalize(pathname);
  const target = normalize(href);

  if (exact || target === "/") return current === target;
  return current === target || current.startsWith(`${target}/`);
};

const NavLink = ({ name, href, exact = false, className = "", onClick }) => {
  const pathname = usePathname();
  const isActive = isActivePath(pathname, href, exact);

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={[
        "group relative flex h-11 items-center justify-center overflow-hidden rounded-md px-space-6",
        "font-primary text-body font-medium",
        "transition-colors duration-300 hover:bg-violet-500/5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 focus-visible:ring-offset-2",
        isActive ? "text-violet-500" : "text-neutral-950",
        className,
      ].join(" ")}
    >
      {name}

      <span
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-x-3 bottom-1.5 h-0.75 origin-center rounded-full bg-violet-500",
          "transition-transform duration-300 ease-out",
          isActive ? "scale-x-20" : "scale-x-0 group-hover:scale-x-20",
        ].join(" ")}
      />
    </Link>
  );
};

export default NavLink;
