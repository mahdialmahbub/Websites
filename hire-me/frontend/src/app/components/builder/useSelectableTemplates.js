"use client";

import { listTemplates } from "@/resume/templates/registry";
import { useGetBuilderTemplatesQuery } from "@/store/api/catalogApi";

/**
 * The templates a person can pick: the catalog from the API, limited to designs the frontend really has.
 * If the catalog cannot be reached the built-in list is used. [{ slug, name, subtitle }]
 */
export function useSelectableTemplates({ skip = false } = {}) {
  const query = useGetBuilderTemplatesQuery(undefined, { skip });
  const builtIn = listTemplates();
  const builtInIds = new Set(builtIn.map((template) => template.id));

  const options = query.data
    ? query.data
        .filter((template) => builtInIds.has(template.slug))
        .map((template) => ({ slug: template.slug, name: template.name, subtitle: template.category?.name ?? template.description }))
    : builtIn.map((template) => ({ slug: template.id, name: template.name, subtitle: template.category }));

  return { options, isLoading: query.isLoading, isError: query.isError, refetch: query.refetch };
}
