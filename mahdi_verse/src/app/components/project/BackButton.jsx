"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-1.5 text-size-sm font-medium text-placeholder_2 dark:text-placeholder/80 hover:text-secondary-500 transition-colors w-fit cursor-pointer mb-space-4 mt-space-4"
    >
      <i className="fi fi-rr-arrow-small-left"></i>
      Back
    </button>
  );
}