"use client";

import { useMemo } from "react";
import { useGetBuilderTemplatesQuery } from "@/store/api/catalogApi";

/**
 * `useSelectableTemplates().options` only has what the pickers need (slug, name, subtitle).
 * The carousel cards also show the category and a description, so this adds them from the catalog
 * (the same cached request the options hook already uses). Fields on the option itself always win.
 */
export function useEnrichedTemplates(options, { skip = false } = {}) {
  const { data: catalog } = useGetBuilderTemplatesQuery(undefined, { skip });

  return useMemo(() => {
    const bySlug = new Map((catalog ?? []).map((template) => [template.slug, template]));
    return options.map((option) => {
      const extra = bySlug.get(option.slug);
      return { ...extra, ...option, description: option.description ?? extra?.description ?? option.subtitle };
    });
  }, [options, catalog]);
}
