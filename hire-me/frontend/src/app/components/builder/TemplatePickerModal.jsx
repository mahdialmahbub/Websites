"use client";

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DEFAULT_TEMPLATE_ID } from "@/resume/templates/registry";
import { setDesign } from "@/store/builder/builderSlice";
import { Button } from "../Button";
import ExploreTemplates from "../ExploreTemplates";
import Modal from "../Modal";
import { useEnrichedTemplates } from "./useEnrichedTemplates";
import { useSelectableTemplates } from "./useSelectableTemplates";

/**
 * The "Template" button's dialog. The list comes from the catalog (so admin changes show up), but only templates
 * that have a design in the frontend can be picked. If the catalog cannot be reached the built-in list is used.
 * Switching a template keeps all the content.
 *
 * Same carousel as the home / create-resume pages: the current template starts in the middle,
 * "Use This" on another card switches to it and closes the dialog.
 */
export default function TemplatePickerModal({ open, onClose }) {
  const dispatch = useDispatch();
  const activeId = useSelector((state) => state.builder.design.templateId) ?? DEFAULT_TEMPLATE_ID;
  const color = useSelector((state) => state.builder.design.color);
  const { options, isLoading, isError, refetch } = useSelectableTemplates({ skip: !open });
  const templates = useEnrichedTemplates(options, { skip: !open });

  const choose = useCallback(
    (slug) => {
      dispatch(setDesign({ templateId: slug }));
      onClose();
    },
    [dispatch, onClose],
  );

  const startAt = Math.max(0, templates.findIndex((template) => template.slug === activeId));

  return (
    <Modal open={open} onClose={onClose} title="Choose a template">
      {isLoading && <p className="py-8 text-center text-neutral-500/70">Loading templates…</p>}
      {isError && (
        <div role="alert" className="mb-4 flex items-center justify-between gap-3 rounded-lg bg-amber-500/10 p-3 text-small text-amber-700">
          <span>We could not load the latest list. Showing the built-in templates.</span>
          <Button type="button" variant="text" onClick={refetch}>
            Retry
          </Button>
        </div>
      )}
      {!isLoading && (
        <ExploreTemplates
          templates={templates}
          limit={Infinity}
          selectedSlug={activeId}
          onSelect={choose}
          color={color}
          startAt={startAt}
          // start from the current template every time the dialog opens or the template changes
          resetKey={`${open}-${activeId}`}
          bleed={false}
          showViewAll={false}
          label="Choose a template"
        />
      )}
    </Modal>
  );
}
