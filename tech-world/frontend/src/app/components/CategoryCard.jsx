// components/CategoryCard.jsx
"use client";

import Link from "next/link";
import Image from "next/image";

export function CategoryCard({ name, slug, image }) {
  return (
    <Link
      href={`/categories/${slug}`}
      className="group relative block min-h-[200px] min-w-[300px] overflow-hidden rounded-2xl border border-white/10"
    >
      <Image
        src={image}
        alt={name}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105 min-h-[200px] min-w-[300px]"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/70">
        <span className="text-2xl font-bold uppercase tracking-wide text-white">
          {name}
        </span>
      </div>
    </Link>
  );
}