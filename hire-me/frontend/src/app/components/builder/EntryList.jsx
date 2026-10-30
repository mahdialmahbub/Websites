"use client";

import toast from "@/lib/toast";
import { isEntryEmpty } from "@/resume/validation";
import { useFormTarget } from "./formTarget";
import { Button } from "../Button";
import FieldCardHeader from "./FieldCardHeader";

const CARD =
  "p-[clamp(0.8125rem,calc(0.282vw+0.746rem),1rem)] rounded-lg space-y-space-7 shadow-[0_1px_4px_rgba(2,6,23,0.10),0_-1px_4px_rgba(2,6,23,0.06)]";

/**
 * @typedef {Object} EntryListProps
 * @property {string} section Section id in the builder state, e.g. "workExperience"
 * @property {string} label Singular name used in texts, e.g. "experience" ("Experience deleted", "Add experience")
 * @property {{ id: string }[]} items The entries of this section
 * @property {number} max Most entries allowed in this section
 * @property {import("react").Dispatch<any>} dispatch Redux dispatch
 * @property {string} [sectionError] Error text for the whole section (shown under the cards)
 * @property {(item: any, index: number) => import("react").ReactNode} renderEntry Form of ONE entry
 */

/**
 * The repeatable sections (jobs, education, projects, references): one card per entry with move up / down,
 * delete, and an "Add More" button. The form of one entry is passed as `renderEntry(item, index)`.
 *
 * Delete: the entry goes away at once and an "Undo" toast appears. Undo puts the same entry back at the same
 * place. An entry with nothing typed in it is deleted silently (nothing to bring back).
 *
 * @param {EntryListProps} props
 */
export default function EntryList({
  section,
  label,
  PIcon,
  items,
  max,
  dispatch,
  sectionError,
  renderEntry,
}) {
  const { actions } = useFormTarget();
  const { addItem, moveItem, removeItem, restoreItem } = actions;
  const atMax = items.length >= max;
  const title = label.charAt(0).toUpperCase() + label.slice(1);

  const remove = (item, index) => {
    dispatch(removeItem({ section, id: item.id }));

    // Nothing typed yet -> nothing to bring back, so no toast
    if (isEntryEmpty(item)) return;

    // `item` and `index` are kept in this closure, so Undo still works after the user moves to another step
    toast.undo(`${title} deleted`, {
      onUndo: () => dispatch(restoreItem({ section, item, index, max })),
    });
  };

  return (
    <div className="flex flex-col gap-space-7">
      {items.map((item, index) => (
        <div key={item.id} className={`${CARD} p-[clamp(0.8125rem,calc(0.282vw+0.746rem),1rem)] pb-0`}>
          <FieldCardHeader
            index={index}
            label={label}
            isFirst={index === 0}
            isLast={index === items.length - 1}
            onMoveUp={() =>
              dispatch(moveItem({ section, id: item.id, direction: -1 }))
            }
            onMoveDown={() =>
              dispatch(moveItem({ section, id: item.id, direction: 1 }))
            }
            onRemove={() => remove(item, index)}
          />
          <div className="space-y-space-8">{renderEntry(item, index)}</div>
        </div>
      ))}

      {items.length === 0 && (
        <p className="rounded-lg border border-dashed border-neutral-500/20 p-6 text-center text-neutral-500/70">
          No {label} added yet. Press the button below to add one.
        </p>
      )}

      {sectionError && (
        <p role="alert" className="text-small text-red-600">
          {sectionError}
        </p>
      )}

      <Button
        variant="secondary"
        type="button"
        icon="fi fi-rr-plus-small"
        disabled={atMax}
        onClick={() => dispatch(addItem({ section }))}
        className="bg-green-500/5 text-green-500 hover:bg-green-500/10 w-full"
      >
        {items.length === 0
          ? `Add ${label}`
          : atMax
            ? `Limit reached (${max})`
            : "Add More"}
      </Button>
    </div>
  );
}
