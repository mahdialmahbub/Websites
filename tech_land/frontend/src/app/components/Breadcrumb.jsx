// components/Breadcrumb.jsx
"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumb({ items = [] }) {
  return (
    <nav className="flex items-center gap-2 text-sm">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center gap-2 *:text-size-h5 font-semibold font-primary uppercase">
            {isLast || !item.href ? (
              <span className={isLast ? "text-secondary font-medium" : "text-placeholder_3"}>
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-placeholder_3 transition-colors hover:text-secondary"
              >
                {item.label}
              </Link>
            )}

            {!isLast && <ChevronRight size={14} className="text-slate-600" />}
          </div>
        );
      })}
    </nav>
  );
}